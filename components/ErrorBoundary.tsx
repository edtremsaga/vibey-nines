"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { clearGame } from "@/lib/storage";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    // Clear any potentially corrupted game data
    clearGame();
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
    });
    // Reload the page to reset app state
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="golf-course-bg flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="rounded-2xl border-2 border-red-500 bg-white/90 p-6 shadow-xl dark:border-red-600 dark:bg-gray-800/90">
              <div className="text-center">
                <div className="mb-4 text-6xl">⚠️</div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Something went wrong
                </h1>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  An unexpected error occurred. Don't worry, your game progress is saved.
                </p>
                
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mb-4 rounded-lg bg-red-50 p-4 text-left dark:bg-red-900/20">
                    <summary className="cursor-pointer font-semibold text-red-800 dark:text-red-300">
                      Error Details (Development Only)
                    </summary>
                    <pre className="mt-2 overflow-auto text-xs text-red-700 dark:text-red-400">
                      {this.state.error.toString()}
                      {this.state.error.stack && `\n\n${this.state.error.stack}`}
                    </pre>
                  </details>
                )}

                <div className="space-y-3">
                  <button
                    onClick={this.handleReset}
                    className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 font-bold text-white shadow-lg transition-all hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-500/50"
                  >
                    🔄 Reset App & Reload
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-6 py-4 font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    🔄 Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}



