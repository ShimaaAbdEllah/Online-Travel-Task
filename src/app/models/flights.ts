export interface AirItineraries {
  sequenceNum: number;
  pKey: string;
  isRefundable: boolean;
  itinTotalFare: TotalFare;
  totalDuration: number;
  deptDate: string;
  arrivalDate: string;
  cabinClass: string;
  flightType: string;
  allJourney: Journey;
  seatAvailability?: number | string;
  baggageInformation: BaggageInfo[];
  passengerFareBreakDownDTOs: PassengerFareBreakdown[];
  mealOptions?: string[];
  flightStatus?: string;
  totalPrice?: number;
}

export interface TotalFare {
  amount: number;
  fareAmount: number;
  promoCode: string | null;
  promoDiscount: number;
  currencyCode: string;
  totalTaxes: number;
}

export interface Journey {
  flights: Flight[];
}

export interface Flight {
  flightDTO: FlightDetail[];
  flightAirline: Airline;
  elapsedTime: number;
  stopsNum: number;
}

export interface FlightDetail {
  departureOffset: number;
  arrivalOffset: number;
  isStopSegment: boolean;
  deptTime: string;
  landTime: string;
  departureDate: string;
  arrivalDate: string;
  flightAirline: Airline;
  operatedAirline: Airline;
  durationPerLeg: number;
  departureTerminalAirport: Airport;
  arrivalTerminalAirport: Airport;
  transitTime: string;
  flightInfo: FlightInfo;
  segmentDetails: SegmentDetails;
  supplierRefID: string | null;
}

export interface Airline {
  airlineCode: string | null;
  airlineName: string | null;
  airlineLogo: string | null;
  alternativeBusinessName: string | null;
  passportDetailsRequired: boolean;
}

export interface Airport {
  airportCode: string;
  airportName: string;
  cityName: string;
  cityCode: string;
  countryCode: string;
  countryName: string;
  regionName: string;
}

export interface FlightInfo {
  flightNumber: string;
  equipmentNumber: string;
  mealCode: string;
  bookingCode: string;
  cabinClass: string;
}

export interface SegmentDetails {
  uniqueKey: string;
  baggage: string;
  childBaggage: string | null;
  infantBaggage: string | null;
}

export interface BaggageInfo {
  baggage: string;
  childBaggage: string | null;
  infantBaggage: string | null;
  airlineName: string;
  deptCity: string;
  landCity: string;
  flightNum: string;
}

export interface PassengerFareBreakdown {
  key: string;
  pricingMethod: string;
  cancelPenaltyDTOs: Penalty[];
  changePenaltyDTOs: Penalty[];
  passengerQuantity: number;
  passengerType: string;
  passengersRef: string[];
  flightFaresDTOs: Fare[];
  taxes: Tax[];
}

export interface Penalty {
  price: number;
  curency: string;
  percentage: number;
}

export interface Fare {
  fareAmount: number;
  fareType: string;
  currencyCode: string;
}

export interface Tax {
  taxCode: string;
  amount: number;
  taxName: string | null;
  taxCurrencyCode: string;
  content: string;
  countryCode: string | null;
}
