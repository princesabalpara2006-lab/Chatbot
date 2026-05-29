import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary Caught Crash]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <span className="text-4xl">⚠️</span>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Terminal Interface Interrupted</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                A rendering anomaly occurred. Don't worry, your conversational sessions are fully saved in-memory.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full text-xs font-bold transition-all shadow-lg"
            >
              Re-initialize Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
