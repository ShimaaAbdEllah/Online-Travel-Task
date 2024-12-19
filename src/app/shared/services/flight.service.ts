import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AirItineraries } from '../../models/flights';
import { Router } from '@angular/router';
import { catchError, of} from 'rxjs'; 


type CurrencyCode = 'EGP' | 'KWD' | 'SAR' | 'USD';

@Injectable({
  providedIn: 'root', 
})
export class FlightService {
  constructor(private http: HttpClient, private router: Router) {}

  flights: AirItineraries[] = [];
  airlines: any = [];
  flightById: any = {};
  copyFlights: AirItineraries[] = [];
  filterByRefund: null | boolean = null;
  filterByStops: number = -1;
  filterByAirlines: string = 'all';
  isModalOpen = false;

  private LOCAL_STORAGE_KEY = 'flightData'; 

  // Load flight data from localStorage or API
  loadFlightData() {
    const storedData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.flights = parsedData.airItineraries;
      this.copyFlights = parsedData.airItineraries;
      this.airlines = parsedData.airlines;
      return;
    }

    this.http
      .get<{ airItineraries: AirItineraries[]; airlines: string[] }>(
        '../../../assets/response.json'
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching flight data:', error);
          return of({ airItineraries: [], airlines: [] });
        })
      )
      .subscribe(
        (data: { airItineraries: AirItineraries[]; airlines: string[] }) => {
          this.flights = data.airItineraries;
          this.copyFlights = data.airItineraries;
          this.airlines = data.airlines;
          localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
      );
  }


  // Add total price to flight
  addTotalPrice(flights: AirItineraries[]): AirItineraries[] {
    return flights.map((flight) => {
      const totalPrice = flight.passengerFareBreakDownDTOs.reduce(
        (total, passenger) =>
          total +
          passenger.flightFaresDTOs.reduce(
            (fareTotal, fare) => fareTotal + fare.fareAmount,
            0
          ),
        0
      );

      return { ...flight, totalPrice }; 
    });
  }

  // Filter flights by refund status
  filterRefund(refund: boolean) {
    this.filterByRefund = refund;
    this.filterAll();
  }

  // Filter flights by number of stops
  filterStops(stops: number) {
    this.filterByStops = stops;
    this.filterAll(); 
  }

  // Filter flights by airline
  filterAirlines(airline: string) {
    this.filterByAirlines = airline;
    this.filterAll(); 
  }

  // Calculate total price in EGP based on fare amounts and currency
  calculateTotalPriceInEGP(flightData: AirItineraries): number {
    const conversionRates: Record<CurrencyCode, number> = {
      EGP: 1,
      KWD: 159.63,
      SAR: 12.98,
      USD: 60,
    };

    let totalEGP = 0;

    flightData.passengerFareBreakDownDTOs.forEach((passenger) => {
      passenger.flightFaresDTOs.forEach((fare) => {
        const currency = fare.currencyCode as CurrencyCode;
        const rate = conversionRates[currency] || 1; 
        totalEGP += fare.fareAmount * rate;
      });
    });

    return totalEGP; 
  }

  // Filter flights by a price range
  filterByPrice(minPrice: number, maxPrice: number): void {
    this.flights = this.copyFlights.map((flight) => {
      const totalEGP = this.calculateTotalPriceInEGP(flight); 
      return { ...flight, totalPrice: totalEGP };  
    });

    // Filter flights based on price range
    this.flights = this.flights.filter(
      (flight) =>
        flight.totalPrice && 
        flight.totalPrice >= minPrice &&
        flight.totalPrice <= maxPrice
    );
  }

  // Apply all active filters
  filterAll(minPrice?: number, maxPrice?: number): void {
    this.flights = this.copyFlights.filter((flight) => {
       // Filter by refund status
      if (
        this.filterByRefund !== null &&
        flight.isRefundable !== this.filterByRefund
      ) {
        return false;
      }
        // Filter by number of stops
      if (
        this.filterByStops !== -1 &&
        flight.allJourney.flights[0].flightDTO.length !== this.filterByStops
      ) {
        return false;
      }
        // Filter by airline
      if (
        this.filterByAirlines !== 'all' &&
        flight.allJourney.flights[0].flightAirline.airlineName !==
          this.filterByAirlines
      ) {
        return false;
      }
       // Filter by price range if minPrice and maxPrice are defined
    if (minPrice !== undefined && maxPrice !== undefined) {
      const totalEGP = this.calculateTotalPriceInEGP(flight); 
      if (totalEGP < minPrice || totalEGP > maxPrice) {
        return false;
      }
    }
      
      return true; // Return only the flights matching all filters
    });
  }

  // Find flight by its unique ID
  findFlightById(id: number) {
    const flight = this.copyFlights.find((flight) => flight.sequenceNum === id);
    if (flight) {
      localStorage.setItem('selectedFlight', JSON.stringify(flight)); 
    }
    return flight; 
  }

  // Retrieve the selected flight from localStorage
  getSelectedFlight() {
    const storedFlight = localStorage.getItem('selectedFlight');
    return storedFlight ? JSON.parse(storedFlight) : null;
  }

  // Modal management
  openFilterModal(): void {
    this.isModalOpen = true;
  }

  closeFilterModal() : void {
    this.isModalOpen = false;
  }
}
