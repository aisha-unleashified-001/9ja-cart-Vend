import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Logo from "@/assets/logo.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Products", href: "/products", icon: "📦" },
  { name: "Orders", href: "/orders", icon: "🛒" },
  { name: "Storefront", href: "/storefront", icon: "🏪" },
  { name: "Analytics", href: "/analytics", icon: "📈" },
  { name: "Notifications", href: "/notifications", icon: "🔔" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-[#182F38] border-r border-[#8DEB6E] transform transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-[#8DEB6E]">
        <Link to="/dashboard" className="flex items-center space-x-2" onClick={onClose}>
          <img src={Logo} alt="SellerHub Logo" className="h-8 w-auto" />
        </Link>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-white hover:bg-[#8DEB6E]/10 rounded-md"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/dashboard" &&
              location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-[#8DEB6E] text-primary"
                  : "text-white hover:bg-[#8DEB6E]/10"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#8DEB6E]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#8DEB6E] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-sm font-medium">
              {user ? getInitials(user.fullName) : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName || 'User'}
            </p>
            <p className="text-xs text-white/70 truncate">
              {user?.storeName || user?.businessName || 'Store'}
            </p>
            <p className="text-xs text-white/50 truncate">
              {user?.emailAddress || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
