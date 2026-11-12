/**
 * MediCare AI - Central API Client
 */

import type {
  Doctor,
  Appointment,
  BloodDonor,
  BloodRequest,
  HealthTest,
  HealthTestBooking,
  MedicalReport,
  AuditLog,
  DiseaseAssessmentResult,
  User,
  UserRole,
} from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Auth & Roles
  async getCurrentUser(role: UserRole = 'patient'): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/current-user?role=${role}`);
    return res.json();
  },

  async getAllUsers(): Promise<{ success: boolean; users: User[] }> {
    const res = await fetch(`${API_BASE}/auth/roles`);
    return res.json();
  },

  // Doctors
  async getDoctors(params?: { specialty?: string; city?: string; mode?: string; search?: string }): Promise<{ success: boolean; doctors: Doctor[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.specialty) searchParams.append('specialty', params.specialty);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.mode) searchParams.append('mode', params.mode);
    if (params?.search) searchParams.append('search', params.search);
    
    const res = await fetch(`${API_BASE}/doctors?${searchParams.toString()}`);
    return res.json();
  },

  async getDoctorById(id: string, date?: string): Promise<{ success: boolean; doctor: Doctor; date: string; slots: { time: string; isAvailable: boolean }[] }> {
    const res = await fetch(`${API_BASE}/doctors/${id}${date ? `?date=${date}` : ''}`);
    return res.json();
  },

  async updateDoctorAvailability(id: string, data: Partial<Doctor>): Promise<{ success: boolean; doctor: Doctor }> {
    const res = await fetch(`${API_BASE}/doctors/${id}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async verifyDoctor(id: string): Promise<{ success: boolean; doctor: Doctor }> {
    const res = await fetch(`${API_BASE}/doctors/${id}/verify`, { method: 'POST' });
    return res.json();
  },

  // Appointments
  async getAppointments(params?: { patientId?: string; doctorId?: string }): Promise<{ success: boolean; appointments: Appointment[] }> {
    const searchParams = new URLSearchParams();
    if (params?.patientId) searchParams.append('patientId', params.patientId);
    if (params?.doctorId) searchParams.append('doctorId', params.doctorId);
    const res = await fetch(`${API_BASE}/appointments?${searchParams.toString()}`);
    return res.json();
  },

  async bookAppointment(data: {
    patientId: string;
    patientName: string;
    patientPhone: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    mode: 'online' | 'in-person';
    symptoms?: string;
  }): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
    const res = await fetch(`${API_BASE}/appointments/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async rescheduleAppointment(id: string, date: string, timeSlot: string): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, timeSlot }),
    });
    return res.json();
  },

  async cancelAppointment(id: string): Promise<{ success: boolean; appointment: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, { method: 'POST' });
    return res.json();
  },

  async savePrescription(id: string, data: { diagnosis: string; medicines: any[]; advice: string; followUpDays?: number; clinicalNotes?: string }): Promise<{ success: boolean; appointment: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/prescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Blood Connect
  async getDonors(params?: { bloodGroup?: string; city?: string; availableOnly?: boolean }): Promise<{ success: boolean; donors: BloodDonor[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.bloodGroup) searchParams.append('bloodGroup', params.bloodGroup);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.availableOnly) searchParams.append('availableOnly', 'true');
    const res = await fetch(`${API_BASE}/blood/donors?${searchParams.toString()}`);
    return res.json();
  },

  async registerDonor(data: Partial<BloodDonor> & { phone: string }): Promise<{ success: boolean; donor: BloodDonor; error?: string }> {
    const res = await fetch(`${API_BASE}/blood/donors/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async toggleDonorAvailability(id: string, isAvailable?: boolean, availabilityNote?: string): Promise<{ success: boolean; donor: BloodDonor }> {
    const res = await fetch(`${API_BASE}/blood/donors/${id}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable, availabilityNote }),
    });
    return res.json();
  },

  async getBloodRequests(params?: { bloodGroup?: string; city?: string; status?: string }): Promise<{ success: boolean; requests: BloodRequest[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.bloodGroup) searchParams.append('bloodGroup', params.bloodGroup);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.status) searchParams.append('status', params.status);
    const res = await fetch(`${API_BASE}/blood/requests?${searchParams.toString()}`);
    return res.json();
  },

  async submitBloodRequest(data: Partial<BloodRequest> & { contactPhone: string }): Promise<{ success: boolean; request: BloodRequest; error?: string }> {
    const res = await fetch(`${API_BASE}/blood/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateBloodRequestStatus(id: string, status: string, fulfilledUnits?: number): Promise<{ success: boolean; request: BloodRequest }> {
    const res = await fetch(`${API_BASE}/blood/requests/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, fulfilledUnits }),
    });
    return res.json();
  },

  async contactDonor(data: { donorId: string; patientName: string; hospitalName: string; bloodGroup: string; message?: string }): Promise<{ success: boolean; message: string; safetyNotice: string }> {
    const res = await fetch(`${API_BASE}/blood/contact-donor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Health Tests
  async getTests(): Promise<{ success: boolean; tests: HealthTest[] }> {
    const res = await fetch(`${API_BASE}/tests`);
    return res.json();
  },

  async getTestBookings(patientId?: string): Promise<{ success: boolean; bookings: HealthTestBooking[] }> {
    const res = await fetch(`${API_BASE}/tests/bookings${patientId ? `?patientId=${patientId}` : ''}`);
    return res.json();
  },

  async bookTest(data: {
    testId: string;
    patientId: string;
    patientName: string;
    date: string;
    timeSlot: string;
    collectionType: 'home' | 'lab';
    address?: string;
  }): Promise<{ success: boolean; booking: HealthTestBooking }> {
    const res = await fetch(`${API_BASE}/tests/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateTestStatus(id: string, status: string): Promise<{ success: boolean; booking: HealthTestBooking }> {
    const res = await fetch(`${API_BASE}/tests/bookings/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Medical Reports
  async getReports(patientId?: string): Promise<{ success: boolean; reports: MedicalReport[] }> {
    const res = await fetch(`${API_BASE}/reports${patientId ? `?patientId=${patientId}` : ''}`);
    return res.json();
  },

  async uploadReport(data: Partial<MedicalReport>): Promise<{ success: boolean; report: MedicalReport }> {
    const res = await fetch(`${API_BASE}/reports/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async toggleReportShare(reportId: string, doctorId: string): Promise<{ success: boolean; report: MedicalReport }> {
    const res = await fetch(`${API_BASE}/reports/${reportId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId }),
    });
    return res.json();
  },

  // AI Modules
  async checkSymptoms(data: {
    symptoms: string;
    duration?: string;
    severity?: string;
    ageGroup?: string;
    medicalHistory?: string;
    vitals?: string;
  }): Promise<{ success: boolean; assessment: DiseaseAssessmentResult; fallback?: boolean; error?: string }> {
    const res = await fetch(`${API_BASE}/ai/symptom-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async analyzeReport(data: {
    reportTitle?: string;
    biomarkers?: any[];
    rawText?: string;
  }): Promise<{ success: boolean; analysis: any; fallback?: boolean }> {
    const res = await fetch(`${API_BASE}/ai/analyze-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async sendChatMessage(message: string, history?: { sender: string; text: string }[]): Promise<{ success: boolean; reply: string; fallback?: boolean }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    return res.json();
  },

  // Admin
  async getAdminOverview(): Promise<{ success: boolean; stats: any; recentLogs: AuditLog[] }> {
    const res = await fetch(`${API_BASE}/admin/overview`);
    return res.json();
  },

  async getAuditLogs(): Promise<{ success: boolean; logs: AuditLog[] }> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`);
    return res.json();
  },
};
