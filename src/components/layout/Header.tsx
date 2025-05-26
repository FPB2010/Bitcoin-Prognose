import React from 'react';
import { Bitcoin, Moon, Sun, Globe2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { languages } from '../../i18n';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Bitcoin className="h-8 w-8 text-primary-500" />
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t('header.title')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                aria-label="Change language"
              >
                <Globe2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {languages[i18n.language as keyof typeof languages]?.nativeName || 'English'}
                </span>
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {Object.entries(languages).map(([code, { nativeName }]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                          i18n.language === code
                            ? 'text-primary-600 dark:text-primary-400 font-medium'
                            : 'text-neutral-700 dark:text-neutral-300'
                        }`}
                        role="menuitem"
                      >
                        {nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              aria-label={theme === 'dark' ? t('header.theme.light') : t('header.theme.dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-neutral-400" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;