import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, Globe } from "lucide-react";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
];

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageChange = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
    // Here you would implement actual language switching logic
    // For now, we'll just update the selected state
    console.log('Language changed to:', language.name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-sm">
          <Globe className="w-4 h-4" />
          <span className="hidden md:inline">{selectedLanguage.flag} {selectedLanguage.name}</span>
          <span className="md:hidden">{selectedLanguage.flag}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border border-border shadow-elegant z-[100]" align="end">
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

export default LanguageSelector;