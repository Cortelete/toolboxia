import React, { useState } from 'react';

const romanMap: { [key: string]: number } = {
  M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
};
const arabicMap: { value: number; symbol: string }[] = [
  { value: 1000, symbol: 'M' }, { value: 900, symbol: 'CM' }, { value: 500, symbol: 'D' },
  { value: 400, symbol: 'CD' }, { value: 100, symbol: 'C' }, { value: 90, symbol: 'XC' },
  { value: 50, symbol: 'L' }, { value: 40, symbol: 'XL' }, { value: 10, symbol: 'X' },
  { value: 9, symbol: 'IX' }, { value: 5, symbol: 'V' }, { value: 4, symbol: 'IV' },
  { value: 1, symbol: 'I' }
];

function toRoman(num: number): string {
    if (num <= 0 || num >= 4000) return 'Inválido';
    let result = '';
    for (const pair of arabicMap) {
        while (num >= pair.value) {
            result += pair.symbol;
            num -= pair.value;
        }
    }
    return result;
}

function fromRoman(romanStr: string): string {
    romanStr = romanStr.toUpperCase();
    if (!/^[MDCLXVI]+$/.test(romanStr)) return 'Inválido';
    
    let result = 0;
    let i = 0;
    while (i < romanStr.length) {
        const twoChar = romanStr.substring(i, i + 2);
        if (twoChar in romanMap) {
            result += romanMap[twoChar];
            i += 2;
        } else {
            const oneChar = romanStr[i];
            if (oneChar in romanMap) {
              result += romanMap[oneChar];
              i++;
            } else {
              return 'Inválido';
            }
        }
    }
    // Final check if the conversion back to roman is the same
    if(toRoman(result) !== romanStr) return 'Inválido';

    return result.toString();
}

interface RomanNumeralConverterProps {
    onGoBack: () => void;
}

const RomanNumeralConverter: React.FC<RomanNumeralConverterProps> = ({ onGoBack }) => {
    const [arabic, setArabic] = useState<string>('1994');
    const [roman, setRoman] = useState<string>('MCMXCIV');

    const handleArabicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setArabic(value);
        if (value === '') {
            setRoman('');
        } else {
            const num = parseInt(value, 10);
            if (!isNaN(num)) {
                setRoman(toRoman(num));
            } else {
                setRoman('Inválido');
            }
        }
    };

    const handleRomanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setRoman(value);
         if (value === '') {
            setArabic('');
        } else {
            setArabic(fromRoman(value));
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
            <div className="w-full max-w-3xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-400 dark:to-yellow-500">
                        Conversor de Números Romanos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Converta números arábicos para romanos e vice-versa.</p>
                </header>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="w-full space-y-2">
                        <label htmlFor="arabic-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Número Arábico
                        </label>
                        <input
                            id="arabic-input"
                            type="number"
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 placeholder-gray-500 font-mono text-lg text-center"
                            value={arabic}
                            onChange={handleArabicChange}
                            placeholder="Ex: 2024"
                        />
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-500 dark:text-gray-400 self-center transform md:rotate-90">
                        &#8644;
                    </div>

                    <div className="w-full space-y-2">
                        <label htmlFor="roman-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Número Romano
                        </label>
                        <input
                            id="roman-input"
                            type="text"
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 placeholder-gray-500 font-mono text-lg text-center"
                            value={roman}
                            onChange={handleRomanChange}
                            placeholder="Ex: MMXXIV"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default RomanNumeralConverter;