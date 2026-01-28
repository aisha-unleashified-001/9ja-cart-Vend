import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { registerImg } from "../../assets/auth";
import { Image } from "../ui/Image";
import Logo from "@/assets/logo2.png";

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isSuccessPage = location.pathname === "/register/success";

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Left side - Form Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Logo - Hidden on success page, centered and linked to homepage */}
          {!isSuccessPage && (
            <div className="flex justify-center mb-8">
              <Link to="/">
                <img src={Logo} alt="9jacart Logo" className="h-16 w-auto opacity-50" />
              </Link>
            </div>
          )}
          {isSuccessPage ? (
            <Outlet />
          ) : (
            <div className="bg-[#F8FEF8] border border-[#C8E6C8] rounded-lg p-8 shadow-sm">
              <Outlet />
            </div>
          )}
        </div>
      </div>

      {/* Right side - Static Image */}
      <div className="hidden lg:flex lg:w-1/2 relative h-screen">
        {/* Background Image */}
        <Image
          src={registerImg}
          alt="E-commerce shopping experience"
          className="absolute inset-0 w-full h-full"
          objectFit="cover"
          lazy={false}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-20" />
      </div>
    </div>
  );
};

export default AuthLayout;
