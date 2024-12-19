import { Component } from '@angular/core';
import { LanguageService } from 'src/app/shared/services/language.service'; 

@Component({
  selector: 'app-language-toggle', 
  templateUrl: './language.component.html', 
  styleUrls: ['./language.component.css'] 
})
export class LanguageToggleComponent {
  language: string; // The current language (either 'EN' for English or 'AR' for Arabic)

  constructor(private languageService: LanguageService) {
    // Subscribe to the current language observable to update the language flag whenever the language changes
    this.languageService.currentLang$.subscribe(lang => {
      // Update the language display based on the current language (show 'AR' for Arabic and 'EN' for English)
      this.language = lang === 'en' ? 'AR' : 'EN';
    });
  }

  /**
   * Toggles between English and Arabic by calling the toggleLanguage method from the LanguageService.
   * This method updates the current language based on the current selection.
   */
  toggleLanguage() {
    this.languageService.toggleLanguage(); // Toggles between 'en' and 'ar'
  }
}
