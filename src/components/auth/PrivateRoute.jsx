"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/layout/Header";

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      setIsLoading(false);
      return;
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isTrainBoostLogin") === "true";
    
    if (isLoggedIn) {
      setIsAuthenticated(true);
    } else {
      router.push("/login");
    }
    
    setIsLoading(false);
  }, [pathname, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For login page, render without header
  if (pathname === "/login") {
    return children;
  }

  // For other pages, render with header if authenticated
  if (isAuthenticated) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  // Show loading while redirecting to login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default PrivateRoute;