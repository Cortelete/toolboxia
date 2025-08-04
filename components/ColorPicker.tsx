import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

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

// --- Color Conversion Utilities ---
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return { 
        r: Math.round(255 * f(0)), 
        g: Math.round(255 * f(8)), 
        b: Math.round(255 * f(4)) 
    };
}

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}


const ColorPicker: React.FC = () => {
    const [hue, setHue] = useState<number>(259);
    const [saturation, setSaturation] = useState<number>(90);
    const [lightness, setLightness] = useState<number>(66);
    const [copiedValue, setCopiedValue] = useState<string | null>(null);

    const wheelCanvasRef = useRef<HTMLCanvasElement>(null);
    const sliderCanvasRef = useRef<HTMLCanvasElement>(null);
    const isDraggingWheel = useRef(false);

    const { hexValue, rgbValue, hslValue } = useMemo(() => {
        const { r, g, b } = hslToRgb(hue, saturation, lightness);
        return {
            hexValue: rgbToHex(r, g, b),
            rgbValue: `rgb(${r}, ${g}, ${b})`,
            hslValue: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        };
    }, [hue, saturation, lightness]);

    // Draw the color wheel and its indicator
    useEffect(() => {
        const canvas = wheelCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const size = canvas.width;
        const radius = size / 2;
        ctx.clearRect(0, 0, size, size);

        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const dx = x - radius;
                const dy = y - radius;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius) {
                    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
                    const sat = (distance / radius) * 100;
                    const {r, g, b} = hslToRgb(angle, sat, 50);
                    const index = (y * size + x) * 4;
                    data[index] = r;
                    data[index+1] = g;
                    data[index+2] = b;
                    data[index+3] = 255;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
        
        const angleRad = hue * Math.PI / 180;
        const r = (saturation / 100) * radius;
        const indicatorX = radius + r * Math.cos(angleRad);
        const indicatorY = radius + r * Math.sin(angleRad);

        ctx.strokeStyle = lightness > 55 ? 'black' : 'white';
        ctx.lineWidth = 3;
        ctx.fillStyle = hexValue;
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

    }, [hue, saturation, lightness, hexValue]);

    // Draw the lightness slider
    useEffect(() => {
        const canvas = sliderCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, 0%)`);
        gradient.addColorStop(0.5, `hsl(${hue}, ${saturation}%, 50%)`);
        gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, 100%)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        const x = (lightness / 100) * width;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

    }, [hue, saturation, lightness]);

    const updateColorFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = wheelCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = canvas.width;
        const radius = size / 2;
        
        const dx = x - radius;
        const dy = y - radius;
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
        
        const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
        const sat = (distance / radius) * 100;
        setHue(Math.round(angle));
        setSaturation(Math.round(sat));
    }

    const handleWheelMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        isDraggingWheel.current = true;
        updateColorFromEvent(e);
    };

    const handleWheelMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(isDraggingWheel.current) {
            updateColorFromEvent(e);
        }
    };
    
    const handleMouseUp = () => {
        isDraggingWheel.current = false;
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [])
    
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLightness(parseInt(e.target.value, 10));
    };

    const handleCopy = useCallback((value: string) => {
        if (value === 'N/A') return;
        navigator.clipboard.writeText(value).then(() => {
            setCopiedValue(value);
            setTimeout(() => setCopiedValue(null), 2000);
        });
    }, []);

    const colorFormats = [
        { name: 'HEX', value: hexValue },
        { name: 'RGB', value: rgbValue },
        { name: 'HSL', value: hslValue },
    ];
    
    return (
        <div className="w-full max-w-3xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <header className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-500">
                    Color Picker
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Selecione uma cor e copie seu código em vários formatos.</p>
            </header>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                     <canvas
                        ref={wheelCanvasRef}
                        width={250}
                        height={250}
                        onMouseDown={handleWheelMouseDown}
                        onMouseMove={handleWheelMouseMove}
                        className="rounded-full cursor-pointer shadow-lg border-4 border-white/50 dark:border-black/20"
                    />
                    
                    <div className="w-[250px] relative h-8 flex items-center">
                         <canvas
                            ref={sliderCanvasRef}
                            width={250}
                            height={25}
                            className="w-full h-full rounded-full cursor-pointer shadow-inner"
                        />
                         <input
                            type="range"
                            min="0"
                            max="100"
                            value={lightness}
                            onChange={handleSliderChange}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label="Seletor de luminosidade"
                            style={{'--thumb-color': hexValue} as React.CSSProperties}
                        />
                    </div>
                </div>
                
                <div className="w-full md:w-64 space-y-4">
                    <div
                        className="w-full h-24 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                        style={{ backgroundColor: hexValue }}
                    />
                    {colorFormats.map(format => (
                        <div key={format.name} className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{format.name}</label>
                            <div 
                                onClick={() => handleCopy(format.value)}
                                title={`Clique para copiar ${format.name}`}
                                className="relative group flex items-center bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"
                            >
                                <input
                                    type="text"
                                    readOnly
                                    value={format.value}
                                    className="flex-grow w-full bg-transparent p-3 text-gray-800 dark:text-gray-200 font-mono focus:outline-none cursor-pointer text-sm"
                                    aria-label={`Código da cor em ${format.name}`}
                                />
                                <div className="p-2 m-1 rounded-full">
                                    {copiedValue === format.value ? (
                                        <IconCheck className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <IconCopy className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;