import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import NomenclatureConverter from './components/NomenclatureConverter';
import CaseConverter from './components/CaseConverter';
import Counter from './components/Counter';
import AccentRemover from './components/AccentRemover';
import NumberToWordsConverter from './components/NumberToWordsConverter';
import SpellChecker from './components/SpellChecker';
import CoolLettersConverter from './components/CoolLettersConverter';
import TextToHtmlConverter from './components/TextToHtmlConverter';
import RomanNumeralConverter from './components/RomanNumeralConverter';
import TextCutter from './components/TextCutter';
import RandomNumberGenerator from './components/RandomNumberGenerator';
import BinaryTranslator from './components/BinaryTranslator';
import LoremIpsumGenerator from './components/LoremIpsumGenerator';
import ColorPicker from './components/ColorPicker';
import VisualWebAnalyzer from './components/VisualWebAnalyzer';
import ImageReader from './components/ImageReader';
import ImageUpscaler from './components/ImageUpscaler';
import Footer from './components/Footer';


// Icons
const IconSun: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const IconMoon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const IconHome: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);


export type ToolId = 'nomenclature' | 'case' | 'counter' | 'accents' | 'number-to-words' | 'spell-checker' | 'cool-letters' | 'text-to-html' | 'roman-numerals' | 'text-cutter' | 'random-number' | 'binary-translator' | 'lorem-ipsum' | 'color-picker' | 'visual-analyzer' | 'image-reader' | 'image-upscaler';

export interface Tool {
    id: ToolId;
    name: string;
    description: string;
    component: JSX.Element;
    implemented: boolean;
}

const tools: Tool[] = [
  { id: 'nomenclature', name: 'Conversor de Nomenclatura', description: 'Converta listas de texto em `snake_case`, `camelCase`, etc.', component: <NomenclatureConverter />, implemented: true },
  { id: 'case', name: 'Conversor Maiúsculas/Minúsculas', description: 'Altere rapidamente o texto entre MAIÚSCULAS, minúsculas e Capitalizado.', component: <CaseConverter />, implemented: true },
  { id: 'counter', name: 'Contador de Caracteres', description: 'Conte caracteres, palavras e linhas do seu texto em tempo real.', component: <Counter />, implemented: true },
  { id: 'accents', name: 'Remover Acentos', description: 'Limpe seu texto removendo todos os acentos e caracteres diacríticos.', component: <AccentRemover />, implemented: true },
  { id: 'number-to-words', name: 'Número por Extenso', description: 'Transforme números em sua representação por extenso em português.', component: <NumberToWordsConverter />, implemented: true },
  { id: 'spell-checker', name: 'Corretor Ortográfico (IA)', description: 'Utilize IA para corrigir erros ortográficos e gramaticais no seu texto.', component: <SpellChecker />, implemented: true },
  { id: 'visual-analyzer', name: 'Analisador Visual (IA)', description: 'Envie um print de um site e receba uma análise de UI/UX feita por IA.', component: <VisualWebAnalyzer />, implemented: true },
  { id: 'image-reader', name: 'Leitor de Imagens (IA)', description: 'Peça para a IA descrever em detalhes o conteúdo de qualquer imagem.', component: <ImageReader />, implemented: true },
  { id: 'image-upscaler', name: 'Ampliador de Imagem (IA)', description: '(Demo) Aumente a resolução de suas imagens com o poder da IA.', component: <ImageUpscaler />, implemented: true },
  { id: 'cool-letters', name: 'Letras Diferentes', description: 'Crie textos com fontes e estilos especiais para redes sociais.', component: <CoolLettersConverter />, implemented: true },
  { id: 'text-to-html', name: 'Texto para HTML', description: 'Converta texto simples em HTML com parágrafos e quebras de linha.', component: <TextToHtmlConverter />, implemented: true },
  { id: 'roman-numerals', name: 'Conversor de Números Romanos', description: 'Converta números arábicos para romanos e vice-versa.', component: <RomanNumeralConverter />, implemented: true },
  { id: 'text-cutter', name: 'Cortar Textos', description: 'Divida textos longos em pedaços menores de um tamanho definido.', component: <TextCutter />, implemented: true },
  { id: 'random-number', name: 'Sorteador de Números', description: 'Sorteie números aleatórios com configurações de intervalo e quantidade.', component: <RandomNumberGenerator />, implemented: true },
  { id: 'binary-translator', name: 'Tradutor de Código Binário', description: 'Traduza texto para código binário ou decodifique binário para texto.', component: <BinaryTranslator />, implemented: true },
  { id: 'lorem-ipsum', name: 'Gerador de Lorem Ipsum', description: 'Gere texto de preenchimento para seus layouts.', component: <LoremIpsumGenerator />, implemented: true },
  { id: 'color-picker', name: 'Color Picker', description: 'Selecione cores e copie seus códigos em HEX, RGB e HSL.', component: <ColorPicker />, implemented: true },
];

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [activeTool, setActiveTool] = useState<ToolId | 'home'>('home');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const handleSelectTool = (toolId: ToolId | 'home') => {
        const tool = tools.find(t => t.id === toolId);
        if (toolId === 'home' || (tool && tool.implemented)) {
            setActiveTool(toolId);
            setIsMenuOpen(false); // Close menu on selection
        }
    };
    
    const currentTool = tools.find(t => t.id === activeTool);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 font-sans transition-colors duration-300 flex flex-col">
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-400 dark:to-purple-500">ToolBox.IA</h1>
                    <div className="flex items-center gap-2">
                         <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                             {theme === 'light' ? <IconMoon className="h-6 w-6"/> : <IconSun className="h-6 w-6"/>}
                         </button>
                         <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                         </button>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={`fixed md:relative top-0 left-0 h-full z-30 md:z-auto w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                    <div className="p-4 flex flex-col h-full">
                        <header className="hidden md:flex justify-between items-center mb-6">
                           <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-400 dark:to-purple-500">ToolBox.IA</h1>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                aria-label="Mudar tema"
                            >
                                {theme === 'light' ? <IconMoon className="h-5 w-5"/> : <IconSun className="h-5 w-5"/>}
                            </button>
                        </header>
                        <nav className="flex-grow overflow-y-auto pr-2 -mr-2">
                            <ul className="space-y-1">
                                <li>
                                    <button
                                        onClick={() => handleSelectTool('home')}
                                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-3 ${
                                            activeTool === 'home'
                                                ? 'bg-blue-500 text-white shadow'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <IconHome className="h-5 w-5"/>
                                        Início
                                    </button>
                                </li>
                                <hr className="my-3 border-gray-200 dark:border-gray-700" />
                                {tools.map(tool => (
                                    <li key={tool.id}>
                                        <button
                                            onClick={() => handleSelectTool(tool.id)}
                                            disabled={!tool.implemented}
                                            className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                                                activeTool === tool.id
                                                    ? 'bg-blue-500 text-white shadow'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            } ${
                                                !tool.implemented
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                                        >
                                            {tool.name}
                                            {!tool.implemented && <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">Em breve</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>

                 {isMenuOpen && <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/30 z-20 md:hidden"></div>}

                {/* Main Content Area */}
                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                     {activeTool === 'home' ? (
                        <Home tools={tools} onSelectTool={handleSelectTool} />
                    ) : (
                        currentTool ? currentTool.component : <Home tools={tools} onSelectTool={handleSelectTool} />
                    )}
                </main>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default App;