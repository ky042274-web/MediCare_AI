/**
 * MediCare AI - TypeScript Data Models & Types
 */

export type UserRole = 'patient' | 'doctor' | 'donor' | 'hospital_staff' | 'admin';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Specialty =
  | 'General Physician'
  | 'Cardiologist — Heart Specialist'
  | 'Neurologist — Brain and Nerve Specialist'
  | 'Neurosurgeon — Brain and Spine Surgery Specialist'
  | 'Pediatrician — Children\'s Doctor'
  | 'Gynecologist — Women\'s Health Specialist'
  | 'Orthopedic — Bone and Joint Specialist'
  | 'Dermatologist — Skin Specialist'
  | 'ENT Specialist — Ear, Nose and Throat'
  | 'Ophthalmologist — Eye Specialist'
  | 'Psychiatrist — Mental Health Specialist'
  | 'Endocrinologist — Diabetes and Hormone Specialist'
  | 'Nephrologist — Kidney Specialist'
  | 'Gastroenterologist — Digestive System Specialist'
  | 'Pulmonologist — Lung and Respiratory Specialist'
  | 'Oncologist — Cancer Specialist'
  | 'Dentist — Dental Specialist';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  city?: string;
  bloodGroup?: BloodGroup;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  doctorProfileId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  verifiedQualifications: string; // e.g., MBBS, MD (Cardiology) - AIIMS
  specialty: Specialty;
  hospitalOrClinic: string;
  city: string;
  consultationFee: number; // in INR
  consultationModes: ('online' | 'in-person')[];
  availableDays: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
  workingHours: {
    start: string; // e.g. "09:00"
    end: string;   // e.g. "17:00"
  };
  slotDurationMinutes: number; // e.g. 30
  experienceYears: number;
  languagesSpoken: string[];
  registrationNumber: string; // e.g. "MCI-48921-D"
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  about: string;
  avatarUrl: string;
}

export type AppointmentStatus = 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorHospital: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  mode: 'online' | 'in-person';
  fee: number;
  status: AppointmentStatus;
  symptoms?: string;
  videoRoomId?: string;
  createdAt: string;
  clinicalNotes?: string;
  prescription?: Prescription;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  diagnosis: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string; // e.g. "Twice daily after meals"
    durationDays: number;
  }[];
  advice: string;
  followUpDays?: number;
  issuedAt: string;
  doctorSignature: string;
}

export type UrgencyLevel = 'emergency' | 'urgent' | 'routine';
export type BloodRequestStatus = 'pending' | 'contacted' | 'fulfilled' | 'cancelled';

export interface BloodDonor {
  id: string;
  userId?: string;
  name: string;
  bloodGroup: BloodGroup;
  city: string;
  area: string;
  isAvailable: boolean;
  availabilityNote: string; // e.g., "Ready for emergency calls"
  preferredContact: 'in-app' | 'call' | 'whatsapp';
  phoneMasked: string;
  lastDonationDate?: string;
  donationCount: number;
  verifiedByBloodBank: boolean;
  registeredAt: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  city: string;
  urgency: UrgencyLevel;
  requiredDate: string;
  requesterName: string;
  contactPhoneMasked: string;
  fullContactPhone?: string;
  status: BloodRequestStatus;
  notes?: string;
  createdAt: string;
  fulfilledUnits?: number;
}

export interface HealthTest {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  description: string;
  price: number;
  provider: string;
  sampleType: 'Blood' | 'Urine' | 'Vitals' | 'Swab';
  turnaroundHours: number;
  fastingRequired: boolean;
  fastingHours?: number;
  homeCollectionAvailable: boolean;
  parametersCount: number;
  badge?: string;
}

export type TestBookingStatus = 'scheduled' | 'sample_collected' | 'analyzing' | 'completed' | 'cancelled';

export interface HealthTestBooking {
  id: string;
  testId: string;
  testName: string;
  patientId: string;
  patientName: string;
  date: string;
  timeSlot: string;
  collectionType: 'home' | 'lab';
  address?: string;
  price: number;
  status: TestBookingStatus;
  provider: string;
  bookedAt: string;
  resultReportId?: string;
}

export interface Biomarker {
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
}

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  date: string;
  testType: string;
  laboratoryName: string;
  fileUrl?: string;
  fileType: 'pdf' | 'image' | 'digital';
  sharedWithDoctorIds: string[];
  biomarkers?: Biomarker[];
  aiSummaryEnglish?: string;
  aiSummaryHindi?: string;
  keyFindings?: string[];
  recommendedSpecialty?: string;
  notes?: string;
}

export interface DiseaseAssessmentResult {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Emergency';
  isEmergency: boolean;
  emergencyWarning?: string;
  emergencyWarningHindi?: string;
  possibleConditions: {
    condition: string;
    conditionHindi: string;
    probability: 'Likely' | 'Possible' | 'Uncommon';
    reasoning: string;
  }[];
  recommendedSpecialty: Specialty;
  nextStepsEnglish: string[];
  nextStepsHindi: string[];
  lifestylePrecautions: string[];
  clinicalDisclaimer: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  target: string;
  timestamp: string;
  details: string;
}
