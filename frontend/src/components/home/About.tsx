import { useState, useEffect } from 'react';
import { Compass, Lightbulb, Users, CheckCircle } from 'lucide-react';
import { getPortfolioStats, type Stats } from '../../services/storage';

const principles = [
  {
    num: '01',
    title: 'Creative Thinking',
    description: 'We approach every challenge with fresh perspectives, crafting unique digital identities that capture your brand essence.',
    icon: Lightbulb
  },
  {
    num: '02',
    title: 'Practical Solutions',
    description: 'Aesthetics mean nothing without function. We build systems that are stable, fast, and solve real business problems.',
    icon: Compass
  },
  {
    num: '03',
    title: 'User-Friendly Design',
    description: 'We put your users first, developing intuitive interfaces that deliver smooth, accessible, and delightful experiences.',
    icon: Users
  },
  {
    num: '04',
    title: 'Quality Execution',
    description: 'From clean code to perfect pixel alignments, our engineering standards guarantee a highly polished end product.',
    icon: CheckCircle
  }
];

export default function About() {
  const [stats, setStats] = useState<Stats>({
    completedProjects: '20+',
    happyClients: '10+',
    servicesCount: '5+',
    creativeFocus: '100%'
  });

  useEffect(() => {
    getPortfolioStats()
      .then(setStats)
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  return (
    <section id="about" className="relative pt-0 pb-16 bg-black overflow-hidden border-t border-brand-dark-green/10">
      {/* - ABOUT SECTION - */}
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-brand-green/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          {/* Section Label */}
          <div className="flex items-center justify-center gap-3 mb-6 select-none animate-text animate-fade-up stagger-1">
            <span className="h-[1px] w-8 bg-brand-green/50" />
            <span className="text-[11px] tracking-[0.25em] font-bold text-brand-green uppercase">
              ABOUT AVENIX CORE
            </span>
            <span className="h-[1px] w-8 bg-brand-green/50" />
          </div>

          {/* Main Heading */}
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-none text-white tracking-tight uppercase mb-8 select-none">
            <span className="block animate-text animate-fade-up stagger-2">BUILT AROUND</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-green text-glow-green block animate-text animate-fade-up stagger-3">
              YOUR VISION
            </span>
          </h2>

          {/* Quote Accent Box */}
          <div className="border-l-2 border-brand-lime pl-6 py-2 max-w-xl mx-auto text-left mb-10 select-none animate-text animate-fade-up stagger-4">
            <p className="text-xl sm:text-2xl font-bold font-body text-brand-lime tracking-wide leading-snug uppercase">
              "WE DON'T JUST MAKE IT LOOK GOOD. WE MAKE IT WORK."
            </p>
          </div>

          {/* Description Paragraph */}
          <p className="text-brand-textSecondary text-lg sm:text-xl leading-relaxed font-body max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto mb-12 text-center animate-text animate-fade-up stagger-5">
            Avenix Core is a creative digital studio helping businesses, creators and individuals build their digital presence through websites, visual design, digital experiences and creative solutions.
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-16 border-t border-b border-brand-green/10 py-8 bg-brand-dark-2/10 backdrop-blur-sm rounded-2xl select-none">
            <div className="text-center p-4">
              <div className="font-display text-4xl sm:text-5xl text-brand-lime text-glow-lime mb-2">{stats.completedProjects}</div>
              <div className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">Projects Completed</div>
            </div>
            <div className="text-center p-4">
              <div className="font-display text-4xl sm:text-5xl text-brand-green text-glow-green mb-2">{stats.happyClients}</div>
              <div className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">Happy Clients</div>
            </div>
            <div className="text-center p-4">
              <div className="font-display text-4xl sm:text-5xl text-brand-lime text-glow-lime mb-2">{stats.servicesCount}</div>
              <div className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">Services</div>
            </div>
            <div className="text-center p-4">
              <div className="font-display text-4xl sm:text-5xl text-brand-green text-glow-green mb-2">{stats.creativeFocus}</div>
              <div className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">Creative Focus</div>
            </div>
          </div>

          {/* Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
            {principles.map((principle, idx) => {
              const IconComponent = principle.icon;
              return (
                <div
                  key={principle.num}
                  className="rounded-glow-card-wrapper group relative"
                  style={{ '--card-delay': `${idx * -2.5}s` } as React.CSSProperties}
                >
                  {/* Glow Aura */}
                  <div className="rounded-glow-card-aura" />

                  {/* Card Body */}
                  <div 
                    className="rounded-glow-card group border border-brand-green/10 bg-brand-dark-2/20 hover:border-brand-lime/30 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-left h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-3xl text-brand-lime/30 group-hover:text-brand-lime transition-colors duration-300">
                        {principle.num}
                      </span>
                      <div className="p-2.5 rounded-xl bg-brand-dark-green/15 text-brand-green border border-brand-green/5 group-hover:border-brand-lime/20 group-hover:text-brand-lime transition-colors duration-300">
                        <IconComponent className="w-5 h-5 stroke-[1.5]" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 tracking-wide font-body">
                      {principle.title}
                    </h3>
                    <p className="text-brand-textMuted text-sm leading-relaxed font-body">
                      {principle.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
