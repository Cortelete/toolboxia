import React, { useState, useCallback } from 'react';

const IconUpload: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const IconDownload: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const IconInfo: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const ImageUpscaler: React.FC = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('image.png');
    const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleFileSelect = useCallback((file: File | null) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, etc.).');
            return;
        }
        handleClear();
        setFileName(file.name);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleClear = useCallback(() => {
        setImagePreview(null);
        setUpscaledImage(null);
        setError(null);
        setIsLoading(false);
    }, []);

    const handleUpscale = useCallback(async () => {
        if (!imagePreview) return;

        setIsLoading(true);
        setError(null);
        setUpscaledImage(null);

        // ** SIMULATION **
        // In a real scenario, you would send the image to a backend API for processing.
        // Here, we simulate a delay to mimic the AI working.
        setTimeout(() => {
            // We'll just use the original image as the "upscaled" result for this demo.
            setUpscaledImage(imagePreview);
            setIsLoading(false);
        }, 3000); // 3-second delay
        
    }, [imagePreview, scaleFactor]);

    const handleDownload = useCallback(() => {
        if (!upscaledImage) return;
        const link = document.createElement('a');
        link.href = upscaledImage;
        const nameParts = fileName.split('.');
        const extension = nameParts.pop();
        const name = nameParts.join('.');
        link.download = `${name}_upscaled_${scaleFactor}x.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [upscaledImage, fileName, scaleFactor]);

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
        <div className="w-full max-w-5xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <header className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
                    Ampliador de Imagem (IA)
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Aumente a resolução de suas imagens com o poder da IA.</p>
            </header>
            
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 rounded-r-lg flex items-start gap-3" role="alert">
                <IconInfo className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold">Ferramenta em demonstração</p>
                    <p className="text-sm">
                        Esta funcionalidade é uma simulação. O recurso de "upscaling" será ativado assim que a API for atualizada.
                    </p>
                </div>
            </div>

            {!imagePreview ? (
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative w-full border-4 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/40' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'}`}
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
                        <span className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition-colors pointer-events-none">
                            Selecione um arquivo
                        </span>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Ampliar em:</span>
                             <div className="flex rounded-lg shadow-sm">
                                <button onClick={() => setScaleFactor(2)} className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${scaleFactor === 2 ? 'bg-indigo-500 text-white z-10 ring-2 ring-indigo-500' : 'bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600'}`}>2x</button>
                                <button onClick={() => setScaleFactor(4)} className={`-ml-px px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${scaleFactor === 4 ? 'bg-indigo-500 text-white z-10 ring-2 ring-indigo-500' : 'bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600'}`}>4x</button>
                             </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleUpscale}
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                            >
                                ✨ Ampliar Imagem
                            </button>
                             <button
                                onClick={handleClear}
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                            >
                                Nova Imagem
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-lg">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col items-center">
                            <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Original</h3>
                            <div className="w-full p-2 bg-gray-200 dark:bg-gray-900/30 rounded-lg aspect-square flex items-center justify-center">
                                <img src={imagePreview} alt="Original" className="max-w-full max-h-full object-contain rounded-md shadow-md"/>
                            </div>
                        </div>
                         <div className="flex flex-col items-center">
                             <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Ampliada ({scaleFactor}x)</h3>
                             <div className="w-full p-2 bg-gray-200 dark:bg-gray-900/30 rounded-lg aspect-square flex items-center justify-center">
                                {isLoading && (
                                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                        <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="mt-2">Processando com IA...</p>
                                    </div>
                                )}
                                {upscaledImage && !isLoading && (
                                     <img src={upscaledImage} alt="Ampliada" className="max-w-full max-h-full object-contain rounded-md shadow-md"/>
                                )}
                                {!upscaledImage && !isLoading && (
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                        <p>O resultado aparecerá aqui.</p>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                    
                    {upscaledImage && (
                        <div className="flex justify-center pt-4">
                             <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                <IconDownload className="h-6 w-6" />
                                Baixar Imagem Ampliada
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpscaler;