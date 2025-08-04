import React, { useState, useMemo, useCallback } from 'react';

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

const units = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const tens = ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const hundreds = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

function numberToWords(num: number): string {
    if (num === 0) return "zero";
    if (num > 999999999999) return "Número muito grande.";

    const numStr = num.toString().padStart(12, '0');
    const billions = parseInt(numStr.substring(0, 3));
    const millions = parseInt(numStr.substring(3, 6));
    const thousands = parseInt(numStr.substring(6, 9));
    const rest = parseInt(numStr.substring(9, 12));

    let result = [];
    if (billions) {
        result.push(convertThreeDigits(billions) + (billions > 1 ? " bilhões" : " bilhão"));
    }
    if (millions) {
        result.push(convertThreeDigits(millions) + (millions > 1 ? " milhões" : " milhão"));
    }
    if (thousands) {
        if (!(thousands === 1 && (millions || billions))) {
            result.push(convertThreeDigits(thousands) + " mil");
        } else {
             result.push("mil");
        }
    }
    if (rest) {
        if(result.length > 0 && (rest < 100 || (rest % 100 === 0)) && !numStr.endsWith('000')) result.push('e');
        result.push(convertThreeDigits(rest));
    }

    return result.join(' ').replace(/\s\se\s/g, ' e ').trim();
}

function convertThreeDigits(num: number): string {
    if (num === 0) return "";
    if (num === 100) return "cem";

    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const u = num % 10;
    
    let parts = [];
    if (h > 0) parts.push(hundreds[h]);

    const remainder = num % 100;
    if (remainder > 0) {
        if (remainder >= 10 && remainder < 20) {
            parts.push(teens[remainder - 10]);
        } else {
            if (t > 0) parts.push(tens[t]);
            if (u > 0) parts.push(units[u]);
        }
    }
    return parts.join(' e ');
}


const NumberToWordsConverter: React.FC = () => {
    const [numberInput, setNumberInput] = useState<string>('123456');
    const [copied, setCopied] = useState<boolean>(false);

    const numberInWords = useMemo(() => {
        setCopied(false);
        const num = parseInt(numberInput, 10);
        if (isNaN(num) || numberInput.trim() === '') {
            return 'Digite um número válido.';
        }
        return numberToWords(num);
    }, [numberInput]);

    const handleCopy = useCallback(() => {
        const isInvalid = numberInWords.includes('inválido') || numberInWords.includes('muito grande');
        if (!numberInWords || isInvalid) return;

        navigator.clipboard.writeText(numberInWords).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [numberInWords]);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <header className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500">
                    Número por Extenso
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Converta qualquer número para sua forma escrita.</p>
            </header>

            <div className="space-y-2">
                <label htmlFor="number-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Digite o Número
                </label>
                <input
                    id="number-input"
                    type="number"
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-500 font-mono text-lg"
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                    placeholder="Ex: 12345"
                />
            </div>
            
            <div className="space-y-2">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Resultado por Extenso (clique para copiar)
                </label>
                <div 
                    onClick={handleCopy}
                    title="Clique para copiar"
                    className="relative group w-full bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 min-h-[100px] flex items-center justify-center text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors"
                >
                    <p className="font-semibold text-lg text-emerald-700 dark:text-emerald-400">{numberInWords}</p>
                    <div className="absolute top-2 right-2 p-1 rounded-full text-gray-500 dark:text-gray-400">
                        {copied ? (
                            <IconCheck className="h-5 w-5 text-green-500" />
                        ) : (
                            <IconCopy className="h-5 w-5 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumberToWordsConverter;