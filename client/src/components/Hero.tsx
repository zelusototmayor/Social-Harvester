import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Heart, Share2, X, MoreHorizontal } from 'lucide-react';

// Declare Mixpanel on window
declare global {
  interface Window {
    mixpanel: any;
  }
}

const PhoneFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`relative w-[260px] md:w-[280px] h-[530px] rounded-[2.5rem] border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col ${className}`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-xl z-30"></div>
    {children}
  </div>
);

// Screenshot 1 Recreation: Dark Mode, Draft Reply
const FitfixMockup = () => (
  <div className="bg-slate-900 h-full flex flex-col text-slate-100 font-sans">
    {/* Header */}
    <div className="pt-8 pb-3 px-4 text-center border-b border-slate-800">
      <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-2 opacity-50"></div>
      <h3 className="font-bold text-xs tracking-wide">Comments</h3>
    </div>

    {/* Workout Post Context */}
    <div className="h-40 bg-slate-800 relative overflow-hidden border-b border-slate-800 flex-shrink-0">
        <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop"
            alt="Workout Post"
            className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent flex items-end p-3">
             <div className="w-full">
                 <p className="text-white text-[10px] font-bold mb-0.5 drop-shadow-lg">@fitness_transform</p>
                 <p className="text-white text-xs font-medium leading-tight drop-shadow-lg line-clamp-2">30-min full body workout 🔥 No equipment needed! #fitness #workout</p>
             </div>
        </div>
    </div>

    {/* Comment List */}
    <div className="flex-1 p-4 space-y-4 overflow-hidden relative flex flex-col justify-end">
        {/* Comment 1 */}
        <div className="flex gap-2.5 opacity-40 grayscale">
             <div className="w-8 h-8 rounded-full bg-blue-500 overflow-hidden border border-slate-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
                 <div className="flex flex-col items-start">
                    <img src="https://media.giphy.com/media/osjgQPWRx3cac/giphy.gif" className="w-16 rounded-lg mb-1 opacity-80" alt="sticker" />
                    <span className="text-[9px] text-slate-400">Reply</span>
                 </div>
             </div>
        </div>

        {/* Target Comment */}
        <div className="flex gap-2.5">
             <div className="w-8 h-8 rounded-full bg-yellow-600 overflow-hidden border border-slate-700 shadow-lg">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha" alt="avatar" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
                 <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-xs text-slate-200">deilo_12 <span className="text-slate-500 font-normal ml-1 text-[10px]">2d</span></span>
                    <Heart className="w-3 h-3 text-slate-500" />
                 </div>
                 <p className="text-[13px] mt-0.5 leading-snug text-slate-100">
                    I always love how you explain the exerciess 😍🔥👏.
                 </p>
                 <div className="flex gap-4 mt-1 text-slate-500">
                    <span className="text-[10px] font-medium hover:text-slate-300 cursor-pointer">Reply</span>
                 </div>
             </div>
        </div>
    </div>

    {/* Reply Draft Overlay */}
    <div className="bg-slate-800 p-4 rounded-t-3xl relative z-20 pb-6 mt-1 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-slate-700/50 backdrop-blur-md">
        <div className="flex justify-between text-[10px] text-slate-400 mb-2 font-medium">
            <span>Replying to deilo_12</span>
            <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
        </div>
        <div className="relative group">
            <p className="text-[13px] text-white pr-8 leading-snug font-normal">
                <span className="text-blue-400">@deilo_12</span> if you love visual break downs of workouts - check out <span className="text-red-400 underline decoration-red-400/50 decoration-wavy underline-offset-2">Fitfix App</span>, they have amazing tutorials :)<span className="animate-pulse text-blue-400 inline-block ml-0.5 h-3.5 w-0.5 bg-blue-400 align-middle"></span>
            </p>
            <div className="absolute right-0 bottom-0 bg-blue-600 rounded-full p-1.5 shadow-lg shadow-blue-600/30 cursor-pointer hover:scale-110 transition-transform hover:bg-blue-500">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
        </div>
    </div>
  </div>
);

// Screenshot 2 Recreation: Light Mode, Video Thread
const TalkCoachMockup = () => (
  <div className="bg-white h-full flex flex-col font-sans relative">
     {/* Video Context Header - Taller for vertical video feel */}
     <div className="h-52 bg-slate-900 relative overflow-hidden group">
        <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" 
            alt="Video Context" 
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex items-end p-4">
             <div className="w-full">
                 <p className="text-white text-[10px] font-bold mb-0.5 shadow-black drop-shadow-md">@Reece_Talks</p>
                 <p className="text-white text-xs font-medium leading-tight shadow-black drop-shadow-md line-clamp-2">you can pretend like you're Obama 🎤 #publicspeaking</p>
             </div>
        </div>
        {/* Fake UI Elements */}
        <div className="absolute right-2 bottom-16 flex flex-col gap-3 text-white items-center">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full"><Heart className="w-4 h-4 fill-white/20" /></div>
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full"><MessageCircle className="w-4 h-4" /></div>
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full"><Share2 className="w-4 h-4" /></div>
        </div>
     </div>

     {/* Comment Header */}
     <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
        <span className="font-bold text-xs text-slate-900">93 comments</span>
        <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
     </div>

     {/* Comments */}
     <div className="flex-1 p-4 space-y-5 overflow-hidden bg-slate-50/30">
        {/* User Comment + Reply */}
        <div className="flex gap-2.5">
             <div className="w-7 h-7 rounded-full bg-green-200 flex-shrink-0 overflow-hidden ring-2 ring-white shadow-sm">
                <img src="https://images.unsplash.com/photo-1519895609939-d2a95dc96d36?w=100&auto=format&fit=crop" alt="user" />
             </div>
             <div className="flex-1">
                 <p className="text-[10px] text-slate-500 mb-0.5">NaesAddiction</p>
                 <p className="text-[12px] text-slate-900 font-medium leading-snug">Just tried this and let's say it's really crap. I gotta change the books I read 😂</p>

                 {/* The AI Reply */}
                 <div className="mt-2.5 flex gap-2 relative">
                    {/* Connecting line */}
                    <div className="absolute -left-[17px] top-0 bottom-3 w-[2px] bg-slate-200 rounded-bl-xl border-l border-b border-slate-200 rounded-b-lg"></div>

                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-md z-10">
                         <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-500 mb-0.5 font-semibold">AI Talk Coach</p>
                        <div className="text-[12px] text-slate-800 bg-orange-50 p-2.5 rounded-xl rounded-tl-sm border border-orange-100 shadow-sm leading-snug">
                           You have to practice it with tools like AI talk coach, it provides hard data on your speech :)
                        </div>
                         <div className="flex gap-2 mt-1 pl-1">
                            <span className="text-[9px] text-slate-400 font-medium">Reply</span>
                            <div className="flex items-center gap-0.5 text-[9px] text-slate-400">
                                <Heart className="w-2.5 h-2.5" /> 2
                            </div>
                         </div>
                    </div>
                 </div>
             </div>
        </div>
     </div>
  </div>
);

const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)] opacity-[0.08] animate-grid-flow"></div>
    {/* Moving Light Gradient 1 */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-emerald-400/15 rounded-full blur-[120px] animate-pulse-slow"></div>
    {/* Moving Light Gradient 2 */}
    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-lime-400/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
    {/* Floating particles effect */}
    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-300/5 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
    {/* Vibrant green moving blob */}
    <div className="absolute top-1/2 right-1/4 w-[600px] h-[500px] bg-green-500/12 rounded-full blur-[90px] animate-float" style={{ animationDelay: '3s' }}></div>
  </div>
);

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-20 overflow-hidden bg-gradient-to-br from-emerald-50/60 via-white to-lime-50/40">
      <BackgroundGrid />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Text Content */}
          <div className="lg:w-5/12 text-center lg:text-left pt-4 z-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.05] mb-6 text-slate-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Turn Niche Comments Into <br/>
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-600 animate-shimmer bg-[length:200%_auto] pb-2">
                New Customers!
              </span>
            </h1>

            <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              This tool finds people asking for help, advice, or product recs inside Instagram comments—so you can be the one who answers.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-3 justify-center lg:justify-start" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/register"
                className="relative overflow-hidden inline-flex bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/30 items-center justify-center gap-3 group active:scale-95"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span>Start Now for Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="inline-flex bg-white hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-xl font-bold text-lg transition-all border border-slate-200 items-center justify-center"
              >
                Login
              </Link>
            </div>

            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth'})}
              className="mt-6 px-6 py-2.5 rounded-full font-medium text-slate-500 hover:text-emerald-700 transition-colors text-sm animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              Learn how it works
            </button>
          </div>

          {/* Visuals - Overlapping Phone Layout (COMPACT) */}
          <div className="lg:w-7/12 flex justify-center items-center relative h-[600px] w-full animate-fade-in-up perspective-1000" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-lime-400/10 blur-[100px] rounded-full opacity-60 animate-float"></div>
            
            {/* Phone 1: Dark Mode Draft (Left Back) */}
            <div className="absolute left-1/2 -translate-x-[65%] z-10 transition-all duration-700 hover:z-40 group/phone1">
                <div className="transform transition-transform duration-700 ease-out -rotate-6 translate-y-8 group-hover/phone1:rotate-0 group-hover/phone1:translate-y-0 group-hover/phone1:scale-110 will-change-transform">
                    <PhoneFrame className="bg-slate-900 border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group-hover/phone1:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
                        <FitfixMockup />
                    </PhoneFrame>
                </div>
            </div>

            {/* Phone 2: Light Mode Thread (Right Front) */}
            <div className="absolute left-1/2 -translate-x-[35%] top-2 z-20 transition-all duration-700 hover:z-40 group/phone2">
                <div className="transform transition-transform duration-700 ease-out rotate-6 group-hover/phone2:rotate-0 group-hover/phone2:translate-y-2 group-hover/phone2:scale-110 will-change-transform">
                    <PhoneFrame className="bg-white border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] group-hover/phone2:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
                        <TalkCoachMockup />
                    </PhoneFrame>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
