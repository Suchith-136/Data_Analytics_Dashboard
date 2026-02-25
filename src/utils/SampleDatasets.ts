// Sample transportation and urban planning datasets

export const SAMPLE_DATASETS = {
  traffic: {
    name: 'Traffic Data',
    description: 'Daily traffic volume by city and vehicle type',
    data: [
      { Date: '2023-01-01', City: 'Hyderabad', VehicleType: 'Car', Volume: 45000, AvgSpeed: 35 },
      { Date: '2023-01-01', City: 'Hyderabad', VehicleType: 'Bus', Volume: 8000, AvgSpeed: 28 },
      { Date: '2023-01-01', City: 'Hyderabad', VehicleType: 'Bike', Volume: 62000, AvgSpeed: 42 },
      { Date: '2023-01-01', City: 'Bangalore', VehicleType: 'Car', Volume: 52000, AvgSpeed: 32 },
      { Date: '2023-01-01', City: 'Bangalore', VehicleType: 'Bus', Volume: 9500, AvgSpeed: 25 },
      { Date: '2023-01-01', City: 'Bangalore', VehicleType: 'Bike', Volume: 58000, AvgSpeed: 38 },
      { Date: '2023-02-01', City: 'Hyderabad', VehicleType: 'Car', Volume: 47000, AvgSpeed: 34 },
      { Date: '2023-02-01', City: 'Hyderabad', VehicleType: 'Bus', Volume: 8200, AvgSpeed: 27 },
      { Date: '2023-02-01', City: 'Hyderabad', VehicleType: 'Bike', Volume: 64000, AvgSpeed: 41 },
      { Date: '2023-02-01', City: 'Bangalore', VehicleType: 'Car', Volume: 54000, AvgSpeed: 31 },
      { Date: '2023-02-01', City: 'Bangalore', VehicleType: 'Bus', Volume: 9800, AvgSpeed: 24 },
      { Date: '2023-02-01', City: 'Bangalore', VehicleType: 'Bike', Volume: 59000, AvgSpeed: 37 },
      { Date: '2023-03-01', City: 'Hyderabad', VehicleType: 'Car', Volume: 48500, AvgSpeed: 33 },
      { Date: '2023-03-01', City: 'Hyderabad', VehicleType: 'Bus', Volume: 8500, AvgSpeed: 26 },
      { Date: '2023-03-01', City: 'Hyderabad', VehicleType: 'Bike', Volume: 66000, AvgSpeed: 40 },
      { Date: '2023-03-01', City: 'Bangalore', VehicleType: 'Car', Volume: 56000, AvgSpeed: 30 },
      { Date: '2023-03-01', City: 'Bangalore', VehicleType: 'Bus', Volume: 10200, AvgSpeed: 23 },
      { Date: '2023-03-01', City: 'Bangalore', VehicleType: 'Bike', Volume: 61000, AvgSpeed: 36 },
      { Date: '2023-04-01', City: 'Hyderabad', VehicleType: 'Car', Volume: 50000, AvgSpeed: 32 },
      { Date: '2023-04-01', City: 'Hyderabad', VehicleType: 'Bus', Volume: 8800, AvgSpeed: 25 },
      { Date: '2023-04-01', City: 'Hyderabad', VehicleType: 'Bike', Volume: 68000, AvgSpeed: 39 },
      { Date: '2023-04-01', City: 'Bangalore', VehicleType: 'Car', Volume: 58000, AvgSpeed: 29 },
      { Date: '2023-04-01', City: 'Bangalore', VehicleType: 'Bus', Volume: 10500, AvgSpeed: 22 },
      { Date: '2023-04-01', City: 'Bangalore', VehicleType: 'Bike', Volume: 63000, AvgSpeed: 35 }
    ]
  },
  accidents: {
    name: 'Accident Data',
    description: 'Traffic accident statistics by city and severity',
    data: [
      { Date: '2023-01-01', City: 'Hyderabad', Severity: 'Minor', Count: 45, Injuries: 32, Fatalities: 0 },
      { Date: '2023-01-01', City: 'Hyderabad', Severity: 'Major', Count: 12, Injuries: 28, Fatalities: 3 },
      { Date: '2023-01-01', City: 'Bangalore', Severity: 'Minor', Count: 52, Injuries: 38, Fatalities: 0 },
      { Date: '2023-01-01', City: 'Bangalore', Severity: 'Major', Count: 15, Injuries: 35, Fatalities: 4 },
      { Date: '2023-02-01', City: 'Hyderabad', Severity: 'Minor', Count: 48, Injuries: 35, Fatalities: 0 },
      { Date: '2023-02-01', City: 'Hyderabad', Severity: 'Major', Count: 14, Injuries: 31, Fatalities: 4 },
      { Date: '2023-02-01', City: 'Bangalore', Severity: 'Minor', Count: 55, Injuries: 41, Fatalities: 0 },
      { Date: '2023-02-01', City: 'Bangalore', Severity: 'Major', Count: 17, Injuries: 38, Fatalities: 5 },
      { Date: '2023-03-01', City: 'Hyderabad', Severity: 'Minor', Count: 42, Injuries: 30, Fatalities: 0 },
      { Date: '2023-03-01', City: 'Hyderabad', Severity: 'Major', Count: 11, Injuries: 26, Fatalities: 2 },
      { Date: '2023-03-01', City: 'Bangalore', Severity: 'Minor', Count: 49, Injuries: 36, Fatalities: 0 },
      { Date: '2023-03-01', City: 'Bangalore', Severity: 'Major', Count: 14, Injuries: 32, Fatalities: 3 },
      { Date: '2023-04-01', City: 'Hyderabad', Severity: 'Minor', Count: 51, Injuries: 37, Fatalities: 0 },
      { Date: '2023-04-01', City: 'Hyderabad', Severity: 'Major', Count: 13, Injuries: 29, Fatalities: 3 },
      { Date: '2023-04-01', City: 'Bangalore', Severity: 'Minor', Count: 58, Injuries: 43, Fatalities: 0 },
      { Date: '2023-04-01', City: 'Bangalore', Severity: 'Major', Count: 16, Injuries: 36, Fatalities: 4 }
    ]
  },
  publicTransport: {
    name: 'Public Transport Data',
    description: 'Public transportation ridership and availability',
    data: [
      { Date: '2023-01-01', City: 'Hyderabad', TransportType: 'Metro', Ridership: 125000, Routes: 3, Availability: 95 },
      { Date: '2023-01-01', City: 'Hyderabad', TransportType: 'Bus', Ridership: 280000, Routes: 145, Availability: 88 },
      { Date: '2023-01-01', City: 'Bangalore', TransportType: 'Metro', Ridership: 185000, Routes: 4, Availability: 92 },
      { Date: '2023-01-01', City: 'Bangalore', TransportType: 'Bus', Ridership: 320000, Routes: 178, Availability: 85 },
      { Date: '2023-02-01', City: 'Hyderabad', TransportType: 'Metro', Ridership: 132000, Routes: 3, Availability: 96 },
      { Date: '2023-02-01', City: 'Hyderabad', TransportType: 'Bus', Ridership: 290000, Routes: 145, Availability: 89 },
      { Date: '2023-02-01', City: 'Bangalore', TransportType: 'Metro', Ridership: 195000, Routes: 4, Availability: 93 },
      { Date: '2023-02-01', City: 'Bangalore', TransportType: 'Bus', Ridership: 335000, Routes: 178, Availability: 86 },
      { Date: '2023-03-01', City: 'Hyderabad', TransportType: 'Metro', Ridership: 128000, Routes: 3, Availability: 94 },
      { Date: '2023-03-01', City: 'Hyderabad', TransportType: 'Bus', Ridership: 285000, Routes: 148, Availability: 87 },
      { Date: '2023-03-01', City: 'Bangalore', TransportType: 'Metro', Ridership: 190000, Routes: 4, Availability: 91 },
      { Date: '2023-03-01', City: 'Bangalore', TransportType: 'Bus', Ridership: 328000, Routes: 180, Availability: 84 },
      { Date: '2023-04-01', City: 'Hyderabad', TransportType: 'Metro', Ridership: 138000, Routes: 4, Availability: 97 },
      { Date: '2023-04-01', City: 'Hyderabad', TransportType: 'Bus', Ridership: 295000, Routes: 150, Availability: 90 },
      { Date: '2023-04-01', City: 'Bangalore', TransportType: 'Metro', Ridership: 202000, Routes: 5, Availability: 94 },
      { Date: '2023-04-01', City: 'Bangalore', TransportType: 'Bus', Ridership: 342000, Routes: 182, Availability: 87 }
    ]
  },
  fuel: {
    name: 'Fuel Price Data',
    description: 'Fuel prices and consumption by city',
    data: [
      { Date: '2023-01-01', City: 'Hyderabad', FuelType: 'Petrol', Price: 102.5, Consumption: 1850000 },
      { Date: '2023-01-01', City: 'Hyderabad', FuelType: 'Diesel', Price: 89.2, Consumption: 2100000 },
      { Date: '2023-01-01', City: 'Bangalore', FuelType: 'Petrol', Price: 104.8, Consumption: 2150000 },
      { Date: '2023-01-01', City: 'Bangalore', FuelType: 'Diesel', Price: 91.5, Consumption: 2450000 },
      { Date: '2023-02-01', City: 'Hyderabad', FuelType: 'Petrol', Price: 104.2, Consumption: 1820000 },
      { Date: '2023-02-01', City: 'Hyderabad', FuelType: 'Diesel', Price: 90.8, Consumption: 2080000 },
      { Date: '2023-02-01', City: 'Bangalore', FuelType: 'Petrol', Price: 106.5, Consumption: 2120000 },
      { Date: '2023-02-01', City: 'Bangalore', FuelType: 'Diesel', Price: 93.2, Consumption: 2420000 },
      { Date: '2023-03-01', City: 'Hyderabad', FuelType: 'Petrol', Price: 106.8, Consumption: 1780000 },
      { Date: '2023-03-01', City: 'Hyderabad', FuelType: 'Diesel', Price: 92.5, Consumption: 2050000 },
      { Date: '2023-03-01', City: 'Bangalore', FuelType: 'Petrol', Price: 108.2, Consumption: 2090000 },
      { Date: '2023-03-01', City: 'Bangalore', FuelType: 'Diesel', Price: 94.8, Consumption: 2390000 },
      { Date: '2023-04-01', City: 'Hyderabad', FuelType: 'Petrol', Price: 108.5, Consumption: 1750000 },
      { Date: '2023-04-01', City: 'Hyderabad', FuelType: 'Diesel', Price: 94.2, Consumption: 2020000 },
      { Date: '2023-04-01', City: 'Bangalore', FuelType: 'Petrol', Price: 110.5, Consumption: 2060000 },
      { Date: '2023-04-01', City: 'Bangalore', FuelType: 'Diesel', Price: 96.5, Consumption: 2360000 }
    ]
  },
  ridesharing: {
    name: 'Ridesharing Data',
    description: 'Ridesharing platform usage and metrics',
    data: [
      { Date: '2023-01-01', City: 'Hyderabad', Platform: 'Uber', Rides: 45000, AvgFare: 185, Rating: 4.2 },
      { Date: '2023-01-01', City: 'Hyderabad', Platform: 'Ola', Rides: 52000, AvgFare: 172, Rating: 4.1 },
      { Date: '2023-01-01', City: 'Bangalore', Platform: 'Uber', Rides: 68000, AvgFare: 195, Rating: 4.3 },
      { Date: '2023-01-01', City: 'Bangalore', Platform: 'Ola', Rides: 72000, AvgFare: 182, Rating: 4.2 },
      { Date: '2023-02-01', City: 'Hyderabad', Platform: 'Uber', Rides: 48000, AvgFare: 188, Rating: 4.2 },
      { Date: '2023-02-01', City: 'Hyderabad', Platform: 'Ola', Rides: 55000, AvgFare: 175, Rating: 4.1 },
      { Date: '2023-02-01', City: 'Bangalore', Platform: 'Uber', Rides: 72000, AvgFare: 198, Rating: 4.3 },
      { Date: '2023-02-01', City: 'Bangalore', Platform: 'Ola', Rides: 76000, AvgFare: 185, Rating: 4.2 },
      { Date: '2023-03-01', City: 'Hyderabad', Platform: 'Uber', Rides: 51000, AvgFare: 192, Rating: 4.3 },
      { Date: '2023-03-01', City: 'Hyderabad', Platform: 'Ola', Rides: 58000, AvgFare: 178, Rating: 4.2 },
      { Date: '2023-03-01', City: 'Bangalore', Platform: 'Uber', Rides: 75000, AvgFare: 202, Rating: 4.4 },
      { Date: '2023-03-01', City: 'Bangalore', Platform: 'Ola', Rides: 79000, AvgFare: 188, Rating: 4.3 },
      { Date: '2023-04-01', City: 'Hyderabad', Platform: 'Uber', Rides: 54000, AvgFare: 195, Rating: 4.3 },
      { Date: '2023-04-01', City: 'Hyderabad', Platform: 'Ola', Rides: 61000, AvgFare: 182, Rating: 4.2 },
      { Date: '2023-04-01', City: 'Bangalore', Platform: 'Uber', Rides: 78000, AvgFare: 205, Rating: 4.4 },
      { Date: '2023-04-01', City: 'Bangalore', Platform: 'Ola', Rides: 82000, AvgFare: 192, Rating: 4.3 }
    ]
  }
};

export type DatasetKey = keyof typeof SAMPLE_DATASETS;
