import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || "Unexpected error",
    };
  }

  componentDidCatch(error: Error, info: unknown) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  handleReload = () => {
    window.location.href = window.location.href;
  };

  render() {
    const { fallback } = this.props;

    if (this.state.hasError) {
      if (fallback) return fallback;

      return (
        <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
          <p className="text-gray-500 mb-4">
            {this.state.message ?? "An unexpected error occurred."}
          </p>

          <button
            onClick={this.handleReload}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}