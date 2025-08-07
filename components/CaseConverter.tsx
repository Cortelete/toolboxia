import React, { useState, useCallback } from 'react';

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

interface CaseConverterProps {
    onGoBack: () => void;
}

const CaseConverter: React.FC<CaseConverterProps> = ({ onGoBack }) => {
    const [text, setText] = useState<string>('Exemplo de Frase para ser Convertida.');
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = useCallback(() => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [text]);
    
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      setCopied(false);
    }

    const toUpperCase = () => setText(text.toUpperCase());
    const toLowerCase = () => setText(text.toLowerCase());
    const toCapitalizedCase = () => {
        setText(text.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase()));
    };

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
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-400 dark:to-purple-500">
                        Conversor de Maiúsculas/Minúsculas
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Altere o texto para maiúsculas, minúsculas ou capitalizado.</p>
                </header>

                <div className="space-y-2">
                    <label htmlFor="case-converter-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Seu Texto (clique para copiar)
                    </label>
                    <div 
                        onClick={handleCopy}
                        title="Clique para copiar"
                        className="relative group cursor-pointer bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200"
                    >
                        <textarea
                            id="case-converter-textarea"
                            rows={8}
                            className="flex-grow w-full bg-transparent p-4 text-gray-800 dark:text-gray-200 resize-y placeholder-gray-500 font-mono focus:outline-none cursor-pointer"
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Digite ou cole seu texto aqui..."
                        />
                         <div className="absolute top-2 right-2 p-2 rounded-full text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                            {copied ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 opacity-50 group-hover:opacity-100" />}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                     <button
                        onClick={toUpperCase}
                        className="w-full sm:w-auto flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        MAIÚSCULAS
                    </button>
                    <button
                        onClick={toLowerCase}
                        className="w-full sm:w-auto flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        minúsculas
                    </button>
                    <button
                        onClick={toCapitalizedCase}
                        className="w-full sm:w-auto flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Capitalizado
                    </button>
                </div>
            </div>
        </>
    );
};

export default CaseConverter;