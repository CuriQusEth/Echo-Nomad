"use client";

import React, { useState } from 'react';
import { useAccount, useSendTransaction, useConnect, useDisconnect } from 'wagmi';
import { parseEther } from 'viem';
import { TitleScreen } from './components/TitleScreen';
import { GameEngine } from './components/game/GameEngine';
import { GameOverScreen } from './components/GameOverScreen';
import { LeaderboardScreen } from './components/Leaderboard';
import { GameState } from './types';
import { Droplet, Battery, Radio, Sun } from 'lucide-react';
import { injected } from 'wagmi/connectors';

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
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();

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

  const sendGMTransaction = () => {
    if (!isConnected) return;
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: 0n,
      data: '0x' // Basic transactions, can also encode "GM" in hex if desired, but 0x is fine for simple ping
    });
  };

  // HUD Component for active game
  const HUD = () => {
    if (gameState.screen !== 'GAME') return null;
    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
        <div className="absolute top-8 left-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1 w-28">
            <div className="flex justify-between text-[9px] uppercase tracking-wider mb-1 text-[#e2d1c3]">
              <span>Resonance</span>
              <span className="text-cyan-400">{Math.floor(gameState.resonance)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="resonance-bar h-full transition-all" style={{ width: `${gameState.resonance}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-28">
            <div className="flex justify-between text-[9px] uppercase tracking-wider mb-1 text-[#e2d1c3]">
              <span>Energy</span>
              <span className="text-yellow-400">{Math.floor(gameState.energy)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="energy-bar h-full transition-all" style={{ width: `${gameState.energy}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-28">
            <div className="flex justify-between text-[9px] uppercase tracking-wider mb-1 text-[#e2d1c3]">
              <span>Thirst</span>
              <span className="text-green-400">{Math.floor(gameState.thirst)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="thirst-bar h-full transition-all" style={{ width: `${gameState.thirst}%` }} />
            </div>
          </div>
        </div>

        <div className="absolute top-8 right-4 flex flex-col items-end gap-4 pointer-events-auto">
          <div className="glass-panel p-3 rounded-2xl flex flex-col gap-2 min-w-[140px] text-[#e2d1c3]">
            <div className="flex justify-between items-center text-[10px]">
              <span className="uppercase tracking-widest text-[#e2d1c3]/70">Score</span>
              <span className="text-[#D4AF37] font-bold">{Math.floor(gameState.score)}m</span>
            </div>
            <div className="h-[1px] bg-white/10" />
            <div className="flex justify-between items-center text-[9px]">
              <span className="uppercase tracking-wider text-[#e2d1c3]/70">Relics</span>
              <span className="text-[#D4AF37] font-mono">{gameState.relicsFound}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 w-full flex flex-col items-center opacity-40 text-[#e2d1c3]">
          <span className="text-[8px] uppercase tracking-widest font-mono">App ID: 68f52e728c4fe3f562003e76</span>
          <span className="text-[8px] font-mono">Builder: [BUILDER_CODE]</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#050505] overflow-y-auto py-4 sm:py-8">
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] sm:rounded-[2.5rem] sm:border-[10px] sm:border-neutral-900 bg-[#0d0d1a] text-[#e2d1c3] font-sans overflow-hidden select-none sm:shadow-[0_0_50px_rgba(34,211,238,0.1)] flex-shrink-0">
        
        {/* Connection Widget */}
        <div className="absolute top-4 right-4 z-[100]">
          {!isConnected ? (
             <button 
               onClick={() => connect({ connector: injected() })}
               className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs hover:bg-white/20 transition-colors"
             >
                Connect Wallet
             </button>
          ) : (
            <button 
               onClick={() => disconnect()}
               className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs hover:bg-white/20 transition-colors"
            >
              {address?.slice(0,6)}...{address?.slice(-4)}
            </button>
          )}
        </div>

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
          >
             {/* Required GM Button inserted as children or overlay */}
             {isConnected && (
               <div className="w-full mt-4 z-[60] flex justify-center">
                 <button 
                   onClick={sendGMTransaction}
                   className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
                 >
                   <Sun size={14} /> Say GM
                 </button>
               </div>
             )}
          </GameOverScreen>
        )}

        {gameState.screen === 'LEADERBOARD' && (
          <LeaderboardScreen onMenu={navToMenu} />
        )}

        <HUD />
      </div>
    </div>
  );
}
