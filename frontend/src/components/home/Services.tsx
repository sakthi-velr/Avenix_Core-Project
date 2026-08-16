import React from 'react';
import { Code, Image, Calendar, Target } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slogan: string;
  description: string;
  offerings: string[];
  icon: React.ComponentType<any>;
  span: string; // for asymmetric desktop layout
}

const servicesList: Service[] = [
  {
    id: '01',
    title: 'WEBSITE DEVELOPMENT',
    slogan: 'WE BUILD WEBSITES THAT WORK FOR YOU.',
    description: 'Websites built to represent your brand and connect with your audience.',
    offerings: ['Landing Pages', 'Business Websites', 'Portfolio Websites', 'E-commerce Websites', 'Custom Web Applications'],
    icon: Code,
    span: 'lg:col-span-2'
  },
  {
    id: '02',
    title: 'POSTER MAKING',
    slogan: 'MAKE YOUR MESSAGE IMPOSSIBLE TO MISS.',
    description: 'Creative visuals that communicate your message at a glance.',
    offerings: ['Social Media Posters', 'Promotional Posters', 'Event Posters', 'Business Posters', 'Campaign Creatives'],
    icon: Image,
    span: 'lg:col-span-1'
  },
  {
    id: '03',
    title: 'WEB INVITATION',
    slogan: 'INVITATIONS THAT FEEL LIKE AN EXPERIENCE.',
    description: 'Interactive invitations made for modern celebrations and special moments.',
    offerings: ['Wedding Invitations', 'Birthday invites', 'Events Coordinator', 'Corporate Invites', 'Special Occasions'],
    icon: Calendar,
    span: 'lg:col-span-1'
  },
  {
    id: '04',
    title: 'DIGITAL MARKETING',
    slogan: 'TURN ATTENTION INTO CONNECTION.',
    description: 'Digital strategies and creative content that help your brand reach people.',
    offerings: ['Social Media Strategy', 'Content Planning', 'Campaign Support', 'Brand Promotion', 'Digital Presence'],
    icon: Target,
    span: 'lg:col-span-2'
  }
];

export default function Services() {
  return (
    <section id="services" className="relative pt-0 pb-16 bg-black overflow-hidden border-t border-brand-dark-green/10">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green/3 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-20 text-center select-none flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-4 animate-text animate-slide-left stagger-1">
            <span className="h-[1px] w-8 bg-brand-green/50" />
            <span className="text-[11px] tracking-[0.25em] font-bold text-brand-green uppercase">
              SERVICES
            </span>
            <span className="h-[1px] w-8 bg-brand-green/50" />
          </div>
          <h2 className="font-display text-5xl sm:text-6xl tracking-tight text-white mb-4 uppercase animate-text animate-slide-right stagger-2">
            WHAT WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-green text-glow-green">CREATE.</span>
          </h2>
          <p className="text-brand-textSecondary text-base sm:text-lg max-w-md mx-auto leading-relaxed animate-text animate-slide-left stagger-3">
            From first idea to final experience, we create digital solutions designed around your needs.
          </p>
        </div>

        {/* Asymmetric Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`slanted-card-wrapper group relative ${service.span}`}
                style={{ '--card-delay': `${idx * -1.6}s` } as React.CSSProperties}
              >
                {/* Glow Aura */}
                <div className="slanted-card-glow-aura" />
                
                {/* Card Border */}
                <div 
                  className="slanted-card-border transition-all duration-300 hover:scale-[1.01] cursor-pointer w-full h-full"
                >
                  <div className="slanted-card-content bg-brand-dark-2/95 p-8 flex flex-col justify-between h-full min-h-[300px]">
                    
                    {/* Top: Icon and Index */}
                    <div className="flex items-start justify-between mb-8">
                      <span className="text-brand-green/40 text-sm font-semibold font-body tracking-wider">
                        {service.id}
                      </span>
                      <div className="p-3.5 bg-brand-dark-green/10 border border-brand-green/10 rounded-xl text-brand-green group-hover:text-brand-lime group-hover:border-brand-lime/30 transition-all duration-300">
                        <IconComponent className="w-6 h-6 stroke-[1.5]" />
                      </div>
                    </div>

                    {/* Middle: Title, Slogan, and Offerings */}
                    <div className="flex-grow flex flex-col justify-center mb-8">
                      <h3 className="text-xl font-bold tracking-wide text-white font-body group-hover:text-brand-lime group-hover:translate-x-1 transition-all duration-300 mb-2 uppercase">
                        {service.title}
                      </h3>
                      <p className="text-xs font-semibold text-brand-lime/80 font-body tracking-wider mb-4 uppercase">
                        {service.slogan}
                      </p>
                      <p className="text-brand-textSecondary text-sm leading-relaxed mb-5 font-body">
                        {service.description}
                      </p>
                      
                      {/* Offerings list as custom tags */}
                      <div className="flex flex-wrap gap-2">
                        {service.offerings.map((offering, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 text-[11px] font-semibold text-brand-textSecondary bg-brand-dark-1 border border-brand-green/5 rounded-full group-hover:border-brand-lime/10 group-hover:text-white transition-all duration-300 font-body"
                          >
                            {offering}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: CTA Action */}
                    <div className="flex items-center justify-between border-t border-brand-green/5 pt-4">
                      <span className="text-xs font-bold text-brand-green tracking-wider group-hover:text-brand-lime transition-colors duration-300">
                        DISCOVER MORE
                      </span>
                      <span className="text-brand-green/60 text-lg font-sans transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-brand-lime">
                        ↗
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
