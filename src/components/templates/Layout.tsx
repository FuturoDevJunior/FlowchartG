import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import Button from '../atoms/Button';
import AuthModal from '../molecules/AuthModal';
import { signOut } from '../../lib/supabase';
import { User as UserType } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  onAuthChange: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onAuthChange }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onAuthChange();
  };

  return (
    <div className="min-h-screen bg-[#2A2A2A] flex flex-col">
      <header className="bg-[#2A2A2A] text-white p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"
              stroke="#00FF88"
              strokeWidth="2"
            />
            <path
              d="M8 12H16M16 12L12 8M16 12L12 16"
              stroke="#00FF88"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-xl font-bold">FlowchartSaaS</h1>
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center">
              <span className="mr-4 text-sm hidden md:inline-block">
                {user.email}
              </span>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-white hover:bg-gray-700"
              >
                <LogOut size={20} className="mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={() => setAuthModalOpen(true)}
            >
              <User size={20} className="mr-1" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default Layout;