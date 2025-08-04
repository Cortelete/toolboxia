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

const textToBinary = (text: string): string => {
    if (!text) return '';
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
};

const binaryToText = (binary: string): string => {
    if (!binary.trim()) return '';
    
    const cleanedBinary = binary.replace(/[^01\s]/g, '').replace(/\s+/g, '');

    if (!cleanedBinary) return '';
    
    if (cleanedBinary.length % 8 !== 0) {
        return 'Código binário inválido ou incompleto...';
    }
    try {
        const textResult = cleanedBinary.match(/.{1,8}/g)?.map(byte => {
            return String.fromCharCode(parseInt(byte, 2));
        }).join('');
        return textResult || '';
    } catch (e) {
        return 'Erro ao decodificar o binário.';
    }
};


const BinaryTranslator: React.FC = () => {
    const [text, setText] = useState<string>('Olá Mundo');
    const [binary, setBinary] = useState<string>(textToBinary('Olá Mundo'));
    const [copied, setCopied] = useState<'text' | 'binary' | null>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        setBinary(textToBinary(newText));
        setCopied(null);
    };

    const handleBinaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newBinary = e.target.value;
        setBinary(newBinary);
        setText(binaryToText(newBinary));
        setCopied(null);
    };

    const handleCopy = useCallback((type: 'text' | 'binary', content: string) => {
        if (!content || (type === 'binary' && content.startsWith('Código binário'))) return;
        navigator.clipboard.writeText(content).then(() => {
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        });
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <header className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-600 dark:from-cyan-400 dark:to-emerald-500">
                    Tradutor de Código Binário
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Converta texto para binário e vice-versa em tempo real.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Text Area */}
                <div className="space-y-2 flex flex-col">
                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Texto (clique para copiar)
                    </label>
                    <div 
                        onClick={() => handleCopy('text', text)}
                        title="Clique para copiar texto"
                        className="relative group flex-grow flex items-start bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-cyan-500 transition-all duration-200 cursor-pointer"
                    >
                        <textarea
                            id="text-input"
                            rows={10}
                            className="flex-grow w-full h-full bg-transparent p-4 text-gray-800 dark:text-gray-200 resize-y placeholder-gray-500 focus:outline-none cursor-pointer"
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Digite o texto aqui..."
                            aria-label="Campo de entrada de texto"
                        />
                        <div className="absolute top-2 right-2 p-2 rounded-full text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                            {copied === 'text' ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 opacity-50 group-hover:opacity-100" />}
                        </div>
                    </div>
                </div>

                {/* Binary Area */}
                <div className="space-y-2 flex flex-col">
                    <label htmlFor="binary-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Código Binário (clique para copiar)
                    </label>
                    <div 
                        onClick={() => handleCopy('binary', binary)}
                        title="Clique para copiar binário"
                        className="relative group flex-grow flex items-start bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 cursor-pointer"
                    >
                        <textarea
                            id="binary-input"
                            rows={10}
                            className="flex-grow w-full h-full bg-transparent p-4 text-gray-800 dark:text-gray-200 resize-y placeholder-gray-500 font-mono focus:outline-none cursor-pointer"
                            value={binary}
                            onChange={handleBinaryChange}
                            placeholder="01001111 01101100 01100001"
                            aria-label="Campo de entrada de código binário"
                        />
                        <div className="absolute top-2 right-2 p-2 rounded-full text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                            {copied === 'binary' ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 opacity-50 group-hover:opacity-100" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BinaryTranslator;