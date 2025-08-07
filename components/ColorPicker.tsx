import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const IconCopy: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const IconCheck: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const IconSpinner: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


// --- Color Conversion & Parsing Utilities ---
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function parseHex(hexStr: string): { r: number; g: number; b: number } | null {
    const sanitized = hexStr.trim().startsWith('#') ? hexStr.trim() : `#${hexStr.trim()}`;
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(sanitized)) return null;
    let r_hex, g_hex, b_hex;
    if (sanitized.length === 4) {
        r_hex = sanitized[1] + sanitized[1];
        g_hex = sanitized[2] + sanitized[2];
        b_hex = sanitized[3] + sanitized[3];
    } else {
        r_hex = sanitized.substring(1, 3);
        g_hex = sanitized.substring(3, 5);
        b_hex = sanitized.substring(5, 7);
    }
    return { r: parseInt(r_hex, 16), g: parseInt(g_hex, 16), b: parseInt(b_hex, 16) };
}

interface ColorPickerProps {
    onGoBack: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onGoBack }) => {
    // Master color state (source of truth)
    const [hue, setHue] = useState<number>(259);
    const [saturation, setSaturation] = useState<number>(90);
    const [lightness, setLightness] = useState<number>(66);
    
    // Derived canonical color values
    const { hexValue, rgbValue, hslValue, r, g, b } = useMemo(() => {
        const rgb = hslToRgb(hue, saturation, lightness);
        return {
            hexValue: rgbToHex(rgb.r, rgb.g, rgb.b),
            rgbValue: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            hslValue: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            r: rgb.r,
            g: rgb.g,
            b: rgb.b
        };
    }, [hue, saturation, lightness]);

    // State for HEX input to allow for transient invalid values while typing
    const [hexInput, setHexInput] = useState(hexValue);
    
    // Sync hex input when master color changes from another source (e.g. color wheel)
    useEffect(() => {
        setHexInput(hexValue);
    }, [hexValue]);

    const [pantoneInput, setPantoneInput] = useState('');
    
    // State for AI features
    const [pantoneValue, setPantoneValue] = useState<string>('');
    const [isFindingPantone, setIsFindingPantone] = useState<boolean>(false);
    const [isFindingHex, setIsFindingHex] = useState<boolean>(false);
    
    const [copiedValue, setCopiedValue] = useState<string | null>(null);
    
    const wheelCanvasRef = useRef<HTMLCanvasElement>(null);
    const sliderCanvasRef = useRef<HTMLCanvasElement>(null);
    const isDraggingWheel = useRef(false);

    // --- AI Functions ---
    const findPantoneColor = useCallback(async (hex: string) => {
        setIsFindingPantone(true);
        setPantoneValue('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Aja como um especialista em cores. Para a cor com o código HEX '${hex}', encontre a correspondência mais próxima no sistema de cores PANTONE. Retorne apenas o nome e código oficial da cor PANTONE (ex: 'PANTONE 19-4052 TCX Classic Blue'). Não inclua nenhuma outra palavra, explicação ou introdução.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setPantoneValue(response.text.trim());
        } catch (error) {
            console.error("Error finding Pantone color:", error);
            setPantoneValue('Não foi possível encontrar');
        } finally {
            setIsFindingPantone(false);
        }
    }, []);

    const findColorFromPantone = async () => {
        if (!pantoneInput.trim()) return;
        setIsFindingHex(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Aja como um especialista em cores. Forneça o código de cor HEX para o seguinte nome de cor PANTONE: "${pantoneInput}". Retorne apenas o código HEX de 6 dígitos com o prefixo '#' (ex: #0F4C81). Não inclua nenhuma outra palavra ou explicação. Se a cor não for encontrada ou for inválida, retorne "invalido".`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const hexResult = response.text.trim();
            const parsedRgb = parseHex(hexResult);
            if (parsedRgb) {
                const { h, s, l } = rgbToHsl(parsedRgb.r, parsedRgb.g, parsedRgb.b);
                setHue(h);
                setSaturation(s);
                setLightness(l);
            } else {
                alert(`Não foi possível encontrar um código HEX para "${pantoneInput}". Tente ser mais específico, ex: "PANTONE 17-5104 Ultimate Gray"`);
            }
        } catch (error) {
            console.error("Error finding HEX from Pantone:", error);
            alert('Ocorreu um erro ao buscar a cor.');
        } finally {
            setIsFindingHex(false);
        }
    };

    useEffect(() => {
        setPantoneValue('');
        const handler = setTimeout(() => {
            if (hexValue) findPantoneColor(hexValue);
        }, 800);
        return () => clearTimeout(handler);
    }, [hexValue, findPantoneColor]);


    // --- Canvas Drawing ---
    useEffect(() => {
        const canvas = wheelCanvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const size = canvas.width; const radius = size / 2;
        ctx.clearRect(0, 0, size, size);
        const imageData = ctx.createImageData(size, size); const data = imageData.data;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const dx = x - radius; const dy = y - radius;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius) {
                    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
                    const sat = (distance / radius) * 100;
                    const {r, g, b} = hslToRgb(angle, sat, 50);
                    const index = (y * size + x) * 4;
                    data[index] = r; data[index+1] = g; data[index+2] = b; data[index+3] = 255;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
        const angleRad = hue * Math.PI / 180; const r = (saturation / 100) * radius;
        const indicatorX = radius + r * Math.cos(angleRad); const indicatorY = radius + r * Math.sin(angleRad);
        ctx.strokeStyle = lightness > 55 ? 'black' : 'white'; ctx.lineWidth = 3; ctx.fillStyle = hexValue;
        ctx.beginPath(); ctx.arc(indicatorX, indicatorY, 10, 0, 2 * Math.PI); ctx.stroke(); ctx.fill();
    }, [hue, saturation, lightness, hexValue]);

    useEffect(() => {
        const canvas = sliderCanvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const width = canvas.width, height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, 0%)`);
        gradient.addColorStop(0.5, `hsl(${hue}, ${saturation}%, 50%)`);
        gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, 100%)`);
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
        const x = (lightness / 100) * width;
        ctx.strokeStyle = 'white'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }, [hue, saturation, lightness]);


    // --- Event Handlers ---
    const updateColorFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = wheelCanvasRef.current; if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const size = canvas.width; const radius = size / 2;
        const dx = x - radius; const dy = y - radius;
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
        const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
        const sat = (distance / radius) * 100;
        setHue(Math.round(angle));
        setSaturation(Math.round(sat));
    }
    const handleWheelMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => { isDraggingWheel.current = true; updateColorFromEvent(e); };
    const handleWheelMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => { if(isDraggingWheel.current) updateColorFromEvent(e); };
    const handleMouseUp = () => { isDraggingWheel.current = false; };
    useEffect(() => { window.addEventListener('mouseup', handleMouseUp); return () => window.removeEventListener('mouseup', handleMouseUp); }, []);
    
    const handleCopy = useCallback((value: string) => {
        if (!value || value === 'Buscando...' || value === 'Não foi possível encontrar') return;
        navigator.clipboard.writeText(value).then(() => {
            setCopiedValue(value);
            setTimeout(() => setCopiedValue(null), 2000);
        });
    }, []);
    
    // --- Input Change Handlers (Real-time update) ---
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        setHexInput(newHex);
        const parsedRgb = parseHex(newHex);
        if (parsedRgb) {
            const { h, s, l } = rgbToHsl(parsedRgb.r, parsedRgb.g, parsedRgb.b);
            setHue(h);
            setSaturation(s);
            setLightness(l);
        }
    };
    
    const handleRgbPartChange = (part: 'r' | 'g' | 'b', value: string) => {
        let numValue = parseInt(value, 10);
        if (isNaN(numValue)) return; // Prevents update on empty input
        numValue = Math.max(0, Math.min(255, numValue));
        const newRgb = { r, g, b, [part]: numValue };
        const { h, s, l } = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
        setHue(h);
        setSaturation(s);
        setLightness(l);
    };

    const handleHslPartChange = (part: 'h' | 's' | 'l', value: string) => {
        let numValue = parseInt(value, 10);
        if (isNaN(numValue)) return; // Prevents update on empty input
        if (part === 'h') setHue(Math.max(0, Math.min(360, numValue)));
        if (part === 's') setSaturation(Math.max(0, Math.min(100, numValue)));
        if (part === 'l') setLightness(Math.max(0, Math.min(100, numValue)));
    };

    return (
        <>
            <button onClick={onGoBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                <span>Voltar ao Início</span>
            </button>
            <div className="w-full max-w-4xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-500">
                        Color Picker
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Selecione, busque ou insira uma cor e copie seu código.</p>
                </header>
                
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
                    <div className="flex flex-col items-center gap-4 flex-shrink-0">
                         <canvas ref={wheelCanvasRef} width={250} height={250} onMouseDown={handleWheelMouseDown} onMouseMove={handleWheelMouseMove} className="rounded-full cursor-pointer shadow-lg border-4 border-white/50 dark:border-black/20"/>
                        <div className="w-[250px] relative h-8 flex items-center">
                             <canvas ref={sliderCanvasRef} width={250} height={25} className="w-full h-full rounded-full cursor-pointer shadow-inner" />
                             <input type="range" min="0" max="100" value={lightness} onChange={e => setLightness(parseInt(e.target.value, 10))} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" aria-label="Seletor de luminosidade"/>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-80 space-y-3">
                        <div className="w-full h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg" style={{ backgroundColor: hexValue }} />
                        
                        {/* Input Fields */}
                        <div className="space-y-1">
                            <label htmlFor="hex-input" className="text-sm font-medium text-gray-500 dark:text-gray-400">HEX</label>
                            <div className="relative group flex items-center"><input id="hex-input" type="text" value={hexInput} onChange={handleHexChange} className="flex-grow w-full bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" /><div onClick={() => handleCopy(hexValue)} title="Copiar HEX" className="absolute right-0 p-2 m-1 rounded-full cursor-pointer">{copiedValue === hexValue ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 text-gray-400 opacity-20 group-hover:opacity-60" />}</div></div>
                        </div>
                        
                         <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">RGB</label>
                                <div onClick={() => handleCopy(rgbValue)} title="Copiar RGB" className="p-1 rounded-full cursor-pointer group">{copiedValue === rgbValue ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4 text-gray-400 opacity-20 group-hover:opacity-60" />}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[ {label: 'R', value: r, handler: (v: string) => handleRgbPartChange('r', v)}, {label: 'G', value: g, handler: (v: string) => handleRgbPartChange('g', v)}, {label: 'B', value: b, handler: (v: string) => handleRgbPartChange('b', v)}].map(item => (
                                    <div key={item.label}>
                                        <input type="number" min="0" max="255" value={item.value} onChange={e => item.handler(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center text-gray-800 dark:text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" aria-label={`Valor de ${item.label}`}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">HSL</label>
                                <div onClick={() => handleCopy(hslValue)} title="Copiar HSL" className="p-1 rounded-full cursor-pointer group">{copiedValue === hslValue ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4 text-gray-400 opacity-20 group-hover:opacity-60" />}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <input type="number" min="0" max="360" value={hue} onChange={e => handleHslPartChange('h', e.target.value)} className="w-full bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center text-gray-800 dark:text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" aria-label="Valor de Matiz (Hue)"/>
                                <input type="number" min="0" max="100" value={saturation} onChange={e => handleHslPartChange('s', e.target.value)} className="w-full bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center text-gray-800 dark:text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" aria-label="Valor de Saturação"/>
                                <input type="number" min="0" max="100" value={lightness} onChange={e => handleHslPartChange('l', e.target.value)} className="w-full bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center text-gray-800 dark:text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" aria-label="Valor de Luminosidade"/>
                            </div>
                        </div>
                        
                        <div className="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700/50">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">PANTONE® <span className="text-xs">(Aproximação por IA)</span></label>
                            <div className="relative group flex items-center"><input type="text" readOnly value={isFindingPantone ? 'Buscando...' : pantoneValue} className="flex-grow w-full bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-gray-200 font-mono focus:outline-none text-sm pr-10" disabled={isFindingPantone} /><div onClick={() => handleCopy(pantoneValue)} title="Copiar Pantone" className="absolute right-0 p-2 m-1 rounded-full cursor-pointer">{isFindingPantone ? <IconSpinner className="h-5 w-5 text-gray-400"/> : copiedValue === pantoneValue && pantoneValue ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 text-gray-400 opacity-20 group-hover:opacity-60" />}</div></div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700/50">
                            <label htmlFor="pantone-search-input" className="text-sm font-medium text-gray-500 dark:text-gray-400">Buscar por PANTONE®</label>
                            <div className="flex items-center gap-2">
                                <input id="pantone-search-input" type="text" value={pantoneInput} onChange={(e) => setPantoneInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') findColorFromPantone(); }} placeholder="Ex: Classic Blue" className="flex-grow w-full bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"/>
                                <button onClick={findColorFromPantone} disabled={isFindingHex || !pantoneInput.trim()} className="p-3 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-wait">
                                    {isFindingHex ? <IconSpinner className="h-5 w-5"/> : 'Ir'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ColorPicker;