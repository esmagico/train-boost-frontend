"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import trainBoostLogo from "@/assets/svg/train-boost-logo.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isTrainBoostLogin") === "true";
    if (isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials
    const validEmail = "admin@trainboost.com";
    const validPassword = "T9#kZ2!pQ8@rL6$vB1";

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === validEmail && password === validPassword) {
      // Set login flag in localStorage
      localStorage.setItem("isTrainBoostLogin", "true");

      toast.success("Login successful! Welcome to Train Boost", {
        position: "top-right",
        autoClose: 2000,
      });

      router.push("/");
    } else {
      toast.error("Invalid email or password. Please check your credentials.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] py-12 px-4 sm:px-6 lg:px-8 mt-[-52px]">
      <div className="max-w-md w-full space-y-8 mt-[-80px]">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-[#121416]">
              <div className="size-8">
                <img src={trainBoostLogo.src} alt="TrainBoost Logo" className="w-8 h-8" />
              </div>
              <h2 className="text-[24px] font-lato font-bold leading-tight tracking-[0.02em]">
                Train Boost
              </h2>
            </div>
          </div>
          <h2 className="mt-6 text-center text-[28px] font-lato font-bold text-[#121416]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-[14px] font-lato font-medium text-[#6B7280]">
            Training Using AI
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-3 border-2 border-gray-300 placeholder-[#6B7280] text-[#121416] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:z-10 font-lato hover:border-gray-400 transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-3 pr-12 border-2 border-gray-300 placeholder-[#6B7280] text-[#121416] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:z-10 font-lato hover:border-gray-400 transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEye className="text-gray-400 cursor-pointer" />
                ) : (
                  <FiEyeOff className="text-gray-400 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
