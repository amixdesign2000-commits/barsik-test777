import { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Pristine Living render error:', error, info);
  }

  handleReset = () => {
    try {
      window.localStorage.removeItem('pristine_living_bookings_v1');
    } catch {
      // Ignore storage errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] p-6 text-[#131b2e]">
          <div className="max-w-md rounded-2xl border border-[#bcc9c6]/60 bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#3d4947]">
              Please reload the page to restore your Pristine Living session.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-5 min-h-[44px] rounded-xl bg-[#00685f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#008378]"
            >
              Reload Marketplace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>,
  );
}
