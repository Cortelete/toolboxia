import React, { useState, useEffect, useCallback } from 'react';

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

interface TextToHtmlConverterProps {
    onGoBack: () => void;
}

const TextToHtmlConverter: React.FC<TextToHtmlConverterProps> = ({ onGoBack }) => {
    const [inputText, setInputText] = useState<string>('Este é o primeiro parágrafo.\n\nEste é o segundo parágrafo com uma\nquebra de linha.');
    const [outputText, setOutputText] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!inputText) {
            setOutputText('');
            return;
        }

        const paragraphs = inputText
            .split(/\n\s*\n/) // Split by one or more empty lines
            .filter(p => p.trim() !== '')
            .map(p => {
                const lines = p.split('\n').join('<br />\n');
                return `<p>${lines}</p>`;
            });

        setOutputText(paragraphs.join('\n\n'));
        setCopied(false);
    }, [inputText]);
    
    const handleCopy = useCallback(() => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [outputText]);

    return (
        <>
            <button
                onClick={onGoBack}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 group"
                aria-label="Voltar para a página inicial"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span>Voltar ao Início</span>
            </button>
            <div className="w-full max-w-3xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500">
                        Texto para HTML
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Converta texto simples em HTML com parágrafos e quebras de linha.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                         <label htmlFor="text-to-html-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Texto Simples
                        </label>
                        <textarea
                            id="text-to-html-input"
                            rows={10}
                            className="w-full h-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 resize-y placeholder-gray-500 font-mono"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Digite seu texto aqui..."
                        />
                    </div>
                     <div className="space-y-2 h-full flex flex-col">
                         <label htmlFor="text-to-html-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Código HTML (clique para copiar)
                        </label>
                        <div 
                            onClick={handleCopy}
                            title="Clique para copiar"
                            className="relative group h-full cursor-pointer bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-sky-500 transition-all duration-200"
                        >
                            <textarea
                                id="text-to-html-output"
                                readOnly
                                rows={10}
                                className="flex-grow w-full h-full bg-transparent p-4 text-gray-800 dark:text-gray-200 resize-y placeholder-gray-500 font-mono focus:outline-none cursor-pointer"
                                value={outputText}
                                placeholder="<p>O HTML aparecerá aqui...</p>"
                            />
                             <div className="absolute top-2 right-2 p-2 rounded-full text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                                {copied ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 opacity-50 group-hover:opacity-100" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TextToHtmlConverter;