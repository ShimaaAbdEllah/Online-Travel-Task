import { Component, HostListener, OnInit } from '@angular/core';
import { FlightService } from 'src/app/shared/services/flight.service';

@Component({
  selector: 'app-flight-result',
  templateUrl: './flight-result.component.html',
  styleUrls: ['./flight-result.component.css']
})
export class FlightResultComponent implements OnInit {
  // Controls the visibility of the filter drawer
  showFilter: boolean = false;

  // Specifies the width of the filter drawer
  readonly drawerWidth: number = 250;

  // Indicates if the screen size is small (e.g., for responsive design)
  isSmallScreen: boolean = false;

  // Injecting the FlightTravelsService
  constructor(private readonly flightTravels: FlightService) {}

  // Initializes component and retrieves flights
  ngOnInit(): void {
    this.updateScreenSize(window.innerWidth); // Update screen size on component initialization
    this.flightTravels.loadFlightData(); // Retrieve flight data from the service
  }

  // Returns the list of flights retrieved by the service
  getFlights(): any[] {
    return this.flightTravels.flights;
  }

  // Toggles the visibility of the filter drawer
  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  // Listens for window resize events and updates screen size
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const target = event.target as Window; // Ensure correct typing for target
    this.updateScreenSize(target.innerWidth);
  }

  // Updates the screen size status based on the width
  private updateScreenSize(width: number): void {
    this.isSmallScreen = width < 768; // Define small screen threshold
  }
}
