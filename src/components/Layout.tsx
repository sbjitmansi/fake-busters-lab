
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className="page-container bg-background dark:bg-fakebuster-950 min-h-screen">
      <Navbar />
      <main className={`pt-24 px-4 pb-20 ${className}`}>
        {children}
      </main>
      <footer className="py-6 px-6 text-center text-sm text-muted-foreground border-t border-border">
        <div className="max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} FakeBusters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
