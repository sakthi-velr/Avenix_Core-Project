import logo from '../../assets/logo.png';
import { ExternalLink } from 'lucide-react';


export default function Footer() {
  return (
    <footer className="relative bg-[#001619] border-t border-brand-green/10 pt-20 pb-12 overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16">
          
          {/* Column 1: Brand details */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 select-none">
              <img src={logo} alt="Avenix Core Logo" className="h-8 w-8 object-contain" />
              <span className="font-display text-2xl tracking-wider text-white">
                AVENIX <span className="text-brand-green">CORE</span>
              </span>
            </div>
            <p className="text-brand-textSecondary text-sm leading-relaxed max-w-sm font-body">
              Avenix Core is a premium creative digital studio combining modern design with practical technology. Turning ideas into digital experiences.
            </p>
            <span className="text-xs font-semibold text-brand-lime font-body tracking-wider block uppercase select-none">
              “Ideas into Digital Experiences.”
            </span>
          </div>

          {/* Column 2: Contact details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-body select-none">
              Get in Touch
            </h4>
            <ul className="space-y-3.5">
              <li className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-lime hover:text-white transition-colors tracking-wider font-body uppercase"
                >
                  Start a Project <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-brand-green/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-textMuted select-none">
          <span className="font-body">
            © {new Date().getFullYear()} AVENIX CORE. All rights reserved.
          </span>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-white transition-colors font-body">Privacy Policy</a>
            <a href="#about" className="hover:text-white transition-colors font-body">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
