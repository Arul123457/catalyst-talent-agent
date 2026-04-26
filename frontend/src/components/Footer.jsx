import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <Zap className="w-6 h-6 text-green-400 transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold text-white">Catalyst</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered talent scouting that finds, engages, and ranks candidates in minutes.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/scout" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Scout Candidates
                </Link>
              </li>
              <li>
                <Link to="/shortlist" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  View Shortlist
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-green-500/10 border border-gray-700 hover:border-green-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-400 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-green-500/10 border border-gray-700 hover:border-green-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-400 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-green-500/10 border border-gray-700 hover:border-green-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-400 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-green-500/10 border border-gray-700 hover:border-green-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-400 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Catalyst. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Built with</span>
            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-semibold border border-green-500/30">
              AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
