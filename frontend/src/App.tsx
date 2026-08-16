import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import About from './components/home/About';
import Services from './components/home/Services';
import Work from './components/home/Work';
import Feedback from './components/home/Feedback';
import Contact from './components/home/Contact';
import Footer from './components/layout/Footer';
import Admin from './components/home/Admin';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    const interval = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname);
      }
    }, 250);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(interval);
    };
  }, [currentPath]);

  // Trigger animations when the corresponding section enters the viewport
  useEffect(() => {
    if (currentPath === '/admin/portfolio') return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px', // Trigger slightly before it rises too high
      threshold: 0.02
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const animatedElements = document.querySelectorAll('.animate-text');
      animatedElements.forEach((el) => observer.observe(el));
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentPath]);

  if (currentPath === '/admin/portfolio') {
    return <Admin />;
  }

  return (
    <div className="min-h-screen bg-black text-brand-textPrimary flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Services />
        <Work />
        <Feedback />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
