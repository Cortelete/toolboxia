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

interface TextCutterProps {
    onGoBack: () => void;
}

const TextCutter: React.FC<TextCutterProps> = ({ onGoBack }) => {
    const [inputText, setInputText] = useState<string>('Este é um texto de exemplo um pouco longo que será usado para demonstrar a funcionalidade de cortar o texto em pedaços menores com um tamanho definido pelo usuário.');
    const [chunkSize, setChunkSize] = useState<number>(50);
    const [chunks, setChunks] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCutText = useCallback(() => {
        if (!inputText || chunkSize <= 0) {
            setChunks([]);
            return;
        }

        const result: string[] = [];
        for (let i = 0; i < inputText.length; i += chunkSize) {
            result.push(inputText.substring(i, i + chunkSize));
        }
        setChunks(result);
        setCopiedIndex(null);
    }, [inputText, chunkSize]);
    
    const handleCopy = useCallback((text: string, index: number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        });
    }, []);

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
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400">
                        Cortar Textos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Divida textos longos em pedaços de um tamanho específico.</p>
                </header>

                <div className="space-y-4">
                    <label htmlFor="text-cutter-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Seu Texto
                    </label>
                    <textarea
                        id="text-cutter-input"
                        rows={8}
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-y placeholder-gray-500"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Cole o texto que deseja cortar..."
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex-grow w-full sm:w-auto">
                        <label htmlFor="chunk-size-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tamanho do Pedaço (caracteres)
                        </label>
                        <input
                            id="chunk-size-input"
                            type="number"
                            min="1"
                            className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={chunkSize}
                            onChange={(e) => setChunkSize(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        />
                    </div>
                    <button
                        onClick={handleCutText}
                        className="w-full sm:w-auto self-end bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        disabled={!inputText.trim()}
                    >
                        Cortar
                    </button>
                </div>

                {chunks.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Resultados ({chunks.length} pedaços)
                        </h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto p-1 -mr-2 pr-2">
                            {chunks.map((chunk, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => handleCopy(chunk, index)}
                                    title="Clique para copiar"
                                    className="relative group flex items-start gap-2 bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"
                                >
                                    <pre className="flex-grow w-full bg-transparent text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre-wrap break-all">
                                        {chunk}
                                    </pre>
                                    <div className="absolute top-1 right-1 p-1">
                                        {copiedIndex === index ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TextCutter;