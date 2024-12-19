import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/shared/services/flight.service';
import { LanguageService } from './../../../shared/services/language.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  // Flag to determine if the current language is Arabic
  isArabic: boolean | undefined = false;
  
  // Search input value and the filtered list of airlines
  search: string = '';
  searchArray: string[] = [];

  // Price range for the flight filter
  minPrice: number = 0;
  maxPrice: number = 10000000;

  constructor(
    public FlightService: FlightService, 
    public LanguageService: LanguageService 
  ) {}

  // Lifecycle hook to initialize the component
  ngOnInit(): void {
    // Subscribe to the current language and update the 'isArabic' flag accordingly
    this.LanguageService.currentLang$.subscribe((lang) => {
      this.isArabic = lang === 'ar';
    });

    // Initialize the search array with available airlines
    this.searchArray = this.FlightService.airlines || [];
  }

  /**
   * Handles airline selection from the dropdown.
   * Filters the flight list by the selected airline.
   */
  handleAirlines(event: any): void {
    const selectedAirline = event.value;
    this.FlightService.filterAirlines(selectedAirline);
  }

  /**
   * Handles changes in the search input for airline filtering.
   * Filters the airlines based on the user's search input.
   */
  handleAirlineChange(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    // Filters airlines based on the search value (case-insensitive)
    this.searchArray = this.FlightService.airlines.filter((airline: any) =>
      airline.toLowerCase().includes(searchValue)
    );
  }

  /**
   * Prevents input of Arabic characters in the search field.
   * This is useful for enforcing a non-Arabic input in the search field.
   */
  preventArabic(event: KeyboardEvent): void {
    const arabicRegex = /[\u0600-\u06FF]/; // Regular expression for Arabic characters
    if (arabicRegex.test(event.key)) {
      event.preventDefault(); // Prevent Arabic character input
    }
  }

  /**
   * Handles the price range filter.
   * Filters flights based on the selected price range (minPrice and maxPrice).
   */
  handlePriceFilter(): void {
    this.FlightService.filterByPrice(this.minPrice, this.maxPrice);
  }

  /**
   * Handles changes in the selected stop number.
   * Filters the flights based on the selected number of stops.
   */
  handleStopsChange(event: any): void {
    const selectedStops = event.value;
    this.FlightService.filterStops(selectedStops);
  }

  /**
   * Handles changes in the refund status filter.
   * Filters flights based on the selected refund status.
   */
  handleRefundChange(event: any): void {
    const selectedRefundStatus = event.value;
    this.FlightService.filterRefund(selectedRefundStatus);
  }
}
