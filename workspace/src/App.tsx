import { useState, useEffect, useRef, useCallback } from 'react';

// Floating Hearts Background Component
function FloatingHearts() {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 12 + Math.random() * 20,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float"
          style={{
            left: `${heart.left}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
          }}
        >
          💕
        </div>
      ))}
    </div>
  );
}

// Confetti Component
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: ['#ec4899', '#f472b6', '#fb7185', '#fda4af', '#fbbf24', '#a78bfa', '#67e8f9'][Math.floor(Math.random() * 7)],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti rounded-sm"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
}

// Forgiveness Mini Game Component
function ForgivenessGame({ onComplete }: { onComplete: () => void }) {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noButtonVisible, setNoButtonVisible] = useState(true);
  const [noOpacity, setNoOpacity] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveButtonAway = useCallback(() => {
    setAttempts(prev => prev + 1);
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const maxX = rect.width - 120;
    const maxY = rect.height - 50;
    
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;
    
    setNoButtonPos({ x: newX, y: newY });
    
    // Fade out gradually
    if (attempts > 3) {
      setNoOpacity(prev => Math.max(0, prev - 0.25));
    }
    
    if (attempts > 6) {
      setNoButtonVisible(false);
    }
  }, [attempts]);

  const handleYes = () => {
    setAccepted(true);
    onComplete();
  };

  const funnyMessages = [
    "Hehe, nice try! 😏",
    "You can't catch me! 🏃‍♂️",
    "Come on, you know the answer! 😘",
    "That button is shy! 🙈",
    "Almost got me... NOT! 😜",
    "Just click Yes already! 💕",
    "The No button is running away! 🫣",
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={containerRef}>
      {!accepted ? (
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100">
            <div className="text-5xl mb-4 animate-heartbeat">🥺</div>
            <h3 className="font-dancing text-3xl text-pink-600 mb-2">
              Will you forgive me?
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              (I promise I'll be better... maybe 😉)
            </p>
            
            <div className="flex justify-center gap-8 items-center min-h-[100px] relative">
              <button
                onClick={handleYes}
                className="px-8 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-glow z-10"
              >
                Yes! 💖
              </button>
              
              {noButtonVisible && (
                <button
                  ref={buttonRef}
                  onMouseEnter={moveButtonAway}
                  onTouchStart={moveButtonAway}
                  className="px-8 py-3 bg-gray-200 text-gray-500 rounded-full font-medium transition-all duration-300"
                  style={{
                    transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                    opacity: noOpacity,
                  }}
                >
                  No
                </button>
              )}
            </div>
            
            {attempts > 0 && attempts <= 7 && (
              <p className="mt-4 text-pink-400 text-sm animate-fade-in">
                {funnyMessages[attempts - 1]}
              </p>
            )}
            
            {attempts > 7 && (
              <p className="mt-4 text-pink-500 text-sm animate-bounce-in font-medium">
                See? Even the "No" button knows the answer is Yes! 💕
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center animate-bounce-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100">
            <div className="text-6xl mb-4">🥰</div>
            <h3 className="font-dancing text-3xl text-pink-600 mb-2">
              Thank you, my love!
            </h3>
            <p className="text-gray-600">
              You're the most amazing person in my life 💗
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Scroll-triggered section component
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </div>
  );
}

// Main App
export default function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);

  useEffect(() => {
    // Trigger confetti on load
    setTimeout(() => setShowConfetti(true), 1000);
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  const handleGameComplete = () => {
    setGameCompleted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const reasonsILoveYou = [
    "The way you laugh at my terrible jokes 😂",
    "How you scrunch your nose when you're thinking 🤔",
    "Your warmth that makes everything feel okay 🌸",
    "The way you say my name 💫",
    "How you remember the little things 🦋",
    "Your smile that lights up my entire world ☀️",
    "The way you make ordinary days feel special ✨",
    "How you're my best friend and my love all in one 💝",
  ];

  return (
    <div className="min-h-screen relative">
      <FloatingHearts />
      <Confetti active={showConfetti} />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4 py-16">
        <div className="text-center z-10">
          <div className="animate-bounce-in">
            <span className="text-6xl md:text-8xl mb-4 block">🎂</span>
          </div>
          
          <h1 className="font-dancing text-5xl md:text-7xl lg:text-8xl text-pink-500 mb-4 animate-fade-in-up">
            Happy Birthday
          </h1>
          <h2 className="font-dancing text-3xl md:text-5xl text-rose-400 mb-6 animate-fade-in-up delay-300">
            My Beautiful Love
          </h2>
          
          <div className="animate-fade-in-up delay-500">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-pink-100">
              <span className="text-pink-400">📅</span>
              <span className="text-gray-700 font-medium">7th October</span>
              <span className="text-pink-400">🎉</span>
            </div>
          </div>
          
          <p className="mt-8 text-gray-600 max-w-md mx-auto animate-fade-in-up delay-700 text-lg">
            Today the world got a little more beautiful because you were born. 
            Here's to celebrating the most amazing person I know.
          </p>
          
          <div className="mt-10 animate-fade-in-up delay-1000">
            <a href="#letter" className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors">
              <span>Scroll down for a surprise</span>
              <span className="animate-float">↓</span>
            </a>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-50">🌸</div>
        <div className="absolute top-40 right-16 text-3xl animate-float-slow opacity-40">✨</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-float opacity-40">💐</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-float-slow opacity-50">🦋</div>
      </section>

      {/* Love Letter Section */}
      <section id="letter" className="py-20 px-4">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            {!letterOpened ? (
              <div 
                className="cursor-pointer group"
                onClick={() => setLetterOpened(true)}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-pink-100 text-center hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="text-6xl mb-4 group-hover:animate-wiggle">💌</div>
                  <h3 className="font-dancing text-2xl text-pink-500 mb-2">A letter for you</h3>
                  <p className="text-gray-400 text-sm">Tap to open</p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-pink-100 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-2xl animate-sparkle">✨</div>
                  <div className="absolute bottom-4 left-4 text-2xl animate-sparkle delay-500">💫</div>
                  
                  <h3 className="font-dancing text-3xl text-pink-500 mb-6">My Dearest,</h3>
                  
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      On this special day, I want you to know just how much you mean to me. 
                      Every single day with you feels like a gift I don't deserve but am so grateful for.
                    </p>
                    <p>
                      You're not just my love — you're my favorite person, my safe place, 
                      my biggest adventure, and the reason I believe in magic.
                    </p>
                    <p>
                      I know I'm not perfect, and there are times I mess up. 
                      But what I want you to always remember is that my love for you is constant. 
                      It doesn't waver, it doesn't fade — it only grows stronger.
                    </p>
                    <p>
                      Today, on your birthday, I want to celebrate YOU. 
                      The way you light up rooms, the kindness in your heart, 
                      and the beautiful soul that you are.
                    </p>
                    <p className="font-dancing text-xl text-pink-500 mt-6">
                      Happy Birthday, my everything. Here's to forever with you. 💕
                    </p>
                    <p className="text-right text-pink-400 font-dancing text-lg">
                      — Yours, always & forever
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Reasons I Love You */}
      <section className="py-20 px-4">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="font-dancing text-4xl md:text-5xl text-pink-500 mb-4">
              Reasons I Adore You
            </h2>
            <p className="text-gray-500">Just a few of the million things I love about you</p>
          </div>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          {reasonsILoveYou.map((reason, index) => (
            <AnimatedSection key={index}>
              <div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-pink-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-gray-700">{reason}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Our Special Date */}
      <section className="py-20 px-4">
        <AnimatedSection>
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 shadow-xl border border-pink-100">
              <div className="text-5xl mb-4 animate-heartbeat">🎀</div>
              <h2 className="font-dancing text-3xl text-pink-500 mb-4">October 7th</h2>
              <p className="text-gray-600 mb-4">
                The day the universe decided to create its masterpiece.
              </p>
              <p className="text-gray-500 text-sm">
                Every year on this day, I thank my lucky stars that you exist. 
                You make the world brighter just by being in it.
              </p>
              <div className="mt-6 flex justify-center gap-3 text-2xl">
                <span className="animate-float">🌷</span>
                <span className="animate-float delay-200">🌸</span>
                <span className="animate-float delay-500">🌺</span>
                <span className="animate-float delay-700">💮</span>
                <span className="animate-float delay-1000">🏵️</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Forgiveness Mini Game */}
      <section className="py-20 px-4">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="font-dancing text-4xl md:text-5xl text-pink-500 mb-4">
              One More Thing...
            </h2>
            <p className="text-gray-500">I have a little question for you 👇</p>
          </div>
          
          <ForgivenessGame onComplete={handleGameComplete} />
        </AnimatedSection>
      </section>

      {/* Birthday Wish / Closing */}
      <section className="py-20 px-4">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-pink-100">
              <div className="text-5xl mb-6 animate-heartbeat">🎁</div>
              <h2 className="font-dancing text-4xl text-pink-500 mb-6">
                My Birthday Wish For You
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  May this year bring you all the happiness your heart can hold.
                </p>
                <p>
                  May every dream you've been chasing finally catch up to you.
                </p>
                <p>
                  May you always see yourself the way I see you — 
                  beautiful, strong, and absolutely incredible.
                </p>
                <p className="font-dancing text-2xl text-pink-500 mt-6">
                  Happy Birthday, my love! 🎂🥳💕
                </p>
              </div>
              
              {gameCompleted && (
                <div className="mt-8 pt-6 border-t border-pink-100 animate-bounce-in">
                  <p className="text-pink-400 text-sm">
                    P.S. — You're stuck with me. No refunds. 😘💝
                  </p>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <div className="flex justify-center gap-2 text-2xl mb-4">
          <span className="animate-float">💖</span>
          <span className="animate-float delay-200">💗</span>
          <span className="animate-float delay-500">💕</span>
          <span className="animate-float delay-700">💗</span>
          <span className="animate-float delay-1000">💖</span>
        </div>
        <p className="font-dancing text-2xl text-pink-400">
          Made with all my love, just for you
        </p>
        <p className="text-gray-400 text-sm mt-2">
          7th October • Forever Yours
        </p>
      </footer>
    </div>
  );
}
