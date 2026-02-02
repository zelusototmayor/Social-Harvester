import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, ShoppingBag, Terminal, Heart, Plane, Shirt } from 'lucide-react';

interface ExampleCardProps {
  category: string;
  icon: React.ReactNode;
  userImage: string;
  postContent: string;
  postImage: string;
  commentUser: string;
  commentUserAvatar: string;
  commentText: string;
  replyText: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  category, userImage, postContent, postImage, commentUser, commentUserAvatar, commentText, replyText
}) => (
  <div className="w-[300px] mx-3 select-none relative flex-shrink-0">
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 h-[540px] flex flex-col shadow-lg group relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm z-10 relative">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm relative bg-slate-100">
             <img src={userImage} alt={category} className="w-full h-full object-cover" />
           </div>
           <div className="text-sm font-medium text-slate-700 truncate max-w-[120px]">{category}</div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-bold border border-emerald-100 shadow-sm uppercase tracking-wide">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           Intent
        </div>
      </div>

      {/* Fake Post Context */}
      <div className="h-44 relative overflow-hidden group-hover:h-40 transition-all duration-500 bg-slate-200 flex-shrink-0">
         <img src={postImage} alt="Post" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
         <p className="absolute bottom-4 left-4 right-4 text-white font-medium text-sm z-10 leading-snug drop-shadow-md line-clamp-2">
            {postContent}
         </p>
      </div>

      {/* Comment Interaction */}
      <div className="p-4 flex-1 flex flex-col gap-3 bg-white relative">
        {/* User Comment */}
        <div className="flex gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-100 bg-slate-100">
            <img src={commentUserAvatar} alt={commentUser} className="w-full h-full object-cover" />
          </div>
          <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none w-full relative">
            <div className="flex justify-between items-start mb-0.5">
               <span className="text-sm font-bold text-slate-700">@{commentUser}</span>
               <span className="text-xs text-slate-400 mt-0.5">2h</span>
            </div>
            <p className="text-sm text-slate-700 leading-snug">{commentText}</p>
          </div>
        </div>

        {/* Brand Reply */}
        <div className="flex gap-2.5 justify-end pl-6">
           <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl rounded-tr-none w-full relative shadow-sm">
             <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse ring-4 ring-white"></div>
             <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-emerald-800">Your AI Agent</span>
             </div>
             <p className="text-sm text-slate-700 leading-snug">{replyText}</p>
           </div>
           <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white mt-auto">
              <MessageSquare className="w-4 h-4" />
           </div>
        </div>
      </div>
    </div>
  </div>
);

export const ExamplesCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const examples: ExampleCardProps[] = [
    {
      category: "Skincare Brand",
      icon: <Heart className="w-4 h-4" />,
      userImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9af908?w=100&auto=format&fit=crop&q=60", 
      postContent: "My updated night routine for sensitive dry skin ✨ #skincare #routine",
      postImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
      commentUser: "dryskin_sarah",
      commentUserAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
      commentText: "My skin is literally flaking off this winter, nothing I use actually hydrates for long 😭",
      replyText: "That happens when moisture barrier is damaged! Our HydraGel 💧 has ceramides specifically for that."
    },
    {
      category: "Fashion Resale App",
      icon: <Shirt className="w-4 h-4" />,
      userImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&auto=format&fit=crop&q=60", 
      postContent: "OOTD: Found this vintage jacket at a random market! 🧥",
      postImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      commentUser: "streetwear_kai",
      commentUserAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
      commentText: "Bro I need that jacket. Where can I find one similar online?",
      replyText: "Vintage leather is hot rn! 🔥 We have 50+ listings of similar 90s bomber jackets on Thrifty. Link in bio!"
    },
    {
      category: "B2B SaaS Tool",
      icon: <Terminal className="w-4 h-4" />,
      userImage: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&auto=format&fit=crop&q=60",
      postContent: "5 tips to grow your email list in 2026 📈 #marketing",
      postImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      commentUser: "marketer_mike",
      commentUserAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
      commentText: "I spend way too much time scheduling these manually. Is there a cheaper alternative to Hubspot?",
      replyText: "Totally get that pain. AutoMail does the scheduling for $10/mo, might save you some budget! 🚀"
    },
    {
      category: "Travel Deals App",
      icon: <Plane className="w-4 h-4" />,
      userImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&auto=format&fit=crop&q=60",
      postContent: "Dreaming of Bali... but flight prices are insane right now ✈️💸",
      postImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
      commentUser: "wanderlust_jen",
      commentUserAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
      commentText: "Tell me about it! I've been looking for tickets to Tokyo and it's $1500+ everywhere.",
      replyText: "Oof, that's steep! We just spotted a mistake fare to Tokyo for $650 on FlyCheap. Check the app! 🌏"
    },
    {
      category: "Fitness E-com",
      icon: <ShoppingBag className="w-4 h-4" />,
      userImage: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=100&auto=format&fit=crop&q=60",
      postContent: "Leg day finisher! 🔥 Resistance bands only.",
      postImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
      commentUser: "home_gym_hero",
      commentUserAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
      commentText: "Where did you get those bands? Mine always snap after a month.",
      replyText: "These are from FlexGear! They're reinforced so they don't snap. Check the link in our bio 💪"
    },
    {
      category: "Pet Training",
      icon: <Heart className="w-4 h-4" />,
      userImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
      postContent: "Teaching your puppy to sit! 🐶 #dogtraining",
      postImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
      commentUser: "new_dog_mom",
      commentUserAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=60",
      commentText: "My puppy bites everything when I try to train him. Help!",
      replyText: "Teething phase is tough! Try our frozen chew toys, they keep them occupied during training sessions."
    }
  ];

  // We duplicate items 3 times to ensure enough buffer for infinite loop
  const marqueeItems = [...examples, ...examples, ...examples];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    // Calculate 1/3 of the total width (the width of one full set of items)
    // 324px is (300px width + 24px margin (mx-3 * 2)) roughly, but better to measure scrollWidth
    
    const scrollStep = () => {
      if (!isPaused && container) {
        container.scrollLeft += 0.8; // Adjust speed here

        // Reset logic: If we've scrolled past the first set, jump back to 0
        // We estimate the width of one set. Since we have 3 sets, 
        // max scrollable is 3 * setWidth. 
        // We reset when >= setWidth.
        const totalWidth = container.scrollWidth;
        const oneSetWidth = totalWidth / 3;

        if (container.scrollLeft >= oneSetWidth) {
           container.scrollLeft = 0; // Seamless reset because set 2 starts exactly like set 1
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <section className="py-24 bg-brand-gray border-y border-brand-border overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
             <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-4">See It In Action</h2>
             <p className="text-brand-textMuted text-lg">
               E-commerce brands, B2C apps, B2B SaaS. Signal Harvester identifies the perfect moment to step in and offer value.
             </p>
          </div>
        </div>
      </div>

      {/* Interactive Marquee Container */}
      <div className="relative w-full py-4">
        {/* We use overflow-x-auto to allow manual scroll when paused, but hide scrollbar with custom class or inline styles if needed */}
        {/* Added no-scrollbar utility class logic via standard css in index.html or inline style here */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto w-full no-scrollbar cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          {marqueeItems.map((ex, i) => (
            <ExampleCard key={i} {...ex} />
          ))}
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="container mx-auto px-6 mt-8">
        <p className="text-center text-slate-400 text-xs tracking-wide">
          These images are mock-ups of the product capabilities.
        </p>
      </div>
    </section>
  );
};
