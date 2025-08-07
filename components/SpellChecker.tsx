import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

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

interface SpellCheckerProps {
    onGoBack: () => void;
}

const SpellChecker: React.FC<SpellCheckerProps> = ({ onGoBack }) => {
    const [inputText, setInputText] = useState<string>('O rapido cachoro maron salta sobre o caum pregisoso.');
    const [outputText, setOutputText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const handleCorrection = useCallback(async () => {
        if (!inputText.trim()) {
            setError('Por favor, insira um texto para corrigir.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setOutputText('');
        setCopied(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Corrija a ortografia e a gramática do seguinte texto, mantendo o significado original e o tom. Retorne apenas o texto corrigido, sem qualquer outra explicação, introdução ou formatação. Texto original: "${inputText}"`;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });
            
            setOutputText(response.text.trim());

        } catch (err) {
            setError('Ocorreu um erro ao contatar a IA. Verifique sua chave de API e tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
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
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-400 dark:to-rose-500">
                        Corretor Ortográfico (IA)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Use o poder da IA para corrigir erros de gramática e ortografia.</p>
                </header>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="spell-checker-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Seu Texto
                        </label>
                        <textarea
                            id="spell-checker-input"
                            rows={6}
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 resize-y placeholder-gray-500"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Cole o texto para correção..."
                        />
                    </div>
                    
                    <button
                        onClick={handleCorrection}
                        disabled={isLoading || !inputText.trim()}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-rose-300/50 disabled:opacity-50 disabled:cursor-wait disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                               </svg>
                               Corrigindo...
                            </>
                        ) : 'Corrigir com IA'}
                    </button>

                    {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
                    
                    <div>
                        <label htmlFor="spell-checker-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Texto Corrigido (clique para copiar)
                        </label>
                         <div 
                            onClick={handleCopy}
                            title="Clique para copiar"
                            className="relative group cursor-pointer bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-rose-500 transition-all duration-200"
                        >
                            <textarea
                                id="spell-checker-output"
                                readOnly
                                rows={6}
                                className="flex-grow w-full bg-transparent p-4 text-gray-800 dark:text-gray-200 resize-y placeholder-gray-500 focus:outline-none cursor-pointer"
                                value={outputText}
                                placeholder="O resultado corrigido aparecerá aqui..."
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

export default SpellChecker;