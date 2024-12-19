import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root', // Providing this service at the root level, making it available throughout the application
})
export class LanguageService {
  
  private currentLangSubject = new BehaviorSubject<string>('en'); // Initializing the language as 'en' (English) by default

  // Creating an observable to allow other components to subscribe to the language changes
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Setting English as the default language for translation
  }

  /**
   * Toggles between English ('en') and Arabic ('ar') languages.
   * Updates the BehaviorSubject to notify subscribers of the language change.
   */
  toggleLanguage(): void {
    const newLang = this.currentLangSubject.value === 'en' ? 'ar' : 'en'; // If current language is 'en', switch to 'ar', else switch to 'en'
    this.currentLangSubject.next(newLang); // Update the current language in the BehaviorSubject
    this.translate.use(newLang); // Change the language used by the ngx-translate service
  }
}
