import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#8b5cf6', '#06b6d4', '#ec4899']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#a855f7', '#3b82f6', '#10b981']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#ffffff', '#8b5cf6', '#06b6d4']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#ec4899', '#f43f5e', '#a855f7']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#06b6d4', '#3b82f6', '#10b981']
  });
}

export default function ConfettiTrigger({ active }) {
  useEffect(() => {
    if (active) {
      fireConfetti();
      const interval = setInterval(() => {
        fireConfetti();
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [active]);

  return null;
}
