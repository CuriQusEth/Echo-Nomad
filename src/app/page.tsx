"use client";

import React, { useState } from 'react';
import { TitleScreen } from '../components/TitleScreen';
import { GameEngine } from '../components/game/GameEngine';
import { GameOverScreen } from '../components/GameOverScreen';
import { LeaderboardScreen } from '../components/Leaderboard';
import { GameState } from '../types';
import { Droplet, Battery, Radio } from 'lucide-react';

const INITIAL_GAME_STATE: GameState = {
  screen: 'TITLE',
  score: 0,
  relicsFound: 0,
  thirst: 100,
  energy: 100,
  resonance: 100,
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  const startGame = () => {
    setGameState({
      ...INITIAL_GAME_STATE,
      screen: 'GAME',
    });
  };

  const navToMenu = () => {
    setGameState(prev => ({ ...prev, screen: 'TITLE' }));
  };

  const navToLeaderboard = () => {
    setGameState(prev => ({ ...prev, screen: 'LEADERBOARD' }));
  };

  // HUD Component for active game
  const HUD = () => {
    if (gameState.screen !== 'GAME') return null;
    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
        <div className="absolute top-8 left-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1 w-48">
            <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 text-[#e2d1c3]">
              <span>Echo Resonance</span>
              <span className="text-cyan-400">{Math.floor(gameState.resonance)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="resonance-bar h-full transition-all" style={{ width: `${gameState.resonance}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-48">
            <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 text-[#e2d1c3]">
              <span>Energy</span>
              <span className="text-yellow-400">{Math.floor(gameState.energy)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="energy-bar h-full transition-all" style={{ width: `${gameState.energy}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-48">
            <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 text-[#e2d1c3]">
              <span>Thirst</span>
              <span className="text-green-400">{Math.floor(gameState.thirst)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="thirst-bar h-full transition-all" style={{ width: `${gameState.thirst}%` }} />
            </div>
          </div>
        </div>

        <div className="absolute top-8 right-8 flex flex-col items-end gap-4">
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 min-w-[200px] text-[#e2d1c3]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="uppercase tracking-widest text-[#e2d1c3]/70">Score</span>
              <span className="text-[#D4AF37] font-bold">{Math.floor(gameState.score)} ECHO</span>
            </div>
            <div className="h-[1px] bg-white/10" />
            <div className="flex justify-between items-center text-[10px]">
              <span className="uppercase tracking-wider text-[#e2d1c3]/70">Relics Found</span>
              <span className="text-[#D4AF37] font-mono">{gameState.relicsFound}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-8 flex flex-col items-end opacity-40 text-[#e2d1c3]">
          <span className="text-[9px] uppercase tracking-widest font-mono">App ID: 68f52e728c4fe3f562003e76</span>
          <span className="text-[9px] font-mono">Builder: bc_pywn60l0</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full h-[100dvh] bg-[#0d0d1a] text-[#e2d1c3] font-sans overflow-hidden select-none">
      {gameState.screen === 'TITLE' && (
        <TitleScreen onStart={startGame} onLeaderboard={navToLeaderboard} />
      )}

      {gameState.screen === 'GAME' && (
        <GameEngine 
          setScreen={(screen) => setGameState(prev => ({ ...prev, screen }))}
          updateGameState={setGameState}
        />
      )}

      {gameState.screen === 'GAMEOVER' && (
        <GameOverScreen 
          gameState={gameState} 
          onRestart={startGame} 
          onMenu={navToMenu} 
        />
      )}

      {gameState.screen === 'LEADERBOARD' && (
        <LeaderboardScreen onMenu={navToMenu} />
      )}

      <HUD />
    </div>
  );
}
