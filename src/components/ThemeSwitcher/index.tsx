import { ThemeContext } from '@/contexts/themeContext';
import React, { useContext } from 'react';


export function ThemeSwitcher() {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext)

    console.log(darkMode)

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-900 text-black dark:text-white"
        >
            {darkMode ? '🌞' : '🌙'}
        </button>
    );
}