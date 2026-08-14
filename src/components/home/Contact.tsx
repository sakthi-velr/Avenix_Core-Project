import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Send, CheckCircle2, ArrowUp } from 'lucide-react';
import { submitContactInquiry } from '../../services/storage';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Contact() {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Website Development');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  
  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Scroll reveal setup
  const formContainerRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        setShowBackToTop(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    const formObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFormVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (contactSectionRef.current) {
      sectionObserver.observe(contactSectionRef.current);
    }
    if (formContainerRef.current) {
      formObserver.observe(formContainerRef.current);
    }

    return () => {
      sectionObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const heroSection = document.getElementById('home');
    if (heroSection) {
      const navbar = document.querySelector('nav');
      let offset = 0;
      if (navbar) {
        const headerBar = navbar.querySelector('.max-w-7xl');
        offset = headerBar ? (headerBar as HTMLElement).offsetHeight : navbar.offsetHeight;
      }
      
      const elementPosition = heroSection.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition >= 0 ? offsetPosition : 0,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Spam bot caught
      setIsSuccess(true);
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    // Call backend API first to persist inquiry
    submitContactInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service,
      message: message.trim()
    })
      .then(() => {
        // Create WhatsApp message template
        const formattedMessage = `New Inquiry — Avenix Core

Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${phone.trim() || 'N/A'}
Service: ${service}
Message: ${message.trim()}`;

        // Open WhatsApp in a new tab with international pre-fill format
        const waUrl = `https://wa.me/916369468554?text=${encodeURIComponent(formattedMessage)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');

        setIsSubmitting(false);
        setIsSuccess(true);
        
        // Reset Form
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      })
      .catch((err) => {
        console.error('Contact log failed:', err);
        setIsSubmitting(false);
        alert('Something went wrong. Please try again.');
      });
  };

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <section ref={contactSectionRef} id="contact" className="relative pt-0 pb-16 bg-black overflow-hidden border-t border-brand-dark-green/10">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-lime/2 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Section Label */}
        <div className="flex items-center justify-center gap-3 mb-6 w-full select-none animate-text animate-fade-down stagger-1">
          <span className="h-[1px] w-8 bg-brand-green/50" />
          <span className="text-[11px] tracking-[0.25em] font-bold text-brand-green uppercase">
            CONTACT US
          </span>
          <span className="h-[1px] w-8 bg-brand-green/50" />
        </div>

        {/* Main Heading */}
        <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-none text-white tracking-tight uppercase text-center select-none mb-12">
          <span className="block animate-text animate-fade-down stagger-2">LET'S BUILD</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-green text-glow-green block animate-text animate-fade-down stagger-3">
            SOMETHING.
          </span>
        </h2>

        {/* Contact Form Container with entrance reveal */}
        <div
          ref={formContainerRef}
          className="w-full max-w-2xl bg-brand-dark-2/40 border border-brand-green/10 p-8 sm:p-10 rounded-2xl backdrop-blur-sm transition-all duration-[600ms] ease-out mb-12 text-left"
          style={{
            opacity: isFormVisible ? 1 : 0,
            transform: prefersReducedMotion 
              ? 'none' 
              : (isFormVisible ? 'translateY(0)' : 'translateY(15px)'),
          }}
        >
          <div className="mb-6 select-none">
            <h3 className="text-xs font-bold text-brand-green tracking-[0.2em] uppercase mb-2 animate-text animate-fade-down stagger-4">
              CONTACT FORM
            </h3>
            <p className="text-brand-textSecondary text-sm sm:text-base leading-relaxed font-body animate-text animate-fade-down stagger-5">
              Have an idea, project or opportunity? Tell us what you're thinking.
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center py-16 space-y-4 select-none">
              <CheckCircle2 className="w-16 h-16 text-brand-green mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-white font-body uppercase tracking-wide">Inquiry Sent Successfully!</h3>
              <p className="text-brand-textSecondary text-base leading-relaxed max-w-md mx-auto font-body">
                Thank you! Your inquiry details have been composed. We will review your project details and get back to you shortly.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-bold tracking-widest hover:bg-brand-green/20 transition-all min-h-[44px]"
              >
                SEND NEW INQUIRY
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Honeypot field (hidden from users, exposes spam bots) */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body min-h-[44px] contact-input"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="contact-email" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body min-h-[44px] contact-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="contact-phone" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Phone (Optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your Phone Number"
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body min-h-[44px] contact-input"
                  />
                </div>

                {/* Service selection dropdown */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="contact-service" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Service Dropdown
                  </label>
                  <select
                    id="contact-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body min-h-[44px] cursor-pointer contact-input"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="Poster Making">Poster Making</option>
                    <option value="Web Invitation">Web Invitation</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="contact-message" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                  Tell us about your project *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your goals, requirements, or time constraints..."
                  className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body contact-input"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-brand-lime to-brand-green hover:shadow-[0_0_20px_rgba(242,255,88,0.3)] text-black font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2 inquiry-btn"
              >
                {isSubmitting ? (
                  'SENDING INQUIRY...'
                ) : (
                  <>
                    SEND INQUIRY <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Details / Navigation below the form */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 select-none">
          {/* Email */}
          <a
            href="mailto:avenixc@gmail.com"
            className="flex items-center gap-4 p-4 border border-brand-green/5 bg-brand-dark-2/40 hover:border-brand-green/30 hover:bg-brand-dark-green/5 hover:shadow-[0_0_15px_rgba(116,255,158,0.15)] rounded-2xl transition-all duration-300 min-h-[44px]"
          >
            <div className="p-3 bg-brand-dark-green/10 border border-brand-green/10 text-brand-green rounded-xl flex-shrink-0">
              <Mail className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block font-body">
                EMAIL US
              </span>
              <span className="text-sm font-semibold text-white tracking-wide font-body block truncate max-w-[170px] sm:max-w-none">
                avenixc@gmail.com
              </span>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+916369468554"
            className="flex items-center gap-4 p-4 border border-brand-green/5 bg-brand-dark-2/40 hover:border-brand-green/30 hover:bg-brand-dark-green/5 hover:shadow-[0_0_15px_rgba(116,255,158,0.15)] rounded-2xl transition-all duration-300 min-h-[44px]"
          >
            <div className="p-3 bg-brand-dark-green/10 border border-brand-green/10 text-brand-green rounded-xl flex-shrink-0">
              <Phone className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block font-body">
                CALL US
              </span>
              <span className="text-sm font-semibold text-white tracking-wide font-body block">
                +91 6369468554
              </span>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/avenix_core?igsh=eTIyd2N2ZWU5ejdr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-brand-green/5 bg-brand-dark-2/40 hover:border-brand-green/30 hover:bg-brand-dark-green/5 hover:shadow-[0_0_15px_rgba(116,255,158,0.15)] rounded-2xl transition-all duration-300 min-h-[44px]"
          >
            <div className="p-3 bg-brand-dark-green/10 border border-brand-green/10 text-brand-green rounded-xl flex-shrink-0">
              <InstagramIcon className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block font-body">
                INSTAGRAM
              </span>
              <span className="text-sm font-semibold text-white tracking-wide font-body block">
                @avenix_core
              </span>
            </div>
          </a>
        </div>

      </div>

      {/* Back-to-Hero Button (placed absolutely at the bottom-right of the section wrapper) */}
      <div className={`absolute bottom-8 right-6 md:right-12 z-20 transition-all duration-500 transform ${
        showBackToTop 
          ? 'opacity-100 scale-100 pointer-events-auto' 
          : 'opacity-0 scale-75 pointer-events-none'
      }`}>
        <button
          onClick={scrollToTop}
          className="group w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-black border border-brand-green/30 text-brand-green hover:text-white hover:scale-[1.03] transition-all duration-300 circular-glow-pulse cursor-pointer"
          aria-label="Back to Hero"
        >
          <ArrowUp className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </div>
    </section>
  );
}
