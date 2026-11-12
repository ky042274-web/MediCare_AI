/**
 * MediCare AI - Full-Stack Express Server with Gemini AI & Vite Middleware
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import type {
  Doctor,
  Appointment,
  BloodDonor,
  BloodRequest,
  HealthTest,
  HealthTestBooking,
  MedicalReport,
  AuditLog,
  Specialty,
  BloodGroup,
  DiseaseAssessmentResult,
  User,
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI SDK server-side
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// SEED IN-MEMORY DATABASE
// ==========================================

const USERS: User[] = [
  {
    id: 'user_patient_1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'patient',
    city: 'New Delhi',
    bloodGroup: 'B+',
    allergies: ['Penicillin', 'Dust mites'],
    chronicConditions: ['Mild Hypertension'],
    emergencyContact: {
      name: 'Sunita Sharma',
      relation: 'Spouse',
      phone: '+91 98765 43211',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_doc_1',
    name: 'Dr. Ananya Sharma',
    email: 'dr.ananya@medicare.ai',
    phone: '+91 98111 22334',
    role: 'doctor',
    city: 'New Delhi',
    doctorProfileId: 'doc_1',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'user_donor_1',
    name: 'Vikram Singh',
    email: 'vikram.donor@example.com',
    phone: '+91 99200 11223',
    role: 'donor',
    city: 'New Delhi',
    bloodGroup: 'O+',
  },
  {
    id: 'user_staff_1',
    name: 'Pooja Verma (Lab Lead)',
    email: 'pooja.verma@medicarelab.com',
    phone: '+91 98333 44556',
    role: 'hospital_staff',
    city: 'New Delhi',
  },
  {
    id: 'user_admin_1',
    name: 'Chief Admin (Medical Oversight)',
    email: 'admin@medicare.ai',
    phone: '+91 99999 88888',
    role: 'admin',
    city: 'New Delhi',
  },
];

// Complete 17 specialties directory
const DOCTORS: Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Rajesh Khanna',
    verifiedQualifications: 'MBBS, MD (Medicine) - AIIMS New Delhi',
    specialty: 'General Physician',
    hospitalOrClinic: 'Max Super Speciality Hospital, Saket',
    city: 'New Delhi',
    consultationFee: 700,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    workingHours: { start: '09:00', end: '17:00' },
    slotDurationMinutes: 30,
    experienceYears: 16,
    languagesSpoken: ['English', 'Hindi', 'Punjabi'],
    registrationNumber: 'DMC-24108',
    isVerified: true,
    rating: 4.9,
    reviewCount: 312,
    about: 'Senior physician with over 16 years treating lifestyle disorders, infectious fevers, seasonal viral illnesses, and primary health concerns.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_2',
    name: 'Dr. Ananya Sharma',
    verifiedQualifications: 'MBBS, MD, DM (Cardiology) - Gold Medalist',
    specialty: 'Cardiologist — Heart Specialist',
    hospitalOrClinic: 'Fortis Escorts Heart Institute, Okhla',
    city: 'New Delhi',
    consultationFee: 1200,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workingHours: { start: '10:00', end: '18:00' },
    slotDurationMinutes: 30,
    experienceYears: 14,
    languagesSpoken: ['English', 'Hindi'],
    registrationNumber: 'MCI-38910-C',
    isVerified: true,
    rating: 4.95,
    reviewCount: 428,
    about: 'Interventional cardiologist specializing in coronary artery disease, heart rhythm abnormalities, hypertension management, and preventive heart care.',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_3',
    name: 'Dr. Arvind Swaminathan',
    verifiedQualifications: 'MBBS, MD (Medicine), DM (Neurology)',
    specialty: 'Neurologist — Brain and Nerve Specialist',
    hospitalOrClinic: 'Apollo Hospitals, Greams Road',
    city: 'Chennai',
    consultationFee: 1100,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    workingHours: { start: '10:00', end: '16:30' },
    slotDurationMinutes: 30,
    experienceYears: 18,
    languagesSpoken: ['English', 'Tamil', 'Hindi'],
    registrationNumber: 'TMC-51042',
    isVerified: true,
    rating: 4.88,
    reviewCount: 265,
    about: 'Expert in migraines, epilepsy, neuropathies, Parkinson’s disease, and stroke rehabilitation.',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_4',
    name: 'Dr. Vikramaditya Sen',
    verifiedQualifications: 'MBBS, MS (Gen Surgery), MCh (Neurosurgery)',
    specialty: 'Neurosurgeon — Brain and Spine Surgery Specialist',
    hospitalOrClinic: 'Medanta - The Medicity, Gurugram',
    city: 'New Delhi',
    consultationFee: 1500,
    consultationModes: ['in-person', 'online'],
    availableDays: ['Tue', 'Thu', 'Sat'],
    workingHours: { start: '11:00', end: '16:00' },
    slotDurationMinutes: 45,
    experienceYears: 20,
    languagesSpoken: ['English', 'Hindi', 'Bengali'],
    registrationNumber: 'HNMC-18029',
    isVerified: true,
    rating: 4.92,
    reviewCount: 194,
    about: 'Distinguished brain and spine surgeon with comprehensive experience in minimally invasive spine decompression and cranial surgeries.',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_5',
    name: 'Dr. Meera Iyer',
    verifiedQualifications: 'MBBS, MD (Pediatrics), DCH',
    specialty: 'Pediatrician — Children\'s Doctor',
    hospitalOrClinic: 'Rainbow Children\'s Hospital, Marathahalli',
    city: 'Bengaluru',
    consultationFee: 800,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    workingHours: { start: '09:30', end: '17:30' },
    slotDurationMinutes: 20,
    experienceYears: 12,
    languagesSpoken: ['English', 'Kannada', 'Hindi'],
    registrationNumber: 'KMC-69123',
    isVerified: true,
    rating: 4.96,
    reviewCount: 512,
    about: 'Caring child specialist focusing on infant nutrition, vaccinations, adolescent growth milestones, and pediatric infections.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813579-994c6575f0a0?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_6',
    name: 'Dr. Suniti Deshmukh',
    verifiedQualifications: 'MBBS, MS (Obstetrics & Gynaecology), FICOG',
    specialty: 'Gynecologist — Women\'s Health Specialist',
    hospitalOrClinic: 'Kokilaben Dhirubhai Ambani Hospital, Andheri',
    city: 'Mumbai',
    consultationFee: 1000,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
    workingHours: { start: '10:00', end: '18:00' },
    slotDurationMinutes: 30,
    experienceYears: 17,
    languagesSpoken: ['English', 'Marathi', 'Hindi'],
    registrationNumber: 'MMC-42981',
    isVerified: true,
    rating: 4.91,
    reviewCount: 384,
    about: 'Dedicated women’s health expert specializing in high-risk pregnancies, PCOS/PCOD management, laparoscopic procedures, and menopause care.',
    avatarUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_7',
    name: 'Dr. Harpreet Singh Bhasin',
    verifiedQualifications: 'MBBS, MS (Orthopaedics), MCh (Ortho - UK)',
    specialty: 'Orthopedic — Bone and Joint Specialist',
    hospitalOrClinic: 'Sir Ganga Ram Hospital, Rajinder Nagar',
    city: 'New Delhi',
    consultationFee: 950,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
    workingHours: { start: '10:00', end: '17:00' },
    slotDurationMinutes: 30,
    experienceYears: 19,
    languagesSpoken: ['English', 'Punjabi', 'Hindi'],
    registrationNumber: 'DMC-30419',
    isVerified: true,
    rating: 4.87,
    reviewCount: 290,
    about: 'Specialist in joint replacement (knee and hip arthroplasty), sports ligament repairs, arthritis pain management, and bone trauma care.',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_8',
    name: 'Dr. Tanya Chatterjee',
    verifiedQualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    specialty: 'Dermatologist — Skin Specialist',
    hospitalOrClinic: 'Kolkata Skin & Laser Institute, Park Street',
    city: 'Kolkata',
    consultationFee: 750,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    workingHours: { start: '11:00', end: '19:00' },
    slotDurationMinutes: 20,
    experienceYears: 11,
    languagesSpoken: ['English', 'Bengali', 'Hindi'],
    registrationNumber: 'WBMC-58291',
    isVerified: true,
    rating: 4.89,
    reviewCount: 340,
    about: 'Consultant dermatologist treating clinical skin diseases (psoriasis, eczema, acne vulgaris), hair loss patterns, and allergic dermatitis.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813590-b8d5a1562b7e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_9',
    name: 'Dr. Pradeep Nambiar',
    verifiedQualifications: 'MBBS, MS (ENT), DLO',
    specialty: 'ENT Specialist — Ear, Nose and Throat',
    hospitalOrClinic: 'Aster CMI Hospital, Hebbal',
    city: 'Bengaluru',
    consultationFee: 850,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workingHours: { start: '09:00', end: '16:00' },
    slotDurationMinutes: 25,
    experienceYears: 15,
    languagesSpoken: ['English', 'Malayalam', 'Kannada', 'Hindi'],
    registrationNumber: 'KMC-47812',
    isVerified: true,
    rating: 4.85,
    reviewCount: 215,
    about: 'Expert in chronic sinusitis, tonsillitis, vertigo/inner ear balance disorders, tinnitus, and hearing rehabilitation.',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_10',
    name: 'Dr. Shalini Kapoor',
    verifiedQualifications: 'MBBS, MS (Ophthalmology), FICO (UK)',
    specialty: 'Ophthalmologist — Eye Specialist',
    hospitalOrClinic: 'Centre for Sight, Safdarjung Enclave',
    city: 'New Delhi',
    consultationFee: 800,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
    workingHours: { start: '09:30', end: '16:30' },
    slotDurationMinutes: 20,
    experienceYears: 13,
    languagesSpoken: ['English', 'Hindi'],
    registrationNumber: 'DMC-39140',
    isVerified: true,
    rating: 4.93,
    reviewCount: 370,
    about: 'Specialized eye surgeon in refractive corrections, cataract micro-incision, diabetic retinopathy screening, and glaucoma management.',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_11',
    name: 'Dr. Alok Nath Mukherjee',
    verifiedQualifications: 'MBBS, MD (Psychiatry) - CIP Ranchi',
    specialty: 'Psychiatrist — Mental Health Specialist',
    hospitalOrClinic: 'MindCare Clinic & Fortis Hospital, Mulund',
    city: 'Mumbai',
    consultationFee: 1200,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    workingHours: { start: '12:00', end: '20:00' },
    slotDurationMinutes: 45,
    experienceYears: 16,
    languagesSpoken: ['English', 'Hindi', 'Bengali'],
    registrationNumber: 'MMC-39108',
    isVerified: true,
    rating: 4.94,
    reviewCount: 288,
    about: 'Compassionate mental healthcare provider specializing in clinical depression, anxiety and panic disorders, sleep disturbances, and OCD.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_12',
    name: 'Dr. Vandana Rao',
    verifiedQualifications: 'MBBS, MD (Gen Med), DM (Endocrinology)',
    specialty: 'Endocrinologist — Diabetes and Hormone Specialist',
    hospitalOrClinic: 'Yashoda Hospitals, Somajiguda',
    city: 'Hyderabad',
    consultationFee: 1000,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workingHours: { start: '10:00', end: '17:00' },
    slotDurationMinutes: 30,
    experienceYears: 14,
    languagesSpoken: ['English', 'Telugu', 'Hindi'],
    registrationNumber: 'TSMC-49102',
    isVerified: true,
    rating: 4.9,
    reviewCount: 310,
    about: 'Specialist in complex diabetes mellitus management, thyroid disorders (hypo/hyperthyroidism, nodules), pituitary disorders, and metabolic syndrome.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813579-994c6575f0a0?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_13',
    name: 'Dr. Sanjeev Kulkarni',
    verifiedQualifications: 'MBBS, MD, DM (Nephrology), DNB',
    specialty: 'Nephrologist — Kidney Specialist',
    hospitalOrClinic: 'Ruby Hall Clinic, Pune',
    city: 'Pune',
    consultationFee: 1100,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    workingHours: { start: '10:00', end: '16:00' },
    slotDurationMinutes: 30,
    experienceYears: 17,
    languagesSpoken: ['English', 'Marathi', 'Hindi'],
    registrationNumber: 'MMC-31054',
    isVerified: true,
    rating: 4.88,
    reviewCount: 224,
    about: 'Nephrology consultant with extensive background in chronic kidney disease (CKD), hemodialysis protocols, renal hypertension, and kidney stones.',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_14',
    name: 'Dr. Amitav Mitra',
    verifiedQualifications: 'MBBS, MD, DM (Gastroenterology)',
    specialty: 'Gastroenterologist — Digestive System Specialist',
    hospitalOrClinic: 'Manipal Hospital, Old Airport Road',
    city: 'Bengaluru',
    consultationFee: 1150,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    workingHours: { start: '09:30', end: '16:30' },
    slotDurationMinutes: 30,
    experienceYears: 16,
    languagesSpoken: ['English', 'Hindi', 'Bengali'],
    registrationNumber: 'KMC-51920',
    isVerified: true,
    rating: 4.91,
    reviewCount: 275,
    about: 'Digestive disease specialist treating GERD/acid reflux, IBS, fatty liver, peptic ulcer disease, and inflammatory bowel diseases.',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_15',
    name: 'Dr. Kavita Joshi',
    verifiedQualifications: 'MBBS, MD (Pulmonary Medicine), FCCP',
    specialty: 'Pulmonologist — Lung and Respiratory Specialist',
    hospitalOrClinic: 'Lilavati Hospital & Research Centre, Bandra',
    city: 'Mumbai',
    consultationFee: 1050,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
    workingHours: { start: '10:30', end: '17:30' },
    slotDurationMinutes: 30,
    experienceYears: 15,
    languagesSpoken: ['English', 'Hindi', 'Gujarati'],
    registrationNumber: 'MMC-48192',
    isVerified: true,
    rating: 4.89,
    reviewCount: 302,
    about: 'Chest physician dealing with adult asthma, COPD, chronic post-viral coughing, interstitial lung disease, and sleep apnea.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813590-b8d5a1562b7e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_16',
    name: 'Dr. Ramanathan Sundaram',
    verifiedQualifications: 'MBBS, MD (Radiotherapy), DM (Medical Oncology)',
    specialty: 'Oncologist — Cancer Specialist',
    hospitalOrClinic: 'Tata Memorial Hospital Affiliate / HCG Cancer Centre',
    city: 'Bengaluru',
    consultationFee: 1400,
    consultationModes: ['online', 'in-person'],
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri'],
    workingHours: { start: '11:00', end: '16:00' },
    slotDurationMinutes: 45,
    experienceYears: 21,
    languagesSpoken: ['English', 'Tamil', 'Hindi'],
    registrationNumber: 'KMC-34901',
    isVerified: true,
    rating: 4.97,
    reviewCount: 380,
    about: 'Senior medical oncologist with 21+ years directing targeted cancer therapies, chemotherapy counseling, and personalized oncology care.',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc_17',
    name: 'Dr. Preeti Agarwal',
    verifiedQualifications: 'BDS, MDS (Conservative Dentistry & Endodontics)',
    specialty: 'Dentist — Dental Specialist',
    hospitalOrClinic: 'Clove Dental & Smile Hospital, Connaught Place',
    city: 'New Delhi',
    consultationFee: 500,
    consultationModes: ['in-person', 'online'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    workingHours: { start: '10:00', end: '19:00' },
    slotDurationMinutes: 30,
    experienceYears: 10,
    languagesSpoken: ['English', 'Hindi'],
    registrationNumber: 'DDC-A-1204',
    isVerified: true,
    rating: 4.86,
    reviewCount: 245,
    about: 'Gentle dental surgeon specializing in root canal treatments, painless tooth restorations, gum health, and dental hygiene.',
    avatarUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&q=80',
  },
];

// Seed Appointments with collision tracking
const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_101',
    patientId: 'user_patient_1',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98765 43210',
    doctorId: 'doc_2',
    doctorName: 'Dr. Ananya Sharma',
    doctorSpecialty: 'Cardiologist — Heart Specialist',
    doctorHospital: 'Fortis Escorts Heart Institute, Okhla',
    date: '2026-10-27',
    timeSlot: '11:00 AM',
    mode: 'online',
    fee: 1200,
    status: 'confirmed',
    symptoms: 'Mild palpitations after moderate exercise, routine BP review.',
    videoRoomId: 'room_cardio_101',
    createdAt: '2026-10-25T14:30:00Z',
    clinicalNotes: 'Previous baseline ECG normal. Advised ambulatory BP monitoring and 2D Echo review.',
    prescription: {
      id: 'rx_101',
      appointmentId: 'apt_101',
      diagnosis: 'Borderline Essential Hypertension with Stress-Induced Palpitations',
      medicines: [
        {
          name: 'Telmisartan 40mg',
          dosage: '1 tablet',
          frequency: 'Once daily after breakfast',
          durationDays: 30,
        },
        {
          name: 'CoQ10 100mg Capsule',
          dosage: '1 capsule',
          frequency: 'Once daily after lunch',
          durationDays: 30,
        },
      ],
      advice: 'Reduce dietary sodium (< 5g/day). Regular 30 min brisk walk. Maintain blood pressure log twice weekly.',
      followUpDays: 30,
      issuedAt: '2026-10-25T15:00:00Z',
      doctorSignature: 'Dr. Ananya Sharma (MCI-38910-C)',
    },
  },
  {
    id: 'apt_102',
    patientId: 'user_patient_1',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98765 43210',
    doctorId: 'doc_1',
    doctorName: 'Dr. Rajesh Khanna',
    doctorSpecialty: 'General Physician',
    doctorHospital: 'Max Super Speciality Hospital, Saket',
    date: '2026-10-29',
    timeSlot: '03:30 PM',
    mode: 'in-person',
    fee: 700,
    status: 'confirmed',
    symptoms: 'Follow-up for seasonal allergy and general health checkup.',
    createdAt: '2026-10-24T10:15:00Z',
  },
  {
    id: 'apt_103',
    patientId: 'user_patient_2',
    patientName: 'Sunita Mehra',
    patientPhone: '+91 98222 33445',
    doctorId: 'doc_2',
    doctorName: 'Dr. Ananya Sharma',
    doctorSpecialty: 'Cardiologist — Heart Specialist',
    doctorHospital: 'Fortis Escorts Heart Institute, Okhla',
    date: '2026-10-27',
    timeSlot: '11:30 AM',
    mode: 'online',
    fee: 1200,
    status: 'confirmed',
    symptoms: 'Shortness of breath on climbing two flights of stairs.',
    videoRoomId: 'room_cardio_102',
    createdAt: '2026-10-25T16:00:00Z',
  },
];

// Seed Blood Donors across all 8 ABO/Rh types
const BLOOD_DONORS: BloodDonor[] = [
  {
    id: 'donor_1',
    name: 'Vikram Singh',
    bloodGroup: 'O+',
    city: 'New Delhi',
    area: 'Saket & South Delhi',
    isAvailable: true,
    availabilityNote: 'Ready for emergency whole blood donation',
    preferredContact: 'in-app',
    phoneMasked: '+91 99200 •••••',
    lastDonationDate: '2026-05-12',
    donationCount: 6,
    verifiedByBloodBank: true,
    registeredAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'donor_2',
    name: 'Amanpreet Kaur',
    bloodGroup: 'B+',
    city: 'New Delhi',
    area: 'Janakpuri & West Delhi',
    isAvailable: true,
    availabilityNote: 'Available on weekdays after 5 PM and weekends',
    preferredContact: 'whatsapp',
    phoneMasked: '+91 98101 •••••',
    lastDonationDate: '2026-06-20',
    donationCount: 4,
    verifiedByBloodBank: true,
    registeredAt: '2026-02-10T11:30:00Z',
  },
  {
    id: 'donor_3',
    name: 'Rohan Deshmukh',
    bloodGroup: 'O-',
    city: 'Mumbai',
    area: 'Andheri West & Bandra',
    isAvailable: true,
    availabilityNote: 'Universal donor (O- Negative) - emergency on-call',
    preferredContact: 'call',
    phoneMasked: '+91 97690 •••••',
    lastDonationDate: '2026-04-18',
    donationCount: 9,
    verifiedByBloodBank: true,
    registeredAt: '2025-11-04T14:20:00Z',
  },
  {
    id: 'donor_4',
    name: 'Deepika Raman',
    bloodGroup: 'A+',
    city: 'Bengaluru',
    area: 'Koramangala & Indiranagar',
    isAvailable: true,
    availabilityNote: 'Can donate platelets or whole blood at accredited blood banks',
    preferredContact: 'in-app',
    phoneMasked: '+91 98450 •••••',
    lastDonationDate: '2026-07-01',
    donationCount: 3,
    verifiedByBloodBank: true,
    registeredAt: '2026-03-22T08:45:00Z',
  },
  {
    id: 'donor_5',
    name: 'Karthik Subbaraman',
    bloodGroup: 'AB+',
    city: 'Chennai',
    area: 'Adyar & T. Nagar',
    isAvailable: true,
    availabilityNote: 'Plasma and blood donor ready on 2-hour notice',
    preferredContact: 'whatsapp',
    phoneMasked: '+91 94440 •••••',
    lastDonationDate: '2026-06-15',
    donationCount: 5,
    verifiedByBloodBank: true,
    registeredAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'donor_6',
    name: 'Farhan Zaidi',
    bloodGroup: 'A-',
    city: 'Hyderabad',
    area: 'Banjara Hills & Jubilee Hills',
    isAvailable: true,
    availabilityNote: 'Rare group A Negative voluntary donor',
    preferredContact: 'in-app',
    phoneMasked: '+91 98850 •••••',
    lastDonationDate: '2026-05-30',
    donationCount: 7,
    verifiedByBloodBank: true,
    registeredAt: '2026-01-30T16:15:00Z',
  },
  {
    id: 'donor_7',
    name: 'Shreya Chatterjee',
    bloodGroup: 'B-',
    city: 'Kolkata',
    area: 'Salt Lake & New Town',
    isAvailable: true,
    availabilityNote: 'B Negative donor available on weekends',
    preferredContact: 'whatsapp',
    phoneMasked: '+91 98300 •••••',
    lastDonationDate: '2026-06-10',
    donationCount: 4,
    verifiedByBloodBank: true,
    registeredAt: '2026-02-05T13:00:00Z',
  },
  {
    id: 'donor_8',
    name: 'Nikhil Trivedi',
    bloodGroup: 'AB-',
    city: 'Pune',
    area: 'Kothrud & Shivajinagar',
    isAvailable: true,
    availabilityNote: 'Rare AB- group voluntary donor ready for crossmatch',
    preferredContact: 'call',
    phoneMasked: '+91 98220 •••••',
    lastDonationDate: '2026-04-05',
    donationCount: 8,
    verifiedByBloodBank: true,
    registeredAt: '2025-10-12T09:30:00Z',
  },
];

// Seed Blood Requests
const BLOOD_REQUESTS: BloodRequest[] = [
  {
    id: 'req_101',
    patientName: 'Suresh Chandra (Cardiac Surgery)',
    bloodGroup: 'O+',
    unitsNeeded: 3,
    hospitalName: 'AIIMS Blood Bank & Trauma Centre',
    city: 'New Delhi',
    urgency: 'emergency',
    requiredDate: '2026-10-27',
    requesterName: 'Pooja Chandra (Daughter)',
    contactPhoneMasked: '+91 98110 •••••',
    fullContactPhone: '+91 98110 55443',
    status: 'pending',
    notes: 'Urgent requirement for bypass surgery. Blood collection and testing at AIIMS Blood Bank only.',
    createdAt: '2026-10-26T06:15:00Z',
    fulfilledUnits: 1,
  },
  {
    id: 'req_102',
    patientName: 'Baby Aarav (Thalassemia Major)',
    bloodGroup: 'B+',
    unitsNeeded: 1,
    hospitalName: 'Kalawati Saran Children Hospital Blood Bank',
    city: 'New Delhi',
    urgency: 'urgent',
    requiredDate: '2026-10-28',
    requesterName: 'Amit Saxena',
    contactPhoneMasked: '+91 98991 •••••',
    fullContactPhone: '+91 98991 22334',
    status: 'contacted',
    notes: 'Monthly regular transfusion. Verified crossmatch required.',
    createdAt: '2026-10-25T11:00:00Z',
    fulfilledUnits: 0,
  },
  {
    id: 'req_103',
    patientName: 'Meenakshi Sundaram',
    bloodGroup: 'A-',
    unitsNeeded: 2,
    hospitalName: 'Apollo Speciality Blood Centre',
    city: 'Chennai',
    urgency: 'routine',
    requiredDate: '2026-10-30',
    requesterName: 'Dr. Venkat (Attending Physician)',
    contactPhoneMasked: '+91 94441 •••••',
    fullContactPhone: '+91 94441 88776',
    status: 'fulfilled',
    notes: 'Elective hip replacement prep. Units arranged via Red Cross.',
    createdAt: '2026-10-22T08:30:00Z',
    fulfilledUnits: 2,
  },
];

// Seed Health Test Catalog
const HEALTH_TESTS: HealthTest[] = [
  {
    id: 'test_1',
    name: 'Complete Blood Count (CBC with ESR)',
    shortCode: 'CBC',
    category: 'Hematology',
    description: 'Comprehensive screening for anemia, blood infections, platelet count, white blood cells, and systemic inflammation.',
    price: 350,
    provider: 'MediCare Diagnostic Labs & Apollo Clinical Care',
    sampleType: 'Blood',
    turnaroundHours: 12,
    fastingRequired: false,
    homeCollectionAvailable: true,
    parametersCount: 24,
    badge: 'Popular',
  },
  {
    id: 'test_2',
    name: 'Blood Glucose (Fasting & PP) + HbA1c Profile',
    shortCode: 'DIAB',
    category: 'Diabetes & Metabolism',
    description: 'Measures fasting plasma glucose, post-meal glucose, and 3-month average blood sugar for diabetes diagnosis and monitoring.',
    price: 600,
    provider: 'MediCare Diagnostics Central',
    sampleType: 'Blood',
    turnaroundHours: 8,
    fastingRequired: true,
    fastingHours: 10,
    homeCollectionAvailable: true,
    parametersCount: 5,
    badge: 'Essential',
  },
  {
    id: 'test_3',
    name: 'Lipid Profile (Cholesterol, HDL, LDL, VLDL, Triglycerides)',
    shortCode: 'LIPID',
    category: 'Cardiac & Lipids',
    description: 'Evaluates cardiovascular risk, good vs bad cholesterol ratios, and triglyceride levels to guide heart health.',
    price: 550,
    provider: 'Fortis Labs Partner',
    sampleType: 'Blood',
    turnaroundHours: 12,
    fastingRequired: true,
    fastingHours: 12,
    homeCollectionAvailable: true,
    parametersCount: 7,
  },
  {
    id: 'test_4',
    name: 'Thyroid Profile Comprehensive (T3, T4, Ultra-sensitive TSH)',
    shortCode: 'THYROID',
    category: 'Endocrinology',
    description: 'Screens for hyperthyroidism, hypothyroidism, fatigue causes, and metabolic gland disorders.',
    price: 500,
    provider: 'MediCare Central Pathology',
    sampleType: 'Blood',
    turnaroundHours: 14,
    fastingRequired: true,
    fastingHours: 8,
    homeCollectionAvailable: true,
    parametersCount: 3,
  },
  {
    id: 'test_5',
    name: 'Kidney Function Test (KFT / RFT with Electrolytes)',
    shortCode: 'KFT',
    category: 'Renal Care',
    description: 'Evaluates Serum Creatinine, Blood Urea Nitrogen (BUN), Uric Acid, GFR estimation, Sodium, Potassium, and Chloride.',
    price: 750,
    provider: 'Max Lab Network',
    sampleType: 'Blood',
    turnaroundHours: 12,
    fastingRequired: false,
    homeCollectionAvailable: true,
    parametersCount: 9,
  },
  {
    id: 'test_6',
    name: 'Liver Function Test (LFT with Enzymes & Bilirubin)',
    shortCode: 'LFT',
    category: 'Hepatic Care',
    description: 'Tests Bilirubin (Total, Direct), SGOT/AST, SGPT/ALT, Alkaline Phosphatase, Total Protein, Albumin, and Globulin.',
    price: 700,
    provider: 'MediCare Diagnostics',
    sampleType: 'Blood',
    turnaroundHours: 12,
    fastingRequired: false,
    homeCollectionAvailable: true,
    parametersCount: 11,
  },
  {
    id: 'test_7',
    name: 'Blood Group & Rh Typing (ABO/Rh D Confirmatory)',
    shortCode: 'BLD_GRP',
    category: 'Blood Banking',
    description: 'Standard serological agglutination testing to certify exact ABO blood group and Rh factor antigen presence.',
    price: 200,
    provider: 'Authorized Blood Bank Diagnostic Centre',
    sampleType: 'Blood',
    turnaroundHours: 4,
    fastingRequired: false,
    homeCollectionAvailable: true,
    parametersCount: 2,
  },
  {
    id: 'test_8',
    name: 'Blood Pressure & Vitals Assessment (In-Clinic)',
    shortCode: 'VITALS',
    category: 'General Vitals',
    description: 'Professional multi-cuff blood pressure reading, SpO2 pulse oximetry, respiratory rate, resting pulse rate, and BMI assessment.',
    price: 150,
    provider: 'MediCare Community Clinic Saket',
    sampleType: 'Vitals',
    turnaroundHours: 1,
    fastingRequired: false,
    homeCollectionAvailable: false,
    parametersCount: 6,
  },
  {
    id: 'test_9',
    name: 'Master Health Checkup Package (68 Parameters)',
    shortCode: 'MASTER_68',
    category: 'Full Body Wellness',
    description: 'Includes CBC, HbA1c, Lipid Profile, KFT, LFT, Thyroid, Urine Routine, Vitamin D, and Vitamin B12 with Doctor Consultation.',
    price: 2499,
    provider: 'MediCare Central Diagnostics',
    sampleType: 'Blood',
    turnaroundHours: 24,
    fastingRequired: true,
    fastingHours: 12,
    homeCollectionAvailable: true,
    parametersCount: 68,
    badge: 'Best Value',
  },
];

// Seed Test Bookings
const TEST_BOOKINGS: HealthTestBooking[] = [
  {
    id: 'bk_201',
    testId: 'test_2',
    testName: 'Blood Glucose (Fasting & PP) + HbA1c Profile',
    patientId: 'user_patient_1',
    patientName: 'Rahul Sharma',
    date: '2026-10-28',
    timeSlot: '07:30 AM',
    collectionType: 'home',
    address: 'B-42, Gulmohar Enclave, South Delhi, New Delhi 110049',
    price: 600,
    status: 'scheduled',
    provider: 'MediCare Diagnostics Central',
    bookedAt: '2026-10-25T17:00:00Z',
  },
  {
    id: 'bk_202',
    testId: 'test_1',
    testName: 'Complete Blood Count (CBC with ESR)',
    patientId: 'user_patient_1',
    patientName: 'Rahul Sharma',
    date: '2026-10-20',
    timeSlot: '09:00 AM',
    collectionType: 'lab',
    price: 350,
    status: 'completed',
    provider: 'MediCare Diagnostic Labs & Apollo Clinical Care',
    bookedAt: '2026-10-19T11:20:00Z',
    resultReportId: 'rep_301',
  },
];

// Seed Medical Reports
const MEDICAL_REPORTS: MedicalReport[] = [
  {
    id: 'rep_301',
    patientId: 'user_patient_1',
    patientName: 'Rahul Sharma',
    title: 'Comprehensive Lipid & Glycemic Health Panel',
    date: '2026-10-18',
    testType: 'Biochemistry & Lipid Profile',
    laboratoryName: 'MediCare Central Diagnostic Labs (NABL Accredited)',
    fileType: 'digital',
    sharedWithDoctorIds: ['doc_1', 'doc_2'],
    biomarkers: [
      { name: 'Fasting Blood Glucose', value: 114, unit: 'mg/dL', referenceRange: '70 - 99', status: 'high' },
      { name: 'HbA1c (Glycated Hemoglobin)', value: 6.2, unit: '%', referenceRange: '< 5.7', status: 'high' },
      { name: 'Total Cholesterol', value: 218, unit: 'mg/dL', referenceRange: '< 200', status: 'high' },
      { name: 'HDL Cholesterol (Good)', value: 44, unit: 'mg/dL', referenceRange: '> 40', status: 'normal' },
      { name: 'LDL Cholesterol (Bad)', value: 138, unit: 'mg/dL', referenceRange: '< 100', status: 'high' },
      { name: 'Triglycerides', value: 172, unit: 'mg/dL', referenceRange: '< 150', status: 'high' },
      { name: 'Serum Creatinine', value: 0.95, unit: 'mg/dL', referenceRange: '0.7 - 1.2', status: 'normal' },
      { name: 'Hemoglobin', value: 14.6, unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'normal' },
    ],
    aiSummaryEnglish: 'The report indicates pre-diabetes (fasting glucose 114 mg/dL and HbA1c 6.2%) alongside borderline elevated LDL cholesterol and triglycerides. Kidney function and hemoglobin remain healthy. Early lifestyle changes including aerobic exercise and reduced refined carbohydrates can prevent progression.',
    aiSummaryHindi: 'रिपोर्ट में प्रीडायबिटीज के लक्षण दिखते हैं (फास्टिंग ग्लूकोज 114 mg/dL और HbA1c 6.2%) और साथ ही एलडीएल कोलेस्ट्रॉल थोड़ा बढ़ा हुआ है। गुर्दे की कार्यप्रणाली (Creatinine) और हीमोग्लोबिन बिल्कुल सामान्य हैं। नियमित व्यायाम और खान-पान में सुधार से इसे समय रहते नियंत्रित किया जा सकता है।',
    keyFindings: [
      'Pre-diabetic glycemic range (HbA1c 6.2%)',
      'Mild dyslipidemia with elevated LDL (138 mg/dL)',
      'Normal renal filtration (Creatinine 0.95 mg/dL)',
    ],
    recommendedSpecialty: 'Endocrinologist — Diabetes and Hormone Specialist',
    notes: 'Sample report verified by Pathologist Dr. S. N. Roy, MD (Path).',
  },
  {
    id: 'rep_302',
    patientId: 'user_patient_1',
    patientName: 'Rahul Sharma',
    title: 'Resting Electrocardiogram (ECG) Report',
    date: '2026-09-15',
    testType: 'Cardiac Diagnostics',
    laboratoryName: 'Fortis Escorts Heart Diagnostic Centre',
    fileType: 'digital',
    sharedWithDoctorIds: ['doc_2'],
    biomarkers: [
      { name: 'Heart Rate', value: 76, unit: 'bpm', referenceRange: '60 - 100', status: 'normal' },
      { name: 'PR Interval', value: 164, unit: 'ms', referenceRange: '120 - 200', status: 'normal' },
      { name: 'QRS Duration', value: 88, unit: 'ms', referenceRange: '80 - 120', status: 'normal' },
      { name: 'QTc Interval', value: 412, unit: 'ms', referenceRange: '< 440', status: 'normal' },
    ],
    aiSummaryEnglish: 'Normal sinus rhythm with normal axis and intervals. No acute ST-T changes or signs of ischemia detected at rest.',
    aiSummaryHindi: 'ईसीजी रिपोर्ट सामान्य साइनस रिदम दर्शाती है। आराम की स्थिति में दिल की धड़कन और तरंगें सामान्य हैं, कोई तीव्र रुकावट नहीं है।',
    keyFindings: ['Normal Sinus Rhythm at 76 bpm', 'No ischemic ST elevation/depression'],
    recommendedSpecialty: 'Cardiologist — Heart Specialist',
  },
];

// Seed Audit Logs
const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    action: 'DOCTOR_CREDENTIAL_VERIFIED',
    performedBy: 'Chief Admin (Medical Oversight)',
    role: 'admin',
    target: 'Dr. Ananya Sharma (MCI-38910-C)',
    timestamp: '2026-10-24T09:00:00Z',
    details: 'Verified against National Medical Commission portal records.',
  },
  {
    id: 'log_2',
    action: 'BLOOD_REQUEST_SAFETY_SCREENED',
    performedBy: 'MediCare Compliance AI & Staff',
    role: 'hospital_staff',
    target: 'Blood Request #req_101 (AIIMS O+)',
    timestamp: '2026-10-26T06:20:00Z',
    details: 'Verified voluntary non-commercial request routed via AIIMS Blood Bank.',
  },
  {
    id: 'log_3',
    action: 'REPORT_CONSENT_GRANTED',
    performedBy: 'Rahul Sharma',
    role: 'patient',
    target: 'Dr. Ananya Sharma',
    timestamp: '2026-10-25T14:35:00Z',
    details: 'Granted read access to Lipid & Glycemic Panel #rep_301 for upcoming consultation.',
  },
];

// ==========================================
// API ROUTES
// ==========================================

// Authentication & Profile mock/session
app.get('/api/auth/current-user', (req: Request, res: Response) => {
  const role = (req.query.role as string) || 'patient';
  const user = USERS.find((u) => u.role === role) || USERS[0];
  res.json({ success: true, user });
});

app.get('/api/auth/roles', (_req: Request, res: Response) => {
  res.json({ success: true, users: USERS });
});

// Doctor Directory
app.get('/api/doctors', (req: Request, res: Response) => {
  const { specialty, city, mode, search } = req.query;
  let results = [...DOCTORS];

  if (specialty && specialty !== 'all') {
    results = results.filter((d) => d.specialty.toLowerCase().includes((specialty as string).toLowerCase()));
  }
  if (city && city !== 'all') {
    results = results.filter((d) => d.city.toLowerCase() === (city as string).toLowerCase());
  }
  if (mode && mode !== 'all') {
    results = results.filter((d) => d.consultationModes.includes(mode as 'online' | 'in-person'));
  }
  if (search) {
    const s = (search as string).toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(s) ||
        d.specialty.toLowerCase().includes(s) ||
        d.hospitalOrClinic.toLowerCase().includes(s) ||
        d.city.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, doctors: results, total: results.length });
});

app.get('/api/doctors/:id', (req: Request, res: Response) => {
  const doctor = DOCTORS.find((d) => d.id === req.params.id);
  if (!doctor) {
    res.status(404).json({ success: false, error: 'Doctor not found' });
    return;
  }

  const requestedDate = (req.query.date as string) || new Date().toISOString().split('T')[0];
  
  // Generate candidate time slots for the doctor
  const candidateSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  // Find already booked slots on this date
  const bookedSlots = APPOINTMENTS
    .filter((a) => a.doctorId === doctor.id && a.date === requestedDate && a.status === 'confirmed')
    .map((a) => a.timeSlot);

  const slotsWithAvailability = candidateSlots.map((slot) => ({
    time: slot,
    isAvailable: !bookedSlots.includes(slot),
  }));

  res.json({
    success: true,
    doctor,
    date: requestedDate,
    slots: slotsWithAvailability,
  });
});

// Update Doctor Availability / Settings (Doctor dashboard)
app.post('/api/doctors/:id/availability', (req: Request, res: Response) => {
  const doctor = DOCTORS.find((d) => d.id === req.params.id);
  if (!doctor) {
    res.status(404).json({ success: false, error: 'Doctor not found' });
    return;
  }

  const { availableDays, workingHours, slotDurationMinutes, consultationFee } = req.body;
  if (availableDays) doctor.availableDays = availableDays;
  if (workingHours) doctor.workingHours = workingHours;
  if (slotDurationMinutes) doctor.slotDurationMinutes = slotDurationMinutes;
  if (consultationFee) doctor.consultationFee = Number(consultationFee);

  AUDIT_LOGS.unshift({
    id: `log_${Date.now()}`,
    action: 'DOCTOR_SCHEDULE_UPDATED',
    performedBy: doctor.name,
    role: 'doctor',
    target: doctor.name,
    timestamp: new Date().toISOString(),
    details: `Updated available days to ${doctor.availableDays.join(', ')} and fee to ₹${doctor.consultationFee}.`,
  });

  res.json({ success: true, doctor });
});

// Admin verify doctor
app.post('/api/doctors/:id/verify', (req: Request, res: Response) => {
  const doctor = DOCTORS.find((d) => d.id === req.params.id);
  if (!doctor) {
    res.status(404).json({ success: false, error: 'Doctor not found' });
    return;
  }
  doctor.isVerified = true;

  AUDIT_LOGS.unshift({
    id: `log_${Date.now()}`,
    action: 'DOCTOR_CREDENTIAL_VERIFIED',
    performedBy: 'Chief Administrator',
    role: 'admin',
    target: `${doctor.name} (${doctor.registrationNumber})`,
    timestamp: new Date().toISOString(),
    details: 'Verified credentials against National Registry.',
  });

  res.json({ success: true, doctor });
});

// Appointment Booking with ATOMIC COLLISION CHECK
app.get('/api/appointments', (req: Request, res: Response) => {
  const { patientId, doctorId } = req.query;
  let results = [...APPOINTMENTS];
  if (patientId) {
    results = results.filter((a) => a.patientId === patientId);
  }
  if (doctorId) {
    results = results.filter((a) => a.doctorId === doctorId);
  }
  res.json({ success: true, appointments: results });
});

app.post('/api/appointments/book', (req: Request, res: Response) => {
  const { patientId, patientName, patientPhone, doctorId, date, timeSlot, mode, symptoms } = req.body;

  if (!doctorId || !date || !timeSlot || !patientName) {
    res.status(400).json({ success: false, error: 'Missing required booking details.' });
    return;
  }

  const doctor = DOCTORS.find((d) => d.id === doctorId);
  if (!doctor) {
    res.status(404).json({ success: false, error: 'Doctor not found.' });
    return;
  }

  // CRITICAL: Slot collision prevention
  const collision = APPOINTMENTS.find(
    (a) => a.doctorId === doctorId && a.date === date && a.timeSlot === timeSlot && a.status === 'confirmed'
  );

  if (collision) {
    res.status(409).json({
      success: false,
      error: `The ${timeSlot} slot on ${date} has just been reserved by another patient. Please choose another time.`,
    });
    return;
  }

  const newAppointment: Appointment = {
    id: `apt_${Date.now()}`,
    patientId: patientId || 'user_patient_1',
    patientName,
    patientPhone: patientPhone || '+91 98765 43210',
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    doctorHospital: doctor.hospitalOrClinic,
    date,
    timeSlot,
    mode: mode || 'online',
    fee: doctor.consultationFee,
    status: 'confirmed',
    symptoms: symptoms || 'General consultation request',
    videoRoomId: mode === 'online' ? `room_${Date.now()}` : undefined,
    createdAt: new Date().toISOString(),
  };

  APPOINTMENTS.unshift(newAppointment);

  AUDIT_LOGS.unshift({
    id: `log_${Date.now()}`,
    action: 'APPOINTMENT_BOOKED',
    performedBy: patientName,
    role: 'patient',
    target: `${doctor.name} - ${date} at ${timeSlot}`,
    timestamp: new Date().toISOString(),
    details: `Booking confirmed with appointment ID #${newAppointment.id}.`,
  });

  res.status(201).json({ success: true, appointment: newAppointment });
});

// Reschedule Appointment
app.post('/api/appointments/:id/reschedule', (req: Request, res: Response) => {
  const appointment = APPOINTMENTS.find((a) => a.id === req.params.id);
  if (!appointment) {
    res.status(404).json({ success: false, error: 'Appointment not found.' });
    return;
  }

  const { date, timeSlot } = req.body;
  if (!date || !timeSlot) {
    res.status(400).json({ success: false, error: 'Date and time slot required.' });
    return;
  }

  // Check collision with another appointment
  const collision = APPOINTMENTS.find(
    (a) =>
      a.id !== appointment.id &&
      a.doctorId === appointment.doctorId &&
      a.date === date &&
      a.timeSlot === timeSlot &&
      a.status === 'confirmed'
  );

  if (collision) {
    res.status(409).json({
      success: false,
      error: `Conflict: Slot ${timeSlot} on ${date} is already booked. Please choose another slot.`,
    });
    return;
  }

  appointment.date = date;
  appointment.timeSlot = timeSlot;
  appointment.status = 'rescheduled';

  res.json({ success: true, appointment });
});

// Cancel Appointment
app.post('/api/appointments/:id/cancel', (req: Request, res: Response) => {
  const appointment = APPOINTMENTS.find((a) => a.id === req.params.id);
  if (!appointment) {
    res.status(404).json({ success: false, error: 'Appointment not found.' });
    return;
  }
  appointment.status = 'cancelled';
  res.json({ success: true, appointment });
});

// Doctor writes clinical notes & prescription
app.post('/api/appointments/:id/prescription', (req: Request, res: Response) => {
  const appointment = APPOINTMENTS.find((a) => a.id === req.params.id);
  if (!appointment) {
    res.status(404).json({ success: false, error: 'Appointment not found.' });
    return;
  }

  const { diagnosis, medicines, advice, followUpDays, clinicalNotes } = req.body;
  appointment.clinicalNotes = clinicalNotes || appointment.clinicalNotes;

  appointment.prescription = {
    id: `rx_${Date.now()}`,
    appointmentId: appointment.id,
    diagnosis: diagnosis || 'General Clinical Evaluation',
    medicines: medicines || [],
    advice: advice || 'Stay well hydrated and adhere strictly to dosage guidelines.',
    followUpDays: followUpDays ? Number(followUpDays) : 14,
    issuedAt: new Date().toISOString(),
    doctorSignature: `${appointment.doctorName}`,
  };

  res.json({ success: true, appointment });
});

// ==========================================
// BLOOD CONNECT MODULE
// ==========================================

app.get('/api/blood/donors', (req: Request, res: Response) => {
  const { bloodGroup, city, availableOnly } = req.query;
  let results = [...BLOOD_DONORS];

  if (bloodGroup && bloodGroup !== 'all') {
    results = results.filter((d) => d.bloodGroup === bloodGroup);
  }
  if (city && city !== 'all') {
    results = results.filter((d) => d.city.toLowerCase() === (city as string).toLowerCase());
  }
  if (availableOnly === 'true') {
    results = results.filter((d) => d.isAvailable);
  }

  res.json({ success: true, donors: results, total: results.length });
});

app.post('/api/blood/donors/register', (req: Request, res: Response) => {
  const { name, bloodGroup, city, area, availabilityNote, preferredContact, phone } = req.body;

  if (!name || !bloodGroup || !city) {
    res.status(400).json({ success: false, error: 'Name, blood group, and city are mandatory.' });
    return;
  }

  // Mask phone number for public safety
  const rawPhone = phone || '+91 98000 00000';
  const phoneMasked = rawPhone.length > 7
    ? `${rawPhone.substring(0, 8)} •••••`
    : '+91 ••••• •••••';

  const newDonor: BloodDonor = {
    id: `donor_${Date.now()}`,
    name,
    bloodGroup: bloodGroup as BloodGroup,
    city,
    area: area || `${city} Central`,
    isAvailable: true,
    availabilityNote: availabilityNote || 'Voluntary donor ready for emergency contact through hospital',
    preferredContact: preferredContact || 'in-app',
    phoneMasked,
    donationCount: 0,
    verifiedByBloodBank: false,
    registeredAt: new Date().toISOString(),
  };

  BLOOD_DONORS.unshift(newDonor);

  AUDIT_LOGS.unshift({
    id: `log_${Date.now()}`,
    action: 'DONOR_REGISTERED',
    performedBy: name,
    role: 'donor',
    target: `${bloodGroup} Donor (${city})`,
    timestamp: new Date().toISOString(),
    details: 'New voluntary donor enrolled in MediCare Blood Connect.',
  });

  res.status(201).json({ success: true, donor: newDonor });
});

app.post('/api/blood/donors/:id/availability', (req: Request, res: Response) => {
  const donor = BLOOD_DONORS.find((d) => d.id === req.params.id);
  if (!donor) {
    res.status(404).json({ success: false, error: 'Donor not found.' });
    return;
  }

  donor.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : !donor.isAvailable;
  if (req.body.availabilityNote) {
    donor.availabilityNote = req.body.availabilityNote;
  }

  res.json({ success: true, donor });
});

// Blood Requirements / Requests
app.get('/api/blood/requests', (req: Request, res: Response) => {
  const { bloodGroup, city, status } = req.query;
  let results = [...BLOOD_REQUESTS];

  if (bloodGroup && bloodGroup !== 'all') {
    results = results.filter((r) => r.bloodGroup === bloodGroup);
  }
  if (city && city !== 'all') {
    results = results.filter((r) => r.city.toLowerCase() === (city as string).toLowerCase());
  }
  if (status && status !== 'all') {
    results = results.filter((r) => r.status === status);
  }

  res.json({ success: true, requests: results, total: results.length });
});

app.post('/api/blood/requests', (req: Request, res: Response) => {
  const { patientName, bloodGroup, unitsNeeded, hospitalName, city, urgency, requiredDate, requesterName, contactPhone, notes } = req.body;

  if (!patientName || !bloodGroup || !hospitalName || !city) {
    res.status(400).json({ success: false, error: 'Please provide patient name, blood group, hospital, and city.' });
    return;
  }

  const rawPhone = contactPhone || '+91 98110 00000';
  const contactPhoneMasked = `${rawPhone.substring(0, 8)} •••••`;

  const newRequest: BloodRequest = {
    id: `req_${Date.now()}`,
    patientName,
    bloodGroup: bloodGroup as BloodGroup,
    unitsNeeded: Math.max(1, parseInt(unitsNeeded) || 1),
    hospitalName,
    city,
    urgency: urgency || 'urgent',
    requiredDate: requiredDate || new Date().toISOString().split('T')[0],
    requesterName: requesterName || 'Family Member',
    contactPhoneMasked,
    fullContactPhone: rawPhone,
    status: 'pending',
    notes: notes || 'Hospital blood bank verification required. Commercial blood sale strictly forbidden.',
    createdAt: new Date().toISOString(),
    fulfilledUnits: 0,
  };

  BLOOD_REQUESTS.unshift(newRequest);

  AUDIT_LOGS.unshift({
    id: `log_${Date.now()}`,
    action: 'BLOOD_REQUEST_SUBMITTED',
    performedBy: requesterName || patientName,
    role: 'patient',
    target: `${unitsNeeded} Unit(s) of ${bloodGroup} at ${hospitalName}`,
    timestamp: new Date().toISOString(),
    details: `Urgency level: ${urgency.toUpperCase()}. Verified routing through hospital blood bank.`,
  });

  res.status(201).json({ success: true, request: newRequest });
});

app.post('/api/blood/requests/:id/status', (req: Request, res: Response) => {
  const request = BLOOD_REQUESTS.find((r) => r.id === req.params.id);
  if (!request) {
    res.status(404).json({ success: false, error: 'Request not found.' });
    return;
  }

  const { status, fulfilledUnits } = req.body;
  if (status) request.status = status;
  if (fulfilledUnits !== undefined) request.fulfilledUnits = Number(fulfilledUnits);

  res.json({ success: true, request });
});

// Consent-based Donor Connect
app.post('/api/blood/contact-donor', (req: Request, res: Response) => {
  const { donorId, patientName, hospitalName, bloodGroup, message, requesterPhone } = req.body;
  const donor = BLOOD_DONORS.find((d) => d.id === donorId);
  if (!donor) {
    res.status(404).json({ success: false, error: 'Donor not found.' });
    return;
  }

  // Simulated protected contact relay (protects personal phone numbers, routes via secure consent message)
  res.json({
    success: true,
    message: `A secure notification has been dispatched to ${donor.name} with your hospital request for ${bloodGroup} blood at ${hospitalName}. The donor will review and accept via MediCare Blood Connect consent flow.`,
    safetyNotice: 'Remember: All crossmatching, screening, and transfusions MUST take place at a licensed blood bank or authorized hospital. Blood donation is voluntary; any commercial exchange is illegal.',
  });
});

// ==========================================
// HEALTH TEST BOOKING MODULE
// ==========================================

app.get('/api/tests', (_req: Request, res: Response) => {
  res.json({ success: true, tests: HEALTH_TESTS });
});

app.get('/api/tests/bookings', (req: Request, res: Response) => {
  const { patientId } = req.query;
  let results = [...TEST_BOOKINGS];
  if (patientId) {
    results = results.filter((b) => b.patientId === patientId);
  }
  res.json({ success: true, bookings: results });
});

app.post('/api/tests/book', (req: Request, res: Response) => {
  const { testId, patientId, patientName, date, timeSlot, collectionType, address } = req.body;

  const test = HEALTH_TESTS.find((t) => t.id === testId);
  if (!test) {
    res.status(404).json({ success: false, error: 'Test not found.' });
    return;
  }

  const booking: HealthTestBooking = {
    id: `bk_${Date.now()}`,
    testId: test.id,
    testName: test.name,
    patientId: patientId || 'user_patient_1',
    patientName: patientName || 'Rahul Sharma',
    date: date || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || '08:00 AM',
    collectionType: collectionType || 'home',
    address: collectionType === 'home' ? (address || 'Current Patient Address') : undefined,
    price: test.price,
    status: 'scheduled',
    provider: test.provider,
    bookedAt: new Date().toISOString(),
  };

  TEST_BOOKINGS.unshift(booking);

  AUDIT_LOGS.unshift({
    id: `log_${Date.now()}`,
    action: 'TEST_BOOKED',
    performedBy: booking.patientName,
    role: 'patient',
    target: `${test.name} (${collectionType === 'home' ? 'Home Sample Collection' : 'Lab Visit'})`,
    timestamp: new Date().toISOString(),
    details: `Booking #${booking.id} scheduled for ${booking.date} at ${booking.timeSlot}.`,
  });

  res.status(201).json({ success: true, booking });
});

app.post('/api/tests/bookings/:id/status', (req: Request, res: Response) => {
  const booking = TEST_BOOKINGS.find((b) => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ success: false, error: 'Booking not found.' });
    return;
  }
  booking.status = req.body.status;
  res.json({ success: true, booking });
});

// ==========================================
// MEDICAL REPORTS MODULE
// ==========================================

app.get('/api/reports', (req: Request, res: Response) => {
  const { patientId } = req.query;
  let results = [...MEDICAL_REPORTS];
  if (patientId) {
    results = results.filter((r) => r.patientId === patientId);
  }
  res.json({ success: true, reports: results });
});

app.post('/api/reports/upload', (req: Request, res: Response) => {
  const { title, testType, laboratoryName, biomarkers, patientId, patientName, notes } = req.body;

  const newReport: MedicalReport = {
    id: `rep_${Date.now()}`,
    patientId: patientId || 'user_patient_1',
    patientName: patientName || 'Rahul Sharma',
    title: title || 'Patient Uploaded Diagnostic Record',
    date: new Date().toISOString().split('T')[0],
    testType: testType || 'Routine Lab Diagnostic',
    laboratoryName: laboratoryName || 'Registered Diagnostic Center',
    fileType: 'digital',
    sharedWithDoctorIds: [],
    biomarkers: biomarkers || [],
    notes,
  };

  MEDICAL_REPORTS.unshift(newReport);
  res.status(201).json({ success: true, report: newReport });
});

app.post('/api/reports/:id/share', (req: Request, res: Response) => {
  const report = MEDICAL_REPORTS.find((r) => r.id === req.params.id);
  if (!report) {
    res.status(404).json({ success: false, error: 'Report not found.' });
    return;
  }

  const { doctorId } = req.body;
  if (!doctorId) {
    res.status(400).json({ success: false, error: 'Doctor ID required.' });
    return;
  }

  if (report.sharedWithDoctorIds.includes(doctorId)) {
    report.sharedWithDoctorIds = report.sharedWithDoctorIds.filter((id) => id !== doctorId);
  } else {
    report.sharedWithDoctorIds.push(doctorId);
  }

  const doctor = DOCTORS.find((d) => d.id === doctorId);
  AUDIT_LOGS.unshift({
    id: `log_${Date.now()}`,
    action: report.sharedWithDoctorIds.includes(doctorId) ? 'REPORT_CONSENT_GRANTED' : 'REPORT_CONSENT_REVOKED',
    performedBy: report.patientName,
    role: 'patient',
    target: doctor ? doctor.name : doctorId,
    timestamp: new Date().toISOString(),
    details: `Access permission updated for report #${report.id}.`,
  });

  res.json({ success: true, report });
});

// ==========================================
// AI MODULES: GEMINI POWERED WITH BILINGUAL ENGLISH/HINDI
// ==========================================

// Module 1: AI Disease Risk Assessment
app.post('/api/ai/symptom-check', async (req: Request, res: Response) => {
  const { symptoms, duration, severity, ageGroup, medicalHistory, vitals } = req.body;

  if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Symptoms description is required.' });
    return;
  }

  // Clinical prompt for Gemini 3.8 Flash
  const prompt = `You are an AI Clinical Triage & Health Risk Assessment Assistant for MediCare AI.
Analyze the user's symptoms and health details:
- Reported Symptoms: "${symptoms}"
- Duration: "${duration || 'Not specified'}"
- Severity: "${severity || 'Moderate'}"
- Age Group: "${ageGroup || 'Adult (18-60)'}"
- Known Medical History: "${medicalHistory || 'None noted'}"
- Available Vitals: "${vitals || 'Normal baseline'}"

CRITICAL CLINICAL & SAFETY RULES:
1. EMERGENCY DETECTION: Check for red flag symptoms (e.g. crushing chest pain, radiating arm/jaw pain, acute shortness of breath, sudden facial drooping/speech slurring/FAST signs, severe allergic anaphylaxis, coughing blood, severe sudden head trauma). If present, immediately set isEmergency to true and riskLevel to 'Emergency' or 'High'.
2. PRELIMINARY ONLY: Provide possible health conditions with probabilistic reasoning. Clearly state this is NOT a medical diagnosis.
3. BILINGUAL EXPLANATION: Provide clear explanations, emergency alerts, and next steps in BOTH simple English and fluent Hindi (Devanagari script).
4. RECOMMENDED SPECIALTY: Recommend exactly ONE specialty from this exact list:
   - "General Physician"
   - "Cardiologist — Heart Specialist"
   - "Neurologist — Brain and Nerve Specialist"
   - "Neurosurgeon — Brain and Spine Surgery Specialist"
   - "Pediatrician — Children's Doctor"
   - "Gynecologist — Women's Health Specialist"
   - "Orthopedic — Bone and Joint Specialist"
   - "Dermatologist — Skin Specialist"
   - "ENT Specialist — Ear, Nose and Throat"
   - "Ophthalmologist — Eye Specialist"
   - "Psychiatrist — Mental Health Specialist"
   - "Endocrinologist — Diabetes and Hormone Specialist"
   - "Nephrologist — Kidney Specialist"
   - "Gastroenterologist — Digestive System Specialist"
   - "Pulmonologist — Lung and Respiratory Specialist"
   - "Oncologist — Cancer Specialist"
   - "Dentist — Dental Specialist"

Return valid JSON conforming to the schema.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an intelligent clinical triage and disease risk assessment engine. You never give definitive diagnoses or direct medication dosages. Always prioritize patient safety and emergency alerts.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: {
                type: Type.STRING,
                description: 'Low, Moderate, High, or Emergency',
              },
              isEmergency: {
                type: Type.BOOLEAN,
                description: 'True if symptoms suggest immediate life threat or emergency care needed',
              },
              emergencyWarning: {
                type: Type.STRING,
                description: 'Urgent emergency alert in English if isEmergency is true',
              },
              emergencyWarningHindi: {
                type: Type.STRING,
                description: 'Urgent emergency alert in Hindi if isEmergency is true',
              },
              possibleConditions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    condition: { type: Type.STRING },
                    conditionHindi: { type: Type.STRING },
                    probability: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                  },
                  required: ['condition', 'conditionHindi', 'probability', 'reasoning'],
                },
              },
              recommendedSpecialty: {
                type: Type.STRING,
                description: 'Specialty chosen from the allowed list',
              },
              nextStepsEnglish: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              nextStepsHindi: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              lifestylePrecautions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              clinicalDisclaimer: {
                type: Type.STRING,
                description: 'Disclaimer emphasizing this is AI screening and not a substitute for a qualified doctor',
              },
            },
            required: [
              'riskLevel',
              'isEmergency',
              'possibleConditions',
              'recommendedSpecialty',
              'nextStepsEnglish',
              'nextStepsHindi',
              'lifestylePrecautions',
              'clinicalDisclaimer',
            ],
          },
        },
      });

      const parsed: DiseaseAssessmentResult = JSON.parse(response.text || '{}');
      res.json({ success: true, assessment: parsed });
      return;
    }
  } catch (err: unknown) {
    console.error('Gemini API Error in symptom-check:', err);
  }

  // Safe fallback if API key is absent or network fails
  const isEmergencySymptoms =
    /chest\s*pain|heart\s*attack|stroke|paralysis|cannot\s*breathe|unconscious|severe\s*bleeding/i.test(symptoms);

  const fallbackResult: DiseaseAssessmentResult = {
    riskLevel: isEmergencySymptoms ? 'Emergency' : 'Moderate',
    isEmergency: isEmergencySymptoms,
    emergencyWarning: isEmergencySymptoms
      ? 'CRITICAL ALERT: Your reported symptoms indicate a potential medical emergency. Please call 112 / 108 immediately or visit the nearest emergency room.'
      : undefined,
    emergencyWarningHindi: isEmergencySymptoms
      ? 'आपातकालीन चेतावनी: आपके लक्षण गंभीर चिकित्सा आपात स्थिति का संकेत दे सकते हैं। कृपया तुरंत 112 / 108 पर कॉल करें या नजदीकी आपातकालीन कक्ष (ER) जाएं।'
      : undefined,
    possibleConditions: isEmergencySymptoms
      ? [
          {
            condition: 'Acute Coronary Syndrome or Cardiopulmonary Event',
            conditionHindi: 'हृदय या फेफड़े से संबंधित तीव्र आपात स्थिति',
            probability: 'Likely',
            reasoning: 'Severe chest discomfort or acute shortness of breath requires urgent evaluation to rule out myocardial infarction.',
          },
        ]
      : [
          {
            condition: 'Upper Respiratory Tract Infection / Viral Prodrome',
            conditionHindi: 'ऊपरी श्वसन तंत्र का संक्रमण या मौसमी वायरल',
            probability: 'Likely',
            reasoning: 'Symptom constellation of malaise, throat irritation, or mild fever commonly aligns with viral infections.',
          },
          {
            condition: 'Fatigue-Associated Tension or Stress',
            conditionHindi: 'तनाव अथवा थकान जनित सिरदर्द',
            probability: 'Possible',
            reasoning: 'Exertion and sleep irregularity can exacerbate headaches and somatic discomfort.',
          },
        ],
    recommendedSpecialty: isEmergencySymptoms
      ? 'Cardiologist — Heart Specialist'
      : 'General Physician',
    nextStepsEnglish: [
      'Schedule a clinical consultation with a qualified doctor for definitive physical examination.',
      'Monitor and log your body temperature and resting blood pressure twice daily.',
      'Stay hydrated with warm fluids and prioritize 7-8 hours of restful sleep.',
      'Seek emergency room care immediately if you experience sudden worsening, shortness of breath, or dizziness.',
    ],
    nextStepsHindi: [
      'उचित शारीरिक जांच और सटीक निदान के लिए योग्य डॉक्टर से परामर्श लें।',
      'दिन में दो बार अपना शारीरिक तापमान और रक्तचाप मापकर नोट करें।',
      'पर्याप्त मात्रा में पानी और गुनगुने तरल पदार्थ पिएं तथा आराम करें।',
      'यदि सांस लेने में कठिनाई या अत्यधिक चक्कर आएं तो तुरंत अस्पताल जाएं।',
    ],
    lifestylePrecautions: [
      'Avoid self-medicating with unprescribed antibiotics or heavy analgesics.',
      'Maintain light, easily digestible home-cooked meals.',
      'Refrain from strenuous workouts until clinically evaluated.',
    ],
    clinicalDisclaimer:
      'NOTICE: This assessment is an automated preliminary screening provided solely for educational and triage guidance. It is NOT a clinical diagnosis or medical treatment plan. Always consult an authorized healthcare professional.',
  };

  res.json({ success: true, assessment: fallbackResult, fallback: true });
});

// Module 6: AI Medical Report Explanation
app.post('/api/ai/analyze-report', async (req: Request, res: Response) => {
  const { reportTitle, biomarkers, rawText } = req.body;

  const prompt = `You are a medical laboratory interpreter for MediCare AI.
Analyze this medical report:
Title: "${reportTitle || 'Patient Lab Report'}"
Parameters/Biomarkers: ${JSON.stringify(biomarkers || [])}
Raw Report Text/Notes: "${rawText || 'None'}"

TASK:
1. Explain the results in simple, calm, accessible language suitable for a patient.
2. Provide a bilingual explanation in English and Hindi (Devanagari).
3. Identify which parameters are in normal range vs abnormal (high/low).
4. Provide practical dietary/lifestyle observations without prescribing medicines.
5. Recommend the most appropriate medical specialty to consult.
6. Emphasize that AI interpretations do not replace the reviewing pathologist or doctor.

Return valid JSON conforming to the schema.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an empathetic, precise medical report explanation assistant. You never prescribe medicines. Always provide bilingual English and Hindi explanations.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              englishSummary: { type: Type.STRING },
              hindiSummary: { type: Type.STRING },
              keyFindings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedSpecialty: { type: Type.STRING },
              precautions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              disclaimer: { type: Type.STRING },
            },
            required: ['englishSummary', 'hindiSummary', 'keyFindings', 'recommendedSpecialty', 'precautions', 'disclaimer'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, analysis: parsed });
      return;
    }
  } catch (err: unknown) {
    console.error('Gemini API Error in analyze-report:', err);
  }

  // Safe fallback
  res.json({
    success: true,
    analysis: {
      englishSummary:
        'Your lab report highlights key metabolic and vital indicators. Certain values like fasting sugar or lipid markers are slightly outside the optimal standard reference range, while your renal filtration and hemoglobin markers remain stable. Bringing this report to a consultation with a specialist will help formulate a tailored lifestyle and care plan.',
      hindiSummary:
        'आपकी लैब रिपोर्ट में मुख्य स्वास्थ्य संकेतकों का विश्लेषण किया गया है। कुछ पैरामीटर जैसे रक्त शर्करा या कोलेस्ट्रॉल सामान्य संदर्भ सीमा से थोड़े ऊपर हैं, जबकि गुर्दे और रक्त के मुख्य घटक सामान्य हैं। किसी योग्य चिकित्सक से परामर्श लेकर आप खान-पान और जीवनशैली में आवश्यक सुधार कर सकते हैं।',
      keyFindings: [
        'Review lipid/glucose profile with your primary physician.',
        'Kidney filtration markers (Creatinine/BUN) are within healthy limits.',
        'No critical acute indicators detected.',
      ],
      recommendedSpecialty: 'General Physician',
      precautions: [
        'Maintain a balanced low-glycemic diet with plenty of leafy vegetables.',
        'Engage in 30 minutes of moderate aerobic walking daily.',
        'Retest fasting blood glucose in 4 to 6 weeks as advised by doctor.',
      ],
      disclaimer:
        'DISCLAIMER: AI report analysis is for educational understanding only. It is not an official medical diagnosis. Please share your physical report with your doctor.',
    },
    fallback: true,
  });
});

// Module 10: AI Health Assistant Chat (Bilingual Hindi/English)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ success: false, error: 'Message is required.' });
    return;
  }

  const prompt = `User Message: "${message}"

Recent conversation context:
${(history || []).slice(-4).map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`).join('\n')}

INSTRUCTIONS FOR MEDICARE AI HEALTH ASSISTANT:
- You are MediCare AI's warm, professional, bilingual (English & Hindi) health guide.
- Greet or respond naturally in the language used by the user, or provide a helpful bilingual response when appropriate.
- Explain medical terms in simple, everyday language.
- Guide patients on how to prepare for tests (e.g. fasting requirements), how to choose doctor specialties (from the 17 hospital specialties), and how blood donation works.
- Clearly differentiate routine symptoms from urgent red-flag symptoms.
- STRICT SAFETY GUARDRAIL: Never prescribe drugs, dosages, or self-treatment regimens.
- Clearly remind users that you are an AI assistant and they should consult qualified doctors on MediCare platform for clinical diagnosis.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are MediCare AI Assistant, a professional, empathetic healthcare education guide. You answer in English and Hindi. You never prescribe medicines and always uphold medical safety.',
        },
      });

      res.json({ success: true, reply: response.text });
      return;
    }
  } catch (err: unknown) {
    console.error('Gemini API Error in chat:', err);
  }

  // Safe fallback
  const isHindi = /[\u0900-\u097F]/.test(message);
  let reply = '';
  if (isHindi) {
    reply = `नमस्ते! मैं MediCare AI स्वास्थ्य सहायक हूँ। आपका स्वास्थ्य हमारी प्राथमिकता है।

आपके प्रश्न के अनुसार, सामान्य स्वास्थ्य समस्याओं के लिए आप हमारे 17 विशेषज्ञों में से उपयुक्त डॉक्टर के साथ ऑनलाइन या क्लिनिक अपॉइंटमेंट बुक कर सकते हैं। 

यदि आपके लक्षण अचानक और गंभीर हैं (जैसे छाती में तेज दर्द, सांस लेने में अत्यधिक तकलीफ या बेहोशी), तो तुरंत आपातकालीन हेल्पलाइन (112 या 108) पर संपर्क करें। 

(कृपया ध्यान दें: मैं एक AI सहायक हूँ और दवाइयां निर्धारित नहीं कर सकता। सटीक परामर्श के लिए डॉक्टर से संपर्क करें।)`;
  } else {
    reply = `Hello! I am your MediCare AI Health Assistant. 

I can help explain medical terms, guide you on test preparation (like fasting guidelines for lipid or glucose tests), direct you to the appropriate specialist across our 17 departments, or answer questions about blood donation.

For clinical examination and official prescriptions, please book a consultation with our verified doctors on the platform.

*Safety Notice: If you or anyone around you is experiencing severe red-flag symptoms (such as acute chest pain, sudden numbness/speech loss, or severe breathlessness), please contact emergency services (112 / 108) immediately.*`;
  }

  res.json({ success: true, reply, fallback: true });
});

// Admin & Hospital Overview
app.get('/api/admin/overview', (_req: Request, res: Response) => {
  const stats = {
    totalPatients: USERS.filter((u) => u.role === 'patient').length + 1420,
    totalDoctors: DOCTORS.length,
    verifiedDoctors: DOCTORS.filter((d) => d.isVerified).length,
    activeAppointments: APPOINTMENTS.filter((a) => a.status === 'confirmed').length,
    totalDonors: BLOOD_DONORS.length + 84,
    pendingBloodRequests: BLOOD_REQUESTS.filter((r) => r.status === 'pending').length,
    totalHealthTestsAvailable: HEALTH_TESTS.length,
    completedTests: TEST_BOOKINGS.filter((b) => b.status === 'completed').length + 530,
    systemStatus: 'Operational',
  };

  res.json({ success: true, stats, recentLogs: AUDIT_LOGS.slice(0, 10) });
});

app.get('/api/admin/audit-logs', (_req: Request, res: Response) => {
  res.json({ success: true, logs: AUDIT_LOGS });
});

// ==========================================
// MOUNT VITE MIDDLEWARE (DEV) OR STATIC (PROD)
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediCare AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
