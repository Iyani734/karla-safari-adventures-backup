import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ChevronUp, Camera } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import Destinations from '@/pages/DestinationsPage';
import DestinationDetailPage from '@/pages/DestinationDetailPage';
import ToursPage from '@/pages/ToursPage';
import TourDetailPage from '@/pages/TourDetailPage';
import ParkDetail from '@/pages/parkDetail';
import WriteReview from '@/pages/WriteReview';
import Activities from '@/components/Activities';
import GroupJoiningSafariModal from './components/GroupJoiningSafariModal';
import Gallery from './pages/Gallery';
import BlogIndex from '@/pages/BlogIndex';
import BlogPost from '@/pages/BlogPost';
import LegalPage from '@/pages/LegalPage';

const SAFARI_JOINING_POPUP_ENABLED = false;



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

  const buttonPosition = useMemo(() => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(segment => segment !== '');
    
    const isDestinationWithSection = pathSegments[0] === 'destinations';
    const isActivitySection = pathSegments[0] === 'activities';
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
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const [showSafariModal, setShowSafariModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);

 // ── Disable right-click, show toast & custom scrollbar ──────────────────────────
  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //     if (toastTimer.current) clearTimeout(toastTimer.current);
  //     setShowToast(true);
  //     toastTimer.current = setTimeout(() => setShowToast(false), 2500);
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);

  //   const style = document.createElement('style');
  //   style.id = 'custom-scrollbar-style';
  //   style.textContent = `
  //     ::-webkit-scrollbar {
  //       width: 20px;
  //     }
  //     ::-webkit-scrollbar-track {
  //       background: transparent;
  //     }
  //     ::-webkit-scrollbar-thumb {
  //       background: linear-gradient(to bottom, #ea580c, #c2410c);
  //       border-radius: 9999px;
  //       border: 4px solid transparent;
  //       background-clip: padding-box;
  //     }
  //     ::-webkit-scrollbar-thumb:hover {
  //       background: linear-gradient(to bottom, #f97316, #ea580c);
  //       background-clip: padding-box;
  //     }
  //     * {
  //       scrollbar-width: auto;
  //       scrollbar-color: #ea580c transparent;
  //     }
  //   `;
  //   document.head.appendChild(style);

  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //     document.getElementById('custom-scrollbar-style')?.remove();
  //     if (toastTimer.current) clearTimeout(toastTimer.current);
  //   };
  // }, []);

  // ── Safari modal timer ───────────────────────────────────────────────
  useEffect(() => {
    if (!SAFARI_JOINING_POPUP_ENABLED) return;

    const hasSeenModal = sessionStorage.getItem('hasSeenSafariModal');
    
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowSafariModal(true);
        sessionStorage.setItem('hasSeenSafariModal', 'true');
      }, 120000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy-policy" element={<LegalPage />} />
            <Route path="/terms-and-conditions" element={<LegalPage />} />
            <Route path="/refund-cancellation-policy" element={<LegalPage />} />
            <Route path="/cookie-policy" element={<LegalPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/refund-policy" element={<LegalPage />} />
            <Route path="/cancellation-policy" element={<LegalPage />} />
            <Route path="/cookies" element={<LegalPage />} />
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
        {SAFARI_JOINING_POPUP_ENABLED && (
          <GroupJoiningSafariModal
            isOpen={showSafariModal}
            onClose={() => setShowSafariModal(false)}
          />
        )}

        {/* ── Right-click protection toast ── */}
        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 rounded-full bg-[#3d1a00] border border-orange-500/40 px-5 py-3 shadow-xl shadow-black/40 whitespace-nowrap">
            <Camera className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="text-sm text-orange-100 font-medium">
              © Karla Safari Adventures — All images are protected
            </span>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
