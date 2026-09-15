/**
 * APP ROUTES — the single coherent authenticated surface.
 * /app/* uses the AppShell. Auth and onboarding are standalone.
 * Legacy /demo surface is redirected here.
 */
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppShell } from '../components/app/AppShell';
import { AppProvider, useApp } from '../store/app';
import { ToastProvider } from '../components/ui/primitives';
import { SignupScreen, LoginScreen } from '../components/app/screens/Auth';
import { OnboardingScreen } from '../components/app/screens/Onboarding';
import { DashboardScreen } from '../components/app/screens/Dashboard';
import { NewVerificationScreen } from '../components/app/screens/NewVerification';
import { ConsentScreen } from '../components/app/screens/Consent';
import { VerificationsScreen, VerificationDetailScreen } from '../components/app/screens/Verifications';
import { EvidenceScreen, TrustProfileScreen, ReportScreen } from '../components/app/screens/Views1';
import { PrivacyScreen, InvitationsScreen, AccountScreen } from '../components/app/screens/Views2';
import { ReportsScreen } from '../components/app/screens/Reports';
import { StatesReferenceScreen } from '../components/app/screens/StatesReference';

/** Sends unauthenticated users to login, onboarded-but-shell-less users home. */
function RequireUser({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const location = useLocation();
  if (!state.user || !state.user.session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

/** Detail routes live under /app/verifications/:id — Evidence and Report are sub-views. */
function VerificationDetailRoutes() {
  return (
    <Routes>
      <Route index element={<VerificationDetailScreen />} />
      <Route path="evidence" element={<EvidenceScreen />} />
      <Route path="report" element={<ReportScreen />} />
      <Route path="*" element={<Navigate to=".." replace />} />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <AppProvider>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          {/* Auth — standalone, no shell */}
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/onboarding"
            element={
              <RequireUser>
                <OnboardingScreen />
              </RequireUser>
            }
          />

          {/* Authenticated app shell */}
          <Route
            path="/app/*"
            element={
              <RequireUser>
                <AppShell>
                  <Routes>
                    <Route index element={<DashboardScreen />} />
                    <Route path="verifications" element={<VerificationsScreen />} />
                    <Route path="verifications/:id/*" element={<VerificationDetailRoutes />} />
                    <Route path="new-verification" element={<NewVerificationScreen />} />
                    <Route path="trust" element={<TrustProfileScreen />} />
                    <Route path="evidence" element={<EvidenceScreen />} />
                    <Route path="reports" element={<ReportsScreen />} />
                    <Route path="reports/:id" element={<ReportScreen />} />
                    <Route path="states" element={<StatesReferenceScreen />} />
                    <Route path="consent" element={<ConsentScreen />} />
                    <Route path="privacy" element={<PrivacyScreen />} />
                    <Route path="invitations/:id" element={<InvitationsScreen />} />
                    <Route path="account" element={<AccountScreen />} />
                    <Route path="*" element={<Navigate to="/app" replace />} />
                  </Routes>
                </AppShell>
              </RequireUser>
            }
          />

          {/* Legacy demo surface → new app */}
          <Route path="/demo/*" element={<Navigate to="/app" replace />} />

          {/* Public site routes are rendered by App.tsx before this router — catch-all for unknown app paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AppProvider>
  );
}
