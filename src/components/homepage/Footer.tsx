import { Link } from "react-router-dom";
import { Phone, Mail, MapPinCheck } from "lucide-react";
import Logo from "@/assets/logo.png";

interface FooterProps {
  variant?: "default" | "minimal";
}

const Footer = ({ variant = "default" }: FooterProps) => {
  const contactInfo = {
    phone: "07055559966, 07054449966",
    email: "info@9jacart.ng",
    socialMedia: {
      instagram: "https://instagram.com/9jacart",
      facebook: "https://facebook.com/9jacart",
      twitter: "https://twitter.com/9jacart",
      linkedin: "https://linkedin.com/company/9jacart",
    },
  };

  return (
    <footer className="bg-[#193540]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Logo and Writeup - First on mobile, shown at top */}
        <div className="md:hidden mb-8 pb-8 border-b border-border">
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={Logo} alt="9jacart" className="h-8 w-auto" />
            </div>
            <p className="text-white text-sm">
              Empowering vendors with Nigeria's leading Buy Now, Pay Later
              e-commerce platform. Join thousands of vendors growing their
              business with 9jacart.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 border-b border-border pb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Know Us More
            </h3>
            <ul className="space-y-3 text-sm">
              {/* <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li> */}
              {/* <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li> */}
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms & Conditions (T's & C's)
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Make Money With Us
            </h3>
            <ul className="space-y-3 text-sm">
              {/* <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li> */}
              {/* <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li> */}
              <li>
                <Link
                  to="/sell-product"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sell Products on 9jacart
                </Link>
              </li>
            
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Quick Link
            </h3>
            <ul className="space-y-3 text-sm">
              {/* <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li> */}
              {/* <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li> */}
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                 Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 my-10">
          {/* Brand Section - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block space-y-4">
            <div className="flex items-center">
              <img src={Logo} alt="9jacart" className="h-8 w-auto" />
            </div>
            <p className="text-white text-sm max-w-md">
              Empowering vendors with Nigeria's leading Buy Now, Pay Later
              e-commerce platform. Join thousands of vendors growing their
              business with 9jacart.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 md:flex jmd:ustify-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Reach Us
              </h3>
              <div className="space-y-3">
                {/* Phone */}
                <p className=" text-white flex gap-2">
                  <MapPinCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Office Address: 1, Oregun way, Ikeja, Lagos State, Nigeria
                  </span>
                </p>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center space-x-3 text-white transition-colors group"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{contactInfo.phone}</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center space-x-3 text-white  transition-colors group"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{contactInfo.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4 md:flex">
            <div className="">
              <h3 className="text-lg font-semibold text-white">Follow Us</h3>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <a
                  href={contactInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Follow us on Instagram"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.017 0C8.396 0 7.929.01 6.71.048 5.493.087 4.73.222 4.058.42a5.916 5.916 0 0 0-2.134 1.384A5.916 5.916 0 0 0 .42 4.058C.222 4.73.087 5.493.048 6.71.01 7.929 0 8.396 0 12.017c0 3.624.01 4.09.048 5.309.039 1.217.174 1.98.372 2.652a5.916 5.916 0 0 0 1.384 2.134 5.916 5.916 0 0 0 2.134 1.384c.672.198 1.435.333 2.652.372 1.219.038 1.685.048 5.309.048 3.624 0 4.09-.01 5.309-.048 1.217-.039 1.98-.174 2.652-.372a5.916 5.916 0 0 0 2.134-1.384 5.916 5.916 0 0 0 1.384-2.134c.198-.672.333-1.435.372-2.652.038-1.219.048-1.685.048-5.309 0-3.624-.01-4.09-.048-5.309-.039-1.217-.174-1.98-.372-2.652a5.916 5.916 0 0 0-1.384-2.134A5.916 5.916 0 0 0 19.692.42c-.672-.198-1.435-.333-2.652-.372C15.821.01 15.355 0 12.017 0zm0 2.16c3.557 0 3.98.01 5.385.048 1.3.06 2.006.276 2.477.458.622.242 1.067.532 1.533.998.466.466.756.911.998 1.533.182.471.398 1.177.458 2.477.038 1.405.048 1.828.048 5.385 0 3.557-.01 3.98-.048 5.385-.06 1.3-.276 2.006-.458 2.477-.242.622-.532 1.067-.998 1.533-.466.466-.911.756-1.533.998-.471.182-1.177.398-2.477.458-1.405.038-1.828.048-5.385.048-3.557 0-3.98-.01-5.385-.048-1.3-.06-2.006-.276-2.477-.458-.622-.242-1.067-.532-1.533-.998-.466-.466-.756-.911-.998-1.533-.182-.471-.398-1.177-.458-2.477-.038-1.405-.048-1.828-.048-5.385 0-3.557.01-3.98.048-5.385.06-1.3.276-2.006.458-2.477.242-.622.532-1.067.998-1.533.466-.466.911-.756 1.533-.998.471-.182 1.177-.398 2.477-.458 1.405-.038 1.828-.048 5.385-.048z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M12.017 5.838a6.179 6.179 0 1 0 0 12.358 6.179 6.179 0 0 0 0-12.358zM12.017 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.624-10.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                <a
                  href={contactInfo.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Follow us on Facebook"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                <a
                  href={contactInfo.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Follow us on Twitter"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>

                <a
                  href={contactInfo.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Follow us on LinkedIn"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links (for default variant) */}
        {variant === "default" && (
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <nav className="flex space-x-6">
                <Link
                  to="/"
                  className="text-sm text-white transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Home
                </Link>
                <Link
                  to="/contact"
                  className="text-sm text-white transition-colors"
                  hrefLang="home"
                >
                  Contact
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-white transition-colors"
                >
                  Join as Vendor
                </Link>
              </nav>

              <p className="text-sm text-white">
                © {new Date().getFullYear()} 9jacart. All rights reserved.
              </p>
            </div>
          </div>
        )}

        {/* Minimal variant footer */}
        {variant === "minimal" && (
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-white">
              © {new Date().getFullYear()} 9jacart. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
