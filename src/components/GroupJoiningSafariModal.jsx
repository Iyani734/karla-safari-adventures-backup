import React, { useState,useRef } from 'react';
import { X } from 'lucide-react';
import emailjs from '@emailjs/browser';
const GroupJoiningSafariModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const form = useRef(); 
  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideSafariModal', 'true');
    }
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setSubmitted(true);
    setTimeout(() => {
      if (dontShowAgain) {
        localStorage.setItem('hideSafariModal', 'true');
      }
      onClose();
    }, 5000);
  };

const sendEmail = (e) => {

    e.preventDefault();

    emailjs
      .sendForm('service_bdywzc3', 'template_7l5efx9', form.current, {
        publicKey: 'zhmYd55Xyz63PI0qH',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );

       e.preventDefault();
    console.log('Email submitted:', email);
    setSubmitted(true);
    setTimeout(() => {
      if (dontShowAgain) {
        localStorage.setItem('hideSafariModal', 'true');
      }
      onClose();
    }, 5000);
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className="absolute inset-0  backdrop-blur-[3px]"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-full md:max-w-xl lg:max-w-2xl bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col h-[50vh] md:h-[75vh] lg:h-[75vh]">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 bg-white hover:bg-amber-50 rounded-full p-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 group"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-amber-900 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="relative flex-1 overflow-hidden">
          <img
            src="/migration.jpg"
            alt="Safari Migration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-transparent to-amber-950/70 z-10" />

          <div className="absolute top-3 sm:top-4 left-3 sm:left-6 z-20 animate-shake-interval">
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-lg px-2.5 py-1 shadow-2xl border-2 border-amber-200 transform hover:scale-110 transition-transform duration-300">
              <div className="relative">
                <div className="absolute -inset-1 bg-yellow-400 rounded-lg blur opacity-30"></div>
                <div className="relative">
                  <p className="text-white text-center">
                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent drop-shadow-lg">$2,999</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-amber-50 mb-2 drop-shadow-2xl uppercase tracking-wider" style={{ textShadow: '3px 3px 12px rgba(120,53,15,0.9), 0 0 20px rgba(217,119,6,0.5)' }}>
              Group Joining Safari
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-300 font-bold drop-shadow-lg max-w-2xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
              Experience the Great Migration - Kenya
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-amber-100 font-semibold mt-2" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
              August 11 – August 15th, 2024
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 text-center pb-4 sm:pb-5 md:pb-6 px-4">
            <div className="inline-block bg-gradient-to-r from-green-800/90 to-emerald-900/90 backdrop-blur-md rounded-xl px-4 sm:px-8 py-3 sm:py-4 border-2 border-green-500/40 shadow-2xl">
              <p className="text-yellow-400 font-black text-base sm:text-lg md:text-xl uppercase tracking-widest">
                Save Your Spot!
              </p>
              <p className="text-green-100 text-xs sm:text-sm font-medium mt-1">
                Receive more information about this incredible journey
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 pb-10 flex-shrink-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative">
          {submitted ? (
            <div className="max-w-md mx-auto text-center py-2">
              <p className="text-green-700 font-bold text-sm sm:text-base">
                ✓ Success! You will receive a detailed itinerary in your email shortly.
              </p>
            </div>
          ) : (
            <form ref={form} onSubmit={sendEmail} className="space-y-3 max-w-md mx-auto mb-2.5">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-white border-2 border-amber-300 text-amber-950 placeholder-amber-400 focus:outline-none focus:ring-3 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:via-orange-600 hover:to-amber-700 text-white font-black py-2.5 sm:py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm border-2 border-orange-400"
              >
                Get Details
              </button>
            </form>
          )}

          <div className="absolute bottom-2 left-4 sm:left-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dontShowAgain"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-2 border-amber-400 bg-white text-orange-600 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
              />
              <label
                htmlFor="dontShowAgain"
                className="text-xs text-amber-800 cursor-pointer select-none font-medium"
              >
                Don't show this again
              </label>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake-interval {
          0%, 93.33% {
            transform: translateX(0);
          }
          93.67%, 95.67%, 97.67% {
            transform: translateX(-5px);
          }
          94.67%, 96.67%, 98.67% {
            transform: translateX(5px);
          }
          99.33%, 100% {
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-shake-interval {
          animation: shake-interval 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GroupJoiningSafariModal;