import React, { useState, useMemo, useCallback } from 'react';

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

const fontMaps = {
    bold: { a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇', A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭' },
    italic: { a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻', A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑', K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛', U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡' },
    script: { a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: '𝑒', f: '𝒻', g: '𝑔', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃', o: '𝑜', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏', A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢', H: 'ℋ', I: 'ℐ', J: '𝒥', K: '𝒦', L: 'ℒ', M: 'ℳ', N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯', U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵' },
    fraktur: { a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤', h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪', n: '𝔫', o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲', v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷', A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊', H: 'ℌ', I: 'ℑ', J: '𝔍', K: '𝔎', L: '𝔏', M: '𝔐', N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ' },
    circled: { a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ', n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ', A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ', N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ' },
};

const styles = [
    { id: 'bold', name: 'Negrito' },
    { id: 'italic', name: 'Itálico' },
    { id: 'script', name: 'Manuscrito' },
    { id: 'fraktur', name: 'Gótico' },
    { id: 'circled', name: 'Circulado' },
];

const CoolLettersConverter: React.FC = () => {
    const [inputText, setInputText] = useState<string>('Texto com estilo!');
    const [copiedStyle, setCopiedStyle] = useState<string | null>(null);

    const convertedTexts = useMemo(() => {
        if (!inputText) {
            return styles.reduce((acc, style) => {
                acc[style.id] = '';
                return acc;
            }, {} as { [key: string]: string });
        }
        const result: { [key: string]: string } = {};
        for (const style of styles) {
            const map = fontMaps[style.id as keyof typeof fontMaps];
            result[style.id] = inputText.split('').map(char => map[char as keyof typeof map] || char).join('');
        }
        return result;
    }, [inputText]);
    
    const handleCopy = useCallback((text: string, styleId: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedStyle(styleId);
            setTimeout(() => setCopiedStyle(null), 2000);
        });
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
        setCopiedStyle(null);
    }

    return (
        <div className="w-full max-w-3xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <header className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-500">
                    Letras Diferentes
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Gere textos com fontes e estilos especiais para redes sociais.</p>
            </header>

            <div className="space-y-2">
                <label htmlFor="cool-letters-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Seu Texto
                </label>
                <textarea
                    id="cool-letters-input"
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-y"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Digite aqui..."
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Resultados (clique na linha para copiar)</h2>
                <div className="space-y-3">
                    {styles.map(style => (
                        <div 
                            key={style.id} 
                            onClick={() => handleCopy(convertedTexts[style.id], style.id)}
                            className="flex items-center gap-4 bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"
                            title={`Copiar estilo ${style.name}`}
                        >
                            <p 
                                className="flex-grow w-full bg-transparent text-gray-800 dark:text-gray-200 text-lg" 
                                style={{ fontFamily: style.id === 'script' ? 'cursive' : 'sans-serif'}}
                            >
                                {convertedTexts[style.id] || <span className="text-gray-400 dark:text-gray-500 text-base">...</span>}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline-block flex-shrink-0">{style.name}</span>
                            <div className="flex-shrink-0">
                                {copiedStyle === style.id ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 text-gray-400" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoolLettersConverter;