import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/UserService';
import { Link } from 'react-router-dom';
import { User, Settings, LayoutDashboard, Briefcase, LogOut, Calendar, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfileDropdown = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    const profile = await userService.getCurrentUser();
    setUserProfile(profile);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDisplayName = () => {
    return userProfile?.profile?.username || user?.email?.split('@')[0] || 'User';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 p-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userProfile?.profile_photo_url} />
            <AvatarFallback className="text-xs">
              {getInitials(userProfile?.profile?.username)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <div className="font-medium">{getDisplayName()}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user?.email}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-elegant z-[100]">
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">{getDisplayName()}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
        </div>
        
        <DropdownMenuSeparator />
        
        <Link to="/dashboard">
          <DropdownMenuItem className="cursor-pointer">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
        </Link>
        
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
        </Link>
        
        <Link to="/trips">
          <DropdownMenuItem className="cursor-pointer">
            <Briefcase className="w-4 h-4 mr-2" />
            My Trips
          </DropdownMenuItem>
        </Link>
        
        <Link to="/bookings">
          <DropdownMenuItem className="cursor-pointer">
            <Calendar className="w-4 h-4 mr-2" />
            My Bookings
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator />
        
        <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </Link>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => navigate('/admin/dashboard')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;