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


const RandomNumberGenerator: React.FC = () => {
    const [min, setMin] = useState<number>(1);
    const [max, setMax] = useState<number>(100);
    const [quantity, setQuantity] = useState<number>(5);
    const [drawName, setDrawName] = useState<string>('');
    const [results, setResults] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const handleGenerate = useCallback(() => {
        setError(null);
        setCopied(false);

        if (min >= max) {
            setError('O valor mínimo deve ser menor que o valor máximo.');
            setResults([]);
            return;
        }
        if (quantity <= 0) {
            setError('A quantidade de números a sortear deve ser maior que zero.');
            setResults([]);
            return;
        }
        const availableNumbers = max - min + 1;
        if (quantity > availableNumbers) {
            setError(`Não é possível sortear ${quantity} números. O intervalo só tem ${availableNumbers} números disponíveis.`);
            setResults([]);
            return;
        }

        const drawnNumbers = new Set<number>();
        while (drawnNumbers.size < quantity) {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            drawnNumbers.add(randomNumber);
        }

        const sortedResults = Array.from(drawnNumbers).sort((a, b) => a - b);
        setResults(sortedResults);

    }, [min, max, quantity]);
    
    const handleCopy = useCallback(() => {
        if (results.length === 0) return;
        navigator.clipboard.writeText(results.join(', ')).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [results]);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <header className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-400 dark:to-blue-500">
                    Sorteador de Números
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Gere números aleatórios e configure o intervalo.</p>
            </header>

            <div className="space-y-4 bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="min-val" className="block text-sm font-medium text-gray-700 dark:text-gray-300">De</label>
                        <input type="number" id="min-val" value={min} onChange={e => setMin(parseInt(e.target.value, 10) || 0)} className="mt-1 w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="max-val" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Até</label>
                        <input type="number" id="max-val" value={max} onChange={e => setMax(parseInt(e.target.value, 10) || 0)} className="mt-1 w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="qty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade</label>
                        <input type="number" id="qty" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)} className="mt-1 w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500"/>
                    </div>
                </div>
                 <div>
                    <label htmlFor="draw-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do sorteio (opcional)</label>
                    <input type="text" id="draw-name" value={drawName} onChange={e => setDrawName(e.target.value)} placeholder="Ex: Sorteio de Aniversário" className="mt-1 w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500"/>
                 </div>
            </div>
            
            <button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300/50"
            >
                Sortear Números
            </button>

            {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-lg">{error}</p>}

            {results.length > 0 && (
                 <div className="space-y-4 pt-4">
                    <div className="text-center">
                       {drawName && <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{drawName}</h2>}
                       <p className="text-gray-600 dark:text-gray-400">Resultado do sorteio de {quantity} número(s) entre {min} e {max}:</p>
                    </div>

                    <div 
                        onClick={handleCopy}
                        title="Clique para copiar os números"
                        className="relative group cursor-pointer p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-colors"
                    >
                        <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                            {results.map((num, index) => (
                                <div key={index} className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-2xl font-bold shadow-md border-2 border-blue-200 dark:border-blue-700">
                                    {num}
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-2 right-2 p-1 rounded-full text-gray-500 dark:text-gray-400">
                            {copied ? (
                                <IconCheck className="h-5 w-5 text-green-500" />
                            ) : (
                                <IconCopy className="h-5 w-5 opacity-0 group-hover:opacity-50 transition-opacity" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RandomNumberGenerator;