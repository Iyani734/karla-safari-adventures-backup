import React, { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const TikTokIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Footer = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useRef(null);

  const allSafariLinks = [
    { text: 'Kenya Safaris & Tours', url: '/tours?search=kenya', country: 'Kenya' },
    { text: 'Kenya Budget Safaris', url: '/tours?search=kenya&category=budget', country: 'Kenya' },
    { text: 'Kenya Family Safaris', url: '/tours?search=family', country: 'Kenya' },
    { text: 'Kenya Luxury Safaris', url: '/tours?search=kenya&category=luxury', country: 'Kenya' },
    { text: 'Kenya Honeymoon Safaris', url: '/tours?country=Kenya&search=couple', country: 'Kenya' },
    { text: 'Kenya Group Tours', url: '/tours?search=kenya&category=shared+tours', country: 'Kenya' },
    { text: 'Kenya Luxury Plus Safaris', url: '/tours?country=Kenya&category=luxury+plus', country: 'Kenya' },
    { text: 'Kenya Mid Range Safaris', url: '/tours?country=Kenya&category=mid-range', country: 'Kenya' },
    { text: 'Kenya Private Safaris', url: '/tours?country=Kenya&search=private', country: 'Kenya' },
    { text: 'Kenya Fly-In Safaris', url: '/tours?search=fly&country=Kenya', country: 'Kenya' },
    { text: 'Kenya Walking Safaris', url: '/tours?country=Kenya&search=walking', country: 'Kenya' },
    { text: 'Kenya Birdwatching Safaris', url: '/tours?country=Kenya&search=birding', country: 'Kenya' },
    { text: 'Tanzania Safaris & Tours', url: '/tours?search=tanzania', country: 'Tanzania' },
    { text: 'Tanzania Budget Safaris', url: '/tours?search=tanzania&category=budget', country: 'Tanzania' },
    { text: 'Tanzania Family Safaris', url: '/tours?country=Tanzania&search=family', country: 'Tanzania' },
    { text: 'Tanzania Luxury Safaris', url: '/tours?search=tanzania&category=luxury', country: 'Tanzania' },
    { text: 'Tanzania Honeymoon Safaris', url: '/tours?country=Tanzania&search=honeymoon', country: 'Tanzania' },
    { text: 'Tanzania Group Tours', url: '/tours?search=tanzania&category=shared+tours', country: 'Tanzania' },
    { text: 'Tanzania Luxury Plus Safaris', url: '/tours?country=Tanzania&category=luxury+plus', country: 'Tanzania' },
    { text: 'Tanzania Mid Range Safaris', url: '/tours?country=Tanzania&category=mid-range', country: 'Tanzania' },
    { text: 'Tanzania Private Safaris', url: '/tours?country=Tanzania&search=private', country: 'Tanzania' },
    { text: 'Tanzania Fly-In Safaris', url: '/tours?search=fly&country=Tanzania', country: 'Tanzania' },
    { text: 'Tanzania Walking Safaris', url: '/tours?country=Tanzania&search=walking', country: 'Tanzania' },
    { text: 'Tanzania Camping Safaris', url: '/tours?country=Tanzania&search=camp', country: 'Tanzania' },
    { text: 'Tanzania Beach & Safari Combos', url: '/tours?country=Tanzania&search=zanzibar', country: 'Tanzania' },
    { text: 'Serengeti Migration Safaris', url: '/tours?country=Tanzania&search=serengeti', country: 'Tanzania' },
    { text: 'Ngorongoro Crater Tours', url: '/tours?country=Tanzania&search=ngorongoro', country: 'Tanzania' },
    { text: 'Uganda  Gorilla Tracking', url: '/tours?search=uganda', country: 'Uganda' },
      { text: 'Rwanda Mountain Gorillas', url: '/tours?search=rwanda', country: 'Rwanda' },
       { text: 'South Africa Big 5 Safari', url: '/tours?country=South+Africa', country: 'South-Africa' },

  ];

  const randomSafariLinks = useMemo(() => {
    const kenyaLinks = allSafariLinks.filter(link => link.country === 'Kenya');
    const tanzaniaLinks = allSafariLinks.filter(link => link.country === 'Tanzania');
    const ugandaLinks = allSafariLinks.filter(link => link.country === 'Uganda');
    const rwandaLinks = allSafariLinks.filter(link => link.country === 'Rwanda');
    const southafricaLinks = allSafariLinks.filter(link => link.country === 'South-Africa');


    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledKenya = shuffleArray(kenyaLinks);
    const shuffledTanzania = shuffleArray(tanzaniaLinks);
    const shuffledUganda = shuffleArray(ugandaLinks);
    const shuffledRwanda = shuffleArray(rwandaLinks);
    const shuffledSouthAfrica = shuffleArray(southafricaLinks);


    return [...shuffledKenya.slice(0, 2), ...shuffledTanzania.slice(0, 2),...shuffledUganda.slice(0, 1),...shuffledRwanda.slice(0, 1),...shuffledSouthAfrica.slice(0, 1)];
  }, []);

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Safari Tours', href: '/tours' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Activities', href: '/activities' },
     { name: 'Reviews', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61574151055658',color: 'text-blue-600', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/karla_safari_adventures?igsh=MTZjbnUwcDVuZTdpbg==&utm_source=ig_contact_invite', color: 'text-pink-400', label: 'Instagram' },
      { icon: FaWhatsapp, href: 'https://wa.link/tb18wm',color: 'text-green-400', label: 'Whatsapp' },
    // { icon: TikTokIcon, href: '#', color: 'hover:text-white', label: 'TikTok' }
  ];

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs
      .sendForm('service_upsh1ll', 'template_wc5vldg', form.current, {
        publicKey: 'saTK5UgAgbwvD5WaK',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setIsSubscribed(true);
          setIsLoading(false);
        },
        (error) => {
          console.log('FAILED...', error.text);
          setIsLoading(false);
        },
      );
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="py-5 md:py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SA</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Karla Safari Adventures</span>
                <p className="text-xs text-orange-400">African Wildlife Tours</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Crafting bespoke African safari journeys rooted in conservation, comfort, and authentic wilderness experiences.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span>Westlands, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-orange-400" />
                <span>+254 745 969 305</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-orange-400" />
                <span>info@karlasafariadventures.com</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-xl font-bold text-white mb-6 block ">Quick Links</span>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group  "
                  >
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-30"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-xl font-bold text-white mb-6 block">Safari Experiences</span>
            <ul className="space-y-3">
              {randomSafariLinks.map((link) => (
                <li key={link.text}>
                  <a
                    href={link.url}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-xl font-bold text-white mb-6 block">Stay Connected</span>

            <p className="text-gray-300 mb-4">
              Receive curated safari insights, seasonal journeys, and private travel invitations.
            </p>

            <div className="mb-6">
              {!isSubscribed ? (
                <form ref={form} onSubmit={sendEmail}>
                  <div className="flex">
                    <input
                      type="email"
                      name="user_email"
                      placeholder="Your email address"
                      required
                      className="flex-1 bg-white border-2 border-gray-300 rounded-l-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-r-lg font-semibold text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Sending...' : 'Subscribe'}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border-2 border-green-500 rounded-lg px-4 py-3 text-center"
                >
                  <span className="text-green-400 font-semibold text-lg">✓ Subscribed</span>
                  <p className="text-green-300 text-sm mt-1">Thank you for subscribing!</p>
                </motion.div>
              )}
            </div>

            <div>
              <span className="text-white font-semibold mb-4 block">Follow Us</span>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    aria-label={social.label}
                    className={`w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-slate-700 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-400 text-sm">
              <p>&copy; 2025 Karla Safari Adventures. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Developer Credits</span>
              <a href='https://iyannibuildsweb.netlify.app/' target='_blank' rel='noopener noreferrer' className="text-blue-500 hover:text-orange-400 transition-colors">iyannibuilds.com</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
