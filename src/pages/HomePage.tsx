import MainHeader from "@/components/MainHeader";
import { Link } from "react-router-dom";
import DashboardOverviewImg from "@/assets/dashboard.png";
import incentives from "@/assets/incentives.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MainHeader />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-5xl mx-auto">
            Sell with the fastest - growing and preferred acquisition channel
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Our Marketplace and Reach More Buyers
          </p>

          <Link
            to="/register"
            className="px-6 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mt-16">
          <img
            src={DashboardOverviewImg}
            alt="Dashboard Overview"
            className="w-full max-w-6xl mx-auto rounded-lg "
          />
        </div>

        {/* Incentive Section */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <img
              src={incentives}
              alt="Incentives"
              className="w-full rounded-lg"
            />
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8">
            {/* badge */}
            <div className="inline-block bg-primary text-white px-6 py-4 rounded-full mb-4">
              <span className="text-sm font-semibold flex items-center gap-2">
                {" "}
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1145_18488)">
                    <path
                      d="M11.99 2.15234C6.47 2.15234 2 6.63234 2 12.1523C2 17.6723 6.47 22.1523 11.99 22.1523C17.52 22.1523 22 17.6723 22 12.1523C22 6.63234 17.52 2.15234 11.99 2.15234ZM16.23 18.1523L12 15.6023L7.77 18.1523L8.89 13.3423L5.16 10.1123L10.08 9.69234L12 5.15234L13.92 9.68234L18.84 10.1023L15.11 13.3323L16.23 18.1523Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1145_18488">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 0.152344)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                New Seller Incentives
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Get started with over <br /> $50, 000 in incentives
            </h2>
            <p className="text-muted-foreground mb-4">
              As a new seller, you can take advantage of a series of incentives.
            </p>
            <div className="p-8 bg-[#DDF9D4] rounded-lg mb-6">
              {/* 4 checklist with svg icon*/}
              <ul className="list-disc list-inside space-y-4 text-black font-light">
                <li className="flex items-center gap-2 ">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3327 4.15234L5.99935 11.4857L2.66602 8.15234"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Free listing credits for your first month
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3327 4.15234L5.99935 11.4857L2.66602 8.15234"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Access to premium support for the first three months
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3327 4.15234L5.99935 11.4857L2.66602 8.15234"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Marketing credits to boost your listings
                </li>
              </ul>
            </div>
            <span className="flex items-center gap-2 text-primary font-bold ">
              See all incentives{" "}
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17.1523L17 7.15234"
                  stroke="#182F38"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 7.15234H17V17.1523"
                  stroke="#182F38"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* why create an account */}
        <div className="p-12 bg-[#E8EAEB] mt-24 rounded-3xl flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Why create an account?
            </h2>
            <p className="text-muted-foreground mb-4">
              Creating an account allows you to manage your listings, track
              orders, and access exclusive seller tools.
            </p>
            <Link
              to="/register"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Create Account
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8">
            <img
              src={DashboardOverviewImg}
              alt="Dashboard Overview"
              className="w-full rounded-lg"
            />
          </div>
        </div>
        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Product Management
            </h3>
            <p className="text-muted-foreground">
              Easily add, edit, and organize your products with our intuitive
              interface.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Order Processing
            </h3>
            <p className="text-muted-foreground">
              Streamline your order fulfillment with automated workflows and
              tracking.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Analytics & Insights
            </h3>
            <p className="text-muted-foreground">
              Track your performance with detailed analytics and actionable
              insights.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 bg-card border border-border rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground">10,000+</div>
              <div className="text-muted-foreground">Active Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">$2M+</div>
              <div className="text-muted-foreground">Monthly Sales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">50,000+</div>
              <div className="text-muted-foreground">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 SellerHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
