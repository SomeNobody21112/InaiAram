import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Emblem } from '../components/ui/Emblem';

export function LoginPage() {
  return (
    <main className="bg-bg min-h-screen flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <Emblem size={64} className="text-terracotta mx-auto mb-6" />
          <h1 className="display-m mb-4">Accounts are not yet available</h1>
          <p className="body-l mb-8">
            InaiAram is currently in its early stages. Account creation and login will be available before we take our first case. If you'd like to be notified, please reach out to us.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-terracotta hover:text-terracotta-deep transition-colors"
          >
            ← Return to home
          </Link>
        </div>
      </Container>
    </main>
  );
}
