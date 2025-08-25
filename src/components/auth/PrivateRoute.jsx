"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import { getValidAccessToken } from "@/utils/auth";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   // Skip auth check for login page
  //   if (pathname === "/login") {
  //     return;
  //   }

  //   // Check if user has valid token (with auto-refresh)
  //   const checkAuth = async () => {
  //     try {
  //       const validToken = await getValidAccessToken();
  //       if (validToken) {
  //         setIsAuthenticated(true);
  //       } else {
  //         router.push("/login");
  //       }
  //     } catch (error) {
  //       router.push("/login");
  //     }
  //   };

  //   checkAuth();
  // }, [pathname, router]);

  // For login page, render without header
  if (pathname === "/login") {
    return children;
  }

  // For other pages, render with header if authenticated
  // if (isAuthenticated) {
  if (true) {
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