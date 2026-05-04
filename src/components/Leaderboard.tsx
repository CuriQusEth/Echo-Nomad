import React from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';

interface LeaderboardScreenProps {
  onMenu: () => void;
}

export function LeaderboardScreen({ onMenu }: LeaderboardScreenProps) {
  // Mock data for on-chain hybrid leaderboard
  const entries = [
    { rank: 1, address: '0x1234...abcd', distance: 124500, relics: 142 },
    { rank: 2, address: '0x8888...4444', distance: 98010, relics: 95 },
    { rank: 3, address: '0xaffe...cafe', distance: 84000, relics: 88 },
    { rank: 4, address: '0xdead...beef', distance: 75200, relics: 70 },
    { rank: 5, address: '0x0001...0002', distance: 68100, relics: 62 },
  ];

  return (
    <div className="w-full h-full echo-gradient flex flex-col p-6 overflow-hidden text-[#e2d1c3]">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <button 
        onClick={onMenu}
        className="z-10 self-start text-[#e2d1c3]/70 hover:text-white flex items-center mb-8 tracking-wider text-[10px] uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        BACK TO CAMP
      </button>

      <div className="z-10 max-w-2xl w-full mx-auto flex flex-col h-full">
        <div className="text-center mb-10">
          <Trophy className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 opacity-50" />
          <h2 className="text-3xl font-serif tracking-[0.2em] glow-gold text-[#D4AF37]">ON-CHAIN CHRONICLES</h2>
          <p className="opacity-50 mt-2 text-[10px] tracking-widest uppercase">Base Mainnet Global Ranks</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 glass-panel rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`text-xl font-bold font-mono w-8 text-center ${idx === 0 ? 'text-[#D4AF37]' : idx === 1 ? 'text-[#e2d1c3]' : idx === 2 ? 'text-orange-300' : 'text-white/30'}`}>
                    #{entry.rank}
                  </div>
                  <div className="text-cyan-400 font-mono text-sm">{entry.address}</div>
                </div>
                
                <div className="flex items-center gap-6 text-right">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-white/40 tracking-wider">DISTANCE</span>
                    <span className="text-cyan-400 font-mono">{entry.distance} m</span>
                  </div>
                  <div className="flex flex-col w-16">
                    <span className="text-[10px] uppercase text-white/40 tracking-wider">RELICS</span>
                    <span className="text-[#D4AF37] font-mono">{entry.relics}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
