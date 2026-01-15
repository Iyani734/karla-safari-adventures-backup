import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, User, Phone, Calendar, DollarSign, MessageSquare, CheckCircle, Loader, Trash2, ChevronDown } from 'lucide-react';
import emailjs from '@emailjs/browser';

const CheckoutModal = ({ isOpen, onClose, activities, onRemoveActivity }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    budget: '',
    message: '',
    adults: 1,
    children: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem('dontAskAgainDeleteActivity');
    if (storedPreference === 'true') {
      setDontAskAgain(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const nameMap = {
      'from_name': 'name',
      'from_email': 'email',
      'preferred_date': 'preferredDate'
    };

    const stateKey = nameMap[name] || name;

    setFormData(prev => ({
      ...prev,
      [stateKey]: value
    }));
  };

  const form = useRef();

  const formatActivities = (activities) => {
    return activities.map((activity, index) =>
      `${index + 1}. ${activity.title} - ${activity.country}`
    ).join('\n');
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedActivities = formatActivities(activities);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'Not provided',
      preferred_date: formData.preferredDate || 'Not specified',
      budget: formData.budget || 'Not specified',
      adults: formData.adults,
      children: formData.children,
      selected_activities: formattedActivities,
      message: formData.message || 'No additional requirements',
    };

    emailjs.send('service_rjz93fd', 'template_gy02x69', templateParams, 'e0omTkY4ArMxstpqD')
      .then((result) => {
        console.log('SUCCESS!', result.text);
        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setFormData({
            name: '',
            email: '',
            phone: '',
            preferredDate: '',
            budget: '',
            message: '',
            adults: 1,
            children: 0
          });
        }, 7000);
      }, (error) => {
        console.log('FAILED...', error.text);
        setIsSubmitting(false);
        alert('Failed to submit request. Please try again.');
      });
  };

  const handleDeleteClick = (activityId) => {
    const storedPreference = localStorage.getItem('dontAskAgainDeleteActivity');
    if (storedPreference === 'true') {
      onRemoveActivity(activityId);
    } else {
      setDeleteConfirm(activityId);
    }
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onRemoveActivity(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleDontAskAgainChange = (e) => {
    const checked = e.target.checked;
    setDontAskAgain(checked);
    localStorage.setItem('dontAskAgainDeleteActivity', checked.toString());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] md:flex md:items-center md:justify-center md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative bg-slate-800 w-full h-full md:h-auto md:max-h-[85vh] md:max-w-4xl md:rounded-2xl flex flex-col md:border md:border-slate-700 shadow-2xl"
          >
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 md:rounded-2xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="w-24 h-24 text-green-400 mb-6" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-white mb-3 px-4 text-center"
                  >
                    Request Sent Successfully!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-300 text-center max-w-md px-4"
                  >
                    Our safari experts will review your selected activities and create a personalized itinerary with pricing. We'll contact you within 24 hours!
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {deleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 md:rounded-2xl p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-slate-700 rounded-xl p-6 max-w-md w-full border border-slate-600"
                  >
                    <h3 className="text-xl font-bold text-white mb-3">Remove Activity?</h3>
                    <p className="text-gray-300 mb-4">
                      Are you sure you want to remove this activity from your safari selection?
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                      <input
                        type="checkbox"
                        id="dontAskAgain"
                        checked={dontAskAgain}
                        onChange={handleDontAskAgainChange}
                        className="w-4 h-4 rounded border-slate-500 bg-slate-600 text-orange-500 focus:ring-orange-400 focus:ring-offset-slate-700"
                      />
                      <label htmlFor="dontAskAgain" className="text-sm text-gray-300 cursor-pointer">
                        Don't ask again
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={cancelDelete}
                        className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2.5 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 md:p-6 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Checkout Your Custom Safari</h2>
                <p className="text-orange-100 text-sm">{activities.length} activities selected</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <button
                    onClick={() => setIsActivitiesExpanded(!isActivitiesExpanded)}
                    className="flex items-center justify-between w-full text-left mb-4 hover:bg-slate-700/30 rounded-lg p-2 -ml-2 transition-colors flex-shrink-0"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Selected Activities ({activities.length})
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                        isActivitiesExpanded || activities.length < 4 ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {(isActivitiesExpanded || activities.length < 3) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-y-auto custom-scrollbar pr-2"
                    >
                      {activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-slate-700/50 rounded-lg border border-slate-600/50 flex-shrink-0 hover:bg-slate-700 transition-all duration-300 overflow-hidden flex "
                          style={{ height: '100px' }}
                        >
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-32  object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 p-3 flex flex-col justify-between relative">
                            <div>
                              <h4 className="text-white font-bold text-sm leading-tight mb-1">
                                {activity.title}
                              </h4>
                              <p className="text-gray-300 text-xs font-medium mb-0.5 mt-3">{activity.country}</p>
                              <span className="text-orange-400 text-xs font-medium">{activity.duration}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(activity.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg p-2 transition-all duration-300 h-fit flex-shrink-0 m-2"
                            title="Remove activity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2 flex-shrink-0">
                    <User className="w-5 h-5 text-orange-400" />
                    Your Information
                  </h3>
                  <form ref={form} onSubmit={sendEmail} className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="from_name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="John Doe"
                          className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="from_email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="john@example.com"
                          className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 234 567 8900"
                          className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Travel Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          <input
                            type="date"
                            name="preferred_date"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none [color-scheme:dark]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Budget (USD)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            placeholder="5000"
                            className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Adults
                        </label>
                        <input
                          type="number"
                          name="adults"
                          min="1"
                          value={formData.adults}
                          onChange={handleInputChange}
                          className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Children
                        </label>
                        <input
                          type="number"
                          name="children"
                          min="0"
                          value={formData.children}
                          onChange={handleInputChange}
                          className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Additional Requirements
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Any special requests or preferences..."
                          className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0 mt-4"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Safari Request
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(30, 41, 59, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(249, 115, 22, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(249, 115, 22, 0.8);
            }
                  .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(30, 41, 59, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(249, 115, 22, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(249, 115, 22, 0.8);
            }

            /* Date input styling */
            input[type="date"] {
              color: white !important;
              -webkit-appearance: none;
              appearance: none;
            }

            input[type="date"]::-webkit-calendar-picker-indicator {
              filter: invert(1);
              cursor: pointer;
            }

            input[type="date"]::-webkit-datetime-edit {
              color: white;
            }

            input[type="date"]::-webkit-datetime-edit-fields-wrapper {
              color: white;
            }

            input[type="date"]::-webkit-datetime-edit-text {
              color: white;
            }

            input[type="date"]::-webkit-datetime-edit-month-field,
            input[type="date"]::-webkit-datetime-edit-day-field,
            input[type="date"]::-webkit-datetime-edit-year-field {
              color: white;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
