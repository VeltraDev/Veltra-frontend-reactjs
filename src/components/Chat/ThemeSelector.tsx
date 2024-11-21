import React from 'react';
import { useTheme, themes, ThemeType } from '@/contexts/ThemeContext';
import { Check } from 'lucide-react';

export default function ThemeSelector() {
    const { theme, setTheme, currentTheme } = useTheme();

    return (
        <div className={`p-4 ${currentTheme.bg} rounded-xl shadow-lg border ${currentTheme.border}`}>
            <h3 className={`text-lg font-semibold mb-4 ${currentTheme.headerText}`}>Choose Theme</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {(Object.keys(themes) as ThemeType[]).map((themeKey) => {
                    const themeData = themes[themeKey];
                    return (
                        <button
                            key={themeKey}
                            onClick={() => setTheme(themeKey)}
                            className={`
                p-4 rounded-xl border transition-all duration-200
                ${theme === themeKey ? 'ring-2 ring-blue-500 border-blue-500' : currentTheme.border}
                ${themeData.bg}
                hover:scale-105
              `}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-lg ${themeData.text}`}>{themeData.icon}</span>
                                {theme === themeKey && (
                                    <Check className="w-4 h-4 text-blue-500" />
                                )}
                            </div>
                            <span className={`text-sm font-medium ${themeData.text}`}>
                                {themeData.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}