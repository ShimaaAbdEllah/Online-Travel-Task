import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
  isEnglish = false; // Flag to track the current language (false indicates Arabic)

  constructor(private translate: TranslateService) {
    // Set the default language to English when the component initializes
    this.translate.setDefaultLang('en');
    // Use the English language initially
    this.translate.use('en');
  }

  /**
   * Switches between English and Arabic languages when called.
   * Toggles the value of 'isEnglish' and changes the language accordingly.
   */
  switchLanguage() {
    this.isEnglish = !this.isEnglish; // Toggle the language flag
    const lang = this.isEnglish ? 'en' : 'ar'; // Set language to 'en' if English, 'ar' if Arabic
    this.translate.use(lang); // Use the selected language
  }
}
