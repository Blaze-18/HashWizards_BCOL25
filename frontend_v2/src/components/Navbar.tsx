"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Logo from "@/assets/logo.png";
import { 
  LayoutDashboard, 
  MessageCircleMore, 
  Users, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "View your progress"
    },
    {
      href: "/chat",
      icon: MessageCircleMore,
      label: "Chat & Lessons",
      description: "AI assistance & learning"
    },
    {
      href: "/social",
      icon: Users,
      label: "Social",
      description: "Connect & share"
    }
  ];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <Image
                src={Logo}
                alt="Sentio Logo"
                width={50}
                height={33}
                className="drop-shadow-sm"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Sentio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 hover:shadow-md"
                >
                  <div className="relative">
                    <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  
                  <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                    {item.label}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    {item.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                </Link>
              );
            })}

            {/* Logout Button */}
            <div className="ml-4 group relative">
              <button 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                onClick={() => window.location.href = "/home"}
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Logout
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <div>
                      <span className="text-gray-700 font-medium block">
                        {item.label}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
              
              {/* Mobile Logout */}
              <button 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-600"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = "/home";
                }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}