import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function AdvancedFireworkCheckbox() {
  const [checked, setChecked] = useState(false);
  type Particle = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
  };

  const [particles, setParticles] = useState<Particle[]>([]);

  const createAdvancedFirework = () => {
    const newParticles = [];
    const colors = ["#ffffff", "#fbbf24", "#f59e0b", "#d97706", "#92400e"];

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = 3 + Math.random() * 4;
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 80,
        maxLife: 80,
        size: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setTimeout(() => {
      const secondaryParticles: Particle[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const speed = 1.5 + Math.random() * 2;
        secondaryParticles.push({
          id: i + 100,
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60,
          maxLife: 60,
          size: 1 + Math.random(),
          color: "#ffffff",
        });
      }
      setParticles((prev) => [...prev, ...secondaryParticles]);
    }, 200);

    setParticles(newParticles);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.97,
            vy: particle.vy * 0.97 + 0.05,
            life: particle.life - 1,
          }))
          .filter((particle) => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const handleCheck = (isChecked: boolean) => {
    setChecked(isChecked);
    if (isChecked) {
      createAdvancedFirework();
    }
  };

  return (
    <label className="flex items-center cursor-pointer group relative">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => handleCheck(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded-2xl border-1 transition-all duration-500 relative overflow-visible ${
            checked
              ? "bg-green-500 border-green-500 shadow-2xl scale-125 shadow-green-400/50"
              : "border-gray-400 group-hover:border-green-400 group-hover:shadow-lg group-hover:scale-105"
          }`}
        >
          {checked && (
            <div className="absolute inset-0 rounded-2xl bg-green-500 opacity-50 animate-pulse" />
          )}

          <Check
            className={`w-3 h-3 absolute top-0.5 left-[1px] transition-all duration-700 ${
              checked
                ? "opacity-100 scale-100 rotate-0 text-white"
                : "opacity-0 scale-0 rotate-360 text-transparent"
            }`}
          />

          <div className="absolute top-1/2 left-1/2 pointer-events-none">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  transform: `translate(${particle.x}px, ${particle.y}px)`,
                  opacity: particle.life / particle.maxLife,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </label>
  );
}
