import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

export default function MainHeader() {
  return (
    <header className=" bg-[#182F38] sticky top-0 z-50">
      <div className="max-w-7xl xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="SellerHub Logo" className="h-8 w-auto" />
            </Link>
          </div>

          <div>
            {/* Navigation Links can be added here in the future */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-white hover:text-[#8DEB6E] transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Home
              </Link>
              <Link 
                to="/#about" 
                className="text-white hover:text-[#8DEB6E] transition-colors"
                onClick={(e) => {
                  // If we're already on home page, scroll to section immediately
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    const element = document.getElementById('about');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                About
              </Link>
              <Link 
                to="/#faq" 
                className="text-white hover:text-[#8DEB6E] transition-colors"
                onClick={(e) => {
                  // If we're already on home page, scroll to section immediately
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    const element = document.getElementById('faq');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                FAQ
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-[#8DEB6E] transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white  transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}