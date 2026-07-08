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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await SupabaseService.signInWithGoogle();
      // Browser will redirect to Google. Session handled in App.jsx
    } catch (err) {
      setError(err.message || "Google Authentication failed.");
      setLoading(false);
    }
  };

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

        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-400 font-extrabold text-[10px] uppercase tracking-widest">Or continue with</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-slate-200 hover:border-[#4285F4] rounded-xl bg-white hover:bg-blue-50/30 transition shadow-sm font-bold text-slate-700 text-sm disabled:opacity-50 cursor-pointer mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <div className="text-center mt-2 border-t border-slate-100 pt-4 text-xs font-bold">
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
