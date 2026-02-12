import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/homepage/Footer";

const policyLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/shipping-and-return-policy", label: "Shipping and return policy" },
  { to: "/refund-policy", label: "Refund Policy" },
  { to: "/dispute-policy", label: "Dispute Policy" },
  { to: "/terms", label: "Terms and conditions" },
];

interface PolicyPageLayoutProps {
  title: string;
  children: ReactNode;
}

export function PolicyPageLayout({ title, children }: PolicyPageLayoutProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="flex-1">
        <div className="bg-primary/5 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center">
              {title}
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            <nav className="md:w-56 shrink-0" aria-label="Policy pages">
              <ul className="space-y-1">
                {policyLinks.map(({ to, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        className={`block w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex-1 min-w-0">
              <div className="bg-card rounded-xl shadow-sm border p-6 md:p-10 text-foreground">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
