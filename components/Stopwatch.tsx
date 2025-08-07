import React, { useState, useEffect, useRef, useCallback } from 'react';

// Icons for buttons
const IconPlay: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;
const IconPause: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
const IconFlag: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" /></svg>;
const IconRestart: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" /></svg>;

const formatTime = (time: number) => {
    const milliseconds = `00${time % 1000}`.slice(-3, -1);
    const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
    const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
    const hours = `0${Math.floor(time / 3600000)}`.slice(-2);
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

interface StopwatchProps {
    onGoBack: () => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({ onGoBack }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now() - time;
            timerRef.current = window.setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning, time]);

    const handleStartStop = useCallback(() => {
        setIsRunning(prev => !prev);
    }, []);

    const handleLap = useCallback(() => {
        if (isRunning) {
            setLaps(prevLaps => [time, ...prevLaps]);
        }
    }, [isRunning, time]);

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    }, []);

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
            <div className="w-full max-w-md mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600 dark:from-lime-400 dark:to-emerald-500">
                        Cronômetro
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Meça o tempo com precisão.</p>
                </header>

                <div className="text-center my-8">
                    <p className="font-mono text-5xl sm:text-7xl font-bold tracking-tighter text-gray-800 dark:text-gray-100">
                        {formatTime(time)}
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleReset}
                        className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md disabled:opacity-50"
                        disabled={isRunning || time === 0}
                        aria-label="Resetar"
                    >
                        <IconRestart className="w-8 h-8"/>
                    </button>
                     <button
                        onClick={handleStartStop}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        aria-label={isRunning ? 'Pausar' : 'Iniciar'}
                    >
                        {isRunning ? <IconPause className="w-8 h-8"/> : <IconPlay className="w-8 h-8"/>}
                    </button>
                    <button
                        onClick={handleLap}
                        className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md disabled:opacity-50"
                        disabled={!isRunning}
                        aria-label="Marcar volta"
                    >
                       <IconFlag className="w-8 h-8"/>
                    </button>
                </div>

                {laps.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300">Voltas</h2>
                        <ul className="max-h-60 overflow-y-auto space-y-2 rounded-lg bg-gray-100 dark:bg-gray-900/40 p-3 font-mono text-gray-800 dark:text-gray-200">
                            {laps.map((lap, index) => {
                                const prevLap = laps[index + 1] || 0;
                                const diff = lap - prevLap;
                                return (
                                    <li key={index} className="flex justify-between items-center text-sm p-2 rounded-md even:bg-white/50 dark:even:bg-gray-800/50">
                                        <span className="font-bold text-gray-500 dark:text-gray-400">Volta {laps.length - index}</span>
                                        <span className="text-gray-500 dark:text-gray-400">+{formatTime(diff)}</span>
                                        <span>{formatTime(lap)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default Stopwatch;