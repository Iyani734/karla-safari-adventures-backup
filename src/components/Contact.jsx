import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import emailjs from '@emailjs/browser';
import { eastAfricaTours } from '../lib/tourData';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tour: '',
    tourId: '',
    travelers: '',
    date: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tourSearch, setTourSearch] = useState('');
  const [showTourSuggestions, setShowTourSuggestions] = useState(false);
  const [filteredTours, setFilteredTours] = useState([]);
  
  const tourInputRef = useRef(null);
  const form = useRef();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const sendEmail = (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  emailjs
    .sendForm('service_l1w3w2q', 'template_cfhii5i', form.current, {
      publicKey: 'HTiCAucEf0u_GKfKH',
    })
    .then(
      () => {
        console.log('SUCCESS!');
        toast({
          title: "Inquiry Sent Successfully!",
          description: "We'll get back to you within 24 hours with a personalized safari proposal.",
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          tour: '',
          tourId: '',
          travelers: '',
          date: '',
          message: ''
        });
        setTourSearch('');
        setIsSubmitting(false);
      },
      (error) => {
        console.log('FAILED...', error.text);
        toast({
          title: "Submission Failed",
          description: "There was an error sending your inquiry. Please try again.",
        });
        setIsSubmitting(false);
      },
    );
};


  useEffect(() => {
    if (tourSearch.length > 0) {
      const filtered = eastAfricaTours.filter(tour =>
        tour.title.toLowerCase().includes(tourSearch.toLowerCase()) ||
        tour.location.toLowerCase().includes(tourSearch.toLowerCase()) ||
        tour.subLocation?.toLowerCase().includes(tourSearch.toLowerCase())
      ).slice(0, 8);
      setFilteredTours(filtered);
      setShowTourSuggestions(true);
    } else {
      setFilteredTours([]);
      setShowTourSuggestions(false);
    }
  }, [tourSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tourInputRef.current && !tourInputRef.current.contains(event.target)) {
        setShowTourSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTourSelect = (tour) => {
    setFormData({
      ...formData,
      tour: tour.title,
      tourId: tour.id,
    });
    setTourSearch(tour.title);
    setShowTourSuggestions(false);
  };

  const contactInfo = [

    {
      icon: Phone,
      title: 'Call Us',
      details: ['+254 745 969 305', '+254 717 849 140'],
      color: 'text-green-400'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@karlasafariadventures.com', 'bookings@karlasafariadventures.com'],
      color: 'text-blue-400'
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-orange-400 font-semibold text-base sm:text-lg mb-3 sm:mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Get In Touch
          </motion.span>
          
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Plan Your
            <span className="text-gradient block">African Adventure</span>
          </motion.h2>
          
          <motion.p
            className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Ready to embark on the journey of a lifetime? Contact our safari experts to create your perfect African adventure.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div  className="glass-effect rounded-3xl p-4 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Send Us Your Inquiry</h3>
              
              <form onSubmit={sendEmail} ref={form} className="space-y-4 sm:space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div ref={tourInputRef} className="relative">
                    <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Preferred Tour</label>
                    <div className="relative">
                      <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 z-10" />
                      <input
                        type="text"
                        name="tour"
                        value={tourSearch}
                        onChange={(e) => setTourSearch(e.target.value)}
                        onFocus={() => tourSearch.length > 0 && setShowTourSuggestions(true)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="Search for a tour..."
                      />
                    </div>
                    {showTourSuggestions && filteredTours.length > 0 && (
                      <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto">
                        {filteredTours.map((tour) => (
                          <button
                            key={tour.id}
                            type="button"
                            onClick={() => handleTourSelect(tour)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-0"
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <img
                                src={tour.link}
                                alt={tour.title}
                                className="w-12 sm:w-16 h-9 sm:h-12 object-cover rounded flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-xs sm:text-sm line-clamp-1">{tour.title}</h4>
                                <p className="text-gray-400 text-xs mt-0.5 sm:mt-1">
                                  {tour.location} • {tour.duration}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <input type="hidden" name="tour_id" value={formData.tourId} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Number of Travelers</label>
                    <select
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:border-orange-400 focus:outline-none transition-colors text-sm sm:text-base"
                    >
                      <option value="">Select group size</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3-4">3-4 People</option>
                      <option value="5-8">5-8 People</option>
                      <option value="9+">9+ People</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:border-orange-400 focus:outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Additional Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                    placeholder="Tell us about your dream safari experience, special requirements, or any questions you have..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                      Send Inquiry
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 flex flex-col justify-between "
          >
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                className="glass-effect rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}>
                    <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2">{info.title}</h4>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-300 mb-1 text-sm sm:text-base">{detail}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Why Choose Us */}
            <motion.div
              className="glass-effect rounded-2xl p-4 sm:p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">Why Choose Safari Adventures?</h4>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'Expert local guides with 4+ years experience',
                  'Small group sizes for intimate experiences',
                  '24/7 support throughout your journey',
                  'Sustainable tourism practices',
                  'Customizable itineraries'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-2 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
