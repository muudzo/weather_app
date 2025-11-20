import { useEffect, useRef } from 'react';

interface WeatherParticlesProps {
  condition: string;
}

export function WeatherParticles({ condition }: WeatherParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      };
    };

    // Initialize particles based on weather
    const particleCount = condition === 'rainy' ? 150 : condition === 'cloudy' ? 50 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        ...createParticle(),
        y: Math.random() * canvas.height,
      });
    }

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reset particle if it goes off screen
        if (particle.y > canvas.height + 10) {
          particles[index] = createParticle();
        }

        // Draw particle based on weather
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        if (condition === 'rainy') {
          // Rain drops
          ctx.strokeStyle = 'rgba(174, 223, 255, 0.6)';
          ctx.lineWidth = particle.size;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 2, particle.y - particle.vy * 8);
          ctx.stroke();
        } else {
          // Snow or general particles
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [condition]);

  // Only show particles for certain conditions
  if (!['rainy', 'snowy', 'cloudy'].includes(condition)) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
