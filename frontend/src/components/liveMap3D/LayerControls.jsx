import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Wind, CloudRain, Flame, Activity } from 'lucide-react';

export default function LayerControls({ activeLayers = {}, onToggle = () => {} }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, type: "spring" }}
      className="absolute top-6 left-6 z-10 w-64"
    >
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl text-white">
        <div 
          className="px-4 py-3 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-[13px] tracking-widest uppercase">Simulation Layers</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3">
                
                {/* AQI Heatmap */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <span>AQI Heatmap</span>
                  </div>
                  <div className="relative inline-block w-8 h-4 cursor-pointer" onClick={() => onToggle('aqi')}>
                    <div className={`block w-8 h-4 rounded-full transition-colors ${activeLayers.aqi ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                    <div className={`absolute top-0.5 bg-white w-3 h-3 rounded-full transition-all ${activeLayers.aqi ? 'left-4' : 'left-1'}`}></div>
                  </div>
                </div>

                {/* Pollution Plumes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Flame className="w-4 h-4 text-red-400" />
                    <span>Industrial Plumes</span>
                  </div>
                  <div className="relative inline-block w-8 h-4 cursor-pointer" onClick={() => onToggle('pollution')}>
                    <div className={`block w-8 h-4 rounded-full transition-colors ${activeLayers.pollution ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                    <div className={`absolute top-0.5 bg-white w-3 h-3 rounded-full transition-all ${activeLayers.pollution ? 'left-4' : 'left-1'}`}></div>
                  </div>
                </div>

                {/* Wind Vectors */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <span>Live Wind Flow</span>
                  </div>
                  <div className="relative inline-block w-8 h-4 cursor-pointer" onClick={() => onToggle('wind')}>
                    <div className={`block w-8 h-4 rounded-full transition-colors ${activeLayers.wind ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                    <div className={`absolute top-0.5 bg-white w-3 h-3 rounded-full transition-all ${activeLayers.wind ? 'left-4' : 'left-1'}`}></div>
                  </div>
                </div>

                {/* Weather System */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CloudRain className="w-4 h-4 text-blue-400" />
                    <span>Dynamic Weather</span>
                  </div>
                  <div className="relative inline-block w-8 h-4 cursor-pointer" onClick={() => onToggle('weather')}>
                    <div className={`block w-8 h-4 rounded-full transition-colors ${activeLayers.weather ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                    <div className={`absolute top-0.5 bg-white w-3 h-3 rounded-full transition-all ${activeLayers.weather ? 'left-4' : 'left-1'}`}></div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
