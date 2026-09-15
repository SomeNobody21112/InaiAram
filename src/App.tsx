import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './routes/index';
import AppRoutes from './routes/app-routes';
import { PrivacyPage } from './routes/privacy';
import { ConsentNoticePage } from './routes/consent-notice';
import { TermsPage } from './routes/terms';
import { useTheme } from './hooks/useTheme';

export default function App() {
  useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-terracotta focus:text-white focus:rounded-md focus:text-sm">
          Skip to content
        </a>
        <Routes>
          {/* Public marketing site */}
          <Route path="/" element={<><Nav /><LandingPage /><Footer /></>} />
          <Route path="/privacy" element={<><Nav /><PrivacyPage /><Footer /></>} />
          <Route path="/consent-notice" element={<><Nav /><ConsentNoticePage /><Footer /></>} />
          <Route path="/terms" element={<><Nav /><TermsPage /><Footer /></>} />
          {/* Private application (auth, onboarding, /app shell) + legacy redirects */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
