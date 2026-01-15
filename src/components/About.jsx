import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Heart, Globe, Award, Users, Camera } from 'lucide-react';

const Counter = ({ value, duration = 9000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Parse the numeric part and suffix
  const numericPart = value.match(/[\d.]+/)?.[0] || '0';
  const suffix = value.match(/[A-Za-z+]+/)?.[0] || '';
  
  // Convert to actual number (handle M for millions, K for thousands)
  let targetValue = parseFloat(numericPart);
  let displayDivisor = 1;
  let displaySuffix = suffix;
  
  if (suffix.includes('M')) {
    targetValue = targetValue * 1000000;
    displayDivisor = 1000;
    displaySuffix = 'K' + suffix.replace('M', '');
  } else if (suffix.includes('K')) {
    targetValue = targetValue * 1000;
  }

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Use a slower easing function for smoother counting
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutCubic * targetValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, targetValue, duration]);

  // Format display value
  const formatCount = () => {
    if (suffix.includes('M')) {
      const kValue = Math.floor(count / 1000);
      if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1).replace('.0', '')}M${suffix.replace('M', '')}`;
      }
      return `${kValue}K${suffix.replace('M', '')}`;
    }
    return `${count}${suffix}`;
  };

  return (
    <div ref={ref} className="text-2xl font-bold text-white mb-1">
      {formatCount()}
    </div>
  );
};

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Professional guides and safety protocols ensure your adventure is secure and worry-free.'
    },
    {
      icon: Heart,
      title: 'Conservation Focus',
      description: 'Supporting local communities and wildlife conservation through responsible tourism.'
    },
    {
      icon: Globe,
      title: 'Expert Knowledge',
      description: 'Local guides with deep understanding of wildlife behavior and African culture.'
    }
  ];

  const achievements = [
    { icon: Award, number: '20+', text: 'Awards Won' },
    { icon: Users, number: '1200+', text: 'Happy Clients' },
    { icon: Camera, number: '1M+', text: 'Photos Captured' }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 safari-pattern opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="text-orange-400 font-semibold text-lg mb-4 block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              About Karla Safari Adventures
            </motion.span>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              An Invitation to Africa’s
              <span className="text-gradient block">Most Exclusive Wilderness</span>
            </motion.h2>

            <motion.p
              className="text-gray-300 text-lg mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
For over 4 years, we have been crafting exceptional luxury safari experiences across Africa as a locally based safari operator. We connect discerning travelers with Africa’s iconic wildlife, breathtaking landscapes, and rich cultural heritage. Specializing in tailor-made safaris in Kenya, Tanzania, Uganda, Rwanda and South Africa, our deep local knowledge, passion for conservation, and commitment to refined adventure allow us to create journeys that are immersive, authentic, and truly transformative.
      </motion.p>

            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-semibold text-lg block mb-1">{feature.title}</span>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.text}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <achievement.icon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <Counter value={achievement.number} />
                  <div className="text-gray-400 text-sm leading-tight">
                    {achievement.text.split(' ').map((word, wordIndex) => (
                      <span key={wordIndex} className="block sm:inline">
                        {word}
                        {wordIndex < achievement.text.split(' ').length - 1 && <span className="hidden sm:inline"> </span>}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                    alt="Lion pride resting under acacia tree"
                   src="/tanzaniaDry30.webp" />
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    alt="Safari guide with binoculars"
                   src="/rwandaWildlife65.webp" />
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    className="w-full h-56 object-cover hover:scale-110 transition-transform duration-500"
                    alt="African landscape sunset"
                   src="/maasaiVilage.webp" />
                </div>
              </motion.div>

              <motion.div
                className="space-y-4 mt-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    alt="Giraffe family in African wilderness"
                   src="/Dining_GameDrive_Sundowners.webp" />
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                    alt="Safari vehicle on adventure"
                   src="/big-cat-sanctuary.webp" />
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    className="w-full h-52 object-cover hover:scale-110 transition-transform duration-500"
                    alt="Wildlife in natural habitat"
                   src="/kenyaWildlife26.webp" />
                </div>
              </motion.div>
            </div>

            <motion.div
              className="absolute -top-4 -right-2 sm:-right-4 glass-effect rounded-full p-4 sm:p-6 text-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-xl sm:text-2xl font-bold text-orange-400">4+</div>
              <div className="text-white text-xs sm:text-sm">Years</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;