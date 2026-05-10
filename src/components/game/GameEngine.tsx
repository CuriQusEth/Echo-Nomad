"use client";

import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../../types';

interface GameEngineProps {
  setScreen: (state: any) => void;
  updateGameState: (updater: (prev: GameState) => GameState) => void;
}

// Procedural Helper
const pseudoRandom = (x: number) => {
  const n = Math.sin(x * 12.9898) * 43758.5453;
  return n - Math.floor(n);
};

export function GameEngine({ setScreen, updateGameState }: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game internal state
  const scrollRef = useRef(0);
  const touchState = useRef({ isDown: false, startX: 0, currentX: 0, holdStartTime: 0 });
  const playerRef = useRef({ x: window.innerWidth / 4, y: 0, targetX: window.innerWidth / 4 });
  const timeRef = useRef(0); // Day/Night cycle
  
  const pulses = useRef<{x: number, y: number, r: number, max: number, age: number, opacity: number}[]>([]);
  const relics = useRef<{x: number, y: number, collected: boolean}[]>([]);

  // Generate some relics
  useEffect(() => {
    for(let i=0; i<100; i++) {
      relics.current.push({
        x: 1000 + i * 2500 + pseudoRandom(i)*500,
        y: 0,
        collected: false
      });
    }
  }, []);

  const getTerrainY = (x: number) => {
    // A mix of sine waves for rolling hills
    return Math.sin(x * 0.002) * 50 + Math.sin(x * 0.005) * 80 + Math.sin(x * 0.01) * 20;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      playerRef.current.x = canvas.width / 4;
      playerRef.current.targetX = canvas.width / 4;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update game mechanics
      timeRef.current += dt * 0.05; // 1 unit = 20 seconds
      const dayCycle = (Math.sin(timeRef.current) + 1) / 2; // 0 to 1

      // Move player / Scroll
      if (touchState.current.isDown) {
        // Evaluate swipe diff
        const diff = touchState.current.currentX - touchState.current.startX;
        if (Math.abs(diff) > 20) {
          scrollRef.current -= diff * 0.05;
        }
      } else {
        // Auto slow walk
        scrollRef.current += 100 * dt; 
      }

      const currentScroll = scrollRef.current;
      const baseHeight = canvas.height * 0.7;
      
      // Resource decay
      updateGameState(prev => {
        const newThirst = prev.thirst - (dt * 0.5);
        const newEnergy = prev.energy - (dt * 0.3);
        
        if (newThirst <= 0 || newEnergy <= 0) {
          setTimeout(() => setScreen('GAMEOVER'), 100);
        }
        
        return {
          ...prev,
          score: Math.max(prev.score, currentScroll / 10),
          thirst: Math.max(0, newThirst),
          energy: Math.max(0, newEnergy),
        };
      });

      playerRef.current.y = baseHeight - getTerrainY(scrollRef.current + playerRef.current.x) - 15;

      // Clear & Draw BG
      // Day = Warm Sand/Cyan, Night = Deep Indigo
      const r = Math.floor(20 + dayCycle * 160);
      const g = Math.floor(20 + dayCycle * 180);
      const b = Math.floor(40 + dayCycle * 210);
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add stars at night
      if (dayCycle < 0.4) {
        ctx.fillStyle = `rgba(255,255,255,${(0.4 - dayCycle)})`;
        for(let i=0; i<50; i++) {
          const sx = (pseudoRandom(i) * canvas.width * 2 - currentScroll * 0.1) % canvas.width;
          const sy = pseudoRandom(i + 100) * canvas.height * 0.5;
          ctx.beginPath();
          ctx.arc(sx > 0 ? sx : sx + canvas.width, sy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Terrain back layer
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 20) {
        const worldX = currentScroll + x;
        const y = baseHeight - getTerrainY(worldX * 0.5) * 1.5 - 50; 
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fillStyle = `rgba(10, 10, 20, ${0.1 + dayCycle*0.1})`;
      ctx.fill();

      // Draw Terrain ground
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 10) {
        const worldX = currentScroll + x;
        const y = baseHeight - getTerrainY(worldX);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fillStyle = `rgb(${r*0.3}, ${g*0.3}, ${b*0.4})`;
      ctx.fill();

      // Draw Relics
      relics.current.forEach(relic => {
        const screenX = relic.x - currentScroll;
        if (screenX > -50 && screenX < canvas.width + 50 && !relic.collected) {
          relic.y = baseHeight - getTerrainY(relic.x) - 10;
          
          // Draw relic glowing
          ctx.beginPath();
          ctx.arc(screenX, relic.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#E0C097';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#E0C097';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Collision
          const dist = Math.hypot(screenX - playerRef.current.x, relic.y - playerRef.current.y);
          if (dist < 30) {
            relic.collected = true;
            updateGameState(prev => ({
              ...prev,
              relicsFound: prev.relicsFound + 1,
              energy: Math.min(100, prev.energy + 20),
              resonance: Math.min(100, prev.resonance + 25)
            }));
            
            // Pop pulse
            pulses.current.push({
              x: playerRef.current.x,
              y: playerRef.current.y,
              r: 0, max: 200, age: 0, opacity: 1
            });
          }
        }
      });

      // Draw Echo Pulses
      for (let i = pulses.current.length - 1; i >= 0; i--) {
        const p = pulses.current[i];
        p.r += 200 * dt;
        p.age += dt;
        p.opacity = Math.max(0, 1 - (p.age / 2));
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${p.opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Environment reveal effect within pulse
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r - 20, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${p.opacity * 0.1})`;
        ctx.lineWidth = 40;
        ctx.stroke();

        if (p.age > 2) pulses.current.splice(i, 1);
      }

      // Draw Player
      ctx.beginPath();
      ctx.arc(playerRef.current.x, playerRef.current.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#22d3ee';
      ctx.fill();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Handlers for Mobile First Interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    touchState.current.isDown = true;
    touchState.current.startX = e.clientX;
    touchState.current.currentX = e.clientX;
    touchState.current.holdStartTime = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (touchState.current.isDown) {
      touchState.current.currentX = e.clientX;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    touchState.current.isDown = false;
    const holdDuration = Date.now() - touchState.current.holdStartTime;
    const diff = Math.abs(touchState.current.currentX - touchState.current.startX);

    // If it was a tap/hold without much dragging, fire Echo Pulse
    if (diff < 10) {
      if (holdDuration > 200) {
        // Use Resonance
        updateGameState(prev => {
          if (prev.resonance >= 10) {
            pulses.current.push({
              x: playerRef.current.x,
              y: playerRef.current.y,
              r: 0, max: 400 + holdDuration * 0.5, age: 0, opacity: 1
            });
            return { ...prev, resonance: Math.max(0, prev.resonance - 10) };
          }
          return prev;
        });
        
        // Haptic Feedback
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    }
  };

  return (
    <div 
      className="absolute inset-0 touch-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Tutorial Hint */}
      <div className="absolute top-1/4 left-0 w-full text-center pointer-events-none opacity-40 mix-blend-screen">
        <p className="text-cyan-200 text-sm tracking-[0.2em] animate-pulse">HOLD TO ECHO • SWIPE TO WANDER</p>
      </div>
    </div>
  );
}
