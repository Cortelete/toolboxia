import React, { useState, useEffect } from 'react';

const IconInstagram: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const Footer: React.FC = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000); // Update every second

        return () => {
            clearInterval(timer); // Cleanup on unmount
        };
    }, []);

    const formattedDate = currentDateTime.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const formattedTime = currentDateTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <footer className="w-full bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700/50 p-3 text-center sm:text-left">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 px-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <span>{formattedDate}</span>
                    <span className="mx-2 opacity-50">|</span>
                    <span>{formattedTime}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                    <a
                        href="https://www.instagram.com/InteligenciArte.IA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                    >
                        <IconInstagram className="w-4 h-4" />
                        <span>Desenvolvido por @InteligenciArte.IA</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
