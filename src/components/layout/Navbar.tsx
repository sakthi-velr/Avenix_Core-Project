import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.png';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#work' },
  { name: 'Feedback', href: '#feedback' },
  { name: 'Contact', href: '#contact' },
];

function getNavIcon(name: string) {
  switch (name) {
    case 'Home':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#nav-icon-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'About':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#nav-icon-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'Services':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#nav-icon-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'Work':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#nav-icon-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'Feedback':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#nav-icon-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'Contact':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#nav-icon-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#home');
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLinkClick = (href: string) => {
    setActiveHash(href);
    isClickScrolling.current = true;
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 850);
  };

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        const headerBar = navbar.querySelector('.max-w-7xl');
        const height = headerBar ? (headerBar as HTMLElement).offsetHeight : navbar.offsetHeight;
        
        let borderHeight = 0;
        const style = window.getComputedStyle(navbar);
        if (style.borderBottomWidth && style.borderBottomWidth !== '0px') {
          borderHeight = parseFloat(style.borderBottomWidth);
        }
        
        document.documentElement.style.setProperty('--navbar-height', `${height + borderHeight}px`);
      }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    
    const timer = setTimeout(updateNavbarHeight, 150);

    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (!isClickScrolling.current) {
        setActiveHash(window.location.hash || '#home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initial check for hash
    if (window.location.hash) {
      setActiveHash(window.location.hash);
    }

    // Set up intersection observer for scroll spy
    const sections = navLinks.map(link => document.querySelector(link.href));
    
    const observerOptions = {
      root: null,
      rootMargin: '-67px 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isClickScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            setActiveHash(`#${id}`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-brand-dark-green/20">
      {/* Global Shared SVG Gradients */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="nav-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#74ff9e" />
            <stop offset="100%" stopColor="#f2ff58" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-6 h-[66px] flex items-center justify-between">
        
        {/* Brand Logo and Text */}
        <a href="#home" onClick={() => handleLinkClick('#home')} className="flex items-center space-x-3 cursor-pointer min-h-[44px]">
          <img src={logo} alt="Avenix Core Logo" className="h-8 w-8 object-contain" />
          <span className="font-display text-2xl tracking-wider text-white">
            AVENIX <span className="text-brand-green">CORE</span>
          </span>
        </a>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`relative text-sm font-semibold uppercase tracking-wider transition-colors duration-200 py-2 group flex items-center ${
                  isActive ? 'text-brand-green' : 'text-brand-textSecondary hover:text-brand-green'
                }`}
              >
                <div className={`hidden w-8 h-8 rounded-lg items-center justify-center mr-2 transition-all duration-300 bg-brand-dark-2/40 backdrop-blur-sm border ${
                  isActive 
                    ? 'border-brand-green/50 shadow-[0_0_12px_rgba(116,255,158,0.2)] bg-brand-green/5 scale-[1.03]' 
                    : 'border-brand-green/10 group-hover:border-brand-green/40 group-hover:shadow-[0_0_10px_rgba(116,255,158,0.1)] group-hover:scale-[1.03] group-hover:bg-brand-green/5'
                }`}>
                  {getNavIcon(link.name)}
                </div>
                <span>{link.name}</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-brand-lime transition-transform duration-300 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Right CTA Button (Desktop) */}
        <div className="hidden md:block">
          <a
            href="#contact"
            onClick={() => handleLinkClick('#contact')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-lime to-brand-green text-black font-semibold text-sm hover:shadow-[0_0_20px_rgba(242,255,88,0.4)] transition-all duration-300 hover:-translate-y-0.5 min-h-[44px]"
          >
            Let's Talk
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-brand-textPrimary hover:text-brand-green transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Links Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-brand-dark-green/20 px-6 py-4 flex flex-col space-y-3">
          {navLinks.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  handleLinkClick(link.href);
                  setIsOpen(false);
                }}
                className={`text-base font-semibold tracking-wide py-2.5 flex items-center border-b border-brand-dark-green/10 last:border-b-0 min-h-[44px] group transition-colors duration-200 ${
                  isActive ? 'text-brand-green' : 'text-brand-textSecondary hover:text-brand-green'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 bg-brand-dark-2/40 backdrop-blur-sm border ${
                  isActive 
                    ? 'border-brand-green/50 shadow-[0_0_12px_rgba(116,255,158,0.2)] bg-brand-green/5 scale-[1.03]' 
                    : 'border-brand-green/10 group-hover:border-brand-green/40 group-hover:shadow-[0_0_10px_rgba(116,255,158,0.1)] group-hover:scale-[1.03] group-hover:bg-brand-green/5'
                }`}>
                  {getNavIcon(link.name)}
                </div>
                <span>{link.name}</span>
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={() => {
              handleLinkClick('#contact');
              setIsOpen(false);
            }}
            className="w-full text-center py-3.5 rounded-lg bg-gradient-to-r from-brand-lime to-brand-green text-black font-bold text-sm block min-h-[44px]"
          >
            Let's Talk
          </a>
        </div>
      )}
    </nav>
  );
}
