import React, { useState, useEffect,useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ChevronUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import Destinations from '@/pages/DestinationsPage';
import DestinationDetailPage from '@/pages/DestinationDetailPage';
import ToursPage from '@/pages/ToursPage';
import TourDetailPage from '@/pages/TourDetailPage';
import ParkDetail from '@/pages/ParkDetail'
import WriteReview from '@/pages/WriteReview';
import Activities from '@/components/Activities';

// Add this after all your imports, before the ScrollToTopButton component


function ScrollToTopButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize button position based on location changes
  const buttonPosition = useMemo(() => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(segment => segment !== '');
    
    const isDestinationWithSection = 
      pathSegments[0] === 'destinations';
    const isActivitySection = 
      pathSegments[0] === 'activities';
    const isTourDetail = path.startsWith('/tours/') && path !== '/tours/' && path !== '/tours';
    
    if (isDestinationWithSection) {
      return 'bottom-[100px] lg:bottom-8 right-4';
    } else if (isTourDetail) {
      return 'bottom-[110px] lg:bottom-8 right-7';
    } else if (isActivitySection) {
      return 'bottom-[110px] lg:bottom-8 right-7';
    } else {
      return 'bottom-8 lg:bottom-8 right-6';
    }
  }, [location.pathname]); // Recalculate when pathname changes

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed ${buttonPosition} lg:right-8 z-50 group transition-all duration-300`}
          data-testid="button-scroll-top"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

            <div className="relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full p-2.5 lg:p-4 shadow-2xl border border-orange-400/30 backdrop-blur-sm transition-all duration-300">
              <div className="absolute inset-1 bg-gradient-to-r from-orange-300/20 to-red-400/20 rounded-full"></div>

              <ChevronUp className="w-7 h-7 lg:w-6 lg:h-6 text-white relative z-10 group-hover:animate-bounce" />

              <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap backdrop-blur-sm">
              Back to top
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
            </div>
          </div>
        </button>
      )}
    </>
  );
}


function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 scroll-smooth">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/destinations" element={<Destinations/>} />
            <Route path="/destinations/:country" element={<Destinations />} />
            <Route path="/destinations/:country/:section" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetailPage />} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="/parks" element={<ParkDetail />} />
            <Route path="/parks/:parkId/*" element={<ParkDetail />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tours/:tourId" element={<TourDetailPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

export default App;