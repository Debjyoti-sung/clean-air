import React, { useState, useEffect } from 'react';
import { Lock, Mail, Loader2, Check, UserPlus, LogIn, AlertCircle, Phone } from 'lucide-react';
import { SupabaseService } from '../../services/supabase.service';

export default function AuthPromptCard({ user, onAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeUser, setActiveUser] = useState(user);

  useEffect(() => {
    if (user) {
      setActiveUser(user);
    } else {
      SupabaseService.getUser().then(u => {
        if (u) {
          setActiveUser(u);
          onAuthenticated(u);
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        const u = await SupabaseService.signUp(email, password, {
          name,
          phone,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
        });
        alert("Registration successful!");
        onAuthenticated(u);
      } else {
        const u = await SupabaseService.signIn(email, password);
        onAuthenticated(u);
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  if (activeUser) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Step 10: Authentication</h2>
          <p className="text-sm text-slate-500 font-medium">
            You are currently signed in. Your identity will be attached to the grievance.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner border border-emerald-200 mx-auto">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Authorized Account</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{activeUser.email}</p>
          </div>
          <button
            onClick={() => onAuthenticated(activeUser)}
            className="w-full px-6 py-3.5 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md cursor-pointer"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 10: Authentication</h2>
        <p className="text-sm text-slate-500">
          Please sign in or create an account to submit your environmental report.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-md mx-auto relative overflow-hidden">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#f1f5f9] text-emerald-600 rounded-full flex items-center justify-center shadow-[4px_4px_8px_#cbd5e1,inset_-2px_-2px_5px_#ffffff] border border-slate-250">
            {isSignUp ? <UserPlus className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-250 text-red-700 p-4 rounded-2xl mb-6 text-xs font-bold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {isSignUp && (
            <>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                    <UserPlus className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none transition shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none transition shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]" 
                    placeholder="+91 9876543210" 
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none transition shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]" 
                placeholder="citizen@india.gov.in" 
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none transition shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]" 
                placeholder="••••••••" 
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-3.5 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md shadow-emerald-500/20 disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? "Authenticating..." : isSignUp ? "Sign Up & Continue" : "Sign In & Continue"}</span>
          </button>
        </form>

        <div className="text-center mt-6 border-t border-slate-100 pt-4 text-xs font-bold">
          {isSignUp ? (
            <p className="text-slate-500">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(false); setError(''); }}
                className="text-emerald-600 hover:text-emerald-500 hover:underline transition cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-slate-500">
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(true); setError(''); }}
                className="text-emerald-600 hover:text-emerald-500 hover:underline transition cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
