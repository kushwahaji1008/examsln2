import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, BarChart3, 
  LogOut, User as UserIcon, 
  Sparkles, X,
  Compass, GraduationCap, Video, Wallet
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate navigation links strictly based on role
  const getNavLinks = () => {
    const role = user?.role;
    
    if (role === 'Admin' || role === 'SuperAdmin' || role === 2 || role === 3) {
      return [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Manage Courses', path: '/courses', icon: Compass },
        { name: 'Manage Exams', path: '/exams', icon: FileText },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ];
    }
    
    if (role === 'Teacher' || role === 1) {
      return [
        { name: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
        { name: 'My Courses', path: '/courses', icon: Compass },
        { name: 'Create Course', path: '/courses/new', icon: Sparkles },
        { name: 'My Exams', path: '/teacher/exams', icon: FileText },
        { name: 'Question Bank', path: '/teacher/questions', icon: FileText },
        { name: 'Live Classes', path: '/teacher/live', icon: Video },
        { name: 'Submissions', path: '/teacher/results', icon: FileText },
        { name: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
      ];
    }

    return [
      { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
      { name: 'Course Catalog', path: '/student/courses?tab=all', icon: Compass },
      { name: 'My Learning', path: '/student/courses?tab=enrolled', icon: GraduationCap },
      { name: 'Live Classes', path: '/student/live', icon: Video },
      { name: 'Assessments', path: '/student/exams', icon: FileText },
      { name: 'Results & Certificates', path: '/student/results', icon: BarChart3 },
      { name: 'My Wallet', path: '/student/wallet', icon: Wallet },
    ];
  };

  const navLinks = getNavLinks();

  const isLinkActive = (path: string) => {
    if (path.includes('?')) {
      const [pathname, search] = path.split('?');
      if (location.pathname === pathname) {
        // If current location has no search and path is tab=all, treat as active
        if (!location.search && search === 'tab=all') return true;
        return location.search === `?${search}`;
      }
      return false;
    }
    if (path === '/student') {
      return location.pathname === path || location.pathname === `${path}/dashboard`;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Area */}
        <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3 text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">ExamSolution</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="space-y-1.5">
            <div className="mb-4 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Main Menu
            </div>
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {link.name}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions (Profile & Logout) */}
        <div className="shrink-0 border-t border-border p-4 space-y-1.5">
          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`
            }
          >
            <UserIcon className="h-5 w-5 shrink-0" />
            My Profile
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}