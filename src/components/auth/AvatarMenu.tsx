import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Profile, getAvatarFallback, getDashboardPath } from '@/lib/auth';
import { LogOut, User, LayoutDashboard, Settings } from 'lucide-react';

interface AvatarMenuProps {
  profile: Profile;
}

export function AvatarMenu({ profile }: AvatarMenuProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate(getDashboardPath(profile.role));
  };

  const avatarFallback = getAvatarFallback(profile);
  const dashboardPath = getDashboardPath(profile.role);
  const roleName = profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1) || 'User';
  const displayName = profile.first_name || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatar_url || ''} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end" forceMount>
        <DropdownMenuLabel className="p-3">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{roleName}</p>
        </DropdownMenuLabel>
        
        <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}