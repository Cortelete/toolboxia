import React, { useState, useCallback } from 'react';

type TransformType = 'snake' | 'kebab' | 'camel' | 'pascal' | 'upper_snake';

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

interface NomenclatureConverterProps {
    onGoBack: () => void;
}

const NomenclatureConverter: React.FC<NomenclatureConverterProps> = ({ onGoBack }) => {
    const [inputText, setInputText] = useState<string>('primeiro item, segundo item, TERCEIRO_ITEM');
    const [outputTexts, setOutputTexts] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [transformType, setTransformType] = useState<TransformType>('snake');
    const [removeAccents, setRemoveAccents] = useState<boolean>(true);

    const transformOptions: { key: TransformType; label: string }[] = [
        { key: 'snake', label: 'snake_case' },
        { key: 'kebab', label: 'kebab-case' },
        { key: 'camel', label: 'camelCase' },
        { key: 'pascal', label: 'PascalCase' },
        { key: 'upper_snake', label: 'UPPER_SNAKE' },
    ];

    const handleTransform = useCallback(() => {
        if (!inputText.trim()) {
            setOutputTexts([]);
            return;
        }

        const parts = inputText.split(',').map(p => p.trim()).filter(Boolean);

        const results = parts.map(part => {
            let processedText = part;

            if (removeAccents) {
                processedText = processedText
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
                    .replace(/[^a-zA-Z0-9\s_-]/g, ''); // Remove caracteres especiais, mantendo espaços, hífens e underscores
            }
            
            const words = processedText.trim().split(/[\s_-]+/).filter(Boolean);

            let transformedText = '';

            switch (transformType) {
                case 'snake':
                    transformedText = words.join('_').toLowerCase();
                    break;
                case 'kebab':
                    transformedText = words.join('-').toLowerCase();
                    break;
                case 'camel':
                    transformedText = words.map((word, index) =>
                            index === 0
                                ? word.toLowerCase()
                                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join('');
                    break;
                case 'pascal':
                    transformedText = words.map((word) =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join('');
                    break;
                case 'upper_snake':
                    transformedText = words.join('_').toUpperCase();
                    break;
            }
            return transformedText;
        });

        setOutputTexts(results.filter(Boolean));
        setCopiedIndex(null);
    }, [inputText, transformType, removeAccents]);

    const handleCopy = useCallback((text: string, index: number) => {
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000);
            });
        }
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
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-400 dark:to-purple-500">
                        Conversor de Nomenclatura
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Transforme texto ou listas em nomes de variáveis para qualquer linguagem.</p>
                </header>

                <div className="space-y-4">
                    <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Texto Original (separe itens com vírgula)
                    </label>
                    <textarea
                        id="inputText"
                        rows={5}
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-gray-500 font-mono"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Cole o texto para conversão..."
                    />
                </div>
                
                <div className="space-y-4 bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                       <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Estilo de Conversão
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {transformOptions.map(({key, label}) => (
                                    <button
                                        key={key}
                                        onClick={() => setTransformType(key)}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                                            transformType === key 
                                                ? 'bg-blue-500 text-white shadow-md' 
                                                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                       </div>
                       <div className="flex-shrink-0 pt-4 sm:pt-0">
                           <label htmlFor="removeAccents" className="flex items-center cursor-pointer select-none">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  id="removeAccents"
                                  checked={removeAccents}
                                  onChange={(e) => setRemoveAccents(e.target.checked)}
                                  className="sr-only"
                                />
                                <div className={`block w-12 h-6 rounded-full transition-colors ${removeAccents ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${removeAccents ? 'transform translate-x-6' : ''}`}></div>
                              </div>
                              <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Remover acentos</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleTransform}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    disabled={!inputText.trim()}
                >
                    Transformar Texto
                </button>

                {outputTexts.length > 0 && (
                    <div className="bg-gray-50/70 dark:bg-gray-900/70 rounded-lg p-4 space-y-4 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Resultados (clique para copiar)</h2>
                        <div className="flex flex-wrap gap-3">
                            {outputTexts.map((text, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCopy(text, index)}
                                    className={`flex items-center gap-2 rounded-md p-2 px-3 font-mono cursor-pointer transition-all duration-200 select-none ${
                                        copiedIndex === index
                                            ? 'bg-green-600 text-white shadow-lg'
                                            : 'bg-gray-200 hover:bg-gray-300 text-green-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-green-400'
                                    }`}
                                    title="Clique para copiar"
                                >
                                    <span>{text}</span>
                                    {copiedIndex === index ? (
                                        <IconCheck className="h-5 w-5 flex-shrink-0" />
                                    ) : (
                                        <IconCopy className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default NomenclatureConverter;