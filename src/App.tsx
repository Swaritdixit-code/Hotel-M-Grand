/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Users, 
  ChevronRight, 
  Star, 
  Wifi, 
  Car, 
  Utensils, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Twitter,
  Menu,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

// --- Types ---
interface Room {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  features: string[];
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: string;
  name: string;
  email: string;
  phone: string;
}

// --- Constants ---
const ROOMS: Room[] = [
  {
    id: 'executive',
    name: 'Executive Room',
    price: 1978,
    description: 'Perfect for business travelers seeking comfort and efficiency. Our Executive Rooms are designed with a modern aesthetic, featuring a dedicated workspace and premium bedding to ensure a productive and restful stay.',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800&h=600',
    features: ['King Size Bed', 'Work Desk', 'High-speed Wi-Fi', 'City View', 'Smart TV', 'Coffee Maker']
  },
  {
    id: 'deluxe',
    name: 'Deluxe Suite',
    price: 2850,
    description: 'Spacious luxury with premium amenities for a superior stay. The Deluxe Suite offers a separate living area, a marble-clad bathroom, and floor-to-ceiling windows that provide breathtaking views of the city skyline.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800&h=600',
    features: ['Premium Bedding', 'Lounge Area', 'Mini Bar', 'Luxury Toiletries', 'Bathtub', 'Evening Turndown']
  }
];

const AMENITIES = [
  { icon: <Wifi className="w-6 h-6" />, title: 'Free Wi-Fi', desc: 'High-speed internet in all rooms' },
  { icon: <Car className="w-6 h-6" />, title: 'Free Parking', desc: 'Secure wheelchair-friendly parking' },
  { icon: <Utensils className="w-6 h-6" />, title: 'Banquet Facilities', desc: 'Large halls with 500 capacity' },
  { icon: <Clock className="w-6 h-6" />, title: '24/7 Service', desc: 'Round-the-clock room service' },
];

// --- Types ---
interface MenuItem {
  name: string;
  price: string;
  category: 'Starters' | 'Main Course' | 'Biryani' | 'Desserts';
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Special Chicken Biryani', price: '₹380', category: 'Biryani' },
  { name: 'Mutton Dum Biryani', price: '₹450', category: 'Biryani' },
  { name: 'Chicken 65', price: '₹280', category: 'Starters' },
  { name: 'Paneer Tikka', price: '₹260', category: 'Starters' },
  { name: 'Butter Chicken', price: '₹340', category: 'Main Course' },
  { name: 'Dal Makhani', price: '₹240', category: 'Main Course' },
  { name: 'Gulab Jamun', price: '₹120', category: 'Desserts' },
  { name: 'Double Ka Meetha', price: '₹150', category: 'Desserts' },
];

// --- Components ---

const MenuModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  const categories: MenuItem['category'][] = ['Starters', 'Biryani', 'Main Course', 'Desserts'];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-3xl bg-charcoal-light rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-charcoal">
          <div>
            <h2 className="text-4xl font-serif font-bold text-gold-400">Restaurant Menu</h2>
            <p className="text-white/40 text-sm uppercase tracking-widest mt-1">Quality & Quantity Guaranteed</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-xl font-serif font-bold text-gold-300 mb-6 border-b border-gold-400/20 pb-2 inline-block">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {MENU_ITEMS.filter(item => item.category === category).map(item => (
                  <div key={item.name} className="flex justify-between items-end group">
                    <div className="flex-1">
                      <p className="text-lg font-medium group-hover:text-gold-400 transition-colors">{item.name}</p>
                      <div className="border-b border-dotted border-white/10 flex-1 mx-4 mb-1" />
                    </div>
                    <p className="text-gold-400 font-bold">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-charcoal text-center border-t border-white/10">
          <p className="text-white/40 text-xs">Prices are subject to applicable taxes. | 24/7 Room Service Available</p>
        </div>
      </motion.div>
    </div>
  );
};

const RoomDetailsModal = ({ room, onClose, onBook }: { room: Room | null, onClose: () => void, onBook: () => void }) => {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-charcoal-light rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img src={room.image} alt={room.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-serif font-bold mb-4 text-gold-400">{room.name}</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold">₹{room.price}</span>
            <span className="text-white/40 text-sm">/ per night</span>
          </div>
          <p className="text-white/70 mb-8 leading-relaxed">
            {room.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            {room.features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                {f}
              </div>
            ))}
          </div>

          <button 
            onClick={() => { onClose(); onBook(); }}
            className="w-full gold-gradient text-charcoal py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Book This Room
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = ({ onBookNow }: { onBookNow: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Dining', href: '#dining' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-morphism py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center font-serif font-bold text-charcoal text-xl">M</div>
          <span className="font-serif text-2xl font-bold tracking-tight hidden sm:block">Hotel M Grand</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium hover:text-gold-400 transition-colors uppercase tracking-widest">
              {link.name}
            </a>
          ))}
          <button 
            onClick={onBookNow}
            className="gold-gradient text-charcoal px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass-morphism p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium hover:text-gold-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => { onBookNow(); setIsMobileMenuOpen(false); }}
              className="gold-gradient text-charcoal px-6 py-3 rounded-xl font-bold text-center"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const BookingEngine = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomId: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleConfirm = () => {
    const ref = 'MG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setRefNumber(ref);
    setIsSuccess(true);
  };

  const reset = () => {
    setStep(1);
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-charcoal-light rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
      >
        {!isSuccess ? (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gold-400">Reservation</h2>
                <p className="text-white/60 text-sm">Step {step} of 3</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
              <motion.div 
                className="h-full gold-gradient"
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Step 1: Dates & Guests */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Check-in</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                      <input 
                        type="date" 
                        className="w-full bg-charcoal border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-gold-400 outline-none transition-colors"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Check-out</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                      <input 
                        type="date" 
                        className="w-full bg-charcoal border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-gold-400 outline-none transition-colors"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                    <select 
                      className="w-full bg-charcoal border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-gold-400 outline-none appearance-none transition-colors"
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                    >
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                  disabled={!bookingData.checkIn || !bookingData.checkOut}
                  onClick={handleNext}
                  className="w-full gold-gradient text-charcoal py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-30"
                >
                  Continue to Rooms
                </button>
              </div>
            )}

            {/* Step 2: Room Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {ROOMS.map((room) => (
                    <div 
                      key={room.id}
                      onClick={() => setBookingData({...bookingData, roomId: room.id})}
                      className={`relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${bookingData.roomId === room.id ? 'border-gold-400 bg-gold-400/5' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <img src={room.image} alt={room.name} className="w-full sm:w-32 h-32 object-cover rounded-xl" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold">{room.name}</h3>
                          <span className="text-gold-400 font-bold">₹{room.price}</span>
                        </div>
                        <p className="text-white/60 text-sm mb-2">{room.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {room.features.slice(0, 2).map(f => (
                            <span key={f} className="text-[10px] uppercase tracking-tighter bg-white/5 px-2 py-1 rounded text-white/40">{f}</span>
                          ))}
                        </div>
                      </div>
                      {bookingData.roomId === room.id && (
                        <div className="absolute top-2 right-2 bg-gold-400 text-charcoal rounded-full p-1">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={handleBack} className="flex-1 border border-white/10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Back</button>
                  <button 
                    disabled={!bookingData.roomId}
                    onClick={handleNext}
                    className="flex-[2] gold-gradient text-charcoal py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-30"
                  >
                    Guest Details
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Guest Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 focus:border-gold-400 outline-none transition-colors"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/50">Email</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 focus:border-gold-400 outline-none transition-colors"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/50">Phone</label>
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210"
                        className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 focus:border-gold-400 outline-none transition-colors"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gold-400/5 border border-gold-400/20 p-4 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60 leading-relaxed">
                    By clicking confirm, you agree to our 12:00 PM check-in/out policy and terms of service. No payment is required now.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleBack} className="flex-1 border border-white/10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Back</button>
                  <button 
                    disabled={!bookingData.name || !bookingData.email || !bookingData.phone}
                    onClick={handleConfirm}
                    className="flex-[2] gold-gradient text-charcoal py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-30"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-charcoal" />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-2">Reservation Confirmed!</h2>
            <p className="text-white/60 mb-8">Thank you for choosing Hotel M Grand. We look forward to your stay.</p>
            
            <div className="bg-charcoal p-6 rounded-2xl border border-white/10 mb-8">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Booking Reference</p>
              <p className="text-3xl font-mono font-bold text-gold-400 tracking-wider">{refNumber}</p>
            </div>

            <button 
              onClick={reset}
              className="w-full gold-gradient text-charcoal py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Close & Return Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const roomsRef = useRef<HTMLDivElement>(null);
  const diningRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen selection:bg-gold-400 selection:text-charcoal">
      <Navbar onBookNow={() => setIsBookingOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Hotel M Grand Lobby" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-transparent to-charcoal" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />)}
              <Star className="w-5 h-5 fill-gold-400/50 text-gold-400" />
              <span className="ml-2 text-sm font-medium tracking-widest uppercase text-gold-300">4.3 Star Rated</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
              Experience <br />
              <span className="gold-text-gradient italic">Grandeur</span> in Hyderabad
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Located in the heart of Vanasthalipuram, Hotel M Grand offers premium stays, world-class dining, and grand celebrations.
            </p>
          </motion.div>

          {/* Availability Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="glass-morphism p-2 rounded-2xl md:rounded-full max-w-4xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-4 px-6 py-3 border-b md:border-b-0 md:border-r border-white/10">
              <Calendar className="w-6 h-6 text-gold-400 drop-shadow-[0_0_8px_rgba(197,137,54,0.5)]" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Check In</p>
                <p className="text-sm font-medium">Select Date</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-3 border-b md:border-b-0 md:border-r border-white/10">
              <Calendar className="w-6 h-6 text-gold-400 drop-shadow-[0_0_8px_rgba(197,137,54,0.5)]" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Check Out</p>
                <p className="text-sm font-medium">Select Date</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-3">
              <Users className="w-6 h-6 text-gold-400 drop-shadow-[0_0_8px_rgba(197,137,54,0.5)]" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Guests</p>
                <p className="text-sm font-medium">2 Adults</p>
              </div>
            </div>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="gold-gradient text-charcoal px-10 py-4 rounded-xl md:rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shrink-0"
            >
              Check Availability
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gold-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" ref={roomsRef} className="py-24 px-6 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm uppercase tracking-[0.3em] text-gold-400 font-bold mb-4">Our Accommodations</h2>
              <h3 className="text-5xl font-serif font-bold leading-tight">Refined Comfort for Every Guest</h3>
            </div>
            <p className="text-white/50 max-w-sm">
              From business trips to family vacations, our rooms are designed to provide the ultimate relaxation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {ROOMS.map((room, idx) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer"
                onClick={() => setSelectedRoom(room)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl mb-6">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 glass-morphism px-4 py-2 rounded-full">
                    <span className="text-gold-400 font-bold">From ₹{room.price}</span>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-3xl font-serif font-bold">{room.name}</h4>
                  <div className="flex gap-2">
                    {room.features.slice(0, 2).map(f => (
                      <span key={f} className="text-[10px] uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full text-white/40">{f}</span>
                    ))}
                  </div>
                </div>
                <p className="text-white/60 mb-6 leading-relaxed line-clamp-2">{room.description}</p>
                <div className="flex items-center gap-2 text-gold-400 font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                  View Details <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Biryani Experience Section */}
      <section id="dining" ref={diningRef} className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Special Chicken Biryani" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-gold-400 font-bold mb-4">The Biryani Experience</h2>
            <h3 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              Taste the Legacy of <br />
              <span className="gold-text-gradient italic">Special Chicken Biryani</span>
            </h3>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Our restaurant is famous across Vanasthalipuram for its authentic flavors and premium ambiance. We prioritize both quantity and quality, ensuring every meal is a celebration of Hyderabadi cuisine.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-4xl font-serif font-bold text-gold-400 mb-1">4.5/5</p>
                <p className="text-xs uppercase tracking-widest text-white/40">Food Rating</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-gold-400 mb-1">100%</p>
                <p className="text-xs uppercase tracking-widest text-white/40">Authentic Taste</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="border-2 border-gold-400 text-gold-400 px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gold-400 hover:text-charcoal transition-all"
            >
              Explore Menu
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-white/5 shadow-2xl">
              <img 
                src="https://picsum.photos/seed/restaurant-interior/800/1000" 
                alt="Restaurant Ambiance" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 z-20 glass-morphism p-8 rounded-3xl max-w-xs hidden sm:block">
              <Star className="w-8 h-8 text-gold-400 mb-4" />
              <p className="text-sm italic font-serif leading-relaxed">
                "The Special Chicken Biryani here is unmatched in Vanasthalipuram. The quantity and quality are consistently excellent."
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold-400">— Local Food Critic</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section id="amenities" ref={amenitiesRef} className="py-24 px-6 bg-charcoal-light">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-gold-400 font-bold mb-4">Premium Amenities</h2>
          <h3 className="text-5xl font-serif font-bold">Designed for Your Comfort</h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {AMENITIES.map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl border border-white/5 hover:border-gold-400/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-charcoal pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center font-serif font-bold text-charcoal text-xl">M</div>
              <span className="font-serif text-3xl font-bold tracking-tight">Hotel M Grand</span>
            </div>
            <p className="text-white/50 max-w-md mb-8 leading-relaxed">
              Experience the perfect blend of luxury and tradition at Hotel M Grand. From premium stays to the city's finest biryani, we are committed to excellence.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-8">Contact Us</h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Gokul Arcade, NH 65, opposite D-Mart, Vanasthalipuram, Hyderabad.</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                <a href="tel:09581113425" className="hover:text-gold-400 transition-colors">095811 13425</a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-8">Quick Links</h5>
            <ul className="space-y-4">
              {['Rooms', 'Dining', 'Banquets', 'Gallery', 'Privacy Policy'].map(link => (
                <li key={link}>
                  <a href="#" className="text-white/60 hover:text-gold-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="max-w-7xl mx-auto h-64 rounded-3xl overflow-hidden border border-white/10 mb-12 relative">
          <div className="absolute inset-0 bg-charcoal-light flex flex-col items-center justify-center text-center p-6">
            <MapPin className="w-12 h-12 text-gold-400 mb-4 opacity-50" />
            <p className="text-white/40 font-medium">NH 65, Vanasthalipuram, Hyderabad</p>
            <p className="text-xs text-white/20 mt-2">Interactive Map Integration Placeholder</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-sm">© 2026 Hotel M Grand. All rights reserved.</p>
          <div className="flex gap-8 text-white/30 text-sm">
            <a href="#" className="hover:text-gold-400">Terms of Service</a>
            <a href="#" className="hover:text-gold-400">Cookie Policy</a>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <BookingEngine isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        )}
      </AnimatePresence>

      {/* Room Details Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <RoomDetailsModal 
            room={selectedRoom} 
            onClose={() => setSelectedRoom(null)} 
            onBook={() => { setSelectedRoom(null); setIsBookingOpen(true); }} 
          />
        )}
      </AnimatePresence>

      {/* Menu Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
