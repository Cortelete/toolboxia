import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const IconUpload: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

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

interface Analysis {
    purpose: string;
    design: string;
    ux: string;
    content: string;
    improvements: string;
}

const analysisFields: { key: keyof Analysis, label: string, emoji: string }[] = [
    { key: 'purpose', label: 'Propósito Principal e Clareza', emoji: '🎯' },
    { key: 'design', label: 'Design e Apelo Visual', emoji: '🎨' },
    { key: 'ux', label: 'Experiência do Usuário (UX)', emoji: '✨' },
    { key: 'content', label: 'Conteúdo e Tom de Voz', emoji: '📝' },
    { key: 'improvements', label: 'Pontos de Melhoria', emoji: '🚀' },
];

interface VisualWebAnalyzerProps {
    onGoBack: () => void;
}

const VisualWebAnalyzer: React.FC<VisualWebAnalyzerProps> = ({ onGoBack }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageMimeType, setImageMimeType] = useState<string>('');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleFileSelect = useCallback((file: File | null) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, etc.).');
            return;
        }
        setError(null);
        setAnalysis(null);
        setCopied(false);
        setImageMimeType(file.type);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleClear = useCallback(() => {
        setImagePreview(null);
        setImageMimeType('');
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
        setCopied(false);
    }, []);

    const handleDescribe = useCallback(async () => {
        if (!imagePreview || !imageMimeType) {
            setError('Nenhuma imagem para analisar.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setCopied(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const base64Data = imagePreview.split(',')[1];
            
            const imagePart = {
                inlineData: {
                    mimeType: imageMimeType,
                    data: base64Data,
                },
            };

            const textPart = {
                text: `Aja como um designer UI/UX expert e analista de marketing digital. Analise a seguinte imagem, que é uma captura de tela de um site ou aplicativo. Forneça uma análise detalhada e construtiva. Popule os campos do JSON schema fornecido.`,
            };

             const analysisSchema = {
                type: Type.OBJECT,
                properties: {
                    purpose: {
                        type: Type.STRING,
                        description: 'Analise o objetivo principal da página e a clareza da proposta de valor. Responda em formato de texto corrido e detalhado.'
                    },
                    design: {
                        type: Type.STRING,
                        description: 'Avalie o layout, estrutura, paleta de cores, tipografia, espaços em branco e a qualidade dos elementos visuais. Responda em formato de texto corrido e detalhado.'
                    },
                    ux: {
                        type: Type.STRING,
                        description: 'Analise a intuitividade da navegação, a clareza e posicionamento dos CTAs, e se a interface é limpa ou sobrecarregada. Responda em formato de texto corrido e detalhado.'
                    },
                    content: {
                        type: Type.STRING,
                        description: 'Avalie a legibilidade, concisão do texto e o tom de voz transmitido (ex: profissional, amigável, técnico). Responda em formato de texto corrido e detalhado.'
                    },
                    improvements: {
                        type: Type.STRING,
                        description: 'Liste de 2 a 3 sugestões concretas e acionáveis para melhorar o design e a UX desta página. Responda em formato de lista com marcadores (-).'
                    }
                },
                 required: ["purpose", "design", "ux", "content", "improvements"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: analysisSchema
                }
            });
            
            const resultText = response.text.trim();
            const parsedJson = JSON.parse(resultText);
            setAnalysis(parsedJson);

        } catch (err) {
            setError('Ocorreu um erro ao contatar a IA. Verifique sua chave de API e se a imagem é válida.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [imagePreview, imageMimeType]);

    const handleAnalysisChange = (field: keyof Analysis, value: string) => {
        setAnalysis(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleCopy = useCallback(() => {
        if (!analysis) return;
        
        const formattedText = analysisFields.map(field => 
            `### ${field.emoji} ${field.label}\n${analysis[field.key]}`
        ).join('\n\n');

        navigator.clipboard.writeText(formattedText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [analysis]);


    // Drag and Drop handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
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
            <div className="w-full max-w-4xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-500">
                        Analisador Visual (IA)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Envie um print de um site e receba uma análise de UI/UX feita por IA.</p>
                </header>

                {!imagePreview ? (
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative w-full border-4 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-sky-500 bg-sky-100 dark:bg-sky-900/40' : 'border-gray-300 dark:border-gray-600 hover:border-sky-400'}`}
                    >
                        <div className="flex flex-col items-center justify-center p-10 sm:p-20 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Seletor de arquivo de imagem"
                            />
                            <IconUpload className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Arraste e solte a imagem aqui</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">ou</p>
                            <span className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg font-semibold shadow-md hover:bg-sky-600 transition-colors pointer-events-none">
                                Selecione um arquivo
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative group w-full p-2 bg-gray-900/10 dark:bg-gray-900/30 rounded-lg">
                            <img src={imagePreview} alt="Pré-visualização do site" className="w-full h-auto max-h-[500px] object-contain rounded-md shadow-lg" />
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-md z-10 transition-opacity duration-300">
                                    <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-white mt-4 text-lg font-semibold">Analisando imagem...</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleDescribe}
                                disabled={isLoading}
                                className="w-full flex-grow bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-600 hover:to-sky-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-sky-300/50 disabled:opacity-50 disabled:cursor-wait disabled:scale-100"
                            >
                                ✨ Analisar Website
                            </button>
                             <button
                                onClick={handleClear}
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-400/50 disabled:opacity-50"
                            >
                                Começar de Novo
                            </button>
                        </div>

                        {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-lg">{error}</p>}

                        {analysis && (
                            <div className="bg-gray-50/70 dark:bg-gray-900/70 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                                 <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Análise da IA (Editável)</h2>
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                                            copied
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300'
                                        }`}
                                        disabled={!analysis}
                                    >
                                        {copied ? <IconCheck className="h-5 w-5" /> : <IconCopy className="h-5 w-5" />}
                                        {copied ? 'Copiado!' : 'Copiar Tudo'}
                                    </button>
                                 </div>
                                 <div className="space-y-6">
                                     {analysisFields.map(({ key, label, emoji }) => (
                                        <div key={key}>
                                            <label htmlFor={`analysis-${key}`} className="block text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                {emoji} {label}
                                            </label>
                                            <textarea
                                                id={`analysis-${key}`}
                                                value={analysis[key]}
                                                onChange={(e) => handleAnalysisChange(key, e.target.value)}
                                                className="w-full h-36 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 resize-y"
                                                aria-label={label}
                                            />
                                        </div>
                                    ))}
                                 </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default VisualWebAnalyzer;