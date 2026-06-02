import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, MessageSquare, Star, Search, Plus, Send, Check, 
  ThumbsUp, ChevronDown, ChevronUp, Trash2, User, Award, ShieldCheck, Sparkles
} from 'lucide-react';
import { Car } from '../types';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface UserQuestion {
  id: string;
  name: string;
  email: string;
  question: string;
  date: string;
  isAnswered: boolean;
  answer?: string;
}

interface UserReview {
  id: string;
  name: string;
  carModel: string;
  rating: number;
  comment: string;
  date: string;
  tag?: string;
  verified: boolean;
  likes: number;
}

interface FaqReviewsProps {
  cars: Car[];
  onOpenBooking: () => void;
}

const PRE_SEEDED_FAQ: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'DELIVERY',
    question: 'Do you deliver to Abuja, Port Harcourt, and other states outside of Lagos?',
    answer: 'Absolutely! We specialize in premium interstate transit. We arrange safe, fully enclosed container flatbed heavy carriers to deliver your vehicle directly to Abuja, Port Harcourt, Kano, Enugu, and other states across Nigeria with full transit gold insurance coverage.'
  },
  {
    id: 'faq-2',
    category: 'WARRANTY',
    question: 'What warranty policy covers your luxury and custom sportscars?',
    answer: 'All high-end certified luxury vehicles from AutoAventus come standard with our 2-Year or 40,000 km Bumper-to-Bumper Comprehensive Warranty. For pure electric and hybrid custom models, we extend a specialized 5-Year battery pack cell warranty backed by our localized state-of-the-art repair facilities.'
  },
  {
    id: 'faq-3',
    category: 'CUSTOMIZATION',
    question: 'Can I request custom aerodynamic fittings or tailored upholstery colors?',
    answer: 'Yes, our bespoke concierge customization service lets you choose custom leather upholstery shades, executive sound insulation, premium window tints, carbon fiber aerodynamic spoilers, custom titanium exhaust notes, and performance throttle remaps.'
  },
  {
    id: 'faq-4',
    category: 'SWAPS',
    question: 'How does the Vehicle Swap & Upgrade system process evaluation?',
    answer: 'Our swap system is swift. You submit your vehicle details, and our certified mechanics carry out a comprehensive 150-point diagnostic check in Lagos/Abuja. We determine the fair luxury market value, and you pay only the difference towards your desired upgrade with flexible options.'
  },
  {
    id: 'faq-5',
    category: 'TEST_DRIVE',
    question: 'Are there any charges or strict requirements for private test drives?',
    answer: 'Test drives are highly exclusive and entirely free. However, bookings must be secured in advance. Pilots must provide a valid driver license, complete a basic identity verification check, and be accompanied by a professional product advisor.'
  },
  {
    id: 'faq-6',
    category: 'ELECTRIC',
    question: 'How do you handle EV charging and battery degradation support in Nigeria?',
    answer: 'Every EV purchased includes a high-capacity 22kW Home wallbox charger with professional integration into your workspace or estate generator setup. Our workshop also stocks original replacements and specialized equipment for voltage diagnostics and software updates.'
  }
];

const PRE_SEEDED_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    name: 'Alhaji Ismaila B.',
    carModel: 'BMW M4 Coupe CSL',
    rating: 5,
    comment: 'Acquired the custom BMW CSL. Unbelievable acceleration on the Abuja-Kaduna highway. The engine acoustics are flawless and the cockpit feels like an airplane. Delivery took exactly 3 days. A 5-star team!',
    date: 'May 28, 2026',
    tag: 'Performance',
    verified: true,
    likes: 24
  },
  {
    id: 'rev-2',
    name: 'Chief Emeka O.',
    carModel: 'Porsche 911 Carrera S',
    rating: 5,
    comment: 'Most standard dealers in Lagos lack real mechanical warranty. AutoAventus is a world-class standard. The 2-year warranty was fully certified in writing. Excellent trade-in valuation on my older sports sedan.',
    date: 'May 15, 2026',
    tag: 'Warranty & Care',
    verified: true,
    likes: 18
  },
  {
    id: 'rev-3',
    name: 'Dr. Valerie A.',
    carModel: 'Tesla Model S Plaid',
    rating: 5,
    comment: 'Bespoke electric drive from the future. They professionally integrated the 22kW supercharger grid directly connected to my backup diesel generators in PH, handling surge limits perfectly. Extreme silent power!',
    date: 'April 20, 2026',
    tag: 'EV Integration',
    verified: true,
    likes: 31
  },
  {
    id: 'rev-4',
    name: 'Obinna Daniel',
    carModel: 'Lexus LC 500 Custom',
    rating: 4,
    comment: 'Custom Alcantara interior modification is sheer poetry. Handcrafted red stitching perfectly compliments the deep copper metal exterior. Deducting 1 star only because customs clearance delayed delivery by 24 hours.',
    date: 'April 05, 2026',
    tag: 'Custom Design',
    verified: true,
    likes: 12
  }
];

export default function FaqReviews({ cars, onOpenBooking }: FaqReviewsProps) {
  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  
  // Custom user asked questions persistent state
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>(() => {
    const cached = localStorage.getItem('auto_questions_db');
    return cached ? JSON.parse(cached) : [];
  });

  const [questionForm, setQuestionForm] = useState({ name: '', email: '', question: '' });
  const [questionSuccess, setQuestionSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string; question: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Reviews persistent state
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    const cached = localStorage.getItem('auto_reviews_db');
    return cached ? JSON.parse(cached) : PRE_SEEDED_REVIEWS;
  });

  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'All'>('All');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const [reviewForm, setReviewForm] = useState({
    name: '',
    carModel: '',
    rating: 5,
    comment: '',
    tag: 'General Experience'
  });
  
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Side effects to sync with local storage
  useEffect(() => {
    localStorage.setItem('auto_questions_db', JSON.stringify(userQuestions));
  }, [userQuestions]);

  useEffect(() => {
    localStorage.setItem('auto_reviews_db', JSON.stringify(reviews));
  }, [reviews]);

  // Submit dynamic question
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.name || !questionForm.question) return;

    const currentName = questionForm.name;
    const currentEmail = questionForm.email;
    const currentQuestion = questionForm.question;

    // Direct simulated answers logic to give instant professional vibe
    let automaticAnswer = "";
    const lowerQ = currentQuestion.toLowerCase();
    if (lowerQ.includes('price') || lowerQ.includes('cost') || lowerQ.includes('pay')) {
      automaticAnswer = `Thank you for your interest! Pricing with AutoAventus starts from ₦40 Million. We offer installment splits, swap trades, and secure direct cash wire options. Our finance division will email you specialized rates!`;
    } else if (lowerQ.includes('import') || lowerQ.includes('customs') || lowerQ.includes('ship')) {
      automaticAnswer = `Yes! We import directly from manufacturers with pre-cleared customs clearance at the Port of Lagos. Your purchase is entirely free of hidden tariffs or secondary border clearance fees.`;
    } else if (lowerQ.includes('where') || lowerQ.includes('office') || lowerQ.includes('showroom')) {
      automaticAnswer = `Our main state-of-the-art high-performance vehicle showroom is situated in Victoria Island, Lagos, with safe delivery dispatch hubs in Abuja and Port Harcourt. We look forward to your exclusive pilot visit!`;
    } else {
      automaticAnswer = `Thank you for submitting your custom inquiry! A senior AutoAventus luxury advisor is reviewing this question and will dispatch a comprehensive technological review directly to your inbox within the next 2 hours.`;
    }

    const newQ: UserQuestion = {
      id: 'q-' + Date.now(),
      name: currentName,
      email: currentEmail || 'anonymous@autoaventus.com',
      question: currentQuestion,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      isAnswered: true,
      answer: automaticAnswer
    };

    // Save locally
    setUserQuestions([newQ, ...userQuestions]);
    setSubmittedData({ name: currentName, email: currentEmail, question: currentQuestion });

    // Direct mailto redirect to autoaventusaa@gmail.com
    const subject = encodeURIComponent(`AutoAventus Advisory Request from ${currentName}`);
    const body = encodeURIComponent(
      `Hello AutoAventus Advisor,\n\nI have a custom question regarding your vehicles and options:\n\n"${currentQuestion}"\n\nPlease contact me at:\nClient Name: ${currentName}\nClient Email: ${currentEmail}\n\nBest regards.`
    );

    try {
      window.location.href = `mailto:autoaventusaa@gmail.com?subject=${subject}&body=${body}`;
    } catch (err) {
      console.warn("Mail client direct launching was prevented", err);
    }

    // copy email address to clipboard as extra convenience
    try {
      navigator.clipboard.writeText("autoaventusaa@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 8000);
    } catch(err) {
      console.warn("Clipboard access denied", err);
    }

    setQuestionForm({ name: '', email: '', question: '' });
    setQuestionSuccess(true);
  };

  // Submit dynamic review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      alert("Please complete the review feedback content.");
      return;
    }

    const newRev: UserReview = {
      id: 'rev-' + Date.now(),
      name: reviewForm.name,
      carModel: reviewForm.carModel || 'Custom Performance Selection',
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      tag: reviewForm.tag || 'Verified Owner',
      verified: true,
      likes: 0
    };

    setReviews([newRev, ...reviews]);
    setReviewForm({
      name: '',
      carModel: '',
      rating: 5,
      comment: '',
      tag: 'General Experience'
    });
    setReviewSuccess(true);
    setShowReviewForm(false);
    setTimeout(() => setReviewSuccess(false), 5000);
  };

  // Handle support thumbs liking
  const handleLikeReview = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  // Delete questions/reviews for interactive test feedback
  const handleDeleteQuestion = (id: string) => {
    setUserQuestions(userQuestions.filter(q => q.id !== id));
  };

  const handleDeleteReview = (id: string) => {
    // Only allow deletion of non pre-seeded custom reviews or simple UI control
    setReviews(reviews.filter(r => r.id !== id));
  };

  // Filtering FAQs based on query
  const filteredFaqs = PRE_SEEDED_FAQ.filter(faq => {
    const term = faqSearch.toLowerCase();
    return faq.question.toLowerCase().includes(term) || 
           faq.answer.toLowerCase().includes(term) ||
           faq.category.toLowerCase().includes(term);
  });

  // Filtering reviews based on star selection
  const filteredReviews = reviews.filter(rev => {
    if (selectedRatingFilter === 'All') return true;
    return rev.rating === selectedRatingFilter;
  });

  // Math computations for ratings dashboard metrics
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const starsDistribution = [5, 4, 3, 2, 1].map(starNum => {
    const amt = reviews.filter(r => r.rating === starNum).length;
    const pct = totalReviewsCount > 0 ? (amt / totalReviewsCount) * 100 : 0;
    return { num: starNum, count: amt, percentage: pct };
  });

  return (
    <div className="w-full relative py-6 sm:py-10 bg-[#050505] selection:bg-[#8B0000] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 xs:px-6 md:px-10">
        
        {/* VIEW HERO HEADER */}
        <div className="mb-14 text-center md:text-left relative">
          <p className="text-[#8B0000] font-mono tracking-[0.4em] uppercase text-xs font-black mb-3">
            PILOT COMMUNITY STATION
          </p>
          <h2 className="text-4xl sm:text-6xl font-serif italic text-white font-black leading-none">
            FAQ & Client feedback
          </h2>
          <div className="h-[3px] w-24 bg-[#8B0000] mt-5 mx-auto md:mx-0"></div>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-6 max-w-3xl leading-relaxed uppercase tracking-wider">
            DISCOVER THE DEFINITION OF EXCELLENCE. EXPLORE DETAILED COMPLIANCE QUESTIONS AND REISSUE FEEDBACK SUBMITTED BY WORLDWIDE VERIFIED AUTOAVENTUS OWNER CADETS.
          </p>
        </div>

        {/* SECTION BLOCK: FAQ PLACE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-zinc-900 pb-16 mb-16">
          
          {/* FAQ Display Panel (Left Col) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#8B0000]" />
                <h3 className="text-lg font-mono font-black text-white uppercase tracking-widest">
                  Frequently Asked Questions
                </h3>
              </div>
              
              {/* FAQ Quick Inline Filter search */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="FILTER FAQS..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full bg-black border border-zinc-900 pr-9 p-2.5 text-[10px] text-zinc-300 placeholder-zinc-750 font-mono focus:border-[#8B0000] focus:outline-none uppercase tracking-wider"
                />
                <Search className="w-3.5 h-3.5 text-zinc-600 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="bg-black/40 border border-zinc-925 hover:border-zinc-800 rounded-sm overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                      className="w-full flex justify-between items-center p-5 text-left font-mono group"
                    >
                      <div className="flex flex-col gap-1.5 pr-4">
                        <span className="text-[7.5px] font-bold text-[#8B0000] tracking-widest uppercase">
                          // CODE: {faq.category}
                        </span>
                        <span className="text-[11.5px] sm:text-xs font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-wide">
                          {faq.question}
                        </span>
                      </div>
                      <div className="shrink-0 text-zinc-600 group-hover:text-[#8B0000] transition-colors">
                        {activeFaq === faq.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {activeFaq === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="border-t border-zinc-950 bg-zinc-975/30"
                        >
                          <div className="p-5 font-mono text-[10.5px] text-zinc-400 uppercase tracking-tighter leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-zinc-950/40 border border-zinc-950 font-mono p-4">
                  <p className="text-zinc-600 text-[10px] uppercase">No compliance matches found for current search criteria.</p>
                </div>
              )}
            </div>

            {/* User Questions Live Timeline List */}
            {userQuestions.length > 0 && (
              <div className="mt-8 border-t border-zinc-900 pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-650 animate-ping" />
                  <h4 className="text-[10px] font-mono text-[#8B0000] tracking-widest uppercase font-black">
                    DYNAMIC SUBMITTED QUESTIONS ({userQuestions.length})
                  </h4>
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {userQuestions.map((q) => (
                    <div 
                      key={q.id}
                      className="bg-black/60 border border-red-950/40 p-4 rounded-sm flex flex-col justify-between text-[10.5px] font-mono relative"
                    >
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="absolute top-3 right-3 text-zinc-650 hover:text-red-500 transition-colors p-1"
                        title="Remove submitted question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="pr-8">
                        <div className="flex items-center gap-2 font-black text-white uppercase tracking-wide">
                          <User className="w-3 h-3 text-[#8B0000]" />
                          <span>{q.name}</span>
                          <span className="text-zinc-600 font-normal ml-1">• {q.date}</span>
                        </div>
                        <p className="text-zinc-350 text-[10.5px] mt-2 italic font-semibold text-left">
                          "Q: {q.question}"
                        </p>
                      </div>

                      {q.answer && (
                        <div className="mt-3.5 bg-[#8B0000]/5 border-l-2 border-[#8B0000] p-3 text-zinc-400">
                          <span className="text-[7.5px] text-[#8B0000] font-black tracking-widest block uppercase mb-1">
                            AUTOAVENTUS ADVISOR RESPONSE
                          </span>
                          <p className="leading-relaxed uppercase tracking-tighter text-[9.5px]">
                            {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ask Your Own Question Form (Right Col) */}
          <div className="lg:col-span-5 bg-black/60 border border-zinc-925 p-6 sm:p-8 rounded-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#8B0000]/10 via-transparent to-transparent pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <HelpCircle className="w-4 h-4 text-[#8B0000]" />
                <h4 className="text-xs font-mono font-black text-white uppercase tracking-[0.2em]">
                  Ask Our Advisors Anything
                </h4>
              </div>
              <p className="text-zinc-550 text-[10px] font-mono leading-relaxed uppercase tracking-widest mb-6 text-zinc-455">
                Can't find your answer? Complete the form below and our certified exotic vehicle experts will dispatch an advisory feedback report immediately.
              </p>

              {questionSuccess && (
                <div className="mb-6 bg-zinc-950 border border-[#8B0000]/60 p-4 font-mono text-[10px] tracking-wider space-y-3.5 rounded-sm">
                  <div className="flex items-start gap-2.5 uppercase text-zinc-200">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#8B0000] block mb-1 font-mono tracking-widest">// DISPATCHED TO AUTOAVENTUSAA@GMAIL.COM</span>
                      <p className="leading-relaxed font-bold text-zinc-300">
                        Inquiry posted to active feed! We copied <span className="text-white font-extrabold lowercase font-sans">autoaventusaa@gmail.com</span> to your clipboard and launched your mail carrier.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-900 space-y-2">
                    <p className="text-[9px] text-zinc-500 normal-case leading-relaxed">
                      If your local mail carrier didn't launch automatically due to browser iframe constraints, use these quick companion options:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {submittedData && (
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=autoaventusaa@gmail.com&su=${encodeURIComponent(
                            `AutoAventus Advisory Request from ${submittedData.name}`
                          )}&body=${encodeURIComponent(
                            `Hello AutoAventus Team,\n\nI just submitted this showroom inquiry:\n\n"${submittedData.question}"\n\nPlease reach back to me at: ${submittedData.email}\n\nBest Regards,\n${submittedData.name}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 p-2 bg-red-950/25 hover:bg-[#8B0000]/30 border border-[#8B0000]/40 text-neutral-200 hover:text-white rounded-sm font-mono text-[9px] font-black uppercase tracking-wider transition-all"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-650 block shrink-0 animate-pulse" />
                          Compose via Gmail Webmail
                        </a>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText("autoaventusaa@gmail.com");
                            setCopiedEmail(true);
                            setTimeout(() => setCopiedEmail(false), 5000);
                          } catch (err) {
                            console.warn("Clipboard access denied", err);
                          }
                        }}
                        className="w-full bg-black hover:bg-zinc-900 text-zinc-350 border border-zinc-900 p-2 text-[8.5px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center rounded-sm"
                      >
                        {copiedEmail ? "✓ ADDRESS COPY SUCCESSFUL!" : "COPY: autoaventusaa@gmail.com"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleAskQuestion} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-550 uppercase tracking-widest block font-bold font-mono">
                    YOUR FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={questionForm.name}
                    onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full bg-black border border-zinc-915 text-xs p-3 text-white focus:border-[#8B0000] focus:outline-none uppercase font-mono tracking-wider placeholder-zinc-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-550 uppercase tracking-widest block font-bold font-mono">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={questionForm.email}
                    onChange={(e) => setQuestionForm({ ...questionForm, email: e.target.value })}
                    placeholder="Enter email to receive feedback"
                    className="w-full bg-black border border-zinc-915 text-xs p-3 text-white focus:border-[#8B0000] focus:outline-none font-mono tracking-wider placeholder-zinc-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-550 uppercase tracking-widest block font-bold font-mono">
                    YOUR QUESTION
                  </label>
                  <textarea
                    rows={4}
                    required
                    maxLength={280}
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                    placeholder="Ask about specs, customs clearing, split pricing, or diagnostic refits..."
                    className="w-full bg-black border border-zinc-915 text-xs p-3 text-white focus:border-[#8B0000] focus:outline-none uppercase font-mono tracking-wider placeholder-zinc-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-[#8B0000] text-zinc-400 hover:text-white border border-zinc-850 hover:border-[#8B0000] font-mono text-[9px] font-black py-4 uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Question</span>
                </button>
              </form>
            </div>

            <div className="mt-8 pt-5 border-t border-zinc-925 space-y-1 bg-zinc-950/20 p-4 rounded-sm text-[8px] text-zinc-600 font-mono tracking-wider">
              <span className="text-[#8B0000] font-bold block mb-1">// VIP HOTLINE PROTOCOL</span>
              <p>PILOT SUPPORT DESK AVAILABLE 24 HOURS IN LAGOS</p>
              <p>TELEMETRY BACKEND: SYNC_ONLINE</p>
            </div>
          </div>
        </section>

        {/* SECTION BLOCK: CLIENT REVIEWS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Reviews Statistics and Rating Submission Trigger (Left Col) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-black/60 border border-zinc-925 p-6 rounded-sm relative overflow-hidden shadow-inner">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest">
                  Reviews & Metric Analyzer
                </h3>
              </div>

              {/* Central Average Display */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-5xl font-serif italic text-white font-black">{averageRating}</span>
                <div className="flex flex-col">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(Number(averageRating)) ? 'text-amber-500 fill-amber-500' : 'text-zinc-800'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-1">
                    Based on {totalReviewsCount} Customer Reviews
                  </span>
                </div>
              </div>

              {/* Distribution bars */}
              <div className="space-y-3 font-mono text-[9px] text-zinc-400">
                {starsDistribution.map((dist) => (
                  <div 
                    key={dist.num}
                    onClick={() => {
                      setSelectedRatingFilter(selectedRatingFilter === dist.num ? 'All' : dist.num);
                    }}
                    className={`flex items-center gap-3 cursor-pointer p-1.5 rounded-sm hover:bg-zinc-950/50 transition-colors ${
                      selectedRatingFilter === dist.num ? 'bg-zinc-950 border border-zinc-900' : ''
                    }`}
                    title={`Click to filter only ${dist.num}-Star Reviews`}
                  >
                    <span className="w-10 text-left hover:text-white transition-colors">{dist.num} Stars</span>
                    <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#8B0000] rounded-full" 
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-zinc-500 font-black">
                      {dist.count} ({Math.round(dist.percentage)}%)
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-950">
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="w-full bg-[#8B0000] hover:bg-[#8B0000]/80 text-white font-mono text-[10px] font-black py-4 uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,0,0,0.2)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showReviewForm ? 'Cancel Submission' : 'Submit My Review'}</span>
                </button>
              </div>
            </div>

            {/* Custom Review Submission Form (Collapsible) */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, height: 0 }}
                  animate={{ opacity: 1, scale: 1, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.96, height: 0 }}
                  className="p-6 bg-zinc-950 border border-red-950/50 rounded-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#8B0000]/5 to-transparent pointer-events-none" />
                  <h4 className="text-xs font-mono font-black text-white uppercase tracking-[0.18em] mb-4">
                    Draft Review Entry
                  </h4>

                  <form onSubmit={handleAddReview} className="space-y-4">
                    {/* User Full Name */}
                    <div className="space-y-1">
                      <label className="text-[8px] text-zinc-500 block font-bold font-mono uppercase tracking-widest">
                        PILOT NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="e.g. Kolawole Segun"
                        className="w-full bg-black border border-zinc-900 text-xs p-3 text-white focus:border-[#8B0000] focus:outline-none uppercase font-mono placeholder-zinc-800"
                      />
                    </div>

                    {/* Bought Car Model Selector */}
                    <div className="space-y-1">
                      <label className="text-[8px] text-zinc-500 block font-bold font-mono uppercase tracking-widest">
                        VEHICLE SPECIES ACQUIRED
                      </label>
                      <select
                        value={reviewForm.carModel}
                        onChange={(e) => setReviewForm({ ...reviewForm, carModel: e.target.value })}
                        className="w-full bg-black border border-zinc-900 text-xs p-3 text-zinc-300 focus:border-[#8B0000] focus:outline-none uppercase font-mono cursor-pointer"
                      >
                        <option value="">-- Generic Showroom Model --</option>
                        {cars.map((c) => (
                          <option key={c.id} value={`${c.make} ${c.model}`}>
                            {c.make} {c.model}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Interactive Stars selector */}
                    <div className="space-y-1">
                      <label className="text-[8px] text-zinc-500 block font-bold font-mono uppercase tracking-widest">
                        RATING EVALUATION
                      </label>
                      <div className="flex gap-2 py-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="focus:outline-none cursor-pointer"
                          >
                            <Star 
                              className={`w-5 h-5 transition-transform duration-100 ${
                                s <= (hoverRating !== null ? hoverRating : reviewForm.rating)
                                  ? 'text-amber-500 fill-amber-500 scale-110' 
                                  : 'text-zinc-800'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Choose custom tag */}
                    <div className="space-y-1">
                      <label className="text-[8px] text-zinc-500 block font-bold font-mono uppercase tracking-widest">
                        TOPIC FOCUS
                      </label>
                      <select
                        value={reviewForm.tag}
                        onChange={(e) => setReviewForm({ ...reviewForm, tag: e.target.value })}
                        className="w-full bg-black border border-zinc-900 text-xs p-3 text-zinc-300 focus:border-[#8B0000] focus:outline-none uppercase font-mono cursor-pointer"
                      >
                        <option value="General Experience">General Experience</option>
                        <option value="Performance">Exotic Performance</option>
                        <option value="Bespoke Design">Bespoke Design & Paint</option>
                        <option value="Warranty & Care">Warranty & Care Services</option>
                        <option value="Speedy Delivery">Secure Shipping & Delivery</option>
                        <option value="EV Integration">Electric Integration</option>
                      </select>
                    </div>

                    {/* Comment text */}
                    <div className="space-y-1">
                      <label className="text-[8px] text-zinc-500 block font-bold font-mono uppercase tracking-widest">
                        REVIEW FEEDBACK
                      </label>
                      <textarea
                        rows={4}
                        required
                        maxLength={500}
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Detail your driving test, sound, speed, interior touch, or custom delivery..."
                        className="w-full bg-black border border-zinc-900 text-xs p-3 text-white focus:border-[#8B0000] focus:outline-none uppercase font-mono placeholder-zinc-805 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#8B0000] hover:bg-neutral-100 hover:text-black text-white text-[9px] font-mono font-black py-3.5 uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      Authenticate Review
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Reviews Feed (Right Col) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-950 pb-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#8B0000]" />
                <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest">
                  Verified Owner Review Feed
                </h3>
              </div>
              
              <div className="text-[9px] font-mono text-zinc-500 uppercase">
                Active Filter: <span className="text-white font-bold">{selectedRatingFilter === 'All' ? 'Showing All' : `${selectedRatingFilter}-Star Only`}</span>
              </div>
            </div>

            {reviewSuccess && (
              <div className="bg-[#8B0000]/15 border border-[#8B0000]/65 p-4 text-zinc-200 text-[10px] font-mono tracking-wider flex items-center gap-2.5 uppercase animate-pulse">
                <Check className="w-4 h-4 text-red-500 shrink-0" />
                <p className="leading-relaxed font-bold">
                  Your certified customer review has been authenticated offline and placed in real-time onto our catalog stream!
                </p>
              </div>
            )}

            {/* Main scroll list */}
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-6 bg-black/40 border border-zinc-925 rounded-sm flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 relative group"
                  >
                    {/* Visual Verified Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-950/45 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-[#8B0000] font-black uppercase text-[10px] tracking-wide relative">
                          {rev.name.substring(0, 2).toUpperCase()}
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8B0000] absolute -bottom-0.5 -right-0.5 border border-black flex items-center justify-center text-white text-[6px]">
                            ✓
                          </span>
                        </div>
                        
                        <div className="flex flex-col text-left">
                          <span className="text-[12px] font-bold text-white uppercase tracking-wide">
                            {rev.name}
                          </span>
                          <span className="text-[8px] font-mono text-[#8B0000] tracking-widest uppercase font-black">
                            // OWNER CADET OF {rev.carModel.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Stars & Details */}
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((st) => (
                            <Star 
                              key={st} 
                              className={`w-3 h-3 ${st <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-800'}`} 
                            />
                          ))}
                        </div>
                        {rev.tag && (
                          <span className="text-[8px] font-mono bg-[#8B0000]/10 border border-[#8B0000]/30 text-red-500 px-2 py-0.5 rounded-sm uppercase font-black tracking-widest">
                            {rev.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review text comment content */}
                    <div className="text-[11px] leading-relaxed font-mono uppercase tracking-tighter text-zinc-400 text-left whitespace-pre-line mb-6 pl-2 border-l border-zinc-900">
                      "{rev.comment}"
                    </div>

                    {/* Footer interactions */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-550 pt-2 border-t border-zinc-950/45 text-zinc-455">
                      <span>Posted: {rev.date}</span>
                      
                      <div className="flex items-center gap-4">
                        {/* Likes action */}
                        <button
                          onClick={() => handleLikeReview(rev.id)}
                          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer font-bold"
                          title="Like this authenticated review"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>STRIKE PILOT APPROVAL ({rev.likes})</span>
                        </button>

                        {/* Direct UI client-side deletion for testing */}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-zinc-700 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete (Admin Overwrite Option)"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Subtle red indicator on hover */}
                    <div className="absolute top-0 left-0 w-[4px] h-0 bg-[#8B0000] group-hover:h-full transition-all duration-300 pointer-events-none" />
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-zinc-950/40 border border-zinc-925 p-8 font-mono max-w-sm mx-auto">
                  <Star className="w-6 h-6 text-zinc-900 mx-auto mb-3" />
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pb-3">No reviews with standard {selectedRatingFilter}-Star evaluation found.</p>
                  <button 
                    onClick={() => setSelectedRatingFilter('All')}
                    className="text-[#8B0000] text-[9px] font-black underline uppercase tracking-widest cursor-pointer"
                  >
                    Show All Verified Reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION: CONCIERGE HELP DESK CALLOUT */}
        <div className="mt-20 py-12 p-8 bg-gradient-to-r from-black via-zinc-950 to-black border-y border-zinc-900 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#8b000015_0%,_transparent_70%)]" />
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <Award className="w-8 h-8 text-[#8B0000] mx-auto animate-pulse" />
            <h4 className="text-lg font-serif italic text-white font-black uppercase tracking-[0.15em]">
              VIP Cadet Hub
            </h4>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest leading-relaxed">
              AutoAventus represents the upper standard of automotive retail. Reach out directly to initiate premium negotiations, trades, support, or vehicle swaps.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="bg-[#8B0000] hover:bg-neutral-150 hover:text-white text-white font-mono text-[9px] font-black py-3 px-6 uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve My Drive Slot Now</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
