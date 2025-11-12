/**
 * Language Switcher Component
 * Displays a language selector dropdown in the navbar
 * Shows globe icon with language options
 */

import React, { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { UIText } from "@/lib/uiText";

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, supportedLanguages, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { translatedText: texts } = useTranslation({
    buttonTitle: UIText.header.changeLanguage,
    menuHeading: UIText.header.selectLanguage,
    changingStatus: UIText.header.changingLanguage,
    currentPrefix: UIText.header.currentLanguagePrefix,
    menuTitle: UIText.header.languageMenuTitle,
  });

  const handleLanguageChange = async (languageCode) => {
    await changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLanguageName = supportedLanguages[currentLanguage] || "English";
  const buttonTitle = texts?.buttonTitle ?? UIText.header.changeLanguage;
  const menuHeading = texts?.menuHeading ?? UIText.header.selectLanguage;
  const menuTitle = texts?.menuTitle ?? UIText.header.languageMenuTitle;
  const changingStatus = texts?.changingStatus ?? UIText.header.changingLanguage;
  const currentPrefix = texts?.currentPrefix ?? UIText.header.currentLanguagePrefix;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 h-auto py-2 px-3"
          disabled={isLoading}
          title={buttonTitle}
          aria-label={buttonTitle}
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline text-xs md:text-sm">{currentLanguageName}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48" aria-label={menuTitle}>
        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">
          {menuHeading}
        </div>

        <DropdownMenuSeparator />

        {Object.entries(supportedLanguages).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className="cursor-pointer flex items-center justify-between"
          >
            <span>{name}</span>
            {code === currentLanguage && (
              <span className="ml-2 text-primary font-semibold" aria-hidden="true">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <div className="px-2 py-2 text-xs text-muted-foreground">
          {isLoading ? changingStatus : `${currentPrefix} ${currentLanguageName}`}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
