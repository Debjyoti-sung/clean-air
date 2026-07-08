import React, { useState } from 'react';
import { Cpu, Loader2, CheckSquare, Square, AlertOctagon } from 'lucide-react';
import { generateAIPlan } from './mockData';

export default function AIResolutionPanel({ report, setReports, readOnly = false }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateAIPlan(report.issueCategory);
      setReports(prev => prev.map(r => r.id === report.id ? { 
        ...r, 
        aiResolutionPlan: plan,
        currentStatus: 'Work In Progress'
      } : r));
      setIsGenerating(false);
    }, 1500);
  };

  const toggleChecklist = (taskId) => {
    if (readOnly) return; // Prevent clicks in read-only mode
    setReports(prev => prev.map(r => {
      if (r.id === report.id && r.aiResolutionPlan) {
        const updatedChecklist = r.aiResolutionPlan.checklist.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        
        const completedCount = updatedChecklist.filter(t => t.completed).length;
        let newStatus = r.currentStatus;
        
        if (completedCount > 0 && r.currentStatus !== 'Completed') {
          newStatus = 'Work In Progress';
        }
        
        return { 
          ...r, 
          currentStatus: newStatus,
          aiResolutionPlan: { ...r.aiResolutionPlan, checklist: updatedChecklist } 
        };
      }
      return r;
    }));
  };

  if (!report.aiResolutionPlan) {
    return (
      <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-6 rounded-2xl text-center">
        <Cpu className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-800 mb-1">AI Guided Resolution Plan</h3>
        <p className="text-xs text-slate-500 mb-4 px-4">Generate an automated, step-by-step mitigation strategy with resource estimations and safety guidelines.</p>
        {readOnly ? (
          <div className="text-xs font-bold text-slate-400">Awaiting AI guided checklist generation...</div>
        ) : (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e1] border border-white/40 rounded-xl text-slate-705 hover:text-slate-900 transition-all font-bold text-sm flex items-center justify-center mx-auto space-x-2 cursor-pointer"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            <span>{isGenerating ? 'Synthesizing Plan...' : 'Generate Resolution Plan'}</span>
          </button>
        )}
      </div>
    );
  }

  const { budget, team, duration, riskAnalysis, checklist } = report.aiResolutionPlan;
  const completedCount = checklist.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-5 rounded-2xl space-y-5 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-[#15803D]" />
          <h3 className="text-sm font-black text-slate-900">AI Implementation Guide</h3>
        </div>
        <span className="px-2 py-1 bg-[#15803D]/10 text-[#15803D] font-mono text-[10px] font-bold rounded border border-[#15803D]/20">AERION-AI-V4</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] p-3 rounded-xl border border-transparent">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">Est. Budget</span>
          <span className="text-sm font-bold text-slate-805">{budget}</span>
        </div>
        <div className="bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] p-3 rounded-xl border border-transparent">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">Required Team</span>
          <span className="text-sm font-bold text-slate-805">{team}</span>
        </div>
        <div className="bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] p-3 rounded-xl border border-transparent">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">Est. Duration</span>
          <span className="text-sm font-bold text-slate-805">{duration}</span>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl flex items-start space-x-2.5">
        <AlertOctagon className="w-4.5 h-4.5 text-orange-600 mt-0.5 shrink-0" />
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-700 block mb-0.5">Risk Analysis</span>
          <p className="text-xs font-semibold text-orange-850 leading-normal">{riskAnalysis}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Execution Checklist</span>
          <span className="text-xs font-bold text-[#15803D]">{progressPercent}%</span>
        </div>
        
        <div className="w-full h-1.5 bg-[#f1f5f9] shadow-[inset_1px_1px_2px_#cbd5e1] rounded-full overflow-hidden mb-4 border border-transparent">
          <div className="h-full bg-[#15803D] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="space-y-2">
          {checklist.map((task) => (
            <div 
              key={task.id} 
              onClick={() => toggleChecklist(task.id)}
              className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                task.completed 
                  ? 'bg-slate-200/40 border-slate-300 opacity-60' 
                  : 'bg-white border-slate-200 hover:border-slate-350 hover:shadow-sm'
              }`}
            >
              <div className={task.completed ? 'text-[#15803D]' : 'text-slate-300'}>
                {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
              </div>
              <span className={`text-sm font-semibold flex-1 ${task.completed ? 'line-through text-slate-455' : 'text-slate-705'}`}>
                {task.task}
              </span>
              {task.completed && (
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  DONE
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
