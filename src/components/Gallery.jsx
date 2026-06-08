import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Camera,StickyNote, Heart,LayoutGrid } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      title: 'Majestic Lion',
      category: 'Wildlife',
      description: 'Male lion with magnificent mane resting in golden grassland during sunset',
      likes: 234
    },
    {
      id: 2,
      title: 'Elephant Family',
      category: 'Wildlife',
      description: 'Elephant family with baby elephant walking through African savanna',
      likes: 189
    },
    {
      id: 3,
      title: 'Cheetah Sprint',
      category: 'Action',
      description: 'Cheetah running at full speed across the plains in pursuit of prey',
      likes: 312
    },
    {
      id: 4,
      title: 'Sunset Safari',
      category: 'Landscape',
      description: 'Safari vehicle silhouetted against dramatic African sunset with acacia trees',
      likes: 156
    },
    {
      id: 5,
      title: 'Rhino Portrait',
      category: 'Wildlife',
      description: 'Close-up portrait of white rhinoceros with detailed texture and horn',
      likes: 278
    },
    {
      id: 6,
      title: 'Zebra Herd',
      category: 'Wildlife',
      description: 'Large herd of zebras grazing in the Serengeti with mountains in background',
      likes: 203
    },
    {
      id: 7,
      title: 'Leopard in Tree',
      category: 'Wildlife',
      description: 'Leopard resting on tree branch with spotted coat pattern clearly visible',
      likes: 267
    },
    {
      id: 8,
      title: 'Hippo Pool',
      category: 'Wildlife',
      description: 'Group of hippos in muddy water with some heads visible above surface',
      likes: 145
    },
    {
      id: 9,
      title: 'Giraffe Silhouette',
      category: 'Landscape',
      description: 'Tall giraffe silhouetted against orange and purple sunset sky',
      likes: 198
    }
  ];

  const categories = ['All', 'Wildlife', 'Landscape', 'Action'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 safari-pattern opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
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
            Photo Gallery
          </motion.span>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Captured
            <span className="text-gradient block">Moments in the Wild</span>
          </motion.h2>
          
          <motion.p
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Experience the breathtaking beauty of African wildlife through our lens. Each photo tells a story of adventure and wonder.
          </motion.p>

          <motion.div
            className="max-w-3xl mx-auto px-4 mt-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/0 via-transparent to-orange-300/20 group-hover:from-orange-200/20 transition-all duration-500"></div>

              <div className="absolute -top-4 -left-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <StickyNote className="w-5 h-5 text-white" />
              </div>

              <div className="absolute top-4 right-4 opacity-5">
                <Camera className="w-24 h-24 md:w-32 md:h-32 text-orange-600" />
              </div>

              <p className="text-slate-800 text-base md:text-lg leading-relaxed font-medium relative z-10">
                <span className="text-orange-600 font-bold text-2xl md:text-3xl">"</span>
                Below is a preview of how your photo gallery will look after experiencing a safari expertly organized by our team
                <span className="text-orange-600 font-bold text-2xl md:text-3xl">"</span>
              </p>

              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-orange-400 rounded-full opacity-60"></div>
            </div>
          </motion.div>
        </motion.div>

 

        {/* Gallery Grid */}
        <div className='flex gap-x-4 flex-col md:flex-row'>
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
                     src="/kenyaWildlife1.webp" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                      alt="Safari guide with binoculars"
                     src="/wildbeast4.webp" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      className="w-full h-56 object-cover hover:scale-110 transition-transform duration-500"
                      alt="African landscape sunset"
                     src="/rwandaWildlife68.webp" />
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
                     src="/ugandaWildlife7.webp" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                      alt="Safari vehicle on adventure"
                     src="/southAfricaWildlife57.webp" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      className="w-full h-52 object-cover hover:scale-110 transition-transform duration-500"
                      alt="Wildlife in natural habitat"
                     src="/southAfricaWildlifeWet17.webp" />
                  </div>
                </motion.div>
              </div>
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
                                 src="/southAfricaWildlifeWet19.webp" />
                              </div>
                              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                                  alt="Safari guide with binoculars"
                                 src="/southAfricaWildlife87.webp" />
                              </div>
                              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                  className="w-full h-56 object-cover hover:scale-110 transition-transform duration-500"
                                  alt="African landscape sunset"
                                 src="/kibale national.webp" />
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
                                 src="/southAfricaWildlifeWet20.webp" />
                              </div>
                              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                                  alt="Safari vehicle on adventure"
                                 src="/kenyaWet2.webp" />
                              </div>
                              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                  className="w-full h-52 object-cover hover:scale-110 transition-transform duration-500"
                                  alt="Wildlife in natural habitat"
                                 src="/murchison falls.webp" />
                              </div>
                            </motion.div>
                          </div>
                          </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-4xl max-h-[90vh] bg-slate-800 rounded-2xl overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img  
                    className="w-full h-auto max-h-[70vh] object-cover" 
                    alt={selectedImage.title}
                   src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                      <span className="text-orange-400 font-medium">{selectedImage.category}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <Heart className="w-5 h-5" />
                      <span>{selectedImage.likes} likes</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

    {/* CTA */}
<motion.div
  className="text-center mt-16"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
>
  <p className="text-gray-300 mb-6">Ready to capture your own African adventure?</p>
  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
    <motion.button
      onClick={() => window.location.href = `/tours`}
      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Camera className="inline-block mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
      Book Your Safari
    </motion.button>

    <motion.button
      onClick={() => window.location.href = `/gallery`}
      className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
     <LayoutGrid className="inline-block mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
      View Full Gallery
    </motion.button>
  </div>
</motion.div>
      </div>
    </section>
  );
};

export default Gallery;
