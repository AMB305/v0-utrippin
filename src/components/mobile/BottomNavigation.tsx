import { Home, Compass, User, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Discover', path: '/hotels' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className={`bottom-nav ${className}`}>
      <div className="flex justify-around items-center py-3">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center space-y-1 touch-target-44 transition-colors ${
              isActive(path) 
                ? 'text-mobile-primary-teal' 
                : 'text-mobile-text-secondary hover:text-mobile-text-primary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}