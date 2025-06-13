import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Wallet,
  Megaphone,
  HelpCircle
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/product', icon: Package, label: 'Product' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/income', icon: Wallet, label: 'Income' },
    { to: '/promote', icon: Megaphone, label: 'Promote' },
    { to: '/help', icon: HelpCircle, label: 'Help' }
  ];

  return (
    <aside className="bg-white min-h-screen p-4 flex flex-col w-20 md:w-64 transition-all duration-300">
      {/* Header */}
      <div className="mb-10 hidden md:block text-center w-full">
        <span className="text-4xl font-medium text-gray-700">Vektor </span>
        <span className="text-sm font-normal text-gray-400"> v.01</span>
      </div>

      {/* Logo sólo visible en móvil */}
      <div className="md:hidden flex justify-center mb-10">
        <span className="text-2x1 font-normal text-gray-400"> v.01</span>
      </div>

      {/* Menu */}
      <nav className="space-y-2">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg transition-all justify-center md:justify-between px-3 py-2 ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">{label}</span>
              </div>
              <span className="hidden md:inline text-sm">{'>'}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

