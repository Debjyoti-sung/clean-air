import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { SupabaseService } from '../../services/supabase.service';

export default function AuthPromptCard({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await SupabaseService.signIn(email, password);
      onAuthenticated(user);
    } catch (error) {
      alert("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 10: Authentication</h2>
        <p className="text-sm text-slate-500">
          Please sign in to submit your environmental report. Your identity helps prevent spam and allows you to track resolution progress.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto relative overflow-hidden">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-inner border border-slate-200">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-slate-900 font-bold text-sm focus:outline-none transition" 
              placeholder="citizen@india.gov.in" 
            />
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-slate-900 font-bold text-sm focus:outline-none transition" 
              placeholder="••••••••" 
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-3.5 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md shadow-emerald-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Authenticating..." : "Sign In & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
