import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { type Project, getPortfolioProjects } from '../../services/storage';

const filterCategories = [
  { name: 'ALL', value: 'ALL' },
  { name: 'WEBSITES', value: 'Websites' },
  { name: 'POSTERS', value: 'Posters' },
  { name: 'WEB INVITATIONS', value: 'Web Invitations' },
  { name: 'DIGITAL MARKETING', value: 'Digital Marketing' }
];

interface WorkCardProps {
  project: Project;
  idx: number;
  isLarge: boolean;
  openProject: (project: Project) => void;
}

function WorkCard({ project, idx, isLarge, openProject }: WorkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setRevealed(true);
      }, idx * 150 + 800);
      return () => clearTimeout(timer);
    }
  }, [isInView, idx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normX = x / rect.width;
    const normY = y / rect.height;

    const maxTilt = 5;
    const rotateX = -normY * maxTilt * 2;
    const rotateY = normX * maxTilt * 2;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const baseTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  const currentTransform = isHovered ? transformStyle : baseTransform;

  const cardStyle = {
    '--card-delay': `${idx * -1.2}s`,
    opacity: isInView ? 1 : 0,
    transform: revealed 
      ? currentTransform 
      : (isInView 
         ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)' 
         : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(0.97, 0.97, 0.97) translateY(24px)'),
    transitionProperty: revealed ? 'transform' : 'opacity, transform',
    transitionDuration: revealed ? (isHovered ? '0.15s' : '0.6s') : '0.8s, 0.8s',
    transitionTimingFunction: revealed 
      ? (isHovered ? 'ease-out' : 'cubic-bezier(0.25, 1, 0.5, 1)') 
      : 'cubic-bezier(0.25, 1, 0.5, 1), cubic-bezier(0.25, 1, 0.5, 1)',
    transitionDelay: revealed ? '0ms' : (isInView ? `${idx * 150}ms` : '0ms'),
  } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`slanted-card-wrapper group flex flex-col ${
        isLarge ? 'lg:col-span-2' : 'lg:col-span-1'
      }`}
      style={cardStyle}
    >
      <div className="slanted-card-glow-aura" />
      <div
        onClick={() => openProject(project)}
        className="slanted-card-border work-card-border cursor-pointer transition-all duration-300 w-full h-full flex flex-col justify-between"
      >
        <div className="slanted-card-content bg-brand-dark-2/80 p-6 flex flex-col justify-between h-full overflow-hidden">
          <div className="light-sweep-overlay" />
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-6 bg-black border border-brand-green/5">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-[800ms] cubic-bezier(0.25, 1, 0.5, 1) group-hover:scale-[1.06]"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm border border-brand-green/20 px-3 py-1 rounded-full text-[10px] font-bold text-brand-green uppercase tracking-wide">
              {project.category}
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-lime transition-all duration-300 transform group-hover:-translate-y-1 font-body uppercase">
                {project.title}
              </h3>
              <p className="text-brand-textSecondary text-sm leading-relaxed mb-4 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:text-white/95 font-body">
                {project.shortDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {project.technologies.slice(0, 3).map((tech, tIdx) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 text-[10px] font-bold text-brand-textMuted bg-brand-dark-1 border border-brand-green/5 rounded tech-tag-animate"
                  style={{ '--tag-index': tIdx } as React.CSSProperties}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span 
                  className="px-2.5 py-0.5 text-[10px] font-bold text-brand-textMuted bg-brand-dark-1 border border-brand-green/5 rounded tech-tag-animate"
                  style={{ '--tag-index': 3 } as React.CSSProperties}
                >
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-brand-green/5 pt-4">
            <span className="text-xs font-bold text-brand-green group-hover:text-brand-lime transition-colors duration-200">
              VIEW PROJECT DETAILS
            </span>
            <span className="text-brand-green/60 text-lg font-sans transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-brand-lime">
              ↗
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  useEffect(() => {
    getPortfolioProjects()
      .then(setProjectsList)
      .catch(err => console.error('Failed to load projects:', err));
  }, []);

  const filteredProjects = activeFilter === 'ALL'
    ? projectsList
    : projectsList.filter(p => p.category === activeFilter);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = projectsList.findIndex(p => p.slug === selectedProject.slug);
    const nextIndex = (currentIndex + 1) % projectsList.length;
    setSelectedProject(projectsList[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = projectsList.findIndex(p => p.slug === selectedProject.slug);
    const prevIndex = (currentIndex - 1 + projectsList.length) % projectsList.length;
    setSelectedProject(projectsList[prevIndex]);
  };

  return (
    <section id="work" className="relative pt-0 pb-16 bg-black overflow-hidden border-t border-brand-dark-green/10">
      {/* Background glow overlay */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-lime/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 select-none">
          <div className="flex items-center justify-center gap-3 mb-4 animate-text animate-blur-clear stagger-1">
            <span className="h-[1px] w-8 bg-brand-green/50" />
            <span className="text-[11px] tracking-[0.25em] font-bold text-brand-green uppercase">
              PORTFOLIO
            </span>
            <span className="h-[1px] w-8 bg-brand-green/50" />
          </div>
          <h2 className="font-display text-5xl sm:text-6xl tracking-tight text-white mb-4 uppercase animate-text animate-blur-clear stagger-2">
            MADE TO BE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-green text-glow-green">SEEN.</span>
          </h2>
          <p className="text-brand-textSecondary text-base sm:text-lg max-w-md mx-auto leading-relaxed animate-text animate-blur-clear stagger-3">
            A selection of projects, experiments and digital experiences we've brought to life.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap justify-center sm:gap-3 gap-2 mb-16 select-none">
          {filterCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveFilter(cat.value)}
              className={`sm:px-6 sm:py-2.5 px-3.5 py-1.5 rounded-full sm:text-xs text-[10px] font-bold tracking-wider transition-all duration-300 sm:min-h-[44px] min-h-[36px] ${
                activeFilter === cat.value
                  ? 'bg-gradient-to-r from-brand-lime to-brand-green text-black shadow-[0_0_15px_rgba(116,255,158,0.25)]'
                  : 'bg-brand-dark-2/40 border border-brand-green/10 text-brand-textSecondary hover:border-brand-green/40 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Asymmetric / Editorial Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => {
            const isLarge = idx % 4 === 0 || idx % 4 === 3;
            return (
              <WorkCard
                key={project.slug}
                project={project}
                idx={idx}
                isLarge={isLarge}
                openProject={openProject}
              />
            );
          })}
        </div>

      </div>

      {/* Details Overlay Modal (/work/[slug]) */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-brand-dark-2 border border-brand-green/20 max-w-4xl w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,200,83,0.15)] max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-green/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
              <span className="text-xs font-bold text-brand-green uppercase tracking-widest font-body">
                /work/{selectedProject.slug}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={closeProject}
                  className="p-2 rounded-full hover:bg-brand-dark-green/10 text-brand-textSecondary hover:text-white transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-grow">
              
              {/* Back to Work Link */}
              <button
                onClick={closeProject}
                className="inline-flex items-center text-xs font-bold text-brand-green hover:text-brand-lime transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO WORK
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Image / Gallery */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl border border-brand-green/10 bg-black">
                    <img
                      src={selectedProject.thumbnail}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Gallery row */}
                  {selectedProject.gallery.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProject.gallery.map((img, i) => (
                        <div key={i} className="aspect-[16/10] overflow-hidden rounded-lg border border-brand-green/10 bg-black">
                          <img
                            src={img}
                            alt={`Gallery ${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Narrative Info */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <span className="text-xs font-bold text-brand-lime/80 uppercase tracking-widest font-body">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-body mt-1">
                      {selectedProject.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-brand-green uppercase tracking-wider font-body">Overview</h4>
                    <p className="text-brand-textSecondary text-sm leading-relaxed font-body">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-brand-green uppercase tracking-wider font-body">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-[11px] font-bold text-brand-textSecondary bg-brand-dark-1 border border-brand-green/10 rounded-full font-body"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project URL */}
                  {selectedProject.projectUrl && (
                    <div className="pt-4 border-t border-brand-green/10">
                      <a
                        href={selectedProject.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/30 text-brand-green font-bold text-sm tracking-wide transition-all duration-300 min-h-[44px]"
                      >
                        Visit Project <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer: Next/Prev Project Navigation */}
            <div className="px-6 py-4 border-t border-brand-green/10 bg-black/55 backdrop-blur-sm flex items-center justify-between sticky bottom-0 z-10">
              <button
                onClick={handlePrevProject}
                className="inline-flex items-center px-4 py-2 text-xs font-bold text-brand-textSecondary hover:text-brand-green transition-colors duration-200 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> PREVIOUS PROJECT
              </button>
              <button
                onClick={handleNextProject}
                className="inline-flex items-center px-4 py-2 text-xs font-bold text-brand-textSecondary hover:text-brand-green transition-colors duration-200 min-h-[44px]"
              >
                NEXT PROJECT <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
