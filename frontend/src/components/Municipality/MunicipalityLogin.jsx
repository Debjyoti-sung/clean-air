import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, LogOut } from 'lucide-react';
import { SupabaseService } from '../../services/supabase.service';

export default function MunicipalityLogin({ onBack, onLogin, user, onLogout }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const citizenEmail = 'debjyotibarikgdg@gmail.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pre-check if they are typing the citizen email
    if (email.trim().toLowerCase() === citizenEmail) {
      setError('Same email as citizen! A new/different email for the municipality page must be used.');
      setLoading(false);
      return;
    }

    try {
      const loggedInUser = await SupabaseService.signIn(email, password);
      
      // Post-check just in case
      if (loggedInUser.email.toLowerCase() === citizenEmail) {
        setError('Same email as citizen! A new/different email for the municipality page must be used.');
        await SupabaseService.signOut();
      } else {
        onLogin(loggedInUser);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in but with citizen email (e.g. from session)
  if (user && user.email.toLowerCase() === citizenEmail) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[2rem] border border-slate-200 shadow-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200 shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Access Denied</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Same email as citizen (<span className="text-red-600 font-bold">{user.email}</span>) detected. 
              A new/different email for the municipality page must be used.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onLogout}
              className="w-full py-4 text-sm font-black text-white bg-red-600 hover:bg-red-500 rounded-2xl transition shadow-lg shadow-red-600/10 flex justify-center items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Switch Account</span>
            </button>
            
            <button
              onClick={onBack}
              className="w-full py-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition flex justify-center items-center gap-2 cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Citizen Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4 relative">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-sm transition flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portal
      </button>

      <div className="bg-white w-full max-w-md rounded-[2rem] border border-slate-200 shadow-2xl p-8 relative">
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#f1f5f9] text-[#15803D] rounded-full flex items-center justify-center shadow-[4px_4px_8px_#cbd5e1,inset_-2px_-2px_5px_#ffffff] border border-slate-200">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-black text-slate-900">Municipality Access</h2>
          <p className="text-sm text-slate-500 font-semibold">
            Sign in to access environmental alerts and resolve reports.
          </p>
        </div>

        {/* Feedback Alert Box */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs font-bold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">
              Municipality Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-[#15803D] rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none transition shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]" 
                placeholder="officer@aerion.gov" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">
              Secret Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-[#15803D] rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none transition shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-6 py-4 text-sm font-black text-white bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] rounded-2xl transition shadow-lg shadow-emerald-800/20 disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'Authorizing...' : 'Authorize & Enter'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
