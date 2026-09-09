import confetti from 'canvas-confetti';

export const triggerStarConfetti = (origin = { x: 0.5, y: 0.6 }) => {
  // Gold & Ruby festive colors
  const colors = ['#FFD700', '#FFA500', '#FF4500', '#B21B2D', '#FFFFFF'];

  // 1. Star Shapes Burst
  confetti({
    particleCount: 40,
    spread: 70,
    origin,
    colors,
    shapes: ['star'],
    scalar: 1.2,
    ticks: 150
  });

  // 2. Micro Sparkles Burst
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: origin.x - 0.1, y: origin.y },
      colors
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: origin.x + 0.1, y: origin.y },
      colors
    });
  }, 100);
};

export const triggerJackpotReward = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: Math.random() * 0.4 + 0.3, y: Math.random() - 0.2 },
      colors: ['#FFD700', '#FFA500', '#B21B2D', '#FFF275']
    }));
  }, 250);
};
