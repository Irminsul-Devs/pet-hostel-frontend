export type User = {
  id: number;
  name: string;
  email: string;
  role: 'staff' | 'admin' | 'customer';
  mobile?: string;
  dob?: string;
  address?: string;
};

export type Booking = {
  id: number;
  bookingDate: string;
  name: string;
  mobile: string;
  email: string;
  remarks: string;
  ownerName: string;
  ownerMobile: string;
  ownerDob: string;
  ownerEmail: string;
  ownerAddress: string;
  petName: string;
  petType: string;
  bookingFrom: string;
  bookingTo: string;
  services: string[];
  petDob: string;
  petAge?: string;
  petFood?: string;
  signature: string;
  acknowledge: boolean;
  vaccinationCertificate?: string | null;
  petVaccinated: boolean;
};

export type BookingFormData = Omit<Booking, 'id' | 'vaccinationCertificate'> & {
  vaccinationCertificate?: File | null;
};