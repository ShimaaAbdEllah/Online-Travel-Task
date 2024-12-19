import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AirItineraries } from 'src/app/models/flights';
import { FlightService } from 'src/app/shared/services/flight.service';

// Define supported currency codes for conversion
type CurrencyCode = 'EGP' | 'KWD' | 'SAR' | 'USD';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css']
})
export class FlightCardComponent implements OnInit {
  // Input property to receive flight data from the parent component
  @Input() flight: AirItineraries;

  // Object to store structured data for the flight card
  cardData: any = {};

  // Flag to manage the visibility of the modal
  isModalOpen = false;

  constructor(
    private flightService: FlightService,
    private router: Router
  ) {}

  // Lifecycle hook that initializes the flight card data
  ngOnInit(): void {
    this.initializeCardData();
  }

  /**
   * Initializes card data by extracting relevant information
   * from the flight input. Handles formatting and calculations.
   */
  private initializeCardData(): void {
    const flight = this.flight.allJourney.flights[0]; // First journey flight
    const flightDetails = flight.flightDTO[0]; // Flight details from the DTO

    this.cardData = {
      airName: flight.flightAirline.airlineName || 'Unknown Airline', // Airline name
      departureDate: this.formatDate(flightDetails.departureDate), // Formatted departure date
      arrivalDate: this.formatDate(flightDetails.arrivalDate), // Formatted arrival date
      duration: this.calculateDuration(flightDetails.departureDate, flightDetails.arrivalDate), // Flight duration
      departureCountryName: flightDetails.departureTerminalAirport.countryName, // Departure country
      arrivalCountryName: flightDetails.arrivalTerminalAirport.countryName, // Arrival country
      baggageAllowance: this.getBaggageAllowance(), // Baggage allowance
      refund: this.flight.isRefundable, // Refundable status
      direction: flight.stopsNum + 1, // Number of stops
      totalPrice: this.calculateTotalPriceInEGP(this.flight).toFixed(0) + ' EGP', // Total price in EGP
      id: this.flight.sequenceNum, // Unique flight ID
      seatAvailability: this.flight.seatAvailability || 'N/A', // Seat availability
    };
  }

  /**
   * Retrieves baggage allowance for the flight.
   * Returns "N/A" if no information is available.
   */
  private getBaggageAllowance(): string {
    if (!this.flight.baggageInformation || this.flight.baggageInformation.length === 0) {
      return 'N/A';
    }

    const baggageInfo = this.flight.baggageInformation[0]; // First baggage information entry
    return baggageInfo.baggage || 'N/A';
  }

  /**
   * Converts the total flight price to EGP using predefined currency conversion rates.
   */
  calculateTotalPriceInEGP(flightData: AirItineraries): number {
    const conversionRates: Record<CurrencyCode, number> = {
      EGP: 1,
      KWD: 159.63,
      SAR: 12.98,
      USD: 60,
    };

    let totalEGP = 0;

    // Calculate total price in EGP based on fares and conversion rates
    flightData.passengerFareBreakDownDTOs.forEach((passenger) => {
      passenger.flightFaresDTOs.forEach((fare) => {
        const currency = fare.currencyCode as CurrencyCode;
        const rate = conversionRates[currency] || 1;
        totalEGP += fare.fareAmount * rate;
      });
    });

    return totalEGP;
  }

  /**
   * Formats a date string into a user-friendly format.
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return date.toLocaleString('en-US', options);
  }

  /**
   * Calculates the duration of the flight based on departure and arrival dates.
   */
  calculateDuration(departureDate: string, arrivalDate: string): string {
    const departure = new Date(departureDate);
    const arrival = new Date(arrivalDate);
    const durationInMinutes = Math.round((arrival.getTime() - departure.getTime()) / 60000);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  /**
   * Handles user selection of a flight.
   * Navigates to the flight details page using the flight ID.
   */
  handleSelectedFlight(): void {
    this.flightService.findFlightById(this.flight.sequenceNum); // Fetch flight details
    this.router.navigate(['flight', this.cardData.id]); // Navigate to flight details page
  }

  /**
   * Opens the modal window.
   */
  openModal(): void {
    this.isModalOpen = true;
  }

  /**
   * Closes the modal window.
   */
  closeModal(): void {
    this.isModalOpen = false;
  }
}
