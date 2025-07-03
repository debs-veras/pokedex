import { useEffect, useState } from "react";

export const PokemonBackground = () => {
  const [stars, setStars] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      delay: number;
      duration: number;
      twinkle: boolean;
    }>
  >([]);

  useEffect(() => {
    const generateStars = () => {
      const starCount = window.innerWidth < 768 ? 100 : 200; 
      const newStars = Array.from({ length: starCount }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        delay: Math.random() * 10,
        duration: Math.random() * 5 + 3,
        twinkle: Math.random() > 0.3 
      }));
      setStars(newStars);
    };

    generateStars();
    window.addEventListener('resize', generateStars);
    return () => window.removeEventListener('resize', generateStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
      {/* Estrelas maiores (mais brilhantes) */}
      {stars.filter(star => star.size > 2).map((star, i) => (
        <div
          key={`large-${i}`}
          className={`absolute rounded-full bg-white ${star.twinkle ? 'animate-pulse' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: `0 0 ${star.size * 2}px ${star.size / 2}px rgba(255, 255, 255, ${star.opacity * 0.5})`
          }}
        />
      ))}

      {/* Estrelas menores (fundo) */}
      {stars.filter(star => star.size <= 2).map((star, i) => (
        <div
          key={`small-${i}`}
          className={`absolute rounded-full bg-white ${star.twinkle ? 'animate-pulse' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}

      {/* Algumas estrelas coloridas (10% do total) */}
      {stars.filter((_, i) => i % 10 === 0).map((star, i) => (
        <div
          key={`color-${i}`}
          className={`absolute rounded-full ${i % 3 === 0 ? 'bg-purple-400' : 'bg-blue-400'} animate-pulse`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * 1.5}px`,
            height: `${star.size * 1.5}px`,
            opacity: star.opacity * 0.8,
            animationDelay: `${star.delay * 1.5}s`,
            animationDuration: `${star.duration * 1.2}s`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}

      {/* Efeito de via láctea */}
      <div 
        className="absolute top-1/2 left-1/2 w-full h-1/3 bg-gradient-to-r from-transparent via-purple-900/20 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-15 blur-xl"
        style={{
          clipPath: 'polygon(0% 50%, 100% 30%, 100% 70%, 0% 50%)'
        }}
      />
    </div>
  );
};