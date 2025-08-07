import React, { useState } from 'react';

interface CounterProps {
    onGoBack: () => void;
}

const Counter: React.FC<CounterProps> = ({ onGoBack }) => {
    const [text, setText] = useState<string>('');

    const counts = React.useMemo(() => {
        const trimmedText = text.trim();
        const characters = text.length;
        const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
        const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
        return { characters, words, lines };
    }, [text]);

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
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-400 dark:to-cyan-500">
                        Contador de Caracteres
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Conte caracteres, palavras e linhas em tempo real.</p>
                </header>

                <div className="space-y-4">
                    <label htmlFor="counter-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Seu Texto
                    </label>
                    <textarea
                        id="counter-textarea"
                        rows={10}
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-y placeholder-gray-500 font-mono"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Digite ou cole seu texto aqui para ver a contagem..."
                    />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{counts.characters}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Caracteres</div>
                    </div>
                     <div className="bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{counts.words}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Palavras</div>
                    </div>
                     <div className="bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{counts.lines}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Linhas</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Counter;