/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { EmergencySOSModal } from './components/EmergencySOSModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { DiseasePredictionPage } from './pages/DiseasePredictionPage.tsx';
import { DoctorDirectoryPage } from './pages/DoctorDirectoryPage.tsx';
import { AppointmentsPage } from './pages/AppointmentsPage.tsx';
import { BloodConnectPage } from './pages/BloodConnectPage.tsx';
import { HealthTestsPage } from './pages/HealthTestsPage.tsx';
import { MedicalReportsPage } from './pages/MedicalReportsPage.tsx';
import { AIHealthAssistantPage } from './pages/AIHealthAssistantPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import type { User, UserRole } from './types/index.ts';
import { api } from './services/api.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [extraParams, setExtraParams] = useState<any>({});
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [isSosOpen, setIsSosOpen] = useState(false);

  // Load initial user based on role
  useEffect(() => {
    api.getCurrentUser(currentRole).then((res) => {
      if (res.success && res.user) {
        setCurrentUser(res.user);
      }
    });
  }, [currentRole]);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    api.getCurrentUser(newRole).then((res) => {
      if (res.success && res.user) {
        setCurrentUser(res.user);
      }
    });
  };

  const handleNavigate = (tab: string, extra?: any) => {
    setCurrentTab(tab);
    setExtraParams(extra || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Navbar with role switch and emergency ribbon */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => handleNavigate(tab)}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        lang={lang}
        setLang={setLang}
        onOpenSOS={() => setIsSosOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            lang={lang}
            onOpenSOS={() => setIsSosOpen(true)}
          />
        )}

        {currentTab === 'disease-predict' && (
          <DiseasePredictionPage
            onNavigate={handleNavigate}
            lang={lang}
            onOpenSOS={() => setIsSosOpen(true)}
          />
        )}

        {currentTab === 'doctors' && (
          <DoctorDirectoryPage
            initialSpecialty={extraParams?.specialty}
            currentUser={currentUser}
            lang={lang}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'appointments' && (
          <AppointmentsPage
            currentUser={currentUser}
            userRole={currentRole}
            lang={lang}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'blood-connect' && (
          <BloodConnectPage
            initialAction={extraParams?.action}
            currentUser={currentUser}
            lang={lang}
            onOpenSOS={() => setIsSosOpen(true)}
          />
        )}

        {currentTab === 'health-tests' && (
          <HealthTestsPage
            currentUser={currentUser}
            lang={lang}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'reports' && (
          <MedicalReportsPage
            currentUser={currentUser}
            lang={lang}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'ai-assistant' && (
          <AIHealthAssistantPage
            lang={lang}
            onNavigate={handleNavigate}
            onOpenSOS={() => setIsSosOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            currentUser={currentUser}
            userRole={currentRole}
            lang={lang}
            onNavigate={handleNavigate}
            onOpenSOS={() => setIsSosOpen(true)}
          />
        )}
      </main>

      {/* Emergency SOS Modal (Accessible from anywhere) */}
      <EmergencySOSModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        lang={lang}
        onOpenSOS={() => setIsSosOpen(true)}
      />
    </div>
  );
}
