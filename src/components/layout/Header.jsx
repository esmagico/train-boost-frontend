"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import trainBoostLogo from "@/assets/svg/train-boost-logo.svg";

const navigation = [
  { name: "Home", href: "/" },
  // { name: "Test", href: "/test" },
  // { name: 'Resources', href: '/' },
  // { name: 'Community', href: '/' },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isTrainBoostLogin");
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1f2f4] px-10 py-2">
      <div className="flex items-center gap-1 text-[#121416] cursor-pointer"
      onClick={() => router.push("/")}
      >
        <img
          className="w-6 h-6"
          src={trainBoostLogo.src}
          alt="trainBoostLogo"
        />
        <h2 className="text-[16px] font-lato font-bold leading-[100%] tracking-[0.02em]">
          Train Boost
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-10">
        <nav className="flex items-center gap-5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`font-lato font-semibold text-[14px] leading-[100%] tracking-[0.02em] ${
                  isActive 
                    ? 'text-blue-600 ' 
                    : 'text-[#1A1C29] hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        {/* <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#f1f2f4] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
          <div data-icon="Bell" data-size="20px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"/>
            </svg>
          </div>
        </button> */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="cursor-pointer bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoas-lXwDX4d4qNenf8RAE564_vHHluoFPLisNc_kwvYD7xMl-pNNo4MTJL-GTUDaWsqojiG4bD1LS3277ib4KfQtWNIQ28UkdRewiUVpN9_pg-7QYHkPVzm35zdD8hoi_RW5Ghduj0Nzmj3qbfmrfpRoFrN7h7u8b781iwebQrdXvkBAXPRUeRVoPXX9Ps07w3iq0DE4UJ36zTxJYUkz4pkl8ysGHYFYMcD7qxPfz-1Ku4nONswXHUGNTSHdka2sv29asDFpYzvU")',
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <div className="font-medium">Admin User</div>
                <div className="text-gray-500 truncate">
                  admin@trainboost.com
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
