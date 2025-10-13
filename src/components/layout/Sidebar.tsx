import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Logo from "@/assets/logo.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Products", href: "/products", icon: "📦" },
  { name: "Orders", href: "/orders", icon: "🛒" },
  { name: "Storefront", href: "/storefront", icon: "🏪" },
  { name: "Analytics", href: "/analytics", icon: "📈" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const location = useLocation();
  // Use selective subscriptions for better performance
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col w-64 bg-[#182F38] border-r border-[#8DEB6E]">
      <div className="flex items-center h-16 px-6 border-b border-[#8DEB6E]">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src={Logo} alt="SellerHub Logo" className="h-8 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/dashboard" &&
              location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-[#8DEB6E] text-primary"
                  : "text-white hover:bg-[#8DEB6E]/10"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-[#8DEB6E] rounded-full flex items-center justify-center">
            <span className="text-primary text-sm font-medium">
              {user ? getInitials(user.fullName) : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName || 'User'}
            </p>
            <p className="text-xs text-white/50 truncate">
              {user?.emailAddress || 'user@example.com'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-[#8DEB6E]/10 rounded-md transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
