import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLanguage);
  };

  const getCurrentLanguageDisplay = () => {
    return i18n.language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English';
  };

  return (
    <button 
      className="language-selector"
      onClick={toggleLanguage}
      title={t('language.selector.tooltip')}
      aria-label={t('language.selector.tooltip')}
    >
      {getCurrentLanguageDisplay()}
    </button>
  );
};

export default LanguageSelector;
