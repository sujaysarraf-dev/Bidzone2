/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-neutral-900 font-bold">B</div>
              <span className="font-bold text-xl tracking-tight">Bidzone</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              The leading intelligent financial asset auction aggregation platform in Nepal. 
              Connecting institutions with buyers through transparency and technology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-emerald-500 hover:text-neutral-900 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-emerald-500 hover:text-neutral-900 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-emerald-500 hover:text-neutral-900 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-emerald-500 hover:text-neutral-900 transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/auctions" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">Browse Auctions</Link></li>
              <li><Link to="/how-it-works" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">How It Works</Link></li>
              <li><Link to="/pricing" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">Pricing Plans</Link></li>
              <li><Link to="/about" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">Safety & Security</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-neutral-400 text-sm">
                <Mail size={16} className="text-emerald-500" />
                <span>contact@bidzone.com.np</span>
              </li>
              <li className="flex items-center gap-3 text-neutral-400 text-sm">
                <Phone size={16} className="text-emerald-500" />
                <span>+977 1-4XXXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-neutral-400 text-sm">
                <MapPin size={16} className="text-emerald-500" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-xs">
            © {currentYear} Bidzone Nepal. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
