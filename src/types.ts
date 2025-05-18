export interface Car {
  carType: string;
  brand: string;
  carModel: string;
  image: string;
  yearOfManufacture: number;
  mileage: string;
  fuelType: string;
  available: boolean;
  pricePerDay: number;
  description: string;
  vin: string;
}

export interface Customer {
  name: string;
  phoneNumber: string;
  email: string;
  driversLicenseNumber: string;
}

export interface Rental {
  startDate: string;
  rentalPeriod: number;
  totalPrice: number;
  orderDate: string;
}

export interface Order {
  customer: Customer;
  car: { vin: string };
  rental: Rental;
  status?: "pending" | "confirmed";
}
