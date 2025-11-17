import { Suspense, StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { AppRoutes } from "./routes";
import { ErrorBoundary } from "./ErrorBoundary";
import { Spinner } from "../shared/components/Spinner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//import { AuthProvider } from "../features/auth/context/AuthContext"; //  assume user is logged in

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            {/* <AuthProvider> */}
              <Suspense
                fallback={
                  <div className="flex h-screen items-center justify-center">
                    <Spinner />
                  </div>
                }
              >
                <AppRoutes />
              </Suspense>
            {/* </AuthProvider> */}
          </ErrorBoundary>
        </BrowserRouter>

        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </StrictMode>
  );
}