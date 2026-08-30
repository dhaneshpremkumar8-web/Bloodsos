import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:pl-64">
          <div className="sticky top-16 z-20 flex items-center gap-3 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-gray-700">Menu</span>
          </div>
          <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
