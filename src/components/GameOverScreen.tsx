"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { GameState } from '../types';
import { useAccount, useSendTransaction, useSignMessage } from 'wagmi';
import { BUILDER_CODE, withERC8021Attribution } from '../lib/erc8021';
import { executeTrustlessAgentTask } from '../lib/erc8004';
import { Activity, Trophy, Hexagon, ArrowRight, Loader2 } from 'lucide-react';

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOverScreen({ gameState, onRestart, onMenu }: GameOverScreenProps) {
  const { address } = useAccount();
  const { sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { signMessage, isPending: isSignPending } = useSignMessage();
  const [submissionStatus, setSubmissionStatus] = useState<string>('');

  const handleRecordPilgrimage = async () => {
    if (!address) {
      setSubmissionStatus('Please connect wallet first.');
      return;
    }
    
    // SIWE-style signature for score submission
    const message = `Echo Nomads Pilgrimage\nScore: ${Math.floor(gameState.score)}\nRelics: ${gameState.relicsFound}\nTimestamp: ${Date.now()}`;
    
    try {
      setSubmissionStatus('Signing record...');
      await signMessage({ message, account: address as `0x${string}` }, {
        onSuccess: (signature) => {
          setSubmissionStatus('Record sealed on-chain (mocked using signature).');
          // Dispatch ER8004 background task to index this conceptually
          executeTrustlessAgentTask({
            agentId: 'echo-indexer-1',
            taskType: 'INDEX_PILGRIMAGE',
            payload: { signature, score: gameState.score }
          });
        },
        onError: (err) => {
          setSubmissionStatus('Signature failed.');
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSayGM = () => {
    if (!address) {
      setSubmissionStatus('Please connect wallet first.');
      return;
    }
    
    // Convert 'GM' to hex: 0x474d
    // Append attribution if needed
    const txData = withERC8021Attribution('0x474d');

    setSubmissionStatus('Saying GM...');
    sendTransaction({
      to: address, // Send to self as a mock action
      data: txData,
      value: 0n,
    }, {
      onSuccess: (hash) => {
        setSubmissionStatus(`GM acknowledged! Tx: ${hash.slice(0, 8)}...`);
      },
      onError: (err) => {
        setSubmissionStatus('Transaction failed.');
      }
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center echo-gradient p-6 overflow-hidden text-[#e2d1c3]">
      {/* Background static */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 glass-panel p-8 rounded-3xl max-w-md w-full flex flex-col items-center text-center shadow-2xl"
      >
        <Hexagon className="w-12 h-12 text-[#D4AF37] mb-4 opacity-50" />
        <h2 className="text-3xl font-serif tracking-[0.2em] glow-gold text-[#D4AF37] mb-6">JOURNEY ENDED</h2>
        
        <div className="space-y-4 w-full mb-8">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-[#e2d1c3]/70 tracking-wider text-[10px] uppercase flex items-center"><Activity className="w-4 h-4 mr-2"/> DISTANCE</span>
            <span className="text-cyan-400 font-mono text-lg">{Math.floor(gameState.score)} m</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-[#e2d1c3]/70 tracking-wider text-[10px] uppercase flex items-center"><Trophy className="w-4 h-4 mr-2"/> RELICS FOUND</span>
            <span className="text-[#D4AF37] font-mono text-lg">{gameState.relicsFound}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={handleSayGM}
            disabled={isTxPending || !address}
            className="flex items-center justify-center w-full px-8 py-4 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isTxPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'SAY GM ON-CHAIN'}
          </button>
          
          <button 
            onClick={handleRecordPilgrimage}
            disabled={isSignPending || !address}
            className="relative flex items-center justify-center w-full py-4 glass-panel border border-[#D4AF37]/30 rounded-2xl text-[#D4AF37] tracking-[0.2em] uppercase hover:bg-[#D4AF37]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-bold"
          >
            {isSignPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'RECORD PILGRIMAGE'}
          </button>
          
          {submissionStatus && (
            <div className="text-[10px] font-mono text-center text-cyan-300 mt-2 min-h-6 bg-cyan-900/20 px-2 py-1 rounded">
              {submissionStatus}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
            <button 
              onClick={onRestart}
              className="py-3 bg-white/5 rounded-xl text-[#e2d1c3] tracking-[0.1em] hover:bg-white/10 text-xs transition-colors"
            >
              WANDER AGAIN
            </button>
            <button 
              onClick={onMenu}
              className="py-3 glass-panel rounded-xl text-white/50 tracking-[0.1em] hover:text-[#e2d1c3] text-xs transition-colors"
            >
              MENU
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
