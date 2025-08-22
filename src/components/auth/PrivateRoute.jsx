"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import { decodeJWT } from "@/utils/jwt";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      return;
    }

    // Check if user has valid token
    const token = localStorage.getItem("trainboost_access_token");
    
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp > Date.now() / 1000) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("trainboost_access_token");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [pathname, router]);

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

  // Return null while redirecting to login (no loading spinner)
  return null;
};

export default PrivateRoute;