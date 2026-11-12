# MediCare AI – Intelligent Hospital, Disease Prediction & Blood Connect Platform

> **Tagline:** *Predict Diseases Early. Connect with Doctors. Save Lives Through Blood Donation.*

MediCare AI is a full-stack, intelligent hospital management, disease prediction, and voluntary blood donor network platform built with React, TypeScript, Tailwind CSS, Express, and Google Gemini 3.8 AI.

---

## 🌟 Core Modules

### 1. AI Disease Risk Assessment & Triage
- **Multi-Factor Clinical Assessment:** Evaluates reported symptoms, duration, severity, age group, medical history, and baseline vitals.
- **Red-Flag Emergency Detection:** Detects life-threatening events (e.g., acute chest pain, FAST stroke signs, respiratory failure) and displays immediate emergency guidance with one-touch dialing for national emergency hotlines (**112 / 108**).
- **Probabilistic Risk Categorization:** Categorizes risks into Low, Moderate, High, and Emergency with clinical rationale.
- **Bilingual Results:** Explanations and next steps presented in simple **English** and **Hindi (हिंदी)**.
- **Direct Specialist Routing:** Automatically suggests the exact department among 17 hospital specialties.
- **Medical Disclaimer:** Emphasizes that AI assessments are preliminary educational screening tools and do not constitute a confirmed medical diagnosis.

### 2. Online Doctor Consultation (All 17 Specialties)
1. **General Physician** – Fever, Infections & Primary Care
2. **Cardiologist — Heart Specialist** – Heart Health, ECG & Blood Pressure
3. **Neurologist — Brain and Nerve Specialist** – Migraine, Epilepsy & Nerve Disorders
4. **Neurosurgeon — Brain and Spine Surgery Specialist** – Cranial & Spine Procedures
5. **Pediatrician — Children's Doctor** – Child Milestones & Pediatric Care
6. **Gynecologist — Women's Health Specialist** – Pregnancy, PCOS & Hormonal Health
7. **Orthopedic — Bone and Joint Specialist** – Arthroplasty, Fractures & Arthritis
8. **Dermatologist — Skin Specialist** – Clinical Dermatology & Skin Allergies
9. **ENT Specialist — Ear, Nose and Throat** – Sinus, Vertigo & Hearing
10. **Ophthalmologist — Eye Specialist** – Cataract, Vision Care & Glaucoma
11. **Psychiatrist — Mental Health Specialist** – Mood Disorders, Anxiety & Sleep
12. **Endocrinologist — Diabetes and Hormone Specialist** – Diabetes & Thyroid
13. **Nephrologist — Kidney Specialist** – CKD, Electrolytes & Renal Care
14. **Gastroenterologist — Digestive System Specialist** – GERD, IBS & Liver
15. **Pulmonologist — Lung and Respiratory Specialist** – Asthma & COPD
16. **Oncologist — Cancer Specialist** – Targeted Therapies & Oncology
17. **Dentist — Dental Specialist** – Root Canal & Dental Surgery

Each profile includes verified medical qualifications, MCI/NMC registration numbers, fees, consultation modes (online video and in-person clinic), working hours, and reviews.

### 3. Collision-Free Appointment Booking & In-App Telehealth
- **Real-Time Slot Engine:** Instant availability checks with atomic slot collision prevention (rejects double bookings with `409 Conflict`).
- **Reschedule & Cancellation:** Dynamic slot updates and instant status reflection.
- **In-App Video Consultation Room:** Encrypted telehealth room with simulated HD feeds, mic/camera toggles, call timer, live chat, and doctor's e-prescription writer.
- **Digital E-Prescription:** Doctors can sign and dispatch digital prescriptions containing diagnosis, medications, dosage, frequency, duration, and advice.

### 4. Blood Connect (All 8 ABO/Rh Blood Groups)
- **Supported Blood Types:** A+, A-, B+, B-, AB+, AB-, O+, O-.
- **Voluntary Donor Registration:** Donors register with blood group, city/area, and availability status.
- **Privacy-Preserving Contact:** Public donor phone numbers are masked; requests are dispatched via consent-protected alerts.
- **Hospital Blood Requirement Requests:** Patients/families post requirements with units needed, hospital name, and urgency level.
- **Regulatory Compliance:** Strict non-commercial voluntary policy; all collection and crossmatching must take place in licensed blood banks.

### 5. Diagnostic Health Test Bookings
- **Catalog of 9 Diagnostic Tests & Profiles:**
  - Complete Blood Count (CBC with ESR)
  - Blood Glucose (Fasting & PP) + HbA1c Profile
  - Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)
  - Thyroid Function Profile (T3, T4, Ultra-sensitive TSH)
  - Kidney Function Test (KFT / RFT with Electrolytes)
  - Liver Function Test (LFT with Enzymes & Bilirubin)
  - Blood Group & Rh Typing Confirmatory
  - Blood Pressure & In-Clinic Vitals Assessment
  - Executive Master Health Checkup Package (68 Parameters)
- **Collection Types:** Home sample collection with certified phlebotomists or in-clinic lab walk-in.
- **Fasting Preparation Alerts:** Clear fasting guidance (e.g. 10–12 hours overnight fast).

### 6. Medical Reports & AI Health Records
- **Organized Storage:** Digital storage of laboratory panels and biomarkers.
- **Gemini AI Plain-Language Explanations:** Bilingual breakdowns in English and Hindi explaining high/low biomarkers and lifestyle recommendations.
- **Granular Consent Sharing:** Patients selectively grant or revoke read access for specific doctors.

### 7. Conversational Bilingual AI Health Assistant
- **Bilingual Interface:** Natural conversation in English and Hindi.
- **Health Education:** Explains medical terms, appointment preparation, and triage without prescribing drug dosages.

### 8. Role-Based Access & Testing
Instant role switching available in the navigation bar to test all 5 workflows:
- **👤 Patient:** Rahul Sharma (`user_patient_1`)
- **🩺 Doctor:** Dr. Ananya Sharma, MD Cardiology (`doc_2`)
- **🩸 Blood Donor:** Vikram Singh, O+ Donor (`donor_1`)
- **🏥 Hospital & Lab Staff:** Pooja Verma, Diagnostic Lead
- **🛡️ System Administrator:** Chief Medical Oversight

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Backend:** Node.js, Express, tsx
- **AI Integration:** Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash` on the server-side with `headers: { 'User-Agent': 'aistudio-build' }`
- **Development Server:** Express server with Vite middleware on port 3000

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🔒 Security & Medical Compliance
- All AI assessments feature prominent disclaimers stating that results are educational and do not replace physical clinical examination.
- Blood donation strictly adheres to voluntary, non-remunerated donation principles under the National Blood Policy.
- Protected health information (phone numbers, full addresses) is masked on public directories.
