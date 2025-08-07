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

const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
    'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
    'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
    'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
    'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus', 'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
    'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in', 'hac', 'habitasse', 'platea', 'dictumst', 'aenean',
];

const generateWords = (count: number): string => {
    let words = [];
    for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    return words.join(' ');
};

const generateSentences = (count: number): string => {
    let sentences = [];
    for (let i = 0; i < count; i++) {
        const wordCount = Math.floor(Math.random() * 10) + 8; // 8-17 words per sentence
        let sentence = generateWords(wordCount);
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
        sentences.push(sentence);
    }
    return sentences.join(' ');
};

const generateParagraphs = (count: number): string => {
    let paragraphs = [];
    for (let i = 0; i < count; i++) {
        const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-7 sentences per paragraph
        paragraphs.push(generateSentences(sentenceCount));
    }
    return paragraphs.join('\n\n');
};

interface LoremIpsumGeneratorProps {
    onGoBack: () => void;
}

const LoremIpsumGenerator: React.FC<LoremIpsumGeneratorProps> = ({ onGoBack }) => {
    const [count, setCount] = useState<number>(3);
    const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
    const [generatedText, setGeneratedText] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    const handleGenerate = useCallback(() => {
        setCopied(false);
        if (count <= 0) {
            setGeneratedText('');
            return;
        }
        switch (type) {
            case 'paragraphs':
                setGeneratedText(generateParagraphs(count));
                break;
            case 'sentences':
                setGeneratedText(generateSentences(count));
                break;
            case 'words':
                setGeneratedText(generateWords(count));
                break;
        }
    }, [count, type]);
    
    const handleCopy = useCallback(() => {
        if (!generatedText) return;
        navigator.clipboard.writeText(generatedText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [generatedText]);

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
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500">
                        Gerador de Lorem Ipsum
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Gere texto de preenchimento para seus layouts e designs.</p>
                </header>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="w-full sm:w-1/3">
                        <label htmlFor="lorem-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantidade</label>
                        <input
                            id="lorem-count"
                            type="number"
                            min="1"
                            className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-500"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        />
                    </div>
                     <div className="w-full sm:w-2/3">
                         <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</span>
                         <div className="flex rounded-lg shadow-sm">
                            <button onClick={() => setType('paragraphs')} className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-l-lg transition-colors ${type === 'paragraphs' ? 'bg-amber-500 text-white z-10 ring-2 ring-amber-500' : 'bg-white dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-gray-600'}`}>Parágrafos</button>
                            <button onClick={() => setType('sentences')} className={`-ml-px flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${type === 'sentences' ? 'bg-amber-500 text-white z-10 ring-2 ring-amber-500' : 'bg-white dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-gray-600'}`}>Frases</button>
                            <button onClick={() => setType('words')} className={`-ml-px flex-1 px-4 py-2.5 text-sm font-medium rounded-r-lg transition-colors ${type === 'words' ? 'bg-amber-500 text-white z-10 ring-2 ring-amber-500' : 'bg-white dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-gray-600'}`}>Palavras</button>
                         </div>
                     </div>
                </div>

                <button
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300/50"
                >
                    Gerar Texto
                </button>

                {generatedText && (
                    <div className="space-y-2">
                        <label htmlFor="lorem-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Texto Gerado (clique para copiar)
                        </label>
                        <div 
                            onClick={handleCopy}
                            title="Clique para copiar"
                            className="relative group cursor-pointer bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-amber-500 transition-all duration-200"
                        >
                            <textarea
                                id="lorem-output"
                                readOnly
                                rows={10}
                                className="flex-grow w-full bg-transparent p-4 text-gray-600 dark:text-gray-400 resize-y placeholder-gray-500 focus:outline-none cursor-pointer"
                                value={generatedText}
                            />
                            <div className="absolute top-2 right-2 p-2 rounded-full text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                                {copied ? <IconCheck className="h-5 w-5 text-green-500" /> : <IconCopy className="h-5 w-5 opacity-50 group-hover:opacity-100" />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default LoremIpsumGenerator;