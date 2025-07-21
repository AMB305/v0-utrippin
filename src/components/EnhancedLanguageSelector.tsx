import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

interface EnhancedLanguageSelectorProps {
  className?: string;
  variant?: "default" | "compact";
}

const EnhancedLanguageSelector = ({ className = "", variant = "default" }: EnhancedLanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update selected language when i18n language changes
    const currentLang = languages.find(lang => lang.code === i18n.language);
    if (currentLang) {
      setSelectedLanguage(currentLang);
    }
  }, [i18n.language]);

  const handleLanguageChange = async (language: typeof languages[0]) => {
    if (language.code === selectedLanguage.code) return;
    
    setIsLoading(true);
    try {
      await i18n.changeLanguage(language.code);
      setSelectedLanguage(language);
      
      // Store language preference
      localStorage.setItem('preferredLanguage', language.code);
      
      // Dispatch custom event for other components to react to language change
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: language.code } 
      }));
      
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonContent = variant === "compact" ? (
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4" />
      <span className="text-sm">{selectedLanguage.flag}</span>
      <ChevronDown className="w-3 h-3" />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <span className="hidden md:inline">{selectedLanguage.flag} {selectedLanguage.name}</span>
      <span className="md:hidden">{selectedLanguage.flag}</span>
      <ChevronDown className="w-3 h-3" />
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`${className} ${isLoading ? 'opacity-50' : ''}`}
          disabled={isLoading}
        >
          {buttonContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-background border border-border shadow-elegant z-[9999] fixed" 
        align="end"
        sideOffset={8}
        avoidCollisions={true}
      >
        {languages.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            className="flex items-center justify-between gap-3 cursor-pointer hover:bg-muted"
            onClick={() => handleLanguageChange(language)}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {selectedLanguage.code === language.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedLanguageSelector;