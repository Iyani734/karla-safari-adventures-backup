import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom'; 
import { MapPin, Calendar, Users, ArrowRight, ArrowLeft, Clock, ShoppingCart,Star, Send, DollarSign, Briefcase, Sun, Moon, CloudDrizzle, CloudSnow, Search, Wand2, Home, Settings, UserCheck, Baby, CalendarCheck, Globe, Binary as Binoculars, Truck, Plane, Bed, Utensils, Info, ExternalLink, CheckCircle, XCircle, MapIcon, Quote, ThumbsUp, Camera, Compass, Heart, Award, TrendingUp, MessageCircle, Users as UsersIcon, Shield, TreePine, Leaf, Wind, Mountain, Sunrise, BookOpen, AlertTriangle, Sparkles, Crown, Gift, Zap, Cat, Dog, Bird, Fish, Rabbit, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import ImagePopup from '../components/ImagePopup';
import { getAllActivitiesWithLikes, getLikedActivitiesByCountry } from '../lib/activityData';
import CheckoutModal from './CheckoutModal';
import FloatingCart from './FloatingCart';
import emailjs from '@emailjs/browser';
import { allToursData } from '../lib/allToursData';
// ========================================
// ADDED TO CART NOTIFICATION (Bottom Right Position)
// ========================================
const AddedToCartNotification = ({ show, activity }) => (
  <AnimatePresence>
    {show && activity && (
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed top-20 right-6 md:bottom-6 md:top-auto z-[10000] w-[90%] max-w-md md:w-96"
      >
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-orange-300/30 to-red-300/30"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            <div className="relative p-4 flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    <Heart className="w-12 h-12 text-white fill-white" />
                  </motion.div>
                </div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white font-bold text-lg mb-1 drop-shadow-md"
                >
                  Added to Cart!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-sm line-clamp-1 drop-shadow"
                >
                  {activity.title}
                </motion.p>
              </div>

              <motion.img
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                src={activity.image}
                alt={activity.title}
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
              />
            </div>

            {/* Progress bar - increased duration to 5 seconds */}
            <motion.div
              className="h-1.5 bg-white/30 overflow-hidden"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
            >
              <motion.div
                className="h-full bg-white"
                initial={{ x: '0%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </div>

        {/* Softer glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 20px rgba(249, 115, 22, 0.3)',
              '0 0 40px rgba(249, 115, 22, 0.5)',
              '0 0 20px rgba(249, 115, 22, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);


// ========================================
// CENTRALIZED IMAGE MANAGEMENT SYSTEM
// ========================================
const IMAGE_MANAGER = {
  tourThumbnails: {
   'custom-trip': '/customSafari.webp',
    '7-Day-Kenyan-Luxury-Safari': '/Elephants_luxury.webp',
    'tanzania-great-migration': '/giraffe16.webp',
    'Uganda-Ultimate-Luxury-Safari': '/byeuganda.webp', 
    'rwanda-mountain-gorillas': '/gorillaDP2.webp',
    '10-Day-Kenya-Safari-ol-Pejeta-Samburu-Nakuru-Mara-Amboseli': '/lion27.webp',
    '3-day-mara-fly-in-fly-out': '/maasaimara10.webp',
    'budget-7-Day-Masai-Mara-Nakuru-Naivasha-Amboseli': '/elephant41.webp',
    '6-day-serengeti-budget-safari': '/serengeti-budget2.webp',
    '4-day-gorilla-tracking-and-queen-elizabeth-national-park': '/chipanzee1.webp',
    '3-day-chimpanzee-trekking-canopy-and-lake-kivu-adventure': '/canopy2.webp',
    '3-Day-samburu-flying-safari-tour': '/samburu1.webp',
    '12-day-vacation-escape-to-kenya-coast': '/wasini2.webp',
    '4-day-safari-to-awe-inspiring-landscapes-of-mara-in-jeep': '/maasaimara16.webp',
    '10-day-kenyas-wildest-elegance-an-ultra-luxury-safari': '/solio1.webp',
    '12-day-luxury-honeymoon-safari-and-beach-holiday': '/honeymoon5.webp',
    '3-day-luxury-safari-in-the-great-masai-mara-reserve': '/lions.webp',
    '8-day-unmatched-elegance-crown-jewels-of-kenya-safari' : '/zebra4.webp',
    '7-day-luxury-safari-kruger-national-park-south-africa': '/sunset3.webp',
    '3-day-luxury-honeymoon-safari-to-serengeti-ngorongoro': '/honeymoon9.webp',
    '6-day-circuit-safari-masai-mara-lake-nakuru-amboseli': '/lakeNakuru13.webp',
    '4-day-masai-mara-nakuru': '/leopard5.webp',
    '3-day-adventure-in-masai-mara': '/wildbeast8.webp',
    '7-day-masai-mara-nakuru-naivasha-amboseli' : '/lakeNakuru17.webp',
    '8-day-camping-safari-with-cultural-nature-experiences' : '/culture12.webp',
    '3-Day-Ngorongoro-Kilimanjaro-Hike-Materuni-Waterfalls' : '/ngorongoro10.webp',
    '5-Day-Safari-to-Selous-Nyerere-Mikumi-Maasai-Village' : '/maasaiVillage5.webp',
    '3-Day-Murchison-Falls-NP-Ziwa-and-Budongo-Safari' : '/murchson.webp',
    '5-Day-Kruger-Adventure-Safari' : '/cheatah.webp',
    '5-day-private-explorer-tour' : '/luxury.webp',
    '5-day-premium-luxury-serengeti-gateway-safari' : '/zebra9.webp',
    '4-day-safari-high-end' : '/wildbeast3.webp',
    '5-day-tanzania-adventure-serengeti-migration-plus-big-five': '/zebra10.webp',
    '4-day-luxury-tanzania-safari-tarangire-serengeti-ngorongoro' : '/zebra11.webp',
    '4-day-luxury-samburu-olpejata' : '/culture11.webp',
    '3-day-tarangire-manyara-ngorongoro-crater' : '/zebra14.webp',
    '4-day-lodging-tarangire-ngorngoro-materuni' : '/elephant23.webp',
    '4-day-astonish-mikumi-ruaha-national-park' : '/giraffe9.webp',
    '3-day-amboseli-tsavo-east-mombasa' : '/elephant25.webp',
    '3-day-samburu-wildernes-adventure' : '/giraffe11.webp',
    '3-day-mount-kenya-trek-sirimon-to-chogoria' : '/hiking8.webp',
    '3-day-the-amboseli-budget-safari' : '/elephant32.webp',
    '3-day-tsavo-east-taita-safari-sentrim-salt-lick' : '/elephant38.webp',
    '4-day-nairobi-amboseli-tsavo-east-mombasa-diani-watamu' : '/diani.webp',
    '4-day-mikumi-nyerere-unforgettable-adventures' : '/giraffe15.webp',
    '3-day-budget-safari-tarangire-ngorongoro-manyara' : '/lion22.webp',
    '4-day-safari-to-ruaha-national-park-tanzania' : '/lion24.webp',
    '4-day-amboseli-tsavo-east-west' : '/giraffe23.webp' },

  tourHeroImages: {
    'custom-trip': '/customSafari1.webp',
    '7-Day-Kenyan-Luxury-Safari': '/Elephants_luxury.webp',
    'tanzania-great-migration': '/giraffe16.webp',
    'Uganda-Ultimate-Luxury-Safari': '/byeuganda.webp', 
    'rwanda-mountain-gorillas': '/gorillaDP2.webp',
    '10-Day-Kenya-Safari-ol-Pejeta-Samburu-Nakuru-Mara-Amboseli': '/lion27.webp',
    '3-day-mara-fly-in-fly-out': '/maasaimara10.webp',
    'budget-7-Day-Masai-Mara-Nakuru-Naivasha-Amboseli': '/elephant41.webp',
    '6-day-serengeti-budget-safari': '/serengeti-budget2.webp',
    '4-day-gorilla-tracking-and-queen-elizabeth-national-park': '/chipanzee1.webp',
    '3-day-chimpanzee-trekking-canopy-and-lake-kivu-adventure': '/canopy2.webp',
    '3-Day-samburu-flying-safari-tour': '/samburu1.webp',
    '12-day-vacation-escape-to-kenya-coast': '/wasini2.webp',
    '4-day-safari-to-awe-inspiring-landscapes-of-mara-in-jeep': '/maasaimara16.webp',
    '10-day-kenyas-wildest-elegance-an-ultra-luxury-safari': '/solio1.webp',
    '12-day-luxury-honeymoon-safari-and-beach-holiday': '/honeymoon5.webp',
    '3-day-luxury-safari-in-the-great-masai-mara-reserve': '/lions.webp',
    '8-day-unmatched-elegance-crown-jewels-of-kenya-safari' : '/zebra4.webp',
    '7-day-luxury-safari-kruger-national-park-south-africa': '/sunset3.webp',
    '3-day-luxury-honeymoon-safari-to-serengeti-ngorongoro': '/honeymoon9.webp',
    '6-day-circuit-safari-masai-mara-lake-nakuru-amboseli': '/lakeNakuru13.webp',
    '4-day-masai-mara-nakuru': '/leopard5.webp',
    '3-day-adventure-in-masai-mara': '/wildbeast8.webp',
    '7-day-masai-mara-nakuru-naivasha-amboseli' : '/lakeNakuru17.webp',
    '8-day-camping-safari-with-cultural-nature-experiences' : '/culture12.webp',
    '3-Day-Ngorongoro-Kilimanjaro-Hike-Materuni-Waterfalls' : '/ngorongoro10.webp',
    '5-Day-Safari-to-Selous-Nyerere-Mikumi-Maasai-Village' : '/maasaiVillage5.webp',
    '3-Day-Murchison-Falls-NP-Ziwa-and-Budongo-Safari' : '/murchson.webp',
    '5-Day-Kruger-Adventure-Safari' : '/cheatah.webp',
    '5-day-private-explorer-tour' : '/luxury.webp',
    '5-day-premium-luxury-serengeti-gateway-safari' : '/zebra9.webp',
    '4-day-safari-high-end' : '/wildbeast3.webp',
    '5-day-tanzania-adventure-serengeti-migration-plus-big-five': '/zebra10.webp',
    '4-day-luxury-tanzania-safari-tarangire-serengeti-ngorongoro' : '/zebra11.webp',
    '4-day-luxury-samburu-olpejata' : '/culture11.webp',
    '3-day-tarangire-manyara-ngorongoro-crater' : '/zebra14.webp',
    '4-day-lodging-tarangire-ngorngoro-materuni' : '/elephant23.webp',
    '4-day-astonish-mikumi-ruaha-national-park' : '/giraffe9.webp',
    '3-day-amboseli-tsavo-east-mombasa' : '/elephant25.webp',
    '3-day-samburu-wildernes-adventure' : '/giraffe11.webp',
    '3-day-mount-kenya-trek-sirimon-to-chogoria' : '/hiking8.webp',
    '3-day-the-amboseli-budget-safari' : '/elephant32.webp',
    '3-day-tsavo-east-taita-safari-sentrim-salt-lick' : '/elephant38.webp',
    '4-day-nairobi-amboseli-tsavo-east-mombasa-diani-watamu' : '/diani.webp',
    '4-day-mikumi-nyerere-unforgettable-adventures' : '/giraffe15.webp',
    '3-day-budget-safari-tarangire-ngorongoro-manyara' : '/lion22.webp',
    '4-day-safari-to-ruaha-national-park-tanzania' : '/lion24.webp',
    '4-day-amboseli-tsavo-east-west' : '/giraffe23.webp'
  },

  dailyItineraryImages: {
    'custom-trip': {
      1: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=400&fit=crop',
      2: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop',
      3: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=400&fit=crop',
      4: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=400&fit=crop'
    },
    '7-Day-Kenyan-Luxury-Safari': {
      1: '/elephants_amboseli2.webp',
      2: '/elephants_amboseli.webp',
      3: '/lake naivasha.webp',
      4: '/Lake Nakuru.webp',
      5: '/maasai mara.webp',
      6: '/maasai mara2.webp',
      7: '/zebra.webp'
    },
    'tanzania-great-migration': {
      1: '/manyara2.webp',
      2: '/ngorongoro.webp',
      3: '/serengeti.webp',
      4: '/serengeti2.webp',
      '5-6': '/serengeti3.webp',
      7: '/planeSerengeti.webp',
    },
    'Uganda-Ultimate-Luxury-Safari': {
      1: '/murchison falls.webp',
      2: '/murchison falls2.webp',
      3: '/kibale national.webp',
      4: '/bigodi community.webp',
      5: '/queenelizabeth.webp',
      6: '/queenelizabeth2.webp',
      7: '/bwindi.webp',
      8: '/bwindi2.webp',
      9: '/mburo.webp',
      10: '/backHome1.webp'
    },
    'rwanda-mountain-gorillas': {
      1: '/kigalitour.webp',
      2: '/volcanoeGorilla.webp',
      3: '/goldenMonkeys.webp',
      4: '/equator.webp',
    },
    '10-Day-Kenya-Safari-ol-Pejeta-Samburu-Nakuru-Mara-Amboseli': {
      1: "/olPejeta1.webp",
      2: "/samburuNational1.webp",
      3: "/samburuNational2.webp",
      4: "/LakeNakuru1.webp",
      5: "/maasaiMara1.webp",
      6: "/maasaiMara2.webp",
      7: "/lakeNakuru2.webp",
      8: "/amboseli1.webp",
      9: "/amboseli2.webp",
      10: "/amboseli3.webp",
    },
    '3-day-mara-fly-in-fly-out':{
1: '/maasaimara6.webp',
2: '/maasaimara4.webp',
3: '/maasaimara7.webp',
    },
    'budget-7-Day-Masai-Mara-Nakuru-Naivasha-Amboseli': {
      1: '/maasaimara11.webp',  
      2: '/maasaimara12.webp',
      3: '/masaivilage2.webp',
      4: '/lakeNakuru3.webp',
      5: '/amboseli6.webp',
      6: '/amboseli7.webp',
     7: '/byebye.webp',
    },
    '6-day-serengeti-budget-safari': {
      1: '/tarangire2.webp',  
      2: '/serengeti4.webp',
      3: '/serengeti5.webp',
      4: '/serengeti6.webp',
      5: '/ngorongoro2.webp',
      6: '/amboseli7.webp',
     7: '/byebye.webp',
    },
    '4-day-gorilla-tracking-and-queen-elizabeth-national-park': {
      1:  '/bwindi3.webp',
      2:  '/bwindi4.webp',
      3:  '/queenelizabeth3.webp',
      4:  '/final1.webp',
    },
    '3-day-chimpanzee-trekking-canopy-and-lake-kivu-adventure': {
      1:  '/canopy1.webp',
      2:  '/nyungwe1.webp',
      3:  '/kivi1.webp',
    },
     '3-Day-samburu-flying-safari-tour': {
      1:  '/plane1.webp',
      2:  '/culture1.webp',
      3:  '/zebra1.webp',
    },
     '12-day-vacation-escape-to-kenya-coast': {
      1:  '/mombasa1.webp',
      2:  '/fortJesus.webp',
      3:  '/mombasa2.webp',
      4:  '/mtwapaCreek1.webp', 
      5:  '/mombasa4.webp',
      6:  '/mombasa5.webp',
      7:  '/mombasa6.webp',
      8:  '/mombasa7.webp',  
      9:  '/mombasa9.webp',
      10:  '/shimba1.webp',
      11:  '/culture2.webp',
      12:  '/byeSummer.webp',
    },
    '4-day-safari-to-awe-inspiring-landscapes-of-mara-in-jeep' : {
      1:  '/airstrip.webp',
      2:  '/balloon-masai-mara.webp',
      3:  '/culture5.webp',
      4:  '/flying-safari-masaimara.webp',
    },
    '10-day-kenyas-wildest-elegance-an-ultra-luxury-safari': {
       1: '/airstrip2.webp',
       2: '/meru1.webp',
       3: '/zebra2.webp',
       4 : '/culture6.webp',
       5 : '/gameDrive1.webp',
       6 : '/horse2.webp',
       7 : '/maasaimara21.webp',
       8 : '/ballon1.webp',
       9 : '/sunset1.webp',
       10 : '/airstrip3.webp',
    },
    '12-day-luxury-honeymoon-safari-and-beach-holiday' : {
       1: '/kilimanjaroAirport.webp',
       2: '/tarangire3.webp',
       3: '/serengeti7.webp',
       4 : '/seronaValley.webp',
       5 : '/ngorongoro3.webp',
       6 : '/ngorongoro4.webp',
       7 : '/prisonIsland.webp',
       '8-11' : '/zanzibarBeach.webp',
       12 : '/final2.webp', 
    },
    '3-day-luxury-safari-in-the-great-masai-mara-reserve': {
       1: '/maasaimara24.webp',
       2: '/maasaimara25.webp',
       3: '/maasaimara26.webp',
    },
    '8-day-unmatched-elegance-crown-jewels-of-kenya-safari' : {
       1: '/meru3.webp',
       2: '/meru4.webp',
       3: '/samburu2.webp',
       4 : '/samburu3.webp',
       5 : '/leopard2.webp',
       6 : '/sundowner.webp',
       7 : '/hyena.webp',
       8 : '/lion1.webp',
    },
    '7-day-luxury-safari-kruger-national-park-south-africa' : {
       '1-3': '/timbavati1.webp',
       '4-6': '/sabisabi.webp',
       7: '/sunset2.webp', 
    },
    '3-day-luxury-honeymoon-safari-to-serengeti-ngorongoro' : {
        1: '/serengeti8.webp',
       2: '/hunting.webp',
       3: '/ngorongoro5.webp',
    },
    '6-day-circuit-safari-masai-mara-lake-nakuru-amboseli': {
      1: '/lions1.webp',
      2: '/maasaimara27.webp',
      3: '/lakenakuru4.webp',
      4: '/lakenakuru5.webp',
      5: '/amboseli10.webp',
      6: '/amboseli11.webp',
    },
    '4-day-masai-mara-nakuru': {
    1: '/maasaimara28.webp',
      2: '/maasaimara29.webp',
      3: '/maasai village.webp',
      4: '/lakenakuru6.webp',
    },
    '3-day-adventure-in-masai-mara': {
      1: '/maasaimara31.webp',
      2: '/maasaimara32.webp',
      3: '/maasaimara33.webp',
    },
    '7-day-masai-mara-nakuru-naivasha-amboseli': {
      1: '/lion2.webp',
      2: '/leopard3.webp',
      3: '/maasaiVillage2.webp',
      4: '/lakeNakuru7.webp',
      5: '/amboseli12.webp',
      6: '/elephant3.webp',
      7: '/giraffe2.webp',
    },
    '8-day-camping-safari-with-cultural-nature-experiences': {
       1: '/tanzania.webp',
      2: '/materuniFalls.webp',
      3: '/lion4.webp',
      '4-5': '/serengeti9.webp',
      6: '/ngorongoro6.webp',
      7: '/mtowaumbu.webp',
      8: '/culture7.webp',
    },
    '3-Day-Ngorongoro-Kilimanjaro-Hike-Materuni-Waterfalls' : {
       1: '/ngorongoro7.webp',
          2: '/hike.webp',
      3: '/materuniFalls1.webp',
    },
    '5-Day-Safari-to-Selous-Nyerere-Mikumi-Maasai-Village' : {
     1: '/nyerere.webp',
      2: '/nyerere2.webp',
      3: '/mikumi.webp',
      4: '/mikumi2.webp',
      5: '/maasaiVillage3.webp',
    },
    '3-Day-Murchison-Falls-NP-Ziwa-and-Budongo-Safari' : {
      1: '/murchisonFall.webp',
      2: '/murchisonFall2.webp',
      3: '/gorilla2.webp',
    },
    '5-Day-Kruger-Adventure-Safari' : {
     1: '/kruger1.webp',
     2: '/kruger2.webp',
      3: '/panorama2..webp',
      4: '/lion5.webp',
      5: '/sunrise.webp'
    },
    '5-day-private-explorer-tour' : {
      1: '/Tarangire4.webp',
      2: '/serengeti1.webp',
      3: '/lion10.webp ',
      4: '/ngorongoro11.webp',
      5: '/ngorongoro12.webp'
    },
        '5-day-premium-luxury-serengeti-gateway-safari' : {
      1: '/kilimanjaroAirport1.webp',
      2: '/plane4.webp',
      3: '/baloon1.webp ',
      4: '/sundowner2.webp',
      5: '/lion11.webp'
    },
    '4-day-safari-high-end' : {
      1: '/lakeManyara.webp',
      2: '/serengeti10.webp',
      3: '/serengeti11.webp ',
      4: '/ngorongoro13.webp',
    },
    '5-day-tanzania-adventure-serengeti-migration-plus-big-five' : {
      1: '/plane5.webp',
      2: '/migration.webp',
      3: '/serengeti12.webp ',
      4: '/serengeti13.webp',
      5: '/tarangire5.webp',      
    },
    '4-day-luxury-tanzania-safari-tarangire-serengeti-ngorongoro' : {
      1: '/tarangire6.webp',
      2: '/serengeti14.webp',
      3: '/leopard.webp ',
      4: '/buffalo2.webp',
    },
    '4-day-luxury-samburu-olpejata': {
      1: '/zebra5.webp',
      2: '/giraffe4.webp',
      3: '/longNeck.webp ',
      4: '/culture9.webp',
    },
    '3-day-tarangire-manyara-ngorongoro-crater': {
      1: '/elephant4.webp',
      2: '/zebra6.webp',
      3: '/zebra7.webp ',
    },
    '4-day-lodging-tarangire-ngorngoro-materuni': {
      1: '/maasai.webp',
      2: '/lunch.webp',
      3: '/blackRhino1.webp ',
      4: '/materuniFalls2.webp',
    },
       '4-day-astonish-mikumi-ruaha-national-park' : {
      1: '/mikumi3.webp',
      2: '/buffalo3.webp',
      3: '/elephant5.webp ',
      4: '/byebye2.webp',
    },
     '4-day-amboseli-tsavo-east-west' : {
      1: '/elephant6.webp',
      2: '/rhino.webp',
      3: '/buffalo4.webp ',
      4: '/elephant7.webp',
    },
      '3-day-amboseli-tsavo-east-mombasa' : {
      1: '/elephant8.webp',
      2: '/elephant9.webp',
      3: '/leopard6.webp ',
    },
     '3-day-samburu-wildernes-adventure' : {
      1: '/rare.webp',
      2: '/elephant10.webp',
      3: '/culture10.webp ',
    },
         '3-day-mount-kenya-trek-sirimon-to-chogoria' : {
      1: '/hiking.webp',
      2: '/hiking2.webp',
      3: '/hiking3.webp ',
    },
     '3-day-the-amboseli-budget-safari' : {
      1: '/elephant11.webp',
      2: '/wildLunch.webp',
      3: '/lion12.webp ',
    },
         '3-day-tsavo-east-taita-safari-sentrim-salt-lick' : {
      1: '/elephant12.webp',
      2: '/zebra8.webp',
      3: '/elephant13.webp ',
    },
     '4-day-nairobi-amboseli-tsavo-east-mombasa-diani-watamu' : {
      1: '/elephant14.webp',
      2: '/chetah.webp',
      3: '/elephant15.webp',
      4: '/lion13.webp',
    },
         '4-day-mikumi-nyerere-unforgettable-adventures' : {
      1: '/elephant16.webp',
      2: '/elephant17.webp',
      3: '/giraffe5.webp',
      4: '/elephant18.webp',
    },
    '3-day-budget-safari-tarangire-ngorongoro-manyara' : {
      1: '/tarangire7.webp',
      2: '/ngorongoro14.webp',
      3: '/lion14.webp',
    },
      '4-day-safari-to-ruaha-national-park-tanzania' : {
      1: '/ruaha1.webp',
      2: '/wildLunch2.webp',
      3: '/elephant19.webp',
      4: '/ruaha2.webp',
    },
  },

  vehicleImages: [
    '/landCruiser1.webp',
    '/landCruiser2.webp',
    '/landCruiser3.webp',
    '/landCruiser4.webp',
    '/landCruiser5.webp',
  ]                  
};

// ========================================
// ENHANCED ACCOMMODATION MANAGEMENT SYSTEM
// ========================================
// Professional-grade accommodation system with robust error handling
// and comprehensive logging for debugging purposes

const ACCOMMODATION_MANAGER = {
  // Hotel definitions with complete data structure
  hotels: {
    'ol-tukai-lodge': {
      id: 'ol-tukai-lodge',
      name: 'Ol Tukai Lodge',
      description: 'Luxury lodge inside Amboseli NP',
      meals: 'All Meals Included',
      website: 'https://oltukailodge.com/',
      images: [
        '/oltukai3.webp',
        '/oltukai1.webp',
        '/oltukai4.webp',
        '/oltukai2.webp',
        '/oltukai5.webp',
        '/oltukai6.webp'
      ]
    },
    'lake-naivasha-sopa-resort': {
      id: 'lake-naivasha-sopa-resort',
      name: 'Lake Naivasha Sopa Resort',
      description: 'Mid-range hotel at Lake Naivasha',
      meals: 'Lunch & Dinner Included',
      website: 'https://www.lakenaivasha-soparesort.com/',
      images: [
        '/sopa 12.webp',
        '/sopa 15.webp',
        '/sopa 13.webp',
        '/sopa 11.webp',
        '/sopa 17.webp',
        '/sopa 16.webp'
      ]
    },
    'sarova-lion-hill-game-lodge': {
      id: 'sarova-lion-hill-game-lodge',
      name: 'Sarova Lion Hill Game Lodge',
      description: 'Luxury lodge inside Lake Nakuru NP',
      meals: 'Lunch & Dinner Included',
      website: 'https://sarovahotels.com',
      images: [
        '/sarova1.webp',
        '/sarova2.webp',
        '/sarova3.webp',
        '/sarova7.webp',
        '/sarova5.webp',
        '/sarova6.webp'
      ]
    },
    'sarova-mara-game-camp': {
      id: 'sarova-mara-game-camp',
      name: 'Sarova Mara Game Camp',
      description: 'Luxury tented camp inside Masai Mara NR',
      meals: 'All Meals Included',
      website: 'https://wellworthcollection.co.tz/lake-manyara-kilimamoja/',
      images: [
        '/sarovamara1.webp',
        '/sarovamara2.webp',
        '/sarovamara3.webp',
        '/sarovamara4.webp',
        '/sarovamara5.webp',
        '/sarovamara6.webp'
      ]
    },
    // Additional hotels for other tours
    'lake-manyara-kilimamoja-lodge': {
      id: 'lake-manyara-kilimamoja-lodge',
      name: 'Lake Manyara Kilimamoja Lodge',
      description: 'Luxury lodge overlooking Lake Manyara',
      meals: 'All Meals Included',
      website: 'https://wellworthcollection.co.tz/lake-manyara-kilimamoja/',
      images: [
        '/kilimamoja1.webp',
        '/kilimamoja2.webp',
        '/kilimamoja3.webp',
        '/kilimamoja4.webp'
      ]
    },
    'ngorongoro-lions-paw-camp': {
      name: `Ngorongoro Lion's Paw Camp`,
      description: 'Luxury tented camp located on the crater rim of Ngorongoro Crater',
      meals: 'All Meals Included',
      website: 'https://karibucamps.com/lions-paw/',
      images: [
       '/ngoro1.webp','/ngoro2.webp','/ngoro3.webp','/ngoro4.webp','/ngoro5.webp','/ngoro6.webp','/ngoro7.webp',
      ]
    },
    'melia-serengeti-lodge': {
      name: 'Meliá Serengeti Lodge',
      description: 'Luxury lodge located inside Central Serengeti NP',
      meals: 'All Meals Included',
      website: 'https://www.melia.com/en/hotels/tanzania/serengeti-national-park/hotel-serengeti-lodge-melia-collection',
      images: [
        '/melia1.webp','/melia2.webp','/melia3.webp','/melia4.webp','/melia5.webp','/melia6.webp','/melia7.webp','/melia8.webp','/melia9.webp','/melia10.webp','/melia11.webp','/melia12.webp','/melia13.webp','/melia14.webp','/melia15.webp'
      ]
    },
    'nasikia-mobile-migration-camp': {
      name: 'Nasikia Mobile Migration Camp (Kogatende)',
      description: 'Luxury tented camp located inside Northern Serengeti NP',
      meals: 'All Meals Included',
      website: 'https://nasikiacamps.com/camps-lodges/nasikia-mobile-migration-camp-kogatende/',
      images: [
        '/nasikia1.webp','/nasikia2.webp','/nasikia3.webp','/nasikia4.webp','/nasikia5.webp','/nasikia6.webp','/nasikia7.webp','/nasikia8.webp',
       ] },
    'paraa-safari-lodge': {
      name: 'Paraa Safari Lodge',
      description: 'Luxury lodge located inside Murchison Falls NP',
      meals: 'All Meals Included',
      website: 'https://paraalodge.com/',
      images: [
       '/paraa1.webp','/paraa2.webp','/paraa3.webp','/paraa4.webp','/paraa5.webp','/paraa6.webp','/paraa7.webp','/paraa8.webp','/paraa9.webp','/paraa10.webp'
      ]
    },
    'chimpundu-lodge': {
      name: 'Chimpundu Lodge',
      description: 'Luxury lodge bordering Kibale NP (Chimps) without fences',
      meals: 'All Meals Included',
      website: 'https://chimpundulodge.com/',
      images: [
        '/chimpu1.webp','/chimpu2.webp','/chimpu3.webp','/chimpu4.webp','/chimpu5.webp','/chimpu6.webp','/chimpu7.webp',
      ]
    },
    'mweya-safari-lodge': {
      name: 'Mweya Safari Lodge',
      description: 'Luxury lodge overlooking Kazinga Channel',
      meals: 'All Meals Included',
      website: 'https://mweyalodge.com',
      images: [
        '/mweya1.webp','/mweya2.webp','/mweya3.webp','/mweya4.webp','/mweya5.webp','/mweya6.webp','/mweya7.webp',
      ]
    },
    'mahogany-springs-lodge': {
      name: 'Mahogany Springs Lodge',
      description: 'Luxury lodge bordering Bwindi Impenetrable NP (Gorillas) without fences',
      meals: 'All Meals Included',
      website: 'https://www.mahoganysprings.com/',
      images: [
        '/maho1.webp','/maho2.webp','/maho3.webp','/maho4.webp','/maho5.webp','/maho6.webp','/maho7.webp','/maho8.webp','/maho9.webp',
      ]
    },
    'mihingo-lodge': {
      name: 'Mihingo Lodge',
      description: 'Luxury lodge bordering Lake Mburo NP without fences',
      meals: 'All Meals Included',
      website: 'https://mihingolodge.com/',
      images: [
       '/mihingo1.webp','/mihingo2.webp','/mihingo3.webp','/mihingo4.webp','/mihingo5.webp','/mihingo6.webp','/mihingo7.webp',
      ]
    },
    'tiloreza-volcanoes-ecolodge': {
      name: 'Tiloreza Volcanoes Ecolodge',
      description: 'Mid-range lodge located less than 1hr drive from Volcanoes NP (Gorillas)',
      meals: 'All Meals Included',
      website: 'https://tiloreza.com/',
      images: [
  '/tilo1.webp','/tilo2.webp','/tilo3.webp','/tilo4.webp',
      ]
    },
    'maisha-sweetwaters-camp': {
      name: 'Maisha Sweetwaters Camp',
      description: 'Mid-range tented camp located just outside Ol Pejeta Conservancy (Laikipia Plateau)',
      meals: 'All Meals Included',
      website: 'https://maishasweetwaterscamp.com/',
      images: [
   '/sweetwaters1.webp','/sweetwaters2.webp','/sweetwaters3.webp','/sweetwaters4.webp','/sweetwaters5.webp','/sweetwaters6.webp',
      ]
    },
    'ashnil-samburu-camp': {
      name: 'Ashnil Samburu Camp',
      description: 'Luxury tented camp bordering Samburu NR without fences',
      meals: 'All Meals Included',
      website: 'https://ashnilhotels.com/samburu/',
      images: [
        '/Ashnil1.webp','/Ashnil2.webp','/Ashnil3.webp','/Ashnil4.webp','/Ashnil5.webp','/Ashnil6.webp','/Ashnil7.webp','/Ashnil8.webp','/Ashnil9.webp',
      ]
    },
     'jambo-mara-safari-lodge': {
      name: 'Jambo Mara Safari Lodge',
      description: 'Mid-range resort bordering Masai Mara NR without fences',
      meals: 'All Meals Included',
      website: 'https://jambomara.com/',
      images: [
        '/jambo1.webp','/jambo2.webp','/jambo3.webp','/jambo4.webp','/jambo5.webp','/jambo6.webp','/jambo7.webp','/jambo8.webp','/jambo9.webp','/jambo10.webp','/jambo11.webp','/jambo12.webp','/jambo13.webp','/jambo14.webp',
      ]   
  },
    'avian-court-hotel': {
      name: 'Avian Court Hotel',
      description: 'Mid-range hotel located near Lake Naivasha (Naivasha)',
      meals: 'All Meals Included',
      website: 'https://aviancourthotel.com/',
      images: [
        '/avian1.webp','/avian2.webp','/avian3.webp','/avian4.webp','/avian5.webp','/avian6.webp','/avian7.webp','/avian8.webp','/avian9.webp','/avian10.webp',
      ]   
  }, 
      'hunter-luxury-lodge': {
      name: `Hunter's Luxury Manor`,
      description: 'Luxury tented camp located less than 1hr drive from Amboseli NP',
      meals: 'All Meals Included',
      website: 'https://huntersluxurymanor.com/',
      images: [
        '/hunter1.webp','/hunter2.webp','/hunter3.webp','/hunter4.webp','/hunter5.webp',
      ]   
  },
     'ziwa-bush-lodge': {
      name: `Ziwa Bush Lodge`,
      description: 'Mid-range lodge located just outside Lake Nakuru NP',
      meals: 'All Meals Included',
      website: 'https://www.ziwalodge.com/',
      images: [
        '/ziwa.webp','/ziwa2.webp','/ziwa3.webp','/ziwa4.webp','/ziwa5.webp','/ziwa6.webp',
      ]   
  }, 
    'mara-engai-lodge': {
      name: 'Mara Engai Lodge',
      description: 'Luxury tented camp bordering Mara Triangle (Masai Mara NR) without fences',
      meals: 'All Meals Included',
      website: 'https://www.maraengai.info/',
      images: [
       '/engai1.webp','/engai2.webp','/engai3.webp','/engai4.webp','/engai5.webp','/engai6.webp','/engai7.webp','/engai8.webp','/engai9.webp','/engai10.webp','/engai11.webp','/engai12.webp','/engai13.webp',
      ]   

  },
  'lenchada-tourist-camp': {
 name: 'Lenchada Tourist Camp',
      description: 'Budget tented camp located less than 1hr drive from Masai Mara NR',
      meals: 'All Meals Included',
      website: 'https://lenchadatouristcamp.com/',
      images: [ '/Lenchada1.webp','/Lenchada2.webp','/Lenchada3.webp','/Lenchada4.webp','/Lenchada5.webp','/Lenchada6.webp', ]
  },
    'hillcourt-resort-and-spa': {
      name: 'Hillcourt Resort and Spa',
      description: 'Mid-range resort located in Nakuru City',
      meals: 'All Meals Included',
      website: 'https://www.hillcourtresort.com/',
      images: [ '/hillcourt1.webp','/hillcourt2.webp','/hillcourt3.webp','/hillcourt4.webp','/hillcourt5.webp','/hillcourt6.webp','/hillcourt7.webp','/hillcourt8.webp','/hillcourt9.webp','/hillcourt10.webp', ]
  },
  'hotel-chambai-safari': {
      name: 'Hotel Chambai Safari',
      description: 'Budget hotel located near Lake Naivasha (Naivasha)',
      meals: 'All Meals Included',
      website: 'https://www.hotelchambaisafari.com/',
      images: [ '/chambai1.webp','/chambai2.webp','/chambai3.webp','/chambai4.webp','/chambai5.webp','/chambai6.webp', ]
  },
  'manjaro-tented-camp': {
      name: 'Manjaro Tented Camp',
      description: 'Budget tented camp bordering Amboseli NP without fences',
      meals: 'All Meals Included',
      website: 'https://manjarotentedcamp.com/',
      images: ['/manjaro1.webp','/manjaro2.webp','/manjaro3.webp','/manjaro4.webp','/manjaro5.webp',]
  },
  'fig-lodge': {
      name: 'Fig Lodge',
      description: 'Luxury lodge located in Nairobi',
      meals: 'All Meals Included',
      website: 'https://www.figlodge.com/',
      images: ['/fig1.webp','/fig2.webp','/fig3.webp','/fig4.webp','/fig5.webp','/fig6.webp','/fig7.webp',]
  },
  'budget-camping': {
      name: 'Budget Camping',
      description: 'Budget camping accommodation with basic amenities',
      meals: 'All Meals Included',
      website: '',
      images: ['/camping1.webp','/camping2.webp','/camping3.webp','/camping4.webp','/camping5.webp','/camping6.webp',]
  },
  'ear ken barham guest house': {
    name: 'Ear Ken Barham Guest House',
    description: 'Budget guest house located less than 1hr drive from Nyungwe NP (Chimps)',
    maels: 'All Meals Included',
    website: '',
    images: ['/ken1.webp','/ken2.webp','/ken3.webp','/ken4.webp','/ken5.webp','/ken6.webp',]
  },
  'rwiza-village-guest-house': {
    name: 'Rwiza Village Guest House',
    description: 'Mid-range hotel located at Lake Kivu',
    meals: 'All Meals Included',
    website: '',
    images: ['/rwiza1.webp','/rwiza7.webp','/rwiza3.webp','/rwiza4.webp','/rwiza5.webp','/rwiza6.webp',]
  },
  'bweza-gorilla-lodge': {
    name: 'Bweza Gorilla Lodge',
    description: 'Mid-range lodge located just outside Bwindi Impenetrable NP (Gorillas)',
    meals: 'All Meals Included',
    website: 'https://bwezagorillalodge.com/',
    images: ['/bweze1.webp','/bweze2.webp','/bweze3.webp','/bweze4.webp','/bweze5.webp','/bweze6.webp',]
  },
  'the-bush-lodge': {
    name: 'The Bush Lodge',
    description: 'Mid-range banda located just outside Queen Elizabeth NP',
    meals: 'All Meals Included',
    website: 'https://naturelodgesuganda.com/the-bush-lodge/',
    images: ['/bush1.webp','/bush2.webp','/bush3.webp','/bush4.webp','/bush5.webp','/bush6.webp',]
  },
  'severin-sea-lodge': {
    name: 'Severin Sea Lodge',
    description: 'Mid-range resort located in Mombasa (City)',
    meals: 'All Meals Included',
    website: 'https://www.severinsealodge.com/',
    images: ['/severin1.webp','/severin2.webp','/severin3.webp','/severin4.webp','/severin5.webp','/severin6.webp','/severin7.webp',]
  },
   'diani-sea-resort': {
    name: 'Diani Sea Resort',
    description: 'Mid-range resort located at Diani Beach',
    meals: 'All Meals Included',
    website: 'https://www.dianisearesort.de/',
    images: ['/dianiSea1.webp','/dianiSea2.webp','/dianiSea3.webp','/dianiSea4.webp','/dianiSea5.webp','/dianiSea6.webp','/dianiSea7.webp','/dianiSea8.webp','/dianiSea9.webp','/dianiSea10.webp',]
  },
  '&beyond-kichwa-tembo-tented-camp': {
    name: '&Beyond Kichwa Tembo Tented Camp',
    description: 'Luxury plus tented camp located inside Mara Triangle (Masai Mara NR)',
    meals: 'All Meals Included',
    website: 'https://www.andbeyond.com/our-lodges/africa/kenya/masai-mara-national-park/andbeyond-kichwa-tembo-tented-camp/',
    images: ['/kichwa1.webp','/kichwa2.webp','/kichwa3.webp','/kichwa4.webp','/kichwa5.webp','/kichwa6.webp','/kichwa7.webp','/kichwa8.webp','/kichwa9.webp','/kichwa10.webp','/kichwa11.webp','/kichwa12.webp',]
  },
  'elewana-elsa-kopje-meru': {
    name: `Elewana Elsa's Kopje Meru`,
    description: 'Luxury lodge located inside Meru NP',
    meals: 'All Meals Included',
    website: 'https://www.elewanacollection.com/elsa-s-kopje-meru/at-a-glance',  
    images: ['/elsa1.webp','/elsa2.webp','/elsa3.webp','/elsa4.webp','/elsa5.webp','/elsa6.webp','/elsa7.webp','/elsa8.webp','/elsa9.webp','/elsa10.webp','/elsa11.webp','/elsa12.webp','/elsa13.webp','/elsa14.webp','/elsa15.webp','/elsa16.webp',]
  },
    'sasaab-camp': {
    name: `Sasaab Camp`,
    description: 'Luxury plus tented camp located just outside Samburu NR',
    meals: 'All Meals Included',
    website: 'https://www.thesafaricollection.com/properties/sasaab/',  
    images: ['/sasaab1.webp','/sasaab2.webp','/sasaab3.webp','/sasaab4.webp','/sasaab5.webp','/sasaab6.webp','/sasaab7.webp',]
  },
      'solio-lodge': {
    name: `Solio Lodge`,
    description: 'Luxury plus lodge located inside Solio Ranch (Laikipia Plateau)',
    meals: 'All Meals Included',
    website: 'https://www.thesafaricollection.com/properties/solio-lodge/',  
    images: ['/solio1.webp','/solio2.webp','/solio3.webp','/solio4.webp','/solio5.webp','/solio6.webp','/solio7.webp','/solio8.webp','/solio9.webp','/solio10.webp',]
  },
    'gran-melia-arusha': {
    name: `Gran Meliá Arusha`,
    description: 'Luxury hotel located in Arusha (City)',
    meals: 'All Meals Included',
    website: 'https://www.melia.com/en/hotels/tanzania/arusha',  
    images: ['/meliaArusha1.webp','/meliaArusha2.webp','/meliaArusha3.webp','/meliaArusha4.webp','/meliaArusha5.webp','/meliaArusha6.webp','/meliaArusha7.webp','/meliaArusha8.webp','/meliaArusha9.webp','/meliaArusha10.webp','/meliaArusha11.webp','/meliaArusha12.webp','/meliaArusha13.webp','/meliaArusha14.webp','/meliaArusha15.webp','/meliaArusha16.webp']
  },
  'lake-manyara-kilimamoja-lodge': {
    name: 'Lake Manyara Kilimamoja Lodge',
    description: 'Luxury lodge located 1-2hr drive from Tarangire NP',
    meals: 'All Meals Included',
    website: 'https://wellworthcollection.co.tz/lake-manyara-kilimamoja/',
    images: ['/kilimaMoja1.webp','/kilimaMoja2.webp','/kilimaMoja3.webp','/kilimaMoja4.webp','/kilimaMoja5.webp','/kilimaMoja6.webp','/kilimaMoja7.webp','/kilimaMoja8.webp','/kilimaMoja9.webp','/kilimaMoja10.webp','/kilimaMoja11.webp',]
  },
  'four-seasons-safari-lodge-serengeti' : {
    name: 'Four Seasons Safari Lodge Serengeti',
    description: 'Luxury lodge inside Central Serengeti NP',
    meals: 'All Meals Included',
    website: 'https://www.fourseasons.com/serengeti/',
    images: ['/fourSeasons1.webp','/fourSeasons2.webp','/fourSeasons3.webp','/fourSeasons4.webp','/fourSeasons5.webp','/fourSeasons6.webp','/fourSeasons7.webp','/fourSeasons8.webp','/fourSeasons9.webp','/fourSeasons10.webp','/fourSeasons11.webp','/fourSeasons12.webp','/fourSeasons13.webp',]
  },
  'ngorongoro-lodge-melia-collection' : {
    name: 'Ngorongoro Lodge Meliá Collection',
    description: 'Luxury lodge on the crater rim of Ngorongoro Crater',
    meals: 'All Meals Included',
    website: 'https://www.melia.com/en/hotels/tanzania/ngorongoro-crater/ngorongoro-lodge-melia-collection',
    images: ['/ngorongoroMelia1.webp','/ngorongoroMelia2.webp','/ngorongoroMelia3.webp','/ngorongoroMelia4.webp','/ngorongoroMelia5.webp','/ngorongoroMelia6.webp','/ngorongoroMelia7.webp','/ngorongoroMelia8.webp','/ngorongoroMelia9.webp','/ngorongoroMelia10.webp','/ngorongoroMelia11.webp','/ngorongoroMelia12.webp','/ngorongoroMelia13.webp','/ngorongoroMelia14.webp','/ngorongoroMelia15.webp','/ngorongoroMelia16.webp']
  },
  'zanzibar-serena-hotel' : {
    name: 'Zanzibar Serena Hotel',
    description: 'Luxury hotel located in Stone Town (Zanzibar)',
    meals: 'All Meals Included',
    website: 'https://www.serenahotels.com/zanzibar',
    images: ['/serenaZanzibar1.webp','/serenaZanzibar2.webp','/serenaZanzibar3.webp','/serenaZanzibar4.webp','/serenaZanzibar5.webp','/serenaZanzibar6.webp','/serenaZanzibar7.webp','/serenaZanzibar8.webp','/serenaZanzibar9.webp','/serenaZanzibar10.webp','/serenaZanzibar11.webp','/serenaZanzibar12.webp','/serenaZanzibar13.webp','/serenaZanzibar14.webp','/serenaZanzibar15.webp',]
  },
  'emerald-zanzibar-resort-spa': {
    name: 'Emerald Zanzibar Resort & Spa',
    description: 'Luxury resort at Matemwe Beach (Zanzibar)',
    meals: 'All Meals Included',
    website: 'https://my.emerald-zanzibar.com/',
    images: ['/emerald1.webp','/emerald2.webp','/emerald3.webp','/emerald4.webp','/emerald5.webp','/emerald6.webp','/emerald7.webp','/emerald8.webp','/emerald9.webp','/emerald10.webp','/emerald11.webp',]
  },
  'elewana-sand-river-masai-mara': {
    name: 'Elewana Sand River Masai Mara',
    description: 'Luxury plus lodge located inside Masai Mara NR',
    meals: 'All Meals Included',
    website: 'https://www.elewanacollection.com/sand-river-masai-mara/at-a-glance',
    images: ['/sandRiver1.webp','/sandRiver2.webp','/sandRiver3.webp','/sandRiver4.webp','/sandRiver5.webp','/sandRiver6.webp','/sandRiver7.webp','/sandRiver8.webp','/sandRiver9.webp','/sandRiver10.webp','/sandRiver11.webp','/sandRiver12.webp','/sandRiver13.webp','/sandRiver14.webp',' /sandRiver15.webp','/sandRiver16.webp','/sandRiver17.webp','/sandRiver18.webp','/sandRiver19.webp','/sandRiver20.webp','/sandRiver21.webp','/sandRiver22.webp','/sandRiver23.webp','/sandRiver24.webp','/sandRiver25.webp','/sandRiver26.webp','/sandRiver27.webp','/sandRiver28.webp',]
  },
  'kings-camp' : {
    name: 'Kings Camp',
    description: 'Luxury plus lodge inside Timbavati NR (Greater Kruger)',
    meals: 'All Meals Included',
    website: 'https://www.kingscamp.com/',
    images: ['/kings1.webp','/kings2.webp','/kings3.webp','/kings4.webp','/kings5.webp','/kings6.webp','/kings7.webp','/kings8.webp','/kings9.webp',]
  },
  'leopard-hills-lodge' : {
    name: 'Leopard Hills Lodge',
    description: 'Luxury plus lodge inside Leopard Hills GR (Sabi Sands)',
    meals: 'All Meals Included',
    website: 'https://www.leopardhills.com/',
    images: ['/leopardHills1.webp','/leopardHills2.webp','/leopardHills3.webp','/leopardHills4.webp','/leopardHills5.webp','/leopardHills6.webp','/leopardHills7.webp','/leopardHills8.webp','/leopardHills9.webp',]
  },
  'serengeti-serena-safari-lodge' : {
    name: 'Serengeti Serena Safari Lodge',
    description: 'Luxury lodge inside Central Serengeti NP',
    meals: 'All Meals Included',
    website: 'https://www.serenahotels.com/serengeti',
    images: ['/serenaSerengeti1.webp','/serenaSerengeti2.webp','/serenaSerengeti3.webp','/serenaSerengeti4.webp','/serenaSerengeti5.webp','/serenaSerengeti6.webp','/serenaSerengeti7.webp','/serenaSerengeti8.webp','/serenaSerengeti9.webp','/serenaSerengeti10.webp','/serenaSerengeti11.webp','/serenaSerengeti12.webp','/serenaSerengeti13.webp','/serenaSerengeti14.webp','/serenaSerengeti15.webp','/serenaSerengeti16.webp','/serenaSerengeti17.webp','/serenaSerengeti18.webp','/serenaSerengeti19.webp','/serenaSerengeti20.webp','/serenaSerengeti21.webp',]
  },
  'ngorongoro-serena-safari-lodge' : {
    name: 'Ngorongoro Serena Safari Lodge',
    description: 'Luxury lodge on the crater rim of Ngorongoro Crater',
    meals: 'All Meals Included',
    website: 'https://www.serenahotels.com/ngorongoro',
    images: ['/ngorongoroSerena1.webp','/ngorongoroSerena2.webp','/ngorongoroSerena3.webp','/ngorongoroSerena4.webp','/ngorongoroSerena5.webp','/ngorongoroSerena6.webp','/ngorongoroSerena7.webp','/ngorongoroSerena8.webp','/ngorongoroSerena9.webp','/ngorongoroSerena10.webp','/ngorongoroSerena11.webp','/ngorongoroSerena12.webp','/ngorongoroSerena13.webp','/ngorongoroSerena14.webp',]
  },
  'enkorok-mara-camp' : {
    name: 'Enkorok Mara Camp',
    description: 'Mid-range tented camp located just outside Masai Mara NR',
    meals: 'All Meals Included',
    website: 'https://www.enkorokmaracamp.com/',
    images: ['/enkorok1.webp','/enkorok2.webp','/enkorok3.webp','/enkorok4.webp','/enkorok5.webp','/enkorok6.webp','/enkorok7.webp','/enkorok8.webp','/enkorok9.webp','/enkorok10.webp','/enkorok11.webp','/enkorok12.webp','/enkorok13.webp',]
  },
  'sarova-woodlands-hotel-spa' : {
    name: 'Sarova Woodlands Hotel & Spa',
    description: 'Mid-range hotel located less than 1hr drive from Lake Nakuru NP',
    meals: 'All Meals Included',
    website: 'https://sarovahotels.com/woodlands/',
    images: ['/SarovaWoodLands1.webp','/SarovaWoodLands2.webp','/SarovaWoodLands3.webp','/SarovaWoodLands4.webp','/SarovaWoodLands5.webp','/SarovaWoodLands6.webp','/SarovaWoodLands7.webp','/SarovaWoodLands8.webp',]
  },
  'summit-safari-lodge' : {
    name: 'Summit Safari Lodge',
    description: 'Mid-range lodge in Arusha (City)',
    meals: 'All Meals Included',
    website: 'https://summitlodge.co.tz/',
    images: ['/summitSafari1.webp','/summitSafari2.webp','/summitSafari3.webp','/summitSafari4.webp','/summitSafari5.webp','/summitSafari6.webp','/summitSafari7.webp','/summitSafari8.webp','/summitSafari9.webp','/summitSafari10.webp','/summitSafari11.webp','/summitSafari12.webp','/summitSafari13.webp','/summitSafari14.webp','/summitSafari15.webp','/summitSafari16.webp','/summitSafari17.webp','/summitSafari18.webp','/summitSafari19.webp','/summitSafari20.webp','/summitSafari21.webp','/summitSafari22.webp','/summitSafari23.webp',]
  },
  'migombani-campsite' : {
    name: 'Migombani Campsite',
    description: 'Budget camping 1-2hr drive from Tarangire NP',
    meals: 'All Meals Included',
    website: 'https://migombanicampsite.com/',
    images: ['/migombani1.webp','/migombani2.webp','/migombani3.webp','/migombani4.webp','/migombani5.webp','/migombani6.webp',]
  },
  'seronera-public-campsite' : {
    name: 'Seronera Public Campsite',
    description: 'Budget camping inside Central Serengeti NP',
    meals: 'All Meals Included',
    website: '',
    images: ['/seroneraCampingsite1.webp','/seroneraCampsite2.webp','/seroneraCampsite3.webp','/seroneraCampsite4.webp','/seroneraCampsite5.webp','/seroneraCampsite6.webp',]
  },
  'ngorongoro-simba-campsite-a' : {
    name: 'Ngorongoro Simba Campsite A',
    description: 'Budget camping on the crater rim of Ngorongoro Crater',
    meals: 'All Meals Included',
    website: '',
    images: ['/simbaCampsite1.webp','/simbaCampsite2.webp','/simbaCampsite3.webp','/simbaCampsite4.webp','/simbaCampsite5.webp','/simbaCampsite6.webp',]
  },
  'arusha-gateway-lodge-ii' : {
    name: 'Arusha Gateway Lodge II',
    description: 'Budget lodge located in Arusha (City)',
    meals: 'All Meals Included',
    website: 'https://www.arushagatewaylodge.com/',
    images: ['/arushaGateway1.webp','/arushaGateway2.webp','/arushaGateway3.webp','/arushaGateway4.webp','/arushaGateway5.webp','/arushaGateway6.webp',]
  },
  'materuni-homes': {
    name: 'Materuni Homes',
    description: 'Budget lodge located near Moshi (Town)',
    meals: 'All Meals Included',
    website: 'https://materunihomes.com/',
    images: ['/materuni1.webp','/materuni2.webp','/materuni3.webp','/materuni4.webp','/materuni5.webp','/materuni6.webp','/materuni7.webp','/materuni8.webp','/materuni9.webp','/materuni10.webp','/materuni11.webp','/materuni12.webp','/materuni13.webp','/materuni14.webp','/materuni15.webp',]
  },
  'selous-ngalawa-camp' : {
    name: 'Selous Ngalawa Camp',
    description: 'Budget tented camp located just outside Nyerere NP',
    meals: 'All Meals Included',
    website: 'https://www.selousrufijihippoadventure.com/',
    images: ['/selous1.webp','/selous2.webp','/selous3.webp','/selous4.webp','/selous5.webp','/selous6.webp',]
  },
  'camp-bastian-mikumi': {
    name: 'Camp Bastian Mikumi',
    description: 'Mid-range lodge located just outside Mikumi NP',
    meals: 'All Meals Included',
    website: 'https://www.campbastian.com/',
    images: ['/bastian1.webp','/bastian2.webp','/bastian3.webp','/bastian4.webp','/bastian5.webp','/bastian6.webp','/bastian7.webp','/bastian7.webp','/bastian8.webp','/bastian8.webp','/bastian9.webp','/bastian10.webp','/bastian11.webp','/bastian12.webp','/bastian13.webp','/bastian14.webp','/bastian15.webp',]
  },
  'parkside-safari-lodge' : {
    name: 'Parkside Safari Lodge',
    description: 'Budget lodge just outside Murchison Falls NP',
    meals: 'All Meals Included',
    website: 'https://www.parksidesafarilodge.com/',
    images: ['/parkside1.webp','/parkside2.webp','/parkside3.webp','/parkside4.webp','/parkside5.webp','/parkside6.webp','/parkside7.webp',]
  },
  'kruger-adventure-lodge': {
    name: 'Kruger Adventure Lodge',
    description: 'Budget lodge near Hazyview (Town)',
    meals: 'All Meals Included',
    website: 'https://www.krugeradventurelodge.co.za/',
    images: ['/krugerAdventures1.webp','/krugerAdventure2.webp','/krugerAdventure3.webp','/krugerAdventure4.webp','/krugerAdventure5.webp','/krugerAdventure6.webp','/krugerAdventure7.webp','/krugerAdventure8.webp','/krugerAdventure9.webp','/krugerAdventure10.webp','/krugerAdventure11.webp','/krugerAdventure12.webp','/krugerAdventure13.webp','/krugerAdventure14.webp','/krugerAdventure15.webp','/krugerAdventure16.webp','/krugerAdventure17.webp','/krugerAdventure18.webp','/krugerAdventure19.webp',]
  },
  'elewana-tarangire-treetops': {
    name: 'Elewana Tarangire Treetops',
    description: 'Luxury lodge just outside Tarangire NP',
    meals: 'All Meals Included',
    website: 'http://www.elewanacollection.com/tarangire-treetops/tarangire-treetops-at-a-glance',
     images: ['/elewana1.webp','/elewana2.webp','/elewana3.webp','/elewana4.webp','/elewana5.webp','/elewana6.webp']
  },
    'warangi-ridge-lodge': {
    name: 'Warangi Ridge Lodge',
    description: 'Luxury tented camp inside Central Serengeti NP',
    meals: 'All Meals Included',
    website: 'https://thewildernesscollection.com/warangi-ridge/',
     images: ['/warangi1.webp','/warangi2.webp','/warangi3.webp','/warangi4.webp','/warangi5.webp','/warangi6.webp','/warangi7.webp','/warangi8.webp','/warangi9.webp','/warangi10.webp']
  },
   'craters-edge-lodge': {
    name: 'Craters Edge Lodge',
    description: 'Luxury lodge less than 1hr drive from Ngorongoro Crater',
    meals: 'All Meals Included',
    website: 'https://thewildernesscollection.com/craters-edge/',
     images: ['/cratersEdge1.webp','/cratersEdge2.webp','/cratersEdge3.webp','/cratersEdge4.webp','/cratersEdge5.webp','/cratersEdge6.webp','/cratersEdge7.webp','/cratersEdge8.webp','/cratersEdge9.webp','/cratersEdge10.webp','/cratersEdge11.webp','/cratersEdge12.webp','/cratersEdge13.webp']
  },
     'nanyukie-lodge': {
    name: 'Nanyukie Lodge',
    description: 'Luxury plus tented camp inside Central Serengeti NP',
    meals: 'All Meals Included',
    website: 'https://www.lemalacamps.com/stay/nanyukie-lodge/',
     images: ['/nanyukieLodge1.webp','/nanyukieLodge2.webp','/nanyukieLodge3.webp','/nanyukieLodge4.webp','/nanyukieLodge5.webp','/nanyukieLodge6.webp','/nanyukieLodge7.webp','/nanyukieLodge8.webp',]
  },
   'mawe-mawe-lodge': {
    name: 'Mawe Mawe Lodge',
    description: 'Luxury lodge on the escarpment above Lake Manyara NP',
    meals: 'All Meals Included',
    website: 'https://mawemawemanyaralodge.co.tz/',
     images: ['/mawemawe1.webp','/mawemawe3.webp','/mawemawe4.webp','/mawemawe5.webp','/mawemawe6.webp','/mawemawe7.webp','/mawemawe8.webp','/mawemawe9.webp','/mawemawe10.webp',]
  },
  'the-highlands-camp': {
    name: 'The Highlands Camp',
    description: 'Luxury plus tented camp bordering Ngorongoro Crater without fences',
    meals: 'All Meals Included',
    website: 'https://www.asiliaafrica.com/camps-lodges/the-highlands-camp/',
     images: ['/highlandsCamp1.webp','/highlandsCamp3.webp','/highlandsCamp4.webp','/highlandsCamp5.webp','/highlandsCamp6.webp','/highlandsCamp7.webp','/highlandsCamp8.webp','/highlandsCamp9.webp','/highlandsCamp10.webp',]
  },
  'baobab-mara-luxury-camp' : {
    name: 'Baobab Mara Luxury Camp',
    description: 'Luxury tented camp inside Northern Serengeti NP',
    meals: 'All Meals Included',
    website: 'https://baobablodges.com/mara-luxury-camps/',
     images: ['/boababMara1.webp','/boababMara2.webp','/boababMara3.webp','/boababMara4.webp','/boababMara5.webp','/boababMara6.webp','/boababMara7.webp','/boababMara8.webp','/boababMara9.webp','/boababMara10.webp',,'/boababMara11.webp','/boababMara12.webp','/boababMara13.webp',]
  },
    'tanzania-bush-camps' : {
    name: 'Tanzania Bush Camps - Central Serengeti',
    description: 'Mid-range tented camp inside Central Serengeti NP',
    meals: 'All Meals Included',
    website: 'https://tanzaniabushcamps.com/central-serengeti/',
     images: ['/serengeti-tanzania-bush1.webp','/serengeti-tanzania-bush2.webp','/serengeti-tanzania-bush3.webp','/serengeti-tanzania-bush4.webp','/serengeti-tanzania-bush5.webp','/serengeti-tanzania-bush6.webp','/serengeti-tanzania-bush7.webp','/serengeti-tanzania-bush8.webp','/serengeti-tanzania-bush9.webp','/serengeti-tanzania-bush10.webp','/serengeti-tanzania-bush11.webp','/serengeti-tanzania-bush12.webp','/serengeti-tanzania-bush13.webp','/serengeti-tanzania-bush14.webp','/serengeti-tanzania-bush15.webp','/serengeti-tanzania-bush16.webp','/serengeti-tanzania-bush17.webp','/serengeti-tanzania-bush18.webp',]
  }, 
   'moyo-tented-camp' : {
    name: 'Moyo Tented Camp',
    description: 'Luxury tented camp inside Central Serengeti NP',
    meals: 'All Meals Included',
    website: 'https://www.moyotentedcamp.com/',
     images: ['/moyo-tented-camp1.webp','/moyo-tented-camp2.webp','/moyo-tented-camp3.webp','/moyo-tented-camp4.webp','/moyo-tented-camp5.webp','/moyo-tented-camp6.webp','/moyo-tented-camp7.webp','/moyo-tented-camp8.webp','/moyo-tented-camp9.webp','/moyo-tented-camp10.webp','/moyo-tented-camp11.webp',]
  }, 
     'ngorongoro-marera-mountain-view-lodge' : {
    name: 'Ngorongoro Marera Mountain View Lodge',
    description: 'Luxury lodge 1-2hr drive from Tarangire NP',
    meals: 'All Meals Included',
    website: 'https://mareraviewlodge.com/',
     images: ['/ngorongoro-Marera-mountain-view1.webp','/ngorongoro-Marera-mountain-view2.webp','/ngorongoro-Marera-mountain-view3.webp','/ngorongoro-Marera-mountain-view4.webp','/ngorongoro-Marera-mountain-view5.webp','/ngorongoro-Marera-mountain-view6.webp','/ngorongoro-Marera-mountain-view7.webp','/ngorongoro-Marera-mountain-view8.webp','/ngorongoro-Marera-mountain-view9.webp',]
  }, 
     'into-wild-africa-luxury-safari-camp-serengeti' : {
    name: 'Into Wild Africa Luxury Safari Camp Serengeti',
    description: 'Mid-range tented camp inside Central Serengeti NP',
    meals: 'All Meals Included',
    website: 'https://intowildafrica.com/',
    images: ['/into-the-wild-africa1.webp','/into-the-wild-africa2.webp','/into-the-wild-africa3.webp','/into-the-wild-africa4.webp','/into-the-wild-africa5.webp','/into-the-wild-africa6.webp','/into-the-wild-africa7.webp','/into-the-wild-africa8.webp','/into-the-wild-africa9.webp','/into-the-wild-africa10.webp','/into-the-wild-africa11.webp',]
},   
     'sweetwaters-serena-camp' : {
    name: 'Sweetwaters Serena Camp',
    description: 'Luxury tented camp inside Ol Pejeta Conservancy (Laikipia Plateau)',
    meals: 'All Meals Included',
    website: 'https://www.serenahotels.com/sweetwaters',
    images: ['/sweetwaters-serena-camp1.webp','/sweetwaters-serena-camp2.webp','/sweetwaters-serena-camp3.webp','/sweetwaters-serena-camp4.webp','/sweetwaters-serena-camp5.webp','/sweetwaters-serena-camp6.webp','/sweetwaters-serena-camp7.webp','/sweetwaters-serena-camp8.webp','/sweetwaters-serena-camp9.webp','/sweetwaters-serena-camp10.webp','/sweetwaters-serena-camp11.webp','/sweetwaters-serena-camp12.webp','/sweetwaters-serena-camp13.webp','/sweetwaters-serena-camp14.webp','/sweetwaters-serena-camp15.webp','/sweetwaters-serena-camp16.webp','/sweetwaters-serena-camp17.webp','/sweetwaters-serena-camp18.webp','/sweetwaters-serena-camp19.webp','/sweetwaters-serena-camp20.webp','/sweetwaters-serena-camp21.webp','/sweetwaters-serena-camp22.webp','/sweetwaters-serena-camp23.webp','/sweetwaters-serena-camp24.webp','/sweetwaters-serena-camp25.webp',]
}, 
     'hhando-coffee-lodge' : {
    name: 'Hhando Coffee Lodge',
    description: 'Mid-range lodge 1-2hr drive from Tarangire NP',
    meals: 'All Meals Included',
    website: 'https://www.hhandocoffeelodge.com/',
    images: ['/hhando-coffee-lodge1.webp','/hhando-coffee-lodge2.webp','/hhando-coffee-lodge3.webp','/hhando-coffee-lodge4.webp','/hhando-coffee-lodge5.webp','/hhando-coffee-lodge6.webp','/hhando-coffee-lodge7.webp','/hhando-coffee-lodge8.webp','/hhando-coffee-lodge9.webp','/hhando-coffee-lodge10.webp','/hhando-coffee-lodge11.webp','/hhando-coffee-lodge12.webp','/hhando-coffee-lodge13.webp',]
}, 
     'marera-valley-lodge' : {
    name: 'Marera Valley Lodge',
    description: 'Mid-range lodge 1-2hr drive from Ngorongoro Crater',
    meals: 'All Meals Included',
    website: 'https://mareravalley.com/',
    images: ['/marera-valley-lodge1.webp','/marera-valley-lodge2.webp','/marera-valley-lodge3.webp','/marera-valley-lodge4.webp','/marera-valley-lodge5.webp','/marera-valley-lodge6.webp','/marera-valley-lodge7.webp','/marera-valley-lodge8.webp',]
},
  'tulia-boutique-hotel-spa' : {
    name: 'Tulia Boutique Hotel & Spa',
    description: 'Mid-range hotel in Arusha (City)',
    meals: 'All Meals Included',
    website: 'https://www.tuliahotelandspa.com/',
    images: ['/tulia-boutique-hotel1.webp','/tulia-boutique-hotel2.webp','/tulia-boutique-hotel3.webp','/tulia-boutique-hotel4.webp','/tulia-boutique-hotel5.webp','/tulia-boutique-hotel6.webp','/tulia-boutique-hotel7.webp','/tulia-boutique-hotel8.webp','/tulia-boutique-hotel9.webp','/tulia-boutique-hotel10.webp','/tulia-boutique-hotel11.webp','/tulia-boutique-hotel12.webp','/tulia-boutique-hotel13.webp','/tulia-boutique-hotel14.webp','/tulia-boutique-hotel15.webp','/tulia-boutique-hotel16.webp','/tulia-boutique-hotel17.webp','/tulia-boutique-hotel18.webp','/tulia-boutique-hotel19.webp',]
},
  'bougainvillea-safari-lodge' : {
    name: 'Bougainvillea Safari Lodge',
    description: 'Mid-range lodge 1-2hr drive from Tarangire NP',
    meals: 'All Meals Included',
    website: 'https://bougainvilleasafarilodge.com/',
    images: ['/bougainvillea-safari-lodge1.webp','/bougainvillea-safari-lodge2.webp','/bougainvillea-safari-lodge3.webp','/bougainvillea-safari-lodge4.webp','/bougainvillea-safari-lodge5.webp','/bougainvillea-safari-lodge6.webp','/bougainvillea-safari-lodge7.webp','/bougainvillea-safari-lodge8.webp',]
},
  'camp-lilac' : {
    name: 'Camp Lilac',
    description: 'Mid-range tented camp just outside Mikumi NP',
    meals: 'All Meals Included',
    website: 'https://www.camp-lilac.com/',
    images: ['/camp-lilac.webp','/camp-lilac2.webp','/camp-lilac3.webp','/camp-lilac4.webp','/camp-lilac5.webp','/camp-lilac6.webp','/camp-lilac7.webp','/camp-lilac8.webp','/camp-lilac9.webp','/camp-lilac31.webp']
},
  'TANAPA-ruaha-bandas' : {
    name: 'TANAPA Ruaha Bandas',
    description: 'Budget banda inside Ruaha NP',
    meals: 'All Meals Included',
    website: '',
    images: ['/tanapa-ruaha-bandas.webp',]
},
  'ruaha-hilltop-lodge' : {
    name: 'Ruaha Hilltop Lodge',
    description: 'Mid-range lodge less than 1hr drive from Ruaha NP',
    meals: 'All Meals Included',
    website: 'https://www.ruahahilltoplodge.com/',
    images: ['/ruaha-hilltop-lodge1.webp','/ruaha-hilltop-lodge2.webp','/ruaha-hilltop-lodge3.webp','/ruaha-hilltop-lodge4.webp','/ruaha-hilltop-lodge5.webp','/ruaha-hilltop-lodge6.webp','/ruaha-hilltop-lodge7.webp','/ruaha-hilltop-lodge8.webp',]
},
  'penety-amboseli-resort' : {
    name: 'Penety Amboseli Resort',
    description: 'Mid-range hotel less than 1hr drive from Amboseli NP',
    meals: 'All Meals Included',
    website: 'https://penetyresorts.com/',
    images: ['/penety-amboseli-resort1.webp','/penety-amboseli-resort2.webp','/penety-amboseli-resort3.webp','/penety-amboseli-resort4.webp','/penety-amboseli-resort5.webp','/penety-amboseli-resort6.webp','/penety-amboseli-resort7.webp','/penety-amboseli-resort8.webp','/penety-amboseli-resort10.webp','/penety-amboseli-resort11.webp',]
},
  'ngulia-safari-lodge' : {
    name: 'Ngulia Safari Lodge',
    description: 'Mid-range lodge inside Tsavo West NP',
    meals: 'All Meals Included',
    website: 'https://nguliasafarilodge.com/',
    images: ['/ngulia-safari-lodge1.webp','/ngulia-safari-lodge2.webp','/ngulia-safari-lodge3.webp','/ngulia-safari-lodge4.webp','/ngulia-safari-lodge5.webp','/ngulia-safari-lodge6.webp','/ngulia-safari-lodge7.webp',]
}, 
  'voi-safari-lodge' : {
    name: 'Voi Safari Lodge',
    description: 'Mid-range lodge inside Tsavo East NP',
    meals: 'All Meals Included',
    website: 'https://voisafarilodge.com/',
    images: ['/voi-safari-lodge1.webp','/voi-safari-lodge2.webp','/voi-safari-lodge3.webp','/voi-safari-lodge4.webp','/voi-safari-lodge5.webp','/voi-safari-lodge6.webp','/voi-safari-lodge7.webp','/voi-safari-lodge8.webp','/voi-safari-lodge9.webp','/voi-safari-lodge10.webp','/voi-safari-lodge11.webp',]
}, 
  'nyati-safari-camp' : {
    name: 'Nyati Safari Camp',
    description: 'Budget tented camp just outside Amboseli NP',
    meals: 'All Meals Included',
    website: 'https://www.nyatisafaricamp.com/',
    images: ['/nyati-safari-camp1.webp','/nyati-safari-camp2.webp','/nyati-safari-camp3.webp','/nyati-safari-camp4.webp','/nyati-safari-camp5.webp','/nyati-safari-camp6.webp','/nyati-safari-camp7.webp','/nyati-safari-camp8.webp','/nyati-safari-camp9.webp','/nyati-safari-camp10.webp','/nyati-safari-camp11.webp',]
},  
  'red-elephant-safari-lodge' : {
    name: 'Red Elephant Safari Lodge',
    description: 'Mid-range lodge outside Tsavo East NP',
    meals: 'All Meals Included',
    website: 'https://www.red-elephant-lodge.com/offline/',
    images: ['/red-elephant-lodge1.webp','/red-elephant-lodge2.webp','/red-elephant-lodge3.webp','/red-elephant-lodge4.webp','/red-elephant-lodge5.webp','/red-elephant-lodge6.webp','/red-elephant-lodge7.webp',]
}, 
  'umoja-campsite' : {
    name: 'Umoja Campsite',
    description: 'Budget camping just outside Samburu NR',
    meals: 'All Meals Included',
    website: 'https://www.umojawomen.or.ke/qinstpckg/index.php',
    images: ['/umoja-campsite1.webp','/umoja-campsite2.webp','/umoja-campsite3.webp','/umoja-campsite4.webp','/umoja-campsite5.webp',]
}, 
  'judmaier-campsite' : {
    name: 'Judmaier Campsite',
    description: 'Budget mountain hut on Mt Kenya',
    meals: 'All Meals Included',
    website: 'https://www.umojawomen.or.ke/qinstpckg/index.php',
    images: ['/judmaier-campsite.webp',]
}, 
  'shipton-campsite' : {
    name: 'Shipton Campsite',
    description: 'Budget camping on Mt Kenyaa',
    meals: 'All Meals Included',
    website: '',
    images: ['/shiptons1.webp','/shiptons2.webp','/shiptons3.webp','/shiptons4.webp','/shiptons5.webp','/shiptons6.webp',]
}, 
  'lion-hill-lodge' : {
    name: 'Lion Hill Lodge',
    description: 'Budget lodge less than 1hr drive from Tsavo East NP',
    meals: 'All Meals Included',
    website: 'https://lionhilllodge.com/',
    images: ['/lionHillLodge1.webp','/lionHillLodge2.webp','/lionHillLodge3.webp','/lionHillLodge4.webp','/lionHillLodge5.webp','/lionHillLodge6.webp','/lionHillLodge7.webp','/lionHillLodge8.webp','/lionHillLodge9.webp','/lionHillLodge10.webp',]
}, 
  'salt-lick-safari-lodge' : {
    name: 'Salt Lick Safari Lodge',
    description: 'Luxury lodge inside Taita Hills WS',
    meals: 'All Meals Included',
    website: 'https://saltlicksafarilodge.com/',
    images: ['/saltLickSafariLodge1.webp','/saltLickSafariLodge2.webp','/saltLickSafariLodge3.webp','/saltLickSafariLodge4.webp','/saltLickSafariLodge5.webp','/saltLickSafariLodge6.webp','/saltLickSafariLodge7.webp','/saltLickSafariLodge8.webp',]
},  
  'boma-simba-safari-lodge' : {
    name: 'Boma Simba Safari Lodge',
    description: 'Budget lodge less than 1hr drive from Tsavo East NP',
    meals: 'All Meals Included',
    website: 'https://bomasimbalodge.com/',
    images: ['/bombasimbasafarilodge1.webp','/bombasimbasafarilodge2.webp','/bombasimbasafarilodge3.webp','/bombasimbasafarilodge4.webp','/bombasimbasafarilodge5.webp','/bombasimbasafarilodge6.webp','/bombasimbasafarilodge7.webp','/bombasimbasafarilodge8.webp',]
},   
  'Mloka Safari Lodge' : {
    name: 'Mloka Safari Lodge',
    description: 'Budget lodge less than 1hr drive from Tsavo East NP',
    meals: 'All Meals Included',
    website: 'https://www.mlokasafarilodge.com/',
    images: ['/mlokaSafariLodge1.webp','/mlokaSafariLodge2.webp','/mlokaSafariLodge3.webp','/mlokaSafariLodge4.webp','/mlokaSafariLodge5.webp','/mlokaSafariLodge6.webp','/mlokaSafariLodge7.webp','/mlokaSafariLodge8.webp','/mlokaSafariLodge9.webp','/mlokaSafariLodge10.webp','/mlokaSafariLodge11.webp','/mlokaSafariLodge12.webp','/mlokaSafariLodge13.webp','/mlokaSafariLodge14.webp','/mlokaSafariLodge15.webp','/mlokaSafariLodge16.webp',]
}, 
 'TANAPA-ruaha-cottages' : {
    name: 'TANAPA-Ruaha-Cottages',
    description: 'Budget cottage inside Ruaha NP',
    meals: 'All Meals Included',
    website: '',
    images: ['/tanapaRuahaCottages1.webp','/tanapaRuahaCottages2.webp',]
},    
  




  },
  // Tour accommodation mapping with normalized day keys
  tourAccommodations: {
    '7-Day-Kenyan-Luxury-Safari': {
      '1': 'ol-tukai-lodge',
      '2': 'ol-tukai-lodge',
      '3': 'lake-naivasha-sopa-resort',
      '4': 'sarova-lion-hill-game-lodge',
      '5': 'sarova-mara-game-camp',
      '6': 'sarova-mara-game-camp'
    },
    'tanzania-great-migration': {
      '1': 'lake-manyara-kilimamoja-lodge',
      '2': 'ngorongoro-lions-paw-camp',
      '3': 'melia-serengeti-lodge',
      '4': 'melia-serengeti-lodge',
      '5-6': 'nasikia-mobile-migration-camp'
    },
    'Uganda-Ultimate-Luxury-Safari': {
      '1': 'paraa-safari-lodge',
      '2': 'paraa-safari-lodge',
      '3': 'chimpundu-lodge',
      '4': 'chimpundu-lodge',
      '5': 'mweya-safari-lodge',
      '6': 'mweya-safari-lodge',
      '7': 'mahogany-springs-lodge',
      '8': 'mahogany-springs-lodge',
      '9': 'mihingo-lodge'
    },
    'rwanda-mountain-gorillas': {
      '1': 'tiloreza-volcanoes-ecolodge',
      '2': 'tiloreza-volcanoes-ecolodge',
      '3': 'tiloreza-volcanoes-ecolodge'
    },
    '10-Day-Kenya-Safari-ol-Pejeta-Samburu-Nakuru-Mara-Amboseli': {
      '1': 'maisha-sweetwaters-camp',
      '2': 'ashnil-samburu-camp',
      '3': 'ashnil-samburu-camp',
      '4': 'ziwa-bush-lodge',
      '5': 'jambo-mara-safari-lodge',
      '6': 'jambo-mara-safari-lodge',
      '7': 'avian-court-hotel',
      '8': 'hunter-luxury-lodge',
      '9': 'hunter-luxury-lodge'
    },
    '3-day-mara-fly-in-fly-out': { 
      '1': 'mara-engai-lodge',
      '2': 'mara-engai-lodge'
    },
    'budget-7-Day-Masai-Mara-Nakuru-Naivasha-Amboseli': {
      '1': 'lenchada-tourist-camp',
      '2': 'lenchada-tourist-camp',
      '3': 'hillcourt-resort-and-spa',
      '4': 'hotel-chambai-safari',
      '5': 'manjaro-tented-camp',
      '6': 'manjaro-tented-camp'   
    },
    '6-day-serengeti-budget-safari': {
      1: 'fig-lodge',
      2: 'budget-camping',
      3: 'budget-camping',
      4: 'budget-camping',
      5: 'fig-lodge'
    },
    '4-day-gorilla-tracking-and-queen-elizabeth-national-park': {
     1: 'bweza-gorilla-lodge',
      2: 'the-bush-lodge',
      3: 'the-bush-lodge',
    },
    '3-day-chimpanzee-trekking-canopy-and-lake-kivu-adventure': {
      1: 'ear ken barham guest house',
      2: 'rwiza-village-guest-house',
    },
       '3-Day-samburu-flying-safari-tour': {
      1: 'ashnil-samburu-camp',
      2: 'ashnil-samburu-camp',
    },
    '12-day-vacation-escape-to-kenya-coast': {
      1: 'severin-sea-lodge',
      2: 'severin-sea-lodge',
      3: 'severin-sea-lodge',
      4: 'severin-sea-lodge',
      5: 'diani-sea-resort',
      6: 'diani-sea-resort',
      7: 'diani-sea-resort',
      8: 'diani-sea-resort',
      9: 'diani-sea-resort',
      10: 'diani-sea-resort',
      11: 'diani-sea-resort', 
    },
    '4-day-safari-to-awe-inspiring-landscapes-of-mara-in-jeep': {
      1: '&beyond-kichwa-tembo-tented-camp',
      2: '&beyond-kichwa-tembo-tented-camp',
      3: '&beyond-kichwa-tembo-tented-camp', 
    },
    '10-day-kenyas-wildest-elegance-an-ultra-luxury-safari' : {
      1: 'elewana-elsa-kopje-meru',
      2: 'elewana-elsa-kopje-meru',
      3: 'sasaab-camp',
      4: 'sasaab-camp',
      5: 'solio-lodge',
      6: 'solio-lodge',
      7: '&beyond-kichwa-tembo-tented-camp',
      8: '&beyond-kichwa-tembo-tented-camp',
      9: '&beyond-kichwa-tembo-tented-camp',
    },
    '12-day-luxury-honeymoon-safari-and-beach-holiday' : {
      1: 'gran-melia-arusha',
      2: 'lake-manyara-kilimamoja-lodge',
      3: 'four-seasons-safari-lodge-serengeti',
      4: 'four-seasons-safari-lodge-serengeti',
      5: 'ngorongoro-lodge-melia-collection',
      6: 'zanzibar-serena-hotel',
      '7-11': 'emerald-zanzibar-resort-spa',
    },
    '3-day-luxury-safari-in-the-great-masai-mara-reserve' : {
      1: 'elewana-sand-river-masai-mara',
      2: 'elewana-sand-river-masai-mara',
    },
    '8-day-unmatched-elegance-crown-jewels-of-kenya-safari' : {
      1: 'elewana-elsa-kopje-meru',
      2: 'elewana-elsa-kopje-meru',
      3: 'sasaab-camp',
      4: 'sasaab-camp',
      5: '&beyond-kichwa-tembo-tented-camp',
      6: '&beyond-kichwa-tembo-tented-camp',
      7: 'elewana-sand-river-masai-mara',
    },
    '7-day-luxury-safari-kruger-national-park-south-africa' : {
      '1-3': 'kings-camp',
      '4-6': 'leopard-hills-lodge',
    },
    '3-day-luxury-honeymoon-safari-to-serengeti-ngorongoro' : {
      1: 'serengeti-serena-safari-lodge',
      2: 'ngorongoro-serena-safari-lodge',
    },
    '6-day-circuit-safari-masai-mara-lake-nakuru-amboseli' : {
      1: 'lenchada-tourist-camp',
      2: 'lenchada-tourist-camp',
      3: 'hillcourt-resort-and-spa',
      4: 'manjaro-tented-camp',
      5: 'manjaro-tented-camp',
    },
    '4-day-masai-mara-nakuru' : {
     1: 'enkorok-mara-camp',
      2: 'enkorok-mara-camp',
      3: 'sarova-woodlands-hotel-spa',
    },
    '3-day-adventure-in-masai-mara' : {
      1: 'lenchada-tourist-camp',
      2: 'lenchada-tourist-camp', 
    },
    '7-day-masai-mara-nakuru-naivasha-amboseli': {
      1: 'lenchada-tourist-camp',
      2: 'lenchada-tourist-camp', 
      3: 'hillcourt-resort-and-spa',
      4: 'hotel-chambai-safari',
      5: 'manjaro-tented-camp',
      6: 'manjaro-tented-camp',
    },
    '8-day-camping-safari-with-cultural-nature-experiences': {
      1: 'summit-safari-lodge',
      2: 'summit-safari-lodge', 
      3: 'migombani-campsite',
      '4-5': 'seronera-public-campsite',
      6: 'ngorongoro-simba-campsite-a',
      7: 'summit-safari-lodge',
    },
    '3-Day-Ngorongoro-Kilimanjaro-Hike-Materuni-Waterfalls' : {
         1: 'arusha-gateway-lodge-ii',
      2: 'materuni-homes', 
    },
    '5-Day-Safari-to-Selous-Nyerere-Mikumi-Maasai-Village' : {
      1: 'selous-ngalawa-camp',
      2: 'selous-ngalawa-camp', 
      3: 'camp-bastian-mikumi',
      4: 'camp-bastian-mikumi',
    },
    '3-Day-Murchison-Falls-NP-Ziwa-and-Budongo-Safari' : {
      1: 'parkside-safari-lodge',
      2: 'parkside-safari-lodge',
    },
    '5-Day-Kruger-Adventure-Safari' : {
      1: 'kruger-adventure-lodge',
      2: 'kruger-adventure-lodge',
      3: 'kruger-adventure-lodge',
      4: 'kruger-adventure-lodge',
    },
    '5-day-private-explorer-tour' : {
     1: 'elewana-tarangire-treetops',
      2: 'warangi-ridge-lodge',
      3: 'warangi-ridge-lodge',
      4: 'craters-edge-lodge',
    },
    '5-day-premium-luxury-serengeti-gateway-safari' : {
      1: 'gran-melia-arusha',
      2: 'nanyukie-lodge',
      3: 'nanyukie-lodge',
      4: 'nanyukie-lodge',
    },
    '4-day-safari-high-end' : {
      1: 'mawe-mawe-lodge',
      2: 'nanyukie-lodge',
      3: 'the-highlands-camp',
    },
    '5-day-tanzania-adventure-serengeti-migration-plus-big-five' : {
       1: 'baobab-mara-luxury-camp',
      2: 'tanzania-bush-camps',
      3: 'moyo-tented-camp',
      4: 'mawe-mawe-lodge',
    },
    '4-day-luxury-tanzania-safari-tarangire-serengeti-ngorongoro' : {
      1: 'ngorongoro-marera-mountain-view-lodge',
      2: 'into-wild-africa-luxury-safari-camp-serengeti',
      3: 'ngorongoro-marera-mountain-view-lodge',
    },
    '4-day-luxury-samburu-olpejata' : {
      1: 'sweetwaters-serena-camp',
      '2-3': 'ashnil-samburu-camp',
    },
    '3-day-tarangire-manyara-ngorongoro-crater' : {
        1: 'hhando-coffee-lodge',
        2: 'marera-valley-lodge',
    },
    '4-day-lodging-tarangire-ngorngoro-materuni' : {
       1: 'tulia-boutique-hotel-spa',
      2: 'bougainvillea-safari-lodge',
      3: 'tulia-boutique-hotel-spa',
    },
    '4-day-astonish-mikumi-ruaha-national-park' : {
      1: 'camp-lilac',
      2: 'TANAPA-ruaha-bandas',
      3: 'ruaha-hilltop-lodge',
    },
    '4-day-amboseli-tsavo-east-west' : {
      1: 'penety-amboseli-resort',
      2: 'ngulia-safari-lodge',
      3: 'voi-safari-lodge',
    },
    '3-day-amboseli-tsavo-east-mombasa' : {
      1: 'nyati-safari-camp',
      2: 'red-elephant-safari-lodge',
    },
    '3-day-samburu-wildernes-adventure' : {
      '1-2': 'umoja-campsite'
    },
    '3-day-mount-kenya-trek-sirimon-to-chogoria' : {
       1: 'judmaier-campsite',
      2: 'shipton-campsite',
    },
    '3-day-the-amboseli-budget-safari': {
      '1-2': 'nyati-safari-camp'
    },
       '3-day-tsavo-east-taita-safari-sentrim-salt-lick': {
      1: 'lion-hill-lodge',
      2: 'salt-lick-safari-lodge'
    },
    '4-day-nairobi-amboseli-tsavo-east-mombasa-diani-watamu': {
      '1-2': 'nyati-safari-camp',
      3: 'boma-simba-safari-lodge',
    },
    '4-day-mikumi-nyerere-unforgettable-adventures': {
      1: 'camp-bastian-mikumi',
      '2-3': 'Mloka Safari Lodge'
    },
       '3-day-budget-safari-tarangire-ngorongoro-manyara': {
      1: 'fig-lodge',
      2: 'fig-lodge'
    },
    '4-day-safari-to-ruaha-national-park-tanzania': {
      '1-3': 'TANAPA-ruaha-cottages',
    }



   }
};

// ========================================
// CENTRALIZED ANIMAL AVAILABILITY MANAGEMENT SYSTEM
// ========================================
const ANIMAL_AVAILABILITY_MANAGER = {
  destinations: {
    'Amboseli National Park': {
      mainDestination: 'Amboseli National Park',
      bestTimeToVisit: 'June to October and January to February',
      highSeason: 'December to March and July to October (Busy)',
      bestWeather: 'June to September and January to February (Little rainfall)',
      animals: [
        { name: "Elephant", abundance: "abundant", image: "/elephant.webp" },
        { name: "Giraffe", abundance: "common", image: "/giraffe.webp" },
        { name: "Buffalo", abundance: "abundant", image: "/buffalo.webp" },
        { name: "Zebra", abundance: "abundant", image: "/zebra.webp" },
        { name: "Wildebeest", abundance: "abundant", image: "/wildebeest.webp" },
        { name: "Hippo", abundance: "common", image: "/hippo.webp" },
        { name: "Hyena", abundance: "common", image: "/hyena.webp" },
        { name: "Lion", abundance: "occasional", image: "/lion.webp" },
        { name: "Cheetah", abundance: "occasional", image: "/cheetah.webp" },
        { name: "White Rhino", abundance: "none", image: "/white-rhino.webp" },
        { name: "Black Rhino", abundance: "none", image: "/black-rhino.webp" },
        { name: "Leopard", abundance: "rare to none", image: "/leopard.webp" },
        { name: "Wild Dog", abundance: "none", image: "/wild-dog.webp" }
      ]
    },
    'Lake Naivasha': {
      mainDestination: 'Lake Naivasha',
      bestTimeToVisit: 'All year round',
      highSeason: 'December to March',
      bestWeather: 'Dry season (June to September)',
      animals: [
        { name: 'Giraffe', abundance: 'common', image: '/giraffe.webp' },
        { name: 'White Rhino', abundance: 'common', image: '/white-rhino.webp' },
        { name: 'Buffalo', abundance: 'common', image: '/buffalo.webp' },
        { name: 'Zebra', abundance: 'common', image: '/zebra.webp' },
        { name: 'Hippo', abundance: 'common', image: '/hippo.webp' },
        { name: 'Black Rhino', abundance: 'occasional', image: '/black-rhino.webp' },
        { name: 'Lion', abundance: 'occasional', image: '/lion.webp' },
        { name: 'Leopard', abundance: 'occasional', image: '/leopard.webp' },
        { name: 'Hyena', abundance: 'occasional', image: '/hyena.webp' },
        { name: 'Elephant', abundance: 'none', image: '/elephant.webp' },
        { name: 'Cheetah', abundance: 'none', image: '/cheetah.webp' },
        { name: 'Wildebeest', abundance: 'none', image: '/wildebeest.webp' },
        { name: 'Wild Dog', abundance: 'none', image: '/wild-dog.webp' }
      ]
    },
    'Lake Nakuru National Park': {
      mainDestination: 'Lake Nakuru National Park',
      bestTimeToVisit: 'June to March',
      highSeason: 'July to October',
      bestWeather: 'Clear skies for flamingo viewing',
      animals: [
        { name: 'Giraffe', abundance: 'common', image: '/giraffe.webp' },
        { name: 'White Rhino', abundance: 'common', image: '/white-rhino.webp' },
        { name: 'Buffalo', abundance: 'common', image: '/buffalo.webp' },
        { name: 'Zebra', abundance: 'common', image: '/zebra.webp' },
        { name: 'Hippo', abundance: 'common', image: '/hippo.webp' },
        { name: 'Black Rhino', abundance: 'occasional', image: '/black-rhino.webp' },
        { name: 'Lion', abundance: 'occasional', image: '/lion.webp' },
        { name: 'Leopard', abundance: 'occasional', image: '/leopard.webp' },
        { name: 'Hyena', abundance: 'occasional', image: '/hyena.webp' },
        { name: 'Elephant', abundance: 'none', image: '/elephant.webp' },
        { name: 'Cheetah', abundance: 'none', image: '/cheetah.webp' },
        { name: 'Wildebeest', abundance: 'none', image: '/wildebeest.webp' },
        { name: 'Wild Dog', abundance: 'none', image: '/wild-dog.webp' }
      ]
    },
    'Masai Mara National Reserve': {
      mainDestination: 'Masai Mara National Reserve',
      bestTimeToVisit: 'June to October (For general wildlife viewing) and July or August to October (For wildebeest migration)',
      highSeason: 'June to October and December to March',
      bestWeather: 'June to October (Sunny, but not too hot)',
      animals: [
        { name: "Elephant", abundance: "Common", image: "/elephant.webp" },
        { name: "Giraffe", abundance: "Common", image: "/giraffe.webp" },
        { name: "Lion", abundance: "Common", image: "/lion.webp" },
        { name: "Cheetah", abundance: "Common", image: "/cheetah.webp" },
        { name: "Zebra", abundance: "Abundant", image: "/zebra.webp" },
        { name: "Wildebeest", abundance: "Abundant", image: "/wildebeest.webp" },
        { name: "Buffalo", abundance: "Common", image: "/buffalo.webp" },
        { name: "Hippo", abundance: "Common", image: "/hippo.webp" },
        { name: "Hyena", abundance: "Common", image: "/hyena.webp" },
        { name: "Leopard", abundance: "Occasional", image: "/leopard.webp" },
        { name: "Black Rhino", abundance: "Rare", image: "/black-rhino.webp" },
        { name: "Wild Dog", abundance: "Very Rare", image: "/wild-dog.webp" },
        { name: "White Rhino", abundance: "None", image: "/white-rhino.webp" }
      ]
    }
  },

  tourDestinations: {
    '7-Day-Kenyan-Luxury-Safari': {
      '1': 'Amboseli National Park',
      '2': 'Amboseli National Park',
      '3': 'Lake Naivasha',
      '4': 'Lake Nakuru National Park',
      '5': 'Masai Mara National Reserve',
      '6': 'Masai Mara National Reserve'
    }
  }
};

// ========================================
// ENHANCED HELPER FUNCTIONS WITH ROBUST ERROR HANDLING
// ========================================

/**
 * Enhanced accommodation retrieval with comprehensive debugging
 * Senior developer approach: Fail gracefully with detailed logging
 */
const getAccommodationForDay = (tourId, day) => {
  try {
    // Input validation with detailed logging
    if (!tourId || (day === null || day === undefined)) {
      console.warn('🏨 getAccommodationForDay: Missing required parameters', {
        tourId,
        day,
        type: 'validation_error'
      });
      return null;
    }

    // Normalize day to string for consistent lookup
    const normalizedDay = String(day);
    
 

    // Get tour accommodation mapping
    const tourAccommodations = ACCOMMODATION_MANAGER.tourAccommodations[tourId];
    
    if (!tourAccommodations) {
      console.warn('🏨 No accommodation mapping found for tour:', {
        tourId,
        availableTours: Object.keys(ACCOMMODATION_MANAGER.tourAccommodations),
        type: 'mapping_not_found'
      });
      return null;
    }


    // Direct day lookup
    let hotelId = tourAccommodations[normalizedDay];
    
    // If not found, try range lookup for multi-day accommodations
    if (!hotelId) {
      for (const dayKey in tourAccommodations) {
        if (dayKey.includes('-')) {
          const [start, end] = dayKey.split('-').map(d => parseInt(d, 10));
          const dayNum = parseInt(normalizedDay, 10);
          
          if (!isNaN(start) && !isNaN(end) && !isNaN(dayNum) && dayNum >= start && dayNum <= end) {
            hotelId = tourAccommodations[dayKey];
          
            break;
          }
        }
      }
    }

    if (!hotelId) {
      console.warn('🏨 No hotel ID found for day:', {
        tourId,
        day: normalizedDay,
        availableDays: Object.keys(tourAccommodations),
        type: 'hotel_id_not_found'
      });
      return null;
    }

  

    // Get hotel data
    const hotelData = ACCOMMODATION_MANAGER.hotels[hotelId];
    
    if (!hotelData) {
      console.error('🏨 Hotel data not found:', {
        hotelId,
        availableHotels: Object.keys(ACCOMMODATION_MANAGER.hotels),
        type: 'hotel_data_missing'
      });
      return null;
    }

    

    return {
      id: hotelId,
      ...hotelData
    };

  } catch (error) {
    console.error('🏨 ❌ Error in getAccommodationForDay:', {
      error: error.message,
      stack: error.stack,
      tourId,
      day,
      type: 'function_error'
    });
    return null;
  }
};

/**
 * Get animal availability data for a specific tour day
 */
const getAnimalAvailabilityForDay = (tourId, day) => {
  try {
    if (!tourId || !day) return null;
    
    const normalizedDay = String(day);
    const tourDestinations = ANIMAL_AVAILABILITY_MANAGER.tourDestinations[tourId];
    if (!tourDestinations) return null;

    let destinationKey = tourDestinations[normalizedDay];
    
    if (!destinationKey) {
      for (const dayKey in tourDestinations) {
        if (dayKey.includes('-')) {
          const [start, end] = dayKey.split('-').map(d => parseInt(d));
          const dayNum = parseInt(normalizedDay);
          if (!isNaN(start) && !isNaN(end) && !isNaN(dayNum) && dayNum >= start && dayNum <= end) {
            destinationKey = tourDestinations[dayKey];
            break;
          }
        }
      }
    }

    if (!destinationKey) return null;

    const destinationData = ANIMAL_AVAILABILITY_MANAGER.destinations[destinationKey];
    if (!destinationData) return null;

    return {
      key: destinationKey,
      ...destinationData
    };
  } catch (error) {
    console.warn('Error getting animal availability:', error);
    return null;
  }
};

/**
 * Sort animals by abundance level (highest to lowest)
 */
const sortAnimalsByAbundance = (animals) => {
  if (!Array.isArray(animals)) return [];
  
  const abundancePriority = {
    'abundant': 5,
    'common': 4,
    'occasional': 3,
    'rare': 2,
    'very rare': 1,
    'very-rare': 1,
    'none': 0
  };

  return [...animals].sort((a, b) => {
    const aPriority = abundancePriority[a?.abundance?.toLowerCase()] || 0;
    const bPriority = abundancePriority[b?.abundance?.toLowerCase()] || 0;
    return bPriority - aPriority;
  });
};

// ========================================
// IMAGE HELPER FUNCTIONS
// ========================================

const getTourThumbnail = (tourId) => {
  if (!tourId) return IMAGE_MANAGER.tourThumbnails['custom-trip'];
  return IMAGE_MANAGER.tourThumbnails[tourId] || IMAGE_MANAGER.tourThumbnails['custom-trip'];
};

const getMainTourImage = (tourId) => {
  if (!tourId) return IMAGE_MANAGER.tourHeroImages['custom-trip'];
  return IMAGE_MANAGER.tourHeroImages[tourId] || IMAGE_MANAGER.tourHeroImages['custom-trip'];
};

const getDailyItineraryImage = (tourId, day) => {
  try {
    if (!tourId || !day) return IMAGE_MANAGER.dailyItineraryImages['custom-trip'][1];
    
    const tourImages = IMAGE_MANAGER.dailyItineraryImages[tourId];
    if (!tourImages) return IMAGE_MANAGER.dailyItineraryImages['custom-trip'][1];
    
    return tourImages[day] || tourImages[1] || IMAGE_MANAGER.dailyItineraryImages['custom-trip'][1];
  } catch (error) {
    console.warn('Error getting daily itinerary image:', error);
    return IMAGE_MANAGER.dailyItineraryImages['custom-trip'][1];
  }
};

const getVehicleImages = () => {
  return IMAGE_MANAGER.vehicleImages || [];
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

const AnimalIcon = ({ type, className = "w-6 h-6" }) => {
  const iconMap = {
    'Giraffe': <TreePine className={className} />,
    'Warthog': <Mountain className={className} />,
    'Baboon': <Cat className={className} />,
    'Vervet Monkey': <Cat className={className} />,
    'Lion': <Zap className={className} />,
    'Buffalo': <Mountain className={className} />,
    'Zebra': <Zap className={className} />,
    'White Rhino': <Shield className={className} />,
    'Black Rhino': <Shield className={className} />,
    'Leopard': <Cat className={className} />,
    'Cheetah': <Zap className={className} />,
    'Hyena': <Dog className={className} />,
    'Elephant': <Mountain className={className} />,
    'Wildebeest': <Mountain className={className} />,
    'Hippo': <Mountain className={className} />,
    'Impala': <Rabbit className={className} />,
    'Gazelle': <Rabbit className={className} />,
    'Waterbuck': <Rabbit className={className} />,
    'Colobus Monkey': <Cat className={className} />,
    'Fish Eagle': <Bird className={className} />,
    'Pelican': <Bird className={className} />,
    'Flamingo': <Bird className={className} />,
    'Topi': <Rabbit className={className} />,
    'Crocodile': <Fish className={className} />,
    'Lesser Kudu': <Rabbit className={className} />,
    'Gerenuk': <Rabbit className={className} />,
    'Gorilla': <Mountain className={className} />,
    'Chimpanzee': <Cat className={className} />,
    'Wild Dog': <Dog className={className} />
  };
  
  return iconMap[type] || <Cat className={className} />;
};

const getAbundanceInfo = (abundance) => {
  const normalizedAbundance = abundance?.toLowerCase() || 'none';
  
  // Simplified color system that matches the site's theme
  const abundanceMap = {
    'abundant': { 
      color: 'text-emerald-600', 
      label: 'Abundant',
      dotColor: 'bg-emerald-500'
    },
    'common': { 
      color: 'text-emerald-600', 
      label: 'Common',
      dotColor: 'bg-emerald-500'
    },
    'occasional': { 
      color: 'text-amber-600', 
      label: 'Occasional',
      dotColor: 'bg-amber-500'
    },
    'rare': { 
      color: 'text-gray-500', 
      label: 'Rare',
      dotColor: 'bg-gray-400'
    },
    'rare to none': { 
      color: 'text-gray-500', 
      label: 'Rare',
      dotColor: 'bg-gray-400'
    },
    'very rare': { 
      color: 'text-gray-500', 
      label: 'Very Rare',
      dotColor: 'bg-gray-400'
    },
    'very-rare': { 
      color: 'text-gray-500', 
      label: 'Very Rare',
      dotColor: 'bg-gray-400'
    },
    'none': { 
      color: 'text-gray-500', 
      label: 'None',
      dotColor: 'bg-gray-400'
    }
  };
  return abundanceMap[normalizedAbundance] || abundanceMap['none'];
};

const getNightBadgeColor = (nights) => {
  if (nights === 0) return 'bg-gray-500/80 text-gray-200';
  return 'bg-slate-600/80 text-slate-200';
};

// ========================================
// SAMPLE DATA
// ========================================

const reviewsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    date: "March 2024",
    review: "Absolutely incredible experience! The wildlife encounters were beyond my expectations. Our guide was knowledgeable and passionate.",
    avatar: "SJ",
    verified: true
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "London, UK",
    rating: 5,
    date: "February 2024",
    review: "Perfect organization from start to finish. The accommodations were luxurious and the game drives were thrilling!",
    avatar: "MC",
    verified: true
  }
];

const safariTips = [
  {
    icon: <Camera className="w-5 h-5" />,
    title: "Photography Tips",
    tip: "Bring extra batteries and memory cards. The golden hours (sunrise and sunset) offer the best lighting for wildlife photography."
  },
  {
    icon: <Compass className="w-5 h-5" />,
    title: "What to Pack",
    tip: "Pack neutral-colored clothing, a good hat, sunscreen, and binoculars. Avoid bright colors that might disturb wildlife."
  }
];

const trustIndicators = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Award Winning",
    description: "Top rated safari operator for 5 consecutive years"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Fully Licensed",
    description: "Licensed by Kenya Tourism Board & KATO certified"
  }
];

const conservationInsights = [
  {
    icon: <TreePine className="w-5 h-5" />,
    title: "Conservation Impact",
    content: "Your safari directly supports wildlife conservation and local communities. We partner with conservation organizations to protect endangered species."
  }
];

const wildlifeBehaviorTips = [
  {
    title: "Big Cat Behavior",
    tip: "Lions are most active during cooler parts of the day. Look for them resting under acacia trees during midday heat.",
    icon: <Zap className="w-5 h-5" />
  }
];

// ========================================
// TOURS DATA
// ========================================


// ========================================
// ENHANCED DYNAMIC SIDEBAR CONTENT
// ========================================
const DynamicSidebarContent = ({ contentHeight, activeTab, tour }) => {
  const [visibleContent, setVisibleContent] = useState([]);
// ========================================
// ACTIVITY LIKES STATE MANAGEMENT
// ========================================
// State for activity likes - Initialize from localStorage



 {/* Simplified Call to Action */}
  const renderCallToAction = () => (
   
  <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 shadow-lg hover:scale-102 transition-all duration-300"
        whileHover={{ y: -2 }}
      >
        <Heart className="w-10 h-10 text-orange-400 mx-auto mb-4" />
        <h4 className="text-xl font-bold text-white mb-3">Ready for Adventure?</h4>
        <p className="text-gray-300 mb-4">
          Join thousands of travelers who've experienced the magic of African safaris with us.
        </p>
        
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Fully Insured</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Award Winning</span>
          </div>
        </div>
      </motion.div>
   );

  const renderTrustIndicators = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Crown className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Why Trust Us?</h4>
          <p className="text-orange-400/80 text-sm">Your safari dreams, our expertise</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {trustIndicators.map((indicator, index) => (
          <motion.div 
            key={`trust-${index}`}
            className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ x: 3 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-600/50 rounded-lg">
                <div className="text-orange-400">
                  {indicator.icon}
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-white mb-1">{indicator.title}</h5>
                <p className="text-sm text-gray-300">{indicator.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderReviews = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Quote className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">What Travelers Say</h4>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-orange-400 text-sm">4.9/5 from 438+ reviews</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {reviewsData.slice(0, activeTab === 'day-by-day' ? 3 : 2).map((review) => (
          <motion.div 
            key={`review-${review.id}`}
            className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: review.id * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{review.name}</span>
                  {review.verified && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm italic">"{review.review}"</p>
            <p className="text-gray-500 text-xs mt-2">{review.location}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderConservationInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <TreePine className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Conservation Impact</h4>
          <p className="text-orange-400/80 text-sm">Your safari makes a difference</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {conservationInsights.map((insight, index) => (
          <motion.div 
            key={`conservation-${index}`}
            className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30"
            whileHover={{ x: 3 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-600/50 rounded-lg">
                <div className="text-orange-400">{insight.icon}</div>
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">{insight.title}</h5>
                <p className="text-sm text-gray-300">{insight.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderWildlifeBehavior = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Binoculars className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Wildlife Insights</h4>
          <p className="text-orange-400/80 text-sm">Secrets of the savannah</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {wildlifeBehaviorTips.map((tip, index) => (
          <motion.div 
            key={`wildlife-${index}`}
            className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30"
            whileHover={{ x: 3 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <div className="text-orange-400 bg-slate-600/50 rounded-lg p-2">
                {tip.icon}
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">{tip.title}</h5>
                <p className="text-sm text-gray-300">{tip.tip}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderSafariTips = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Compass className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Expert Safari Tips</h4>
          <p className="text-orange-400/80 text-sm">Professional guidance</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {safariTips.slice(0, activeTab === 'day-by-day' ? 4 : 2).map((tip, index) => (
          <motion.div 
            key={`tip-${index}`}
            className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30"
            whileHover={{ x: 3 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-600/50 rounded-lg">
                <div className="text-orange-400">{tip.icon}</div>
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">{tip.title}</h5>
                <p className="text-sm text-gray-300">{tip.tip}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderStats = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <TrendingUp className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Safari Statistics</h4>
          <p className="text-orange-400/80 text-sm">Numbers that matter</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { value: "98%", label: "Big 5 Success" },
          { value: "4.9", label: "Avg Rating" },
          { value: "1,200+", label: "Happy Clients" },
          { value: "15+", label: "Years Experience" }
        ].map((stat, index) => (
          <motion.div 
            key={`stat-${index}`}
            className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:scale-105 transition-all duration-300"
            whileHover={{ y: -3 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="text-3xl font-bold mb-1 text-orange-400">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

 

  return (
    <div className="mt-6">
      <AnimatePresence>
        {visibleContent.includes('trust') && (
          <div key="trust-section">
            {renderTrustIndicators()}
          </div>
        )}
        {visibleContent.includes('reviews') && (
          <div key="reviews-section">
            {renderReviews()}
          </div>
        )}
        {visibleContent.includes('conservation') && (
          <div key="conservation-section">
            {renderConservationInsights()}
          </div>
        )}
        {visibleContent.includes('wildlife-behavior') && (
          <div key="wildlife-section">
            {renderWildlifeBehavior()}
          </div>
        )}
        {visibleContent.includes('tips') && (
          <div key="tips-section">
            {renderSafariTips()}
          </div>
        )}
        {visibleContent.includes('stats') && (
          <div key="stats-section">
            {renderStats()}
          </div>
        )}
         {visibleContent.includes('call-to-action') && (
          <div key="call-to-action">
            {renderCallToAction()}
          </div>
        )}
      </AnimatePresence>
      
      {/* Simplified Call to Action */}
   
    </div>
  );
};
// ========================================
// FLOATING CART & CHECKOUT STATE
// ========================================


// ========================================
// MAIN TOUR DETAIL PAGE COMPONENT
// ========================================
const TourDetailPage = () => {
  const { tourId } = useParams();
  const { toast } = useToast();
     const form = useRef();

 const sendEmail = (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  emailjs
    .sendForm('service_rjz93fd', 'template_hhl8zd4', form.current, {
      publicKey: 'e0omTkY4ArMxstpqD',
    })
    .then(
      () => {
    
        setIsSubmitting(false);
        toast({
          title: "Booking Request Sent Successfully!",
          description: "We'll send you a detailed itinerary within 24 hours.",
          
        });
        // Reset form data
        setFormData({
          date: '',
          budget: '',
          adults: '1',
          children: '0',
          infants: '0',
          rooms: '1',
          email: '',
          message: ''
        });
      },
      (error) => {
        
        setIsSubmitting(false);
        toast({
          title: "Submission Failed",
          description: "There was an error sending your request. Please try again.",
        });
      },
    );
};

  // Initialize all state variables at the top level
  const [activeTab, setActiveTab] = useState('overview');
  const [imagePopup, setImagePopup] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: ''
  });
  const [contentHeight, setContentHeight] = useState(0);
  const [photosToShow, setPhotosToShow] = useState(4);
  const [showMoreAnimals, setShowMoreAnimals] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('all');
const [allActivities, setAllActivities] = useState([]);
const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
const [likedActivitiesForCart, setLikedActivitiesForCart] = useState([]);
// ========================================
// NOTIFICATION STATE
// ========================================
const [showNotification, setShowNotification] = useState(false);
const [notificationActivity, setNotificationActivity] = useState(null);
const notificationTimeoutRef = useRef(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [showSuccessPopup, setShowSuccessPopup] = useState(false);
// ========================================
// ACTIVITY LIKES STATE MANAGEMENT
// ========================================
// State for activity likes - Initialize from localStorage
const [activityLikes, setActivityLikes] = useState(() => {
  try {
    const stored = localStorage.getItem('safari_activity_likes');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading activity likes from localStorage:', error);
    return {};
  }
});

// ========================================
// ACTIVITY LIKE HANDLER WITH NOTIFICATION
// ========================================
const handleActivityLike = (activityId) => {
  const activity = allActivities.find(a => a.id === activityId);
  const isCurrentlyLiked = activityLikes[activityId];
  
  setActivityLikes(prev => {
    const newLikes = { ...prev };

    if (isCurrentlyLiked) {
      // Unlike: remove the activity from likes
      delete newLikes[activityId];
    } else {
      // Like: add the activity to likes
      newLikes[activityId] = true;
      
      // Show notification for new likes
      if (activity) {
        // Clear any existing timeout
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
        }
        
        setNotificationActivity(activity);
        setShowNotification(true);
        
        // Hide notification after 5 seconds
        notificationTimeoutRef.current = setTimeout(() => {
          setShowNotification(false);
          setTimeout(() => setNotificationActivity(null), 300);
        }, 5000);
      }
    }

    return newLikes;
  });
};


// ========================================
// CLEANUP NOTIFICATION TIMEOUT
// ========================================
useEffect(() => {
  return () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
  };
}, []);

// ========================================
// CART HANDLER FUNCTIONS
// ========================================
const handleRemoveFromCart = (activityId) => {
  // Remove from likes which will automatically update the cart
  setActivityLikes(prev => {
    const newLikes = { ...prev };
    delete newLikes[activityId];
    return newLikes;
  });
  
  toast({
    title: "Activity Removed",
    description: "Activity removed from your cart",
    variant: "default"
  });
};

const handleCheckout = (activities) => {
  if (activities.length === 0) {
    toast({
      title: "Cart is Empty",
      description: "Please add some activities to your cart first",
      variant: "destructive"
    });
    return;
  }
  
  setIsCheckoutOpen(true);
  
  toast({
    title: "Opening Checkout",
    description: `Proceeding with ${activities.length} ${activities.length === 1 ? 'activity' : 'activities'}`,
    variant: "default"
  });
};
const tour = allToursData.find(t => t.id === tourId);
// ========================================
// PERSIST LIKES TO LOCALSTORAGE
// ========================================
// Save activity likes to localStorage whenever they change
// ========================================
// PERSIST LIKES TO LOCALSTORAGE & SYNC WITH CART
// ========================================
// ========================================
// PERSIST LIKES TO LOCALSTORAGE & SYNC WITH CART
// ========================================
useEffect(() => {
  try {
    localStorage.setItem('safari_activity_likes', JSON.stringify(activityLikes));
    
    // Sync liked activities with cart for ALL tours
    const likedActivitiesArray = getAllActivitiesWithLikes().filter(
      activity => activityLikes[activity.id]
    );
    setLikedActivitiesForCart(likedActivitiesArray);
  } catch (error) {
    console.error('Error saving activity likes to localStorage:', error);
  }
}, [activityLikes]); // Removed tour and allActivities dependencies since we're using getAllActivitiesWithLikes()
  // Refs for measuring content height
  const tabContentRef = useRef(null);
  
  

  const [formData, setFormData] = useState({
    date: '',
    budget: tour?.budgetPlaceholder || '',
    adults: 1,
    children: 0,
    infants: 0,
    rooms: 1,
    email: '',
    message: ''
  });

  // Measure content height when tab changes or content updates
  useEffect(() => {
    const measureHeight = () => {
      if (tabContentRef.current) {
        const height = tabContentRef.current.offsetHeight;
        setContentHeight(height);
      }
    };

    measureHeight();
    const timeoutId = setTimeout(measureHeight, 500);
    window.addEventListener('resize', measureHeight);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measureHeight);
    };
  }, [activeTab, tour]);

  // Handle window resize for photo display
  useEffect(() => {
    const getPhotosToShow = () => {
      if (typeof window !== 'undefined') {
        return window.innerWidth >= 768 ? 4 : 6;
      }
      return 4;
    };

    const handleResize = () => {
      setPhotosToShow(getPhotosToShow());
    };

    setPhotosToShow(getPhotosToShow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tour) {
      setFormData(prev => ({ 
        ...prev, 
        budget: tour.isCustom ? '' : tour.budgetPlaceholder || '',
        date: '',
        adults: 1,
        children: 0,
        infants: 0,
        rooms: 1,
        email: '',
        message: ''
      }));
    }
  }, [tourId, tour]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

// ========================================
// LOAD ACTIVITIES WITH LIKE STATUS
// ========================================
useEffect(() => {
  if (tour?.isCustom) {
    const activities = getAllActivitiesWithLikes();

    // Merge with local state to get real-time like status
    const activitiesWithLikes = activities.map(activity => ({
      ...activity,
      isLiked: activityLikes[activity.id] || false
    }));

    // Sort so liked activities appear first
    const sortedActivities = activitiesWithLikes.sort((a, b) => {
      if (a.isLiked && !b.isLiked) return -1;
      if (!a.isLiked && b.isLiked) return 1;
      return 0;
    });

    setAllActivities(sortedActivities);
  }
}, [tour, activityLikes]); // Add activityLikes as dependency

// Handle hash navigation (e.g., from #activities)
useEffect(() => {
  if (window.location.hash === '#activities') {
    // Small delay to ensure the page has rendered
    setTimeout(() => {
      const activitiesSection = document.getElementById('activities');
      if (activitiesSection) {
        activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  }
}, []);

// Filter activities based on selected country
const getFilteredActivities = () => {
  if (selectedCountry === 'all') {
    return allActivities;
  }
  return allActivities.filter(
    activity => activity.country.toLowerCase() === selectedCountry.toLowerCase()
  );
};
// Get unique countries from all activities
const getUniqueCountries = () => {
  const countries = [...new Set(allActivities.map(activity => activity.country))];
  return countries.sort();
};



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || (!tour.isCustom && !formData.date) ) {
        toast({
            title: "Missing Information",
            description: tour.isCustom ? "Please fill in your email and tell us about your dream trip." : "Please fill in the travel date and your email.",
            variant: "destructive"
        });
        return;
    }
    if (tour.isCustom && !formData.message) {
        toast({
            title: "Missing Information",
            description: "Please tell us about your dream safari in the message box.",
            variant: "destructive"
        });
        return;
    }
   
    toast({
      title: tour.isCustom ? "Custom Safari Inquiry Sent!" : "Itinerary Request Sent!",
      description: tour.isCustom ? `Thank you! We've received your custom safari ideas. Our team will contact you via ${formData.email} shortly!` : `We'll send the detailed itinerary for ${tour.title} to your email: ${formData.email} shortly.`,
      variant: "success"
    });
    setFormData({
      date: '',
      budget: tour?.isCustom ? '' : tour?.budgetPlaceholder || '',
      adults: 1,
      children: 0,
      infants: 0,
      rooms: 1,
      email: '',
      message: ''
    });
  };

  const openImagePopup = (images, title, startIndex = 0) => {
    setImagePopup({
      isOpen: true,
      images,
      currentIndex: startIndex,
      title
    });
  };

  const closeImagePopup = () => {
    setImagePopup({
      isOpen: false,
      images: [],
      currentIndex: 0,
      title: ''
    });
  };

  const navigateImage = (direction) => {
    setImagePopup(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + direction + prev.images.length) % prev.images.length
    }));
  };

  const handleVehicleClick = () => {
    openImagePopup(getVehicleImages(), 'Pop-up Roof 4x4 Vehicle');
  };

  const monthNameToIcon = (monthName) => {
    const lowerMonth = monthName.toLowerCase();
    if (['jun', 'jul', 'aug'].includes(lowerMonth)) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (['sep', 'oct', 'nov'].includes(lowerMonth)) return <CloudDrizzle className="w-5 h-5 text-blue-400" />; 
    if (['dec', 'jan', 'feb'].includes(lowerMonth)) return <Sun className="w-5 h-5 text-orange-500" />; 
    if (['mar', 'apr', 'may'].includes(lowerMonth)) return <CloudDrizzle className="w-5 h-5 text-sky-500" />; 
    return <Calendar className="w-5 h-5 text-gray-400" />;
  };

  // Create tabs for itinerary
  const createItineraryTabs = () => {
    if (!tour?.itinerary || !Array.isArray(tour.itinerary)) return [];
    
    return [{
      id: 'day-by-day',
      label: 'Day by Day',
      content: tour.itinerary
    }];
  };

  const itineraryTabs = createItineraryTabs();

  // Toggle show more animals for a specific day
  const toggleShowMoreAnimals = (dayKey) => {
    setShowMoreAnimals(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  // NEW: Redesigned Animal Availability Section based on inspiration
  const renderAnimalAvailabilitySection = (tourId, day) => {
    try {
      const animalData = getAnimalAvailabilityForDay(tourId, day);
      if (!animalData || !animalData.animals || animalData.animals.length === 0) return null;

      const sortedAnimals = sortAnimalsByAbundance(animalData.animals);
      const dayKey = `${tourId}-day-${day}`;
      const isShowingMore = showMoreAnimals[dayKey] || false;
      
      // Show 5 animals on desktop, 3 on mobile by default
      const animalsToShow = typeof window !== 'undefined' && window.innerWidth >= 768 ? 5 : 3;
      const visibleAnimals = isShowingMore ? sortedAnimals : sortedAnimals.slice(0, animalsToShow);
      const hiddenCount = Math.max(0, sortedAnimals.length - animalsToShow);

      return (
<motion.div
  className="mt-4 sm:mt-6 lg:mt-8 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-lg p-4 sm:p-6 lg:p-8"
  style={{ backgroundColor: 'rgb(30, 30, 35)' }}
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Seasonal Information Cards (Unchanged as per request) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/60 rounded-lg sm:rounded-xl border border-gray-600/50">
      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mt-1 flex-shrink-0" />
      <div>
        <h5 className="font-semibold text-gray-200 text-xs sm:text-sm mb-1">Best Time To Visit</h5>
        <p className="text-gray-300 text-xs leading-relaxed">{animalData.bestTimeToVisit}</p>
      </div>
    </div>
    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/60 rounded-lg sm:rounded-xl border border-gray-600/50">
      <div className="flex items-center gap-1 mt-1">
        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
      </div>
      <div>
        <h5 className="font-semibold text-gray-200 text-xs sm:text-sm mb-1">High Season</h5>
        <p className="text-gray-300 text-xs leading-relaxed">{animalData.highSeason}</p>
      </div>
    </div>
    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/60 rounded-lg sm:rounded-xl border border-gray-600/50 sm:col-span-2 lg:col-span-1">
      <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mt-1 flex-shrink-0" />
      <div>
        <h5 className="font-semibold text-gray-200 text-xs sm:text-sm mb-1">Best Weather</h5>
        <p className="text-gray-300 text-xs leading-relaxed">{animalData.bestWeather}</p>
      </div>
    </div>
  </div>

  {/* --- Wildlife Section (Visually Upgraded) --- */}
  <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-4 sm:p-6 lg:p-8">
    
    {/* Enhanced Wildlife Section Title */}
    <div className="flex justify-center items-center gap-3 text-center mb-6 sm:mb-8 lg:mb-10">
      <PawPrint className="w-6 h-6 sm:w-7 sm:h-7 text-slate-500" />
      <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
        Wildlife in {animalData.mainDestination}
      </h4>
    </div>
    
    {/* Improved Responsive Animals Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <AnimatePresence>
        {visibleAnimals.map((animal, idx) => {
          const abundanceInfo = getAbundanceInfo(animal.abundance);
          return (
            <motion.div
              key={`animal-${dayKey}-${animal.name}-${idx}`}
              className="group text-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              {/* Animal Image with circular frame - brightness filter removed for full color */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-inner">
                <img
                  src={animal.image}
                  alt={animal.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide broken image
                    e.target.nextElementSibling.style.display = 'flex'; // Show fallback
                  }}
                />
                {/* Fallback icon if image fails to load */}
                <div className="w-full h-full items-center justify-center text-slate-500 hidden">
                  <AnimalIcon type={animal.name} className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              </div>
              
              {/* Animal Name with improved typography */}
              <h5 className="font-bold text-slate-800 text-sm sm:text-base mb-2 truncate group-hover:text-blue-600 transition-colors duration-300">
                {animal.name}
              </h5>
              
              {/* Abundance Indicator with refined styling */}
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${abundanceInfo.dotColor}`}></div>
                <span className={`text-xs sm:text-sm font-medium text-slate-600`}>
                  {abundanceInfo.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>

    {/* Refined Show More/Less Button */}
    {hiddenCount > 0 && (
      <div className="text-center">
        <motion.button
          onClick={() => toggleShowMoreAnimals(dayKey)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-full text-slate-700 transition-all duration-300 text-sm font-medium hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {isShowingMore ? (
            <>
              <span>Show less</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Show {hiddenCount} more</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    )}
  </div>
</motion.div>
      );
    } catch (error) {
      console.warn('Error rendering animal availability section:', error);
      return null;
    }
  };

  // ========================================
  // ENHANCED ACCOMMODATION CARD RENDERER
  // ========================================
  const renderAccommodationCard = (accommodation) => {
    if (!accommodation) {
      console.warn('🏨 renderAccommodationCard: No accommodation data provided');
      return null;
    }


    const visiblePhotos = accommodation.images?.slice(0, photosToShow - 1) || [];
    const remainingCount = Math.max(0, (accommodation.images?.length || 0) - visiblePhotos.length);

    return (
      <motion.div 
        className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700/50 hover:shadow-xl hover:border-slate-600/50 transition-all duration-300 max-w-full overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Bed className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Accommodation</h4>
            <p className="text-orange-400/80 text-sm">Where you'll stay</p>
          </div>
        </div>
        
        <div className="mb-4">
          <motion.a 
            href={accommodation.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-300 hover:text-orange-200 transition-colors duration-300 font-bold text-lg flex items-center gap-2 group"
            whileHover={{ x: 5 }}
          >
            {accommodation.name}
            <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
          <p className="text-gray-400 mt-1">{accommodation.description}</p>
        </div>
        
        {/* Enhanced Photo Grid with Error Handling */}
        {accommodation.images && accommodation.images.length > 0 && (
          <div className={`grid gap-2 mb-4 ${photosToShow === 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {visiblePhotos.map((image, idx) => (
              <motion.img 
                key={`hotel-photo-${accommodation.id}-${idx}`}
                src={image}
                alt={`${accommodation.name} photo ${idx + 1}`}
                className="w-full h-20 object-cover rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
                onClick={() => openImagePopup(accommodation.images, accommodation.name, idx)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onError={(e) => {
                  console.warn(`🏨 Image failed to load: ${image}`);
                  e.target.style.opacity = '0.5';
                }}
              />
            ))}
            {remainingCount > 0 && (
              <motion.div 
                className="relative cursor-pointer overflow-hidden rounded-lg group"
                onClick={() => openImagePopup(accommodation.images, accommodation.name, photosToShow - 1)}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: (photosToShow - 1) * 0.1 }}
              >
                <img 
                  src={accommodation.images[photosToShow - 1]}
                  alt={`${accommodation.name} more photos`}
                  className="w-full h-20 object-cover shadow-sm border border-slate-600/30"
                />
                <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex items-center justify-center hover:bg-slate-900/70 transition-all duration-300">
                  <div className="text-center">
                    <Camera className="w-6 h-6 text-white mx-auto mb-1" />
                    <span className="text-white font-semibold text-sm">+{remainingCount}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
        
        <motion.div 
          className="bg-slate-700/40 rounded-lg px-4 py-2 inline-flex items-center gap-2 hover:bg-slate-700/60 transition-all duration-300"
          whileHover={{ scale: 1.02, x: 3 }}
        >
          <Utensils className="w-5 h-5 text-orange-400" />
          <span className="text-gray-200 font-medium">{accommodation.meals}</span>
        </motion.div>
      </motion.div>
    );
  };

  // Function to render getting there content for each tour
  const renderGettingThereSection = () => {
    if (!tour?.gettingThere) return null;

    const gettingThere = tour.gettingThere;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8 p-6 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Plane className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Getting There</h3>
            <p className="text-orange-400/80 text-sm">Travel & logistics information</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {[
            {
              icon: <MapIcon className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />,
              title: "Tour Location",
              content: (
                <p className="text-gray-300">This tour starts in <strong className="text-orange-300">{gettingThere.startLocation}</strong> and ends in <strong className="text-orange-300">{gettingThere.endLocation}</strong></p>
              )
            },
            {
              icon: <Plane className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />,
              title: "Airports",
              content: (
                <div>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-orange-300">Start:</strong> {gettingThere.startAirport}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-orange-300">End:</strong> {gettingThere.endAirport}
                  </p>
                </div>
              )
            },
            {
              icon: <Truck className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />,
              title: "Airport Transfer",
              content: (
                <p className="text-gray-300">{gettingThere.airportTransfer}</p>
              )
            },
            {
              icon: <Globe className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />,
              title: "International Flights",
              content: (
                <div>
                  <p className="text-gray-300 mb-2">{gettingThere.internationalFlights}</p>
                  <div className="bg-slate-700/50 rounded-lg p-3 mt-3">
                    <p className="text-sm text-orange-300 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      International flights are not included in the tour price
                    </p>
                  </div>
                </div>
              )
            },
            {
              icon: <Bed className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />,
              title: "Extended Stay",
              content: (
                <p className="text-gray-300">{gettingThere.additionalAccommodation}</p>
              )
            }
          ].map((item, index) => (
            <motion.div 
              key={`getting-there-${index}`}
              className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group"
              whileHover={{ x: 5 }}
            >
              <div className="group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">{item.title}</h4>
                {item.content}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // ========================================
  // ENHANCED ITINERARY CONTENT RENDERER WITH DEBUGGING
  // ========================================
  const renderItineraryContent = (dayRange) => (
    <div className="space-y-8">
      {dayRange?.map((item, index) => {
        // Check if this is the last day - skip accommodation for last day
        const isLastDay = index === dayRange.length - 1;
        
     
        
        return (
          <motion.div
            key={`itinerary-day-${item.day}-${index}`}
            className="glass-effect rounded-xl p-6 shadow-lg hover:shadow-orange-500/10 transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50 group"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
          >
            {/* Enhanced Day Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                {/* Improved Day Badge */}
                <motion.div 
                  className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 px-4 py-3 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:from-orange-400 group-hover:via-orange-500 group-hover:to-red-500 transition-all duration-300 min-w-[80px] text-center"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
                  <div className="relative">
                    <span className="block text-white font-bold text-lg leading-tight">
                      Day
                    </span>
                    <span className="block text-white font-extrabold text-xl leading-tight">
                      {tour.isCustom ? index + 1 : item.day}
                    </span>
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-300 group-hover:text-orange-200 transition-colors">{item.location}</h3>
                  {/* Hotel Information */}
                  {!tour.isCustom && item.hotel && (
                    <div className="flex items-center gap-2 mt-2">
                      <Bed className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm font-medium">{item.hotel}</span>
                    </div>
                  )}
                  {/* Main Destination Info for Easy Developer Editing */}
                  {!tour.isCustom && item.mainDestination && (
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm font-medium">{item.mainDestination}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Enhanced Night Badge */}
              {!tour.isCustom && typeof item.nights === 'number' && (
                <motion.div 
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-300 ${getNightBadgeColor(item.nights)} hover:scale-105 cursor-pointer flex items-center gap-2 min-w-fit`}
                  whileHover={{ scale: 1.1, rotateZ: 2 }}
                >
                  <Bed className="w-4 h-4" />
                  <span>
                    {item.nights > 0 ? `${item.nights} Night${item.nights > 1 ? 's' : ''}` : 'Transit'}
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Image - Updated to use centralized image system */}
            {item.image && (
            
              <motion.img 
                className="w-full h-full object-cover bg-bottom rounded-xl mb-6 shadow-lg cursor-pointer"
                alt={`Image for ${tour.isCustom ? 'step' : 'Day'} ${item.day}: ${item.location} - ${item.image}`}
                src={getDailyItineraryImage(tour.id, item.day)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">{item.activity}</p>
            
            {/* Animal Availability Section - Skip for last day and custom tours */}
            {!tour.isCustom && !isLastDay && renderAnimalAvailabilitySection(tour.id, item.day)}
            
            {/* ========================================
                ENHANCED ACCOMMODATION SECTION WITH DEBUGGING
                ======================================== */}
            {!tour.isCustom && !isLastDay && (() => {
            ;
              
              const accommodation = getAccommodationForDay(tour.id, item.day);
              
              if (accommodation) {
             
                
                return (
                  <div className="mt-6 w-full">
                    <div className="max-w-full overflow-hidden">
                      {renderAccommodationCard(accommodation)}
                    </div>
                  </div>
                );
              } else {
           
                return (
                  <div className="mt-6 w-full p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-yellow-400" />
                      <p className="text-yellow-300 text-sm">
                        <strong>Debug:</strong> No accommodation configured for Day {item.day} (Tour: {tour.id})
                      </p>
                    </div>
                  </div>
                );
              }
            })()}
          </motion.div>
        );
      })}
      
      {/* Add content to match sidebar height for day-by-day tab */}
      {activeTab === 'day-by-day' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-effect rounded-xl p-8 text-center bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
        >
          <Camera className="w-16 h-16 text-orange-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience This Adventure?</h3>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Every day of this safari is carefully crafted to maximize your wildlife encounters and create unforgettable memories. 
            From sunrise game drives to evening sundowners, experience Africa like never before.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">98%</div>
              <div className="text-sm text-gray-400">Big Five Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1200+</div>
              <div className="text-sm text-gray-400">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">4+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
          </div>
          <p className="text-orange-300 font-medium">Use the form on the right to start planning your dream safari today!</p>
        </motion.div>
      )}
    </div>
  );

  // Function to render inclusions content from tour data
  const renderInclusionsContent = () => {
    // Check if tour has inclusions data
    if (!tour?.inclusionsContent) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center p-8 bg-slate-800/40 rounded-xl border border-slate-700/50"
        >
          <Info className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Inclusions Information</h3>
          <p className="text-gray-300 text-lg">
            {tour?.isCustom 
              ? "Since this is a custom safari, inclusions will be determined based on your specific requirements and preferences. We'll provide detailed inclusions information with your personalized quote."
              : "Detailed inclusions information is being updated for this tour. Please contact us for specific details about what's included and excluded."
            }
          </p>
        </motion.div>
      );
    }

    const { included, excluded } = tour.inclusionsContent;

    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Included Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-xl p-6 border border-green-500/20 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-green-300">Included</h3>
            </div>
            
            <div className="space-y-4">
              {included?.map((item, index) => (
                <motion.div 
                  key={`included-${index}`}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-white font-medium group-hover:text-green-300 transition-colors">{item.title}</p>
                    {item.subtitle && <p className="text-gray-400 text-sm">{item.subtitle}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Excluded Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-effect rounded-xl p-6 border border-red-500/20 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-2xl font-bold text-red-300">Excluded</h3>
            </div>
            
            <div className="space-y-4">
              {excluded?.map((item, index) => (
                <motion.div 
                  key={`excluded-${index}`}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-white font-medium group-hover:text-red-300 transition-colors">{item.title}</p>
                    {item.subtitle && <p className="text-gray-400 text-sm">{item.subtitle}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderOverviewContent = () => {
    const overviewData = tour?.overviewContent;
   
    return (
      <div className="space-y-12">
        {/* Tour Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Tour Overview</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            {overviewData?.mainDescription || tour?.description || tour?.overview}
          </p>
        </motion.div>

        {/* Best Months to Visit */}
        {!tour.isCustom && tour?.bestMonths && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Best Months to Visit</h2>
            <div className="flex flex-wrap gap-3">
              {tour.bestMonths.map((month, index) => (
                <motion.span 
                  key={`month-${month}-${index}`}
                  className="flex items-center gap-2 bg-slate-800/70 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-200 shadow-md hover:bg-slate-700 hover:scale-105 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {monthNameToIcon(month)}
                  {month}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tour Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Tour Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(overviewData?.tourFeatures || [
              {
                icon: <Home className="w-6 h-6 text-orange-400 group-hover:text-orange-300" />,
                title: "Luxury tour",
                description: "This luxury tour uses lodges and tented camps."
              },
              {
                icon: <Settings className="w-6 h-6 text-orange-400 group-hover:text-orange-300" />,
                title: "Can be customized",
                description: "You can request minor changes to the accommodations and destinations of this tour."
              },
              {
                icon: <UserCheck className="w-6 h-6 text-orange-400 group-hover:text-orange-300" />,
                title: "Private tour",
                description: "This tour will be organized exclusively for you and won't be shared with others."
              },
              {
                icon: <Users className="w-6 h-6 text-orange-400 group-hover:text-orange-300" />,
                title: "Suitable for solo travelers",
                description: "Solo travelers can book this private tour."
              },
              {
                icon: <CalendarCheck className="w-6 h-6 text-orange-400 group-hover:text-orange-300" />,
                title: "Can start any day",
                description: "If availability permits, this tour can start on any day."
              },
              {
                icon: <Baby className="w-6 h-6 text-orange-400 group-hover:text-orange-300" />,
                title: "Suitable for all ages",
                description: "This tour is suitable for children of all ages."
              }
            ]).map((feature, index) => (
              <motion.div 
                key={`feature-${index}`}
                className="glass-effect rounded-xl p-6 hover:scale-105 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500/20 p-3 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">{feature.title}</h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activities & Transportation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Activities & Transportation</h2>
          <motion.div 
            className="glass-effect rounded-xl p-6 space-y-4 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            {[
              {
                icon: <Binoculars className="w-5 h-5 text-orange-400" />,
                label: "Activities:",
                value: overviewData?.activitiesTransportation?.activities || "game drives"
              },
              {
                icon: <Truck className="w-5 h-5 text-orange-400" />,
                label: "Game drives:",
                value: overviewData?.activitiesTransportation?.gameVehicle || "pop-up roof 4x4 vehicle",
                clickable: true
              },
              {
                icon: <Truck className="w-5 h-5 text-orange-400" />,
                label: "Getting around:",
                value: overviewData?.activitiesTransportation?.transportation || "pop-up roof 4x4 vehicle",
                clickable: overviewData?.activitiesTransportation?.transportation?.includes('4x4')
              },
              {
                icon: <Plane className="w-5 h-5 text-orange-400" />,
                label: overviewData?.activitiesTransportation?.airportTransfer || "A transfer from and back to the airport is included",
                value: null
              }
            ].map((item, index) => (
              <motion.div 
                key={`activity-${index}`}
                className="flex items-center space-x-4 p-2 rounded-lg hover:bg-slate-800/30 transition-all duration-300 group"
                whileHover={{ x: 5 }}
              >
                <div className="bg-orange-500/20 p-2 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                  {item.icon}
                </div>
                <div>
                  {item.value ? (
                    <>
                      <span className="text-gray-300">{item.label} </span>
                      <span 
                        className={`text-white font-medium ${item.clickable ? 'hover:text-orange-300 cursor-pointer transition-colors underline decoration-orange-400/50 hover:decoration-orange-300' : ''}`}
                        onClick={item.clickable ? handleVehicleClick : undefined}
                      >
                        {item.value}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-300">{item.label}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* What to Expect - Always display this section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">{tour.isCustom ? "Why Choose a Custom Safari?" : "What to Expect"}</h2>
          {tour?.whatToExpect && Array.isArray(tour.whatToExpect) && (
            <ul className="space-y-3">
              {tour.whatToExpect.map((item, index) => (
                <motion.li 
                  key={`expectation-${index}`}
                  className="flex items-start hover:bg-slate-800/30 p-3 rounded-lg transition-all duration-300 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <Star className="w-5 h-5 text-orange-400 mr-3 mt-1 flex-shrink-0 group-hover:text-orange-300 group-hover:scale-110 transition-all duration-300" />
                  <span className="text-gray-300 text-lg group-hover:text-gray-200 transition-colors">{item}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    );
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900 pt-20 md:pt-28">
        <motion.div 
          className="text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Search className="w-24 h-24 text-orange-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Tour Not Found</h1>
          <p className="text-xl text-gray-400 mb-8">The safari adventure you are looking for does not exist or may have been moved.</p>
          <Link to="/tours">
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 text-lg rounded-lg">
                Explore Other Tours
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const otherTours = allToursData.filter(t => t.id !== tourId && !t.isCustom).sort(() => 0.5 - Math.random()).slice(0, 2);

  return (
   <div className="bg-slate-900 text-white">
      <ImagePopup
        isOpen={imagePopup.isOpen}
        onClose={closeImagePopup}
        images={imagePopup.images}
        currentIndex={imagePopup.currentIndex}
        onPrevious={() => navigateImage(-1)}
        onNext={() => navigateImage(1)}
        title={imagePopup.title}
      />

      <section className="relative h-[83vh] md:h-[75vh]">
        <img 
          className="absolute inset-0 w-full h-full object-cover  "
          alt={`Hero image for ${tour.title} showing ${tour.image}`}
          src={getMainTourImage(tour.id)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 mb-[-30px] md:pb-3 container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            {tour.title}
          </motion.h1>
          {!tour.isCustom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-orange-300 text-lg"
            >
              <span className="flex items-center"><MapPin className="w-5 h-5 mr-2" /> {tour.location}</span>
              <span className="flex items-center"><Clock className="w-5 h-5 mr-2" /> {tour.duration}</span>
              <span className="flex items-center"><Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" /> {tour.rating} ({tour.reviews} reviews)</span>
            </motion.div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Tab Navigation */}
            <div className="border-b border-slate-700/50">
              <div className="grid grid-cols-2 md:flex md:space-x-1 gap-1 md:gap-0 md:overflow-x-auto scrollbar-hide">
                <motion.button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 md:px-6 py-3 text-xs md:text-sm font-medium rounded-t-lg whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'bg-orange-500 text-white border-b-2 border-orange-500'
                      : 'text-gray-400 hover:text-orange-300 hover:bg-slate-800/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Overview
                </motion.button>
                {itineraryTabs?.map((tab) => (
                  <motion.button
                    key={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 md:px-6 py-3 text-xs md:text-sm font-medium rounded-t-lg whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white border-b-2 border-orange-500'
                        : 'text-gray-400 hover:text-orange-300 hover:bg-slate-800/50'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
                {!tour.isCustom && (
                  <>
                    <motion.button
                      onClick={() => setActiveTab('getting-there')}
                      className={`px-3 md:px-6 py-3 text-xs md:text-sm font-medium rounded-t-lg whitespace-nowrap transition-all duration-300 ${
                        activeTab === 'getting-there'
                          ? 'bg-orange-500 text-white border-b-2 border-orange-500'
                          : 'text-gray-400 hover:text-orange-300 hover:bg-slate-800/50'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Getting There
                    </motion.button>
                    <motion.button
                      onClick={() => setActiveTab('inclusions')}
                      className={`px-3 md:px-6 py-3 text-xs md:text-sm font-medium rounded-t-lg whitespace-nowrap transition-all duration-300 ${
                        activeTab === 'inclusions'
                          ? 'bg-orange-500 text-white border-b-2 border-orange-500'
                          : 'text-gray-400 hover:text-orange-300 hover:bg-slate-800/50'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Inclusions
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`tab-content-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
                ref={tabContentRef}
              >
                {activeTab === 'overview' && renderOverviewContent()}
                {activeTab === 'getting-there' && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-8">Getting There</h2>
                    {renderGettingThereSection()}
                  </div>
                )}
                {activeTab === 'inclusions' && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-8">What's Included & Excluded</h2>
                    {renderInclusionsContent()}
                  </div>
                )}
                {itineraryTabs?.map((tab) => 
                  activeTab === tab.id && (
                    <div key={`tab-content-${tab.id}`}>
                      <h2 className="text-3xl font-bold text-white mb-8">{tour.isCustom ? "How It Works" : "Daily Itinerary"}</h2>
                      {renderItineraryContent(tab.content)}
                    </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="sticky top-28">
              {/* Main Booking Form */}
              <motion.div 
                className="glass-effect rounded-2xl p-6 md:p-8 shadow-xl mb-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -4 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{tour.isCustom ? "Design Your Dream Safari" : "Plan Your Trip"}</h3>
                {!tour.isCustom && <p className="text-orange-400 mb-6 text-lg">Starting from ${tour.pricePerPerson}/person</p>}
                {tour.isCustom && <p className="text-orange-400 mb-6 text-lg">Tell us your vision, and we'll make it happen!</p>}
                
             <form ref={form} onSubmit={sendEmail} className="space-y-5">
  {/* Hidden fields for tour info and calculated total */}
  <input type="hidden" name="tour_name" value={tour.title || tour.name} />
  <input 
    type="hidden" 
    name="total_guests" 
    value={Number(formData.adults || 0) + Number(formData.children || 0) + Number(formData.infants || 0)} 
  />
  
  {!tour.isCustom && (
    <div>
      <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1.5">Preferred Travel Date</label>
      <input
        type="date"
        name="date"
        id="date"
        value={formData.date}
        onChange={handleInputChange}
        required={!tour.isCustom}
        className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none placeholder-gray-500 hover:border-slate-500 transition-colors"
      />
    </div>
  )}
  
  <div>
    <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1.5">Your Budget (USD per person{tour.isCustom ? ", optional" : ""})</label>
    <div className="relative">
      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="number"
        name="budget"
        id="budget"
        min="0"
        placeholder={tour.isCustom ? "e.g., 5000" : String(tour.budgetPlaceholder || "e.g., 3500")}
        value={formData.budget}
        onChange={handleInputChange}
        className="w-full bg-slate-700/60 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none placeholder-gray-500 hover:border-slate-500 transition-colors"
      />
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label htmlFor="adults" className="block text-sm font-medium text-gray-300 mb-1.5">Adults (12+)</label>
      <input
        type="number"
        name="adults"
        id="adults"
        min="1"
        value={formData.adults}
        onChange={handleInputChange}
        required
        className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none placeholder-gray-500 hover:border-slate-500 transition-colors"
      />
    </div>
    <div>
      <label htmlFor="children" className="block text-sm font-medium text-gray-300 mb-1.5">Children (3-11)</label>
      <input
        type="number"
        name="children"
        id="children"
        min="0"
        value={formData.children}
        onChange={handleInputChange}
        className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none placeholder-gray-500 hover:border-slate-500 transition-colors"
      />
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label htmlFor="infants" className="block text-sm font-medium text-gray-300 mb-1.5">Infants (0-2)</label>
      <input
        type="number"
        name="infants"
        id="infants"
        min="0"
        value={formData.infants}
        onChange={handleInputChange}
        className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none placeholder-gray-500 hover:border-slate-500 transition-colors"
      />
    </div>
    <div>
      <label htmlFor="rooms" className="block text-sm font-medium text-gray-300 mb-1.5">Rooms</label>
      <input
        type="number"
        name="rooms"
        id="rooms"
        min="1"
        value={formData.rooms}
        onChange={handleInputChange}
        required
        className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none placeholder-gray-500 hover:border-slate-500 transition-colors"
      />
    </div>
  </div>
  
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Your Email</label>
    <input
      type="email"
      name="email"
      id="email"
      value={formData.email}
      onChange={handleInputChange}
      required
      placeholder="you@example.com"
      className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none placeholder-gray-500 hover:border-slate-500 transition-colors"
    />
  </div>
  
  <div>
    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
      {tour.isCustom ? "Tell us about your dream safari (destinations, activities, interests, etc.)" : "Special Requests / Custom Message (Optional)"}
    </label>
    <textarea
      name="message"
      id="message"
      rows="4"
      value={formData.message}
      onChange={handleInputChange}
      placeholder={tour.isCustom ? "The more details, the better we can tailor your adventure!" : "e.g., dietary needs, accessibility requirements, special occasions"}
      className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none placeholder-gray-500 hover:border-slate-500 transition-colors resize-none"
      required={tour.isCustom}
    ></textarea>
  </div>
  
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  <Button
  type="submit"
  disabled={isSubmitting}
  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3.5 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
>
  {isSubmitting ? (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
      Sending...
    </div>
  ) : (
    <>
      <Send className="w-5 h-5 mr-2.5" />
      {tour.isCustom ? "Send Custom Inquiry" : "Get Detailed Itinerary"}
    </>
  )}
</Button>
  </motion.div>
</form>
                <p className="text-xs text-gray-400 mt-6 text-center">
                  Our travel experts will contact you with a personalized itinerary and quote.
                </p>
              </motion.div>

              {/* Dynamic Additional Content */}
              <DynamicSidebarContent 
                contentHeight={contentHeight} 
                activeTab={activeTab}
                tour={tour}
              />
            </div>
          </aside>
        </div>
      </div>

{/* Activities Section - Only shown for custom tours */}
{tour?.isCustom && allActivities.length > 0 && (
  <section id="activities" className="py-12 md:py-16 border-t border-slate-700/50">
    <div className="container mx-auto px-4">
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Explore Activities for Your Custom Safari
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Browse activities from different destinations to help inspire your perfect safari itinerary. 
          Activities you've liked will appear first.
        </p>
      </motion.div>

      {/* Country Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {/* All Countries Button */}
          <motion.button
            onClick={() => setSelectedCountry('all')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
              selectedCountry === 'all'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Destinations
            <span className="ml-2 text-xs opacity-80">({allActivities.length})</span>
          </motion.button>

          {/* Individual Country Buttons */}
          {getUniqueCountries().map((country, index) => {
            const countryActivityCount = allActivities.filter(
              a => a.country.toLowerCase() === country.toLowerCase()
            ).length;

            return (
              <motion.button
                key={`country-filter-${country}`}
                onClick={() => setSelectedCountry(country)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedCountry === country
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {country}
                <span className="ml-2 text-xs opacity-80">({countryActivityCount})</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Activities Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {getFilteredActivities().map((activity, index) => (
          <motion.div
            key={activity.id}
            className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 bg-slate-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Activity Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover transform  transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
           {/* Like Button - Interactive */}
{/* Enhanced Like Button with Cart Icon Spin */}
<motion.button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleActivityLike(activity.id);
  }}
  className={`absolute top-4 right-4 px-3 py-2 rounded-full flex items-center gap-1.5 shadow-lg transition-all duration-300 z-10 ${
    activity.isLiked
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-white/90 text-gray-700 hover:bg-white'
  }`}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  initial={{ scale: 0 }}
  animate={{ 
    scale: 1,
    rotate: activity.isLiked ? [0, 0] : 0
  }}
  transition={{ 
    scale: { duration: 0.3 },
    rotate: { duration: 0.6, ease: 'easeInOut' }
  }}
>
  <motion.div
    animate={{
      rotate: activity.isLiked ? 360 : 0
    }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
  >
    <ShoppingCart className={`w-4 h-4 transition-all duration-300`} />
  </motion.div>
  <span className="text-sm font-medium">
    {activity.isLiked ? 'In Cart' : 'Add'}
  </span>
</motion.button>



              
              {/* Country Badge */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-slate-700">
                {activity.country}
              </div>
            </div>

            {/* Activity Content */}
            <div className="p-6">
              {/* Activity Title */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
                {activity.title}
              </h3>
              
              {/* Activity Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {activity.description}
              </p>

              {/* Activity Details */}
              <div className="flex items-center justify-between text-sm">
                {activity.duration && (
                  <div className="flex items-center gap-1.5 text-orange-400">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duration}</span>
                  </div>
                )}
                {activity.difficulty && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/20 text-green-300' :
                    activity.difficulty.toLowerCase() === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {activity.difficulty}
                  </div>
                )}
              </div>
            </div>

            {/* Hover Overlay with More Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/80 opacity-0 transition-opacity duration-300 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-white text-sm mb-4">
                  {activity.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    // Scroll to booking form
                    const form = document.querySelector('form');
                    if (form) {
                      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // Optional: Pre-fill message with activity
                      const messageField = form.querySelector('[name="message"]');
                      if (messageField) {
                        const currentMessage = messageField.value;
                        const activityText = `Include: ${activity.title} in ${activity.country}`;
                        if (!currentMessage.includes(activityText)) {
                          messageField.value = currentMessage 
                            ? `${currentMessage}\n${activityText}` 
                            : activityText;
                        }
                      }
                    }
                  }}
                >
                  Add to Custom Safari
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results Message */}
      {getFilteredActivities().length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No activities found for {selectedCountry}
          </h3>
          <p className="text-gray-400">
            Try selecting a different destination or view all activities
          </p>
        </motion.div>
      )}

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <p className="text-gray-400 mb-4">
          Found activities you'd like to include? Fill out the form above with your preferences!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            const form = document.querySelector('form');
            if (form) {
              form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
        >
          Start Planning Your Custom Safari
        </motion.button>
      </motion.div>
    </div>
  </section>
)}


      {otherTours.length > 0 &&  !tour?.isCustom && (
        <section className="py-12 md:py-16 border-t border-slate-700/50">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold text-white mb-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              You Might Also Like
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {otherTours?.map((suggestedTour, index) => (
                <Link key={`suggested-${suggestedTour.id}`} to={`/tours/${suggestedTour.id}`}>
                  <motion.div
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 bg-slate-800"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <img 
                      className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      alt={`Suggested tour: ${suggestedTour.title} - ${suggestedTour.image}`}
                      src={getTourThumbnail(suggestedTour.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">{suggestedTour.title}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-orange-400 text-sm">{suggestedTour.duration}</p>
                        <p className="text-lg font-semibold text-white">${suggestedTour.pricePerPerson}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {(!tour.isCustom && (tour.prevTrip || tour.nextTrip)) && (
        <section className="py-8 md:py-12 border-t border-slate-700/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {tour.prevTrip && allToursData.find(t => t.id === tour.prevTrip) ? (
                    <Link to={`/tours/${tour.prevTrip}`} className="w-full sm:w-auto">
                        <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" className="w-full border-orange-500/70 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200 transition-all duration-300 py-3 px-6 rounded-lg flex items-center justify-center sm:justify-start">
                              <ArrowLeft className="w-5 h-5 mr-2.5" />
                              <span className="truncate max-w-[150px] sm:max-w-xs">Prev: {allToursData.find(t => t.id === tour.prevTrip)?.title}</span>
                          </Button>
                        </motion.div>
                    </Link>
                    ) : <div className="w-full sm:w-auto"></div>}
                    
                    {tour.nextTrip && allToursData.find(t => t.id === tour.nextTrip) ? (
                    <Link to={`/tours/${tour.nextTrip}`} className="w-full sm:w-auto">
                        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" className="w-full border-orange-500/70 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200 transition-all duration-300 py-3 px-6 rounded-lg flex items-center justify-center sm:justify-start">
                               <span className="truncate max-w-[150px] sm:max-w-xs">Next: {allToursData.find(t => t.id === tour.nextTrip)?.title}</span>
                              <ArrowRight className="w-5 h-5 ml-2.5" />
                          </Button>
                        </motion.div>
                    </Link>
                    ) : <div className="w-full sm:w-auto"></div>}
                </div>
            </div>
        </section>
      )}
        {/* Floating Cart - Show for all tours (not just custom) */}
      {(
     <FloatingCart
    likedActivities={likedActivitiesForCart}
    onRemoveActivity={handleRemoveFromCart}
    onCheckout={handleCheckout}
    onCartClick={() => {
      // Open checkout directly when cart is clicked
      if (likedActivitiesForCart.length > 0) {
        handleCheckout(likedActivitiesForCart);
      }
    }}
  />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        activities={likedActivitiesForCart}
        onRemoveActivity={handleRemoveFromCart}
      />

      {/* Added to Cart Notification */}
      <AddedToCartNotification 
        show={showNotification} 
        activity={notificationActivity} 
      />
    </div>
  );
};

export default TourDetailPage;