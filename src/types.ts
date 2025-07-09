export type UserRole = "staff" | "admin" | "customer";

export type User = {
  id: number;
  name: string | null;
  email: string;
  password: string;
  mobile: string | null;
  dob: string | null;
  address: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type Booking = {
  id: number;
  bookingDate: string;
  name: string;
  mobile: string;
  email: string;
  remarks: string | null;
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
  petAge: string | null;
  petFood: string;
  vaccinationCertificate: string | null;
  petVaccinated: boolean;
  userId: number | null;
};

export type BookingFormData = Omit<Booking, "id" | "userId"> & {
  vaccinationCertificate: File | null;
  petAge: string;
  userId?: number | null;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export type EditBookingModalProps = {
  booking: Booking;
  onClose: () => void;
  onSave: (updatedBooking: Booking) => Promise<void>;
};

export type EditBookingForm = Omit<
  Booking,
  "vaccinationCertificate" | "petAge"
> & {
  vaccinationCertificate: File | string | null;
  petAge: string; // Ensure petAge is always a string
};

export type DateString = string;
export type DateTimeString = string;
