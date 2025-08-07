import React, { useState, useEffect, useMemo } from 'react';

const IconPlus: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const IconX: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;


interface WorldClock {
    timezone: string;
}

const defaultClocks: WorldClock[] = [
    { timezone: 'America/New_York' },
    { timezone: 'Europe/London' },
    { timezone: 'Asia/Tokyo' },
    { timezone: 'Australia/Sydney' },
];

const ClockCard: React.FC<{ timezone: string; currentTime: Date; onRemove: (tz: string) => void; }> = ({ timezone, currentTime, onRemove }) => {
    const { city, time, date, offset } = useMemo(() => {
        try {
            const dateObj = new Date(currentTime);
            const city = timezone.split('/').pop()?.replace(/_/g, ' ') || '';
            const time = dateObj.toLocaleTimeString('pt-BR', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const date = dateObj.toLocaleDateString('pt-BR', { timeZone: timezone, weekday: 'short', day: '2-digit', month: 'short' });
            const offsetParts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'longOffset' }).formatToParts(dateObj);
            const offsetString = offsetParts.find(part => part.type === 'timeZoneName')?.value || 'GMT';
            return { city, time, date, offset: offsetString };
        } catch (e) {
            console.error("Invalid timezone:", timezone);
            return { city: "Inválido", time: "--:--:--", date: "--", offset: "" };
        }
    }, [timezone, currentTime]);
    
    if (city === "Inválido") return null;

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 relative">
            <button onClick={() => onRemove(timezone)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <IconX className="w-4 h-4"/>
            </button>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{city}</p>
            <p className="font-mono text-4xl font-bold text-gray-900 dark:text-gray-100 my-2">{time}</p>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{date}</span>
                <span>{offset}</span>
            </div>
        </div>
    );
};

interface WorldClocksProps {
    onGoBack: () => void;
}

const WorldClocks: React.FC<WorldClocksProps> = ({ onGoBack }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [clocks, setClocks] = useState<WorldClock[]>(() => {
        const saved = localStorage.getItem('world_clocks');
        return saved ? JSON.parse(saved) : defaultClocks;
    });
    const [selectedTimezone, setSelectedTimezone] = useState<string>('Europe/Paris');
    
    const timezones = useMemo(() => [
        'Africa/Cairo',
        'America/Argentina/Buenos_Aires',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/New_York',
        'America/Phoenix',
        'America/Sao_Paulo',
        'America/Toronto',
        'Asia/Dubai',
        'Asia/Hong_Kong',
        'Asia/Kolkata',
        'Asia/Shanghai',
        'Asia/Singapore',
        'Asia/Tokyo',
        'Australia/Sydney',
        'Europe/Berlin',
        'Europe/Istanbul',
        'Europe/London',
        'Europe/Moscow',
        'Europe/Paris',
        'Pacific/Auckland',
        'Pacific/Honolulu',
        'UTC',
    ].sort(), []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('world_clocks', JSON.stringify(clocks));
    }, [clocks]);

    const addClock = () => {
        if (selectedTimezone && !clocks.find(c => c.timezone === selectedTimezone)) {
            setClocks(prev => [...prev, { timezone: selectedTimezone }]);
        }
    };

    const removeClock = (timezoneToRemove: string) => {
        setClocks(prev => prev.filter(c => c.timezone !== timezoneToRemove));
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
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                        Relógios do Mundo
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Veja a hora atual em diferentes cidades.</p>
                </header>

                <div className="bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                     <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adicionar fuso horário</h3>
                     <div className="flex gap-2">
                        <div className="relative w-full">
                            <select
                                value={selectedTimezone}
                                onChange={(e) => setSelectedTimezone(e.target.value)}
                                className="w-full appearance-none bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 pr-10 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                aria-label="Selecionar fuso horário"
                            >
                                {timezones.map(tz => (
                                    <option key={tz} value={tz} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">{tz.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                                <IconChevronDown className="h-5 w-5" />
                            </div>
                        </div>
                        <button onClick={addClock} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow flex-shrink-0">
                            <IconPlus className="w-6 h-6"/>
                        </button>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clocks.map(clock => (
                        <ClockCard key={clock.timezone} timezone={clock.timezone} currentTime={currentTime} onRemove={removeClock} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default WorldClocks;