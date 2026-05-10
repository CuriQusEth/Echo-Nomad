"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface TitleScreenProps {
  onStart: () => void;
  onLeaderboard: () => void;
}

export function TitleScreen({ onStart, onLeaderboard }: TitleScreenProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center echo-gradient overflow-hidden select-none text-[#e2d1c3]">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="absolute bottom-0 w-full flex justify-center pb-64 pointer-events-none">
        <div className="relative w-full max-w-2xl h-1">
          <div className="horizon-line w-full"></div>
        </div>
      </div>

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-sans font-serif tracking-tighter glow-gold text-[#D4AF37] mb-2">
            ECHO NOMADS
          </h1>
          <p className="mt-4 opacity-70 tracking-wider text-sm flex items-center justify-center gap-3 text-[10px] uppercase">
            <span>Pilgrimage 041</span>
            <span className="h-3 w-[1px] bg-white/20"></span>
            <span>Base Mainnet</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full flex flex-col gap-4 mt-8"
        >
          <button
            onClick={onStart}
            className="glass-panel text-white py-4 px-6 rounded-2xl overflow-hidden transition-all hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center group"
          >
            <Play className="w-5 h-5 mr-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="tracking-[0.2em] font-bold text-xs uppercase text-[#D4AF37]">BEGIN JOURNEY</span>
          </button>

          <button
            onClick={onLeaderboard}
            className="glass-panel text-[#e2d1c3] py-4 px-6 rounded-2xl transition-all hover:bg-white/5 hover:border-[#e2d1c3]/30 flex items-center justify-center group"
          >
            <Trophy className="w-5 h-5 mr-3 opacity-80 group-hover:text-[#D4AF37] transition-colors" />
            <span className="tracking-[0.1em] text-xs uppercase opacity-80">Chronicles</span>
          </button>

          {/* Web3 Connect */}
          <div className="mt-4 pt-6">
            {!isConnected ? (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className="w-full flex items-center justify-center py-3 rounded-2xl glass-panel hover:bg-white/10 transition-colors"
              >
                <Wallet className="w-4 h-4 mr-2 opacity-70" />
                <span className="text-[10px] tracking-widest uppercase">Connect Wallet</span>
              </button>
            ) : (
              <div className="flex justify-between items-center glass-panel p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-white/50">Wallet Status</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-[#e2d1c3]">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  <button
                    onClick={() => disconnect()}
                    className="text-[9px] uppercase px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 w-full flex flex-col items-center opacity-40 text-[#e2d1c3]">
        <span className="text-[9px] uppercase tracking-widest font-mono">App ID: 68f52e728c4fe3f562003e76</span>
        <span className="text-[9px] font-mono">Builder: bc_pywn60l0</span>
      </div>
    </div>
  );
}
