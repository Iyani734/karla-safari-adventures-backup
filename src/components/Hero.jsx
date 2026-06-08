import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Users, Award } from 'lucide-react';

const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Hero = () => {
  const [counters, setCounters] = useState([0, 0, 0]);

  const stats = [
    { icon: Users, value: '1200+', label: 'Happy Travelers', target: 1200 },
    { icon: Award, value: '4+', label: 'Years Experience', target: 4 },
    { icon: Star, value: '4.9', label: 'Average Rating', target: 4.9 }
  ];

  const countries = [
    { name: 'Kenya', url: '/tours?country=Kenya' },
    { name: 'Tanzania', url: '/tours?country=Tanzania' },
    { name: 'Uganda', url: '/tours?country=Uganda' },
    { name: 'Rwanda', url: '/tours?country=Rwanda' },
    { name: 'South Africa', url: '/tours?country=South+Africa' }
  ];

  useEffect(() => {
    const duration = 4000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters([
        Math.floor(1200 * progress),
        Math.floor(4 * progress),
        Math.min(4.9, (4.9 * progress))
      ]);

      if (currentStep >= steps) {
        setCounters([1200, 4, 4.9]);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const scrollToTestimonials = () => {
    const section = document.getElementById("testimonials");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const formatCounter = (index) => {
    if (index === 0) return `${counters[0]}+`;
    if (index === 1) return `${counters[1]}+`;
    if (index === 2) return counters[2].toFixed(1);
    return '';
  };

  return (
   <section id="home" className="relative min-h-screen  flex items-center justify-center overflow-hidden -mt-12 md:-mt-20 pt-16 sm:pt-24 max-[400px]:pt-32 sm:-mb-30">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={2}
            src={"/hero.jpg"}
            alt={"elephants at sunset"}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
      </div>

      <div className="absolute inset-0 z-10 hidden md:block">
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 lg:w-20 lg:h-20 bg-orange-500/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-24 h-24 lg:w-32 lg:h-32 bg-red-500/20 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight md:mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Experience the
            <span className="bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent block mt-2">
              Wild Heart of Africa
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-4 sm:mb-6 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0  "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
           From luxury escapes to authentic adventure safaris, we design unforgettable journeys across Africa's most iconic wildlife destinations—home to the legendary Big Five.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-3 mb-6 sm:mb-8 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {countries.map((country) => (
              <a
                key={country.name}
                href={country.url}
                className="backdrop-blur-sm bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {country.name}
              </a>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button
            onClick={() => window.location.href = `/tours`}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 group"
            >
              Explore Safari Packages
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto backdrop-blur-sm bg-white/10 text-white border-white/30 hover:bg-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg group"
              onClick={scrollToTestimonials}
            >
              <Star className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              Hear from our Travelers
            </Button>
          </motion.div>

       <motion.div
  className="max-w-4xl mx-auto px-4 sm:px-0 pb-4 sm:pb-0 mb-8"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8, duration: 0.8 }}
>
            <div className="hidden sm:block">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mx-auto mb-1 sm:mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">{formatCounter(index)}</div>
                    <div className="text-gray-300 text-xs sm:text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="block sm:hidden">
              <motion.div
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 text-center max-w-md mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-3">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="flex flex-col items-center flex-1">
                      <stat.icon className="w-5 h-5 text-orange-400 mb-1.5" />
                      <div className="text-xl font-bold text-white">{formatCounter(index)}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-gray-300 text-xs">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center flex-1">
                      {stat.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
 
    </section>
  );
};

function App() {
  return <Hero />;
}

export default App;
