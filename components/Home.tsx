import React from 'react';
import type { Tool, ToolId, ViewMode } from '../App';

interface HomeProps {
    tools: Tool[];
    onSelectTool: (toolId: ToolId | 'home') => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

const ToolCard: React.FC<{ tool: Tool, onSelectTool: (toolId: ToolId) => void }> = ({ tool, onSelectTool }) => (
     <button
        key={tool.id}
        onClick={() => onSelectTool(tool.id)}
        disabled={!tool.implemented}
        className={`
            group p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-transparent
            hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 
            transition-all duration-300 ease-in-out text-left space-y-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg disabled:hover:border-transparent
        `}
    >
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {tool.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {tool.description}
        </p>
    </button>
);

const Home: React.FC<HomeProps> = ({ tools, onSelectTool, viewMode, onViewModeChange }) => {

    const sortedTools = React.useMemo(() => {
        if (viewMode === 'name') {
            return [...tools].sort((a, b) => a.name.localeCompare(b.name));
        }
        return tools;
    }, [tools, viewMode]);
    
    const groupedTools = React.useMemo(() => {
        if (viewMode !== 'category') return null;
        return sortedTools.reduce((acc, tool) => {
            const category = tool.category || 'Outras';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(tool);
            return acc;
        }, {} as Record<string, Tool[]>);
    }, [sortedTools, viewMode]);

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

            <div className="flex justify-center items-center gap-4">
                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Organizar por:</span>
                 <div className="flex rounded-lg p-1 bg-gray-200/70 dark:bg-gray-800/60">
                    <button 
                        onClick={() => onViewModeChange('category')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-300 ${viewMode === 'category' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
                        aria-pressed={viewMode === 'category'}
                    >
                        Categoria
                    </button>
                     <button 
                        onClick={() => onViewModeChange('name')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-300 ${viewMode === 'name' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
                        aria-pressed={viewMode === 'name'}
                    >
                        Nome
                    </button>
                 </div>
            </div>
            
            {viewMode === 'name' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} onSelectTool={onSelectTool} />
                    ))}
                </div>
            )}
            
            {viewMode === 'category' && groupedTools && (
                <div className="space-y-10">
                    {Object.entries(groupedTools).map(([category, toolsInCategory]) => (
                        <section key={category}>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-blue-500/30">
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {toolsInCategory.map(tool => (
                                    <ToolCard key={tool.id} tool={tool} onSelectTool={onSelectTool} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
