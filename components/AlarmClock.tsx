import React, { useState, useEffect, useCallback, useRef } from 'react';

const IconPlus: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const IconTrash: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconBell: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;


interface Alarm {
    id: number;
    time: string; // "HH:mm"
    label: string;
    enabled: boolean;
}

interface AlarmClockProps {
    onGoBack: () => void;
}

const AlarmClock: React.FC<AlarmClockProps> = ({ onGoBack }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [alarms, setAlarms] = useState<Alarm[]>(() => {
        const savedAlarms = localStorage.getItem('alarms');
        return savedAlarms ? JSON.parse(savedAlarms) : [];
    });
    const [newAlarmTime, setNewAlarmTime] = useState('07:00');
    const [newAlarmLabel, setNewAlarmLabel] = useState('Acordar');
    const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }, [alarms]);

    useEffect(() => {
        const currentHHMM = currentTime.toTimeString().substring(0, 5);
        const activeAlarm = alarms.find(a => a.enabled && a.time === currentHHMM);
        if (activeAlarm && !triggeredAlarm) {
            setTriggeredAlarm(activeAlarm);
            if (audioRef.current) {
                audioRef.current.play().catch(console.error);
            }
        }
    }, [currentTime, alarms, triggeredAlarm]);
    
    useEffect(() => {
        // Simple beep sound to avoid external URLs
        audioRef.current = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"+Array(1e3).join("123"));
    }, []);

    const addAlarm = useCallback(() => {
        if (!newAlarmTime) return;
        setAlarms(prev => [...prev, { id: Date.now(), time: newAlarmTime, label: newAlarmLabel || 'Alarme', enabled: true }]);
        setNewAlarmLabel('');
    }, [newAlarmTime, newAlarmLabel]);

    const toggleAlarm = (id: number) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    };

    const deleteAlarm = (id: number) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    const dismissAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setTriggeredAlarm(null);
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
            <div className="w-full max-w-lg mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <header className="text-center">
                     <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-600 dark:from-rose-400 dark:to-violet-500">
                        Despertador
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Configure alarmes para seus compromissos.</p>
                </header>

                <div className="text-center bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg">
                    <p className="font-mono text-5xl sm:text-6xl font-bold tracking-tighter text-gray-800 dark:text-gray-100">
                        {currentTime.toLocaleTimeString('pt-BR')}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">{currentTime.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Adicionar Novo Alarme</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input type="time" value={newAlarmTime} onChange={e => setNewAlarmTime(e.target.value)} className="flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-rose-500" />
                        <input type="text" value={newAlarmLabel} onChange={e => setNewAlarmLabel(e.target.value)} placeholder="Etiqueta do alarme" className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-rose-500" />
                        <button onClick={addAlarm} className="p-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors shadow"><IconPlus className="w-6 h-6"/></button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Meus Alarmes</h3>
                    {alarms.length > 0 ? (
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {alarms.map(alarm => (
                                <li key={alarm.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${alarm.enabled ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-gray-100 dark:bg-gray-800/60 opacity-60'}`}>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{alarm.time}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{alarm.label}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toggleAlarm(alarm.id)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${alarm.enabled ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${alarm.enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
                                        </button>
                                        <button onClick={() => deleteAlarm(alarm.id)} className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30">
                                            <IconTrash className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum alarme configurado.</p>
                    )}
                </div>
                
                {triggeredAlarm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center animate-pulse">
                            <IconBell className="w-16 h-16 text-rose-500 mx-auto mb-4"/>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{triggeredAlarm.label}</h2>
                            <p className="text-5xl font-mono my-2 text-gray-900 dark:text-gray-100">{triggeredAlarm.time}</p>
                            <button onClick={dismissAlarm} className="mt-6 px-8 py-3 bg-rose-500 text-white font-bold rounded-lg shadow-lg hover:bg-rose-600 transition-transform transform hover:scale-105">
                                Dispensar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AlarmClock;