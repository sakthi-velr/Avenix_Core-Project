import logo from '../../assets/logo.png';
import heroBg from '../../assets/hero-mountains-water.png';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-fit md:min-h-screen w-full flex items-center justify-between pt-[88px] pb-8 md:pt-[72px] md:pb-4 overflow-hidden bg-black">
      {/* Layer 1: Mountain + water background image (hidden on mobile, visible on desktop) */}
      <img
        src={heroBg}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0 hidden md:block"
        alt=""
        loading="eager"
      />

      {/* Layer 2: Dark Gradient / Readability Overlay (only on desktop) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none md:block hidden"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.50) 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.30) 100%)'
        }} 
      />

      {/* Layer 3: Dynamic Background Effects */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Deep dark green base glow */}
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-green/5 blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-lime/3 blur-[100px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-30">
        
        {/* Left Content Column (45% on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left"
             style={{ contentVisibility: 'auto' }}>
          
          {/* Tagline Label */}
          <div className="mb-6 self-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-green/30 bg-brand-dark-2/40 backdrop-blur-sm shadow-[0_0_15px_rgba(116,255,158,0.1)]">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
              <span className="text-[10px] tracking-[0.2em] font-bold text-brand-green uppercase">
                Digital Solutions
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-display text-7xl sm:text-8xl lg:text-[90px] leading-[0.9] tracking-tight text-white mb-6 uppercase select-none">
            We Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-green text-glow-green">
              Digital
            </span> <br />
            Experiences<span className="text-brand-lime">.</span>
          </h1>

          {/* Description */}
          <p className="text-brand-textSecondary text-base sm:text-lg max-w-md mb-8 leading-relaxed">
            Websites, designs, media and marketing solutions
            that help brands grow and stand out.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#services"
              className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-brand-lime to-brand-green hover:from-brand-lime-hover hover:to-brand-green text-black font-bold text-sm tracking-wide inline-flex items-center group transition-all duration-300 hover:shadow-[0_0_25px_rgba(242,255,88,0.4)] hover:-translate-y-0.5"
            >
              Explore Services
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-lg border border-brand-lime/30 bg-black/40 hover:border-brand-lime hover:bg-brand-lime/5 text-white font-semibold text-sm tracking-wide inline-flex items-center group transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Right Graphic Column (55% on desktop) */}
        <div className="lg:col-span-7 w-full h-[260px] sm:h-[360px] md:h-[500px] lg:h-[600px] relative flex items-center justify-center">
          
          {/* Logo Visual Container */}
          <div className="relative w-full h-full max-w-[280px] sm:max-w-[400px] md:max-w-[580px] flex items-center justify-center">
            
            {/* 1. Subtle green atmospheric glow */}
            <div className="absolute inset-0 bg-radial-glow rounded-full opacity-40 blur-[80px] pointer-events-none"
                 style={{
                   background: 'radial-gradient(circle, rgba(116, 255, 158, 0.15) 0%, transparent 70%)'
                 }} />

            {/* 2. Grid lines - Perspective fade-out */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                 style={{
                   backgroundImage: 'linear-gradient(rgba(116, 255, 158, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(116, 255, 158, 0.05) 1px, transparent 1px)',
                   backgroundSize: '40px 40px',
                   backgroundPosition: 'center',
                   maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
                   WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
                 }} />

            {/* 3. Thin circular orbital rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full absolute animate-spin-slow opacity-60" viewBox="0 0 500 500" fill="none">
               
                {/* Inner ring */}
                <circle cx="250" cy="250" r="130" stroke="#74FF9E" strokeWidth="1" strokeDasharray="4 6" />
                {/* Tiny glowing nodes on rings */}
                <circle cx="250" cy="120" r="3" fill="#74FF9E" className="shadow-lg" />
                <circle cx="380" cy="250" r="3" fill="#F2FF58" className="shadow-lg" />
                <circle cx="250" cy="380" r="3" fill="#74FF9E" className="shadow-lg" />
                <circle cx="120" cy="250" r="3" fill="#F2FF58" className="shadow-lg" />
              </svg>
            </div>

            {/* 5. Avenix Core 3D A Logo */}
            <div className="relative z-10 w-[240px] sm:w-[320px] md:w-[410px] aspect-square flex items-center justify-center">
              <img 
                src={logo} 
                alt="Avenix Core 3D Graphic" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(116,255,158,0.25)] select-none pointer-events-none"
              />
            </div>


            {/* 7. Water reflection beneath the terrain */}
            <div className="absolute bottom-[-40px] w-[240px] sm:w-[320px] md:w-[410px] h-[65px] opacity-25 filter blur-md pointer-events-none scale-y-[-0.6] rotate-180 z-10 overflow-hidden">
              <img 
                src={logo} 
                alt="Reflection" 
                className="w-full h-full object-contain brightness-50"
              />
            </div>
            {/* Green horizontal reflection line overlay */}
            <div className="absolute bottom-[5px] w-[180px] md:w-[220px] h-[2px] bg-gradient-to-r from-transparent via-brand-green/40 to-transparent blur-[1px] z-30" />
            
          </div>
        </div>

      </div>
    </section>
  );
}
