import { Link } from 'react-router-dom';
import { Droplet, Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
                <Droplet className="h-5 w-5 text-white" fill="white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold text-gray-900">BloodSOS</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600">AI</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              AI-powered emergency blood donor matching platform. Saving lives, one drop at a time.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
              <Heart className="h-4 w-4 text-primary-500" fill="currentColor" />
              <span>Made with care for humanity</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to="/donors" className="hover:text-primary-600">Find Donors</Link></li>
              <li><Link to="/sos" className="hover:text-primary-600">SOS Board</Link></li>
              <li><Link to="/voice-sos" className="hover:text-primary-600">Voice SOS</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600">Blood Compatibility</a></li>
              <li><a href="#" className="hover:text-primary-600">Donation Guide</a></li>
              <li><a href="#" className="hover:text-primary-600">Emergency Protocols</a></li>
              <li><a href="#" className="hover:text-primary-600">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-500" />
                <span>+91 1800 BLOOD SOS</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-500" />
                <span>help@bloodsos.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span>Chennai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} BloodSOS AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-primary-600">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600">Terms of Service</a>
            <a href="#" className="hover:text-primary-600">Medical Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
