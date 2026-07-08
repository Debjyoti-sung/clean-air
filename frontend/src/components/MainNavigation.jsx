import React, { useState, useEffect } from 'react';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

export default function MainNavigation({ onSearchClick, onReportClick, language, currentPage, setCurrentPage, user, onLoginClick, onLogoutClick, onRegisterClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: language === 'EN' ? 'Home' : 'मुख्य', value: 'landing', href: '#home' },
    { name: language === 'EN' ? 'Live Map' : 'लाइव नक्शा', value: 'live-map', href: '#map-page' },
    { name: language === 'EN' ? 'Citizen' : 'नागरिक', value: 'citizen', href: '#citizen-page' },
    { name: language === 'EN' ? 'Municipality' : 'नगर पालिका', value: 'municipality', href: '#municipality' },
    { name: language === 'EN' ? 'AQI Prediction' : 'AQI भविष्यवाणी', value: 'prediction', href: '#prediction-page' },
    { name: language === 'EN' ? 'About' : 'हमारे बारे में', value: 'landing', href: '#about' },
  ];

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    if (link.value === 'landing') {
      setCurrentPage('landing');
      setTimeout(() => {
        try {
          const el = document.querySelector(link.href);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (err) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    } else {
      setCurrentPage(link.value);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 px-2 md:pt-3 md:px-4 pointer-events-none">
      <nav className={`pointer-events-auto w-full max-w-[1440px] bg-[#f1f5f9] rounded-[2.5rem] transition-all duration-500 flex justify-between items-center px-6 md:px-8
        ${scrolled 
          ? 'py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' 
          : 'py-3.5 shadow-[0_8px_20px_rgb(0,0,0,0.08)]'
        }
      `}>
        {/* Left: Brand Logo */}
        <div className="flex flex-col select-none cursor-pointer group" onClick={() => { setCurrentPage('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="flex items-center space-x-3">
            <img src={logo} alt="AERION Logo" className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="text-[22px] font-black text-slate-800 tracking-tight leading-none uppercase">
                AERION
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">
                {language === 'EN' ? 'Intelligence' : 'खुफिया प्रणाली'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Neomorphic Segmented Nav Links */}
        <div className="hidden lg:flex items-center space-x-2 bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] p-2 rounded-full">
          {navLinks.map((link) => {
            const isActive = currentPage === link.value && (link.value !== 'landing' || link.href === '#home');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${
                  isActive
                    ? 'text-[#15803D] shadow-[4px_4px_8px_#cbd5e1] bg-[#f1f5f9]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-[#e2e8f0]/50'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* Right: Search, Auth, and Primary CTA */}
        <div className="hidden lg:flex items-center space-x-5">
          <button
            onClick={onSearchClick}
            className="w-11 h-11 rounded-full bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] hover:text-[#15803D] text-slate-500 flex items-center justify-center transition-all duration-300 cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {user ? (
            <div className="relative flex items-center space-x-3">
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] transition-all duration-300 cursor-pointer overflow-hidden border-2 border-emerald-100"
              >
                {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                  <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-emerald-700 font-bold text-lg uppercase">
                    {(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || '?').charAt(0)}
                  </span>
                )}
              </button>

              {profileMenuOpen && (
                <div className="absolute top-14 right-0 w-64 bg-[#f1f5f9] rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.15)] p-5 border border-slate-200 animate-fadeIn z-50">
                  <div className="flex flex-col items-center pb-4 mb-4 border-b border-slate-200/60 text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-[4px_4px_8px_#cbd5e1] mb-3 bg-white">
                      {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                        <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-2xl uppercase">
                           {(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || '?').charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-[15px] font-black text-slate-800">
                      {user?.user_metadata?.name || user?.user_metadata?.full_name || user.email.split('@')[0]}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-1 truncate w-full px-2">
                      {user.email}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setProfileMenuOpen(false);
                      if (onLogoutClick) onLogoutClick();
                    }}
                    className="w-full px-4 py-3 rounded-2xl font-bold text-[13px] text-red-600 hover:text-red-700 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] transition-all duration-300 cursor-pointer"
                  >
                    {language === 'EN' ? 'Logout' : 'लॉग आउट'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-6 py-2.5 rounded-full font-bold text-[14px] text-slate-600 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] transition-all duration-300 hover:text-slate-900 cursor-pointer"
            >
              {language === 'EN' ? 'Login' : 'लॉग इन'}
            </button>
          )}

          <button
            onClick={() => {
              setCurrentPage('live-map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-full font-extrabold text-[14px] text-emerald-700 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] transition-all duration-300 flex items-center space-x-2 group cursor-pointer"
          >
            <span>{language === 'EN' ? 'Explore' : 'प्लेटफ़ॉर्म खोजें'}</span>
            <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile: Menu button & Search button */}
        <div className="flex items-center lg:hidden space-x-4">
          <button
            onClick={onSearchClick}
            className="w-10 h-10 rounded-full bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] flex items-center justify-center text-slate-500 active:shadow-[inset_2px_2px_5px_#cbd5e1] transition-all"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] flex items-center justify-center text-slate-600 active:shadow-[inset_2px_2px_5px_#cbd5e1] transition-all"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation (Neomorphic style) */}
      {isOpen && (
        <div className="lg:hidden absolute top-24 left-4 right-4 bg-[#f1f5f9] shadow-[0_10px_40px_rgb(0,0,0,0.15)] rounded-[2rem] p-6 flex flex-col space-y-6 pointer-events-auto animate-fadeIn z-50">
          <div className="flex flex-col space-y-3 bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] p-4 rounded-3xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`text-[15px] font-bold py-3 px-4 rounded-xl transition-all ${
                  (currentPage === link.value && (link.value !== 'landing' || link.href === '#home'))
                    ? 'text-[#15803D] shadow-[4px_4px_8px_#cbd5e1] bg-[#f1f5f9]'
                    : 'text-slate-600 hover:text-slate-900 active:shadow-[inset_2px_2px_5px_#cbd5e1]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col space-y-4 pt-2">
            {user ? (
              <div className="flex flex-col space-y-4 bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] p-4 rounded-3xl items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-[4px_4px_8px_#cbd5e1] bg-white mt-2">
                  {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                    <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-2xl uppercase">
                       {(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || '?').charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center w-full">
                  <h3 className="text-[15px] font-black text-slate-800">
                    {user?.user_metadata?.name || user?.user_metadata?.full_name || user.email.split('@')[0]}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-1 truncate w-full">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => { setIsOpen(false); if (onLogoutClick) onLogoutClick(); }}
                  className="w-full text-center text-[15px] font-bold text-red-600 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] py-3.5 rounded-2xl transition cursor-pointer"
                >
                  {language === 'EN' ? 'Logout' : 'लॉग आउट'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setIsOpen(false); if (onLoginClick) onLoginClick(); }}
                  className="w-full text-center text-[15px] font-bold text-slate-600 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] py-3.5 rounded-2xl transition cursor-pointer"
                >
                  {language === 'EN' ? 'Login' : 'लॉग इन'}
                </button>
                <button
                  onClick={() => { setIsOpen(false); if (onRegisterClick) onRegisterClick(); }}
                  className="w-full text-center text-[15px] font-bold text-slate-600 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] py-3.5 rounded-2xl transition cursor-pointer"
                >
                  {language === 'EN' ? 'Register' : 'पंजीकरण'}
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                setCurrentPage('live-map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-center text-[15px] font-extrabold text-emerald-700 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] py-4 rounded-2xl transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{language === 'EN' ? 'Explore Platform' : 'प्लेटफ़ॉर्म खोजें'}</span>
              <ChevronRight className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
