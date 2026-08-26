import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, School, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  language: Language;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  language,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onSuccess(res.user);
      } else {
        const res = await api.register({
          email,
          name,
          password,
          phone,
          school
        });
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка аутентификации');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (presetEmail: string, presetName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.loginWithGoogle(presetEmail, presetName);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="auth-modal-card"
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-slate-900">
                {mode === 'login' ? t.loginBtn : t.registerBtn}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">{t.brandName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Preset Buttons */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              {language === 'ky' ? 'Тесттик кирүү (Ылдам тандоо):' : 'Быстрый вход для проверки (Тест):'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('jeentaevagulmira@gmail.com', 'Гулмира Жээнтаева')}
                className="p-3 rounded-2xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 text-left transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">Гулмира Ж. (Автор)</p>
                  <p className="text-[10px] text-indigo-700 font-medium">Админ-панель</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ainura.teacher@bilim.kg', 'Айнура Исмаилова')}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition-colors flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">Айнура И. (Мугалим)</p>
                  <p className="text-[10px] text-slate-500">Купленный материал</p>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-slate-400 text-[11px]">же почта аркылуу / или через email</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.nameLabel}:</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="мисалы: Айнура Исмаилова"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">{t.emailLabel}:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@bilim.kg"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Пароль:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.phoneLabel}:</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+996 700 000000"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Мектеп / Шаар (Школа):</label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="№5 орто мектеп"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-xs transition-colors text-xs"
            >
              {loading ? 'Сурам аткарылууда...' : mode === 'login' ? t.loginBtn : t.registerBtn}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center pt-2 text-xs text-slate-600">
            {mode === 'login' ? (
              <p>
                {language === 'ky' ? 'Аккаунтуңуз жокпу?' : 'Нет аккаунта?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-indigo-700 hover:underline"
                >
                  {t.registerBtn}
                </button>
              </p>
            ) : (
              <p>
                {language === 'ky' ? 'Аккаунтуңуз барбы?' : 'Уже зарегистрированы?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-indigo-700 hover:underline"
                >
                  {t.loginBtn}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
