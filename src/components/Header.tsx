import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  FolderLock,
  Globe,
  Settings,
  Sparkles
} from 'lucide-react';
import { User, Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  user: User | null;
  language: Language;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onToggleLanguage: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  userLicensesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  language,
  currentTab,
  onSelectTab,
  onToggleLanguage,
  onOpenAuth,
  onLogout,
  userLicensesCount
}) => {
  const t = translations[language];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            id="brand-logo-container"
            onClick={() => onSelectTab('catalog')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-800 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  {t.brandName}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t.authorTag} • {language === 'ky' ? 'КР Билим берүү стандарттары' : 'Стандарты МОиН КР'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav id="header-nav" className="hidden lg:flex items-center gap-1.5">
            <button
              id="nav-catalog-btn"
              onClick={() => onSelectTab('catalog')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                currentTab === 'catalog'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.navCatalog}
            </button>
            <button
              id="nav-how-it-works-btn"
              onClick={() => onSelectTab('how-it-works')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                currentTab === 'how-it-works'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.navHowItWorks}
            </button>
            {user && (
              <button
                id="nav-my-materials-btn"
                onClick={() => onSelectTab('my-materials')}
                className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
                  currentTab === 'my-materials'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FolderLock className="w-4 h-4 text-indigo-600" />
                <span>{t.navMyMaterials}</span>
                {userLicensesCount > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                    {userLicensesCount}
                  </span>
                )}
              </button>
            )}
            {user?.role === 'ADMIN' && (
              <button
                id="nav-admin-btn"
                onClick={() => onSelectTab('admin')}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
                  currentTab === 'admin'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{t.navAdmin}</span>
              </button>
            )}
          </nav>

          {/* Right Actions: Language Switch + User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200"
              title="Переключить язык / Тилди алмаштыруу"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'ky' ? '🇰🇬 KG' : '🇷🇺 RU'}</span>
            </button>

            {/* Auth Buttons / User Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  id="user-profile-badge"
                  onClick={() => onSelectTab(user.role === 'ADMIN' ? 'admin' : 'my-materials')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-indigo-700 font-medium">
                      {user.role === 'ADMIN' ? 'Автор / Администратор' : 'Мугалим / Учитель'}
                    </p>
                  </div>
                </div>

                <button
                  id="logout-btn"
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title={t.logoutBtn}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="login-header-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {t.loginBtn}
                </button>
                <button
                  id="register-header-btn"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.registerBtn}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-around py-2.5 border-t border-slate-100 text-xs">
          <button
            onClick={() => onSelectTab('catalog')}
            className={`px-3 py-1 rounded-lg ${currentTab === 'catalog' ? 'bg-slate-900 font-bold text-white' : 'text-slate-600'}`}
          >
            {t.navCatalog}
          </button>
          <button
            onClick={() => onSelectTab('how-it-works')}
            className={`px-3 py-1 rounded-lg ${currentTab === 'how-it-works' ? 'bg-slate-900 font-bold text-white' : 'text-slate-600'}`}
          >
            {t.navHowItWorks}
          </button>
          {user && (
            <button
              onClick={() => onSelectTab('my-materials')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 ${currentTab === 'my-materials' ? 'bg-indigo-100 font-bold text-indigo-900' : 'text-slate-600'}`}
            >
              <FolderLock className="w-3.5 h-3.5" />
              <span>{t.navMyMaterials}</span>
            </button>
          )}
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3 py-1 rounded-lg ${currentTab === 'admin' ? 'bg-indigo-700 text-white font-bold' : 'text-indigo-800'}`}
            >
              {t.navAdmin}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
