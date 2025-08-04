import React from 'react';
import type { Tool, ToolId } from '../App';

interface HomeProps {
    tools: Tool[];
    onSelectTool: (toolId: ToolId | 'home') => void;
}

const Home: React.FC<HomeProps> = ({ tools, onSelectTool }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <header className="text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-400 dark:to-purple-500">
                    Bem-vindo ao ToolBox.IA
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
                    Sua coleção completa de ferramentas inteligentes. Escolha uma das opções abaixo para começar.
                </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => onSelectTool(tool.id)}
                        disabled={!tool.implemented}
                        className={`
                            group p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50
                            hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 
                            transition-all duration-300 ease-in-out text-left space-y-2
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg disabled:hover:border-gray-200/50 dark:disabled:hover:border-gray-700/50
                        `}
                    >
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {tool.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tool.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
