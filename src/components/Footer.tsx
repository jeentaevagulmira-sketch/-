import React from 'react';
import { BookOpen, ShieldCheck, Lock, Mail, Phone, MessageSquare, Send, Award, Clock } from 'lucide-react';
import { Language, PortalSettings } from '../types';
import { translations } from '../translations';

interface FooterProps {
  language: Language;
  portalSettings?: PortalSettings | null;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, portalSettings, onSelectCategory }) => {
  const t = translations[language];

  // Derived values from portalSettings
  const brandName = portalSettings?.siteName?.[language] || portalSettings?.siteName?.ky || t.brandName;
  const description =
    portalSettings?.footer?.description?.[language] ||
    portalSettings?.footer?.description?.ky ||
    portalSettings?.siteDescription?.[language] ||
    portalSettings?.siteDescription?.ky ||
    (language === 'ky'
      ? 'Кыргызстандын башталгыч жана орто мектеп мугалимдери үчүн автордук окуу куралдарынын, календардык пландарынын жана тесттеринин расмий корголгон онлайн платформасы.'
      : 'Официальная защищенная платформа авторских методических пособий, календарных планов и дидактических материалов для учителей школ Кыргызстана.');

  const authorName = portalSettings?.authorName || t.authorTag;
  
  const authorBadge =
    portalSettings?.footer?.authorBadge?.[language] ||
    portalSettings?.footer?.authorBadge?.ky ||
    (typeof portalSettings?.authorTitle === 'object'
      ? portalSettings.authorTitle[language] || portalSettings.authorTitle.ky
      : portalSettings?.authorTitle) ||
    (language === 'ky' ? 'КР Билим берүү отличниги' : 'Отличник образования КР');

  const email = portalSettings?.contactEmail || 'jeentaevagulmira@gmail.com';
  const phone = portalSettings?.contactPhone || '+996 555 123 456';
  const whatsapp = portalSettings?.contactWhatsApp || '+996 555 123 456';
  const telegram = portalSettings?.contactTelegram || '@jeentaeva_bilim';
  
  const supportHours =
    typeof portalSettings?.supportHours === 'object'
      ? portalSettings.supportHours[language] || portalSettings.supportHours.ky
      : portalSettings?.supportHours || (language === 'ky' ? 'Дүйшөмбү - Ишемби: 08:00 - 20:00' : 'Понедельник - Суббота: 08:00 - 20:00');

  const address =
    portalSettings?.footer?.address?.[language] ||
    portalSettings?.footer?.address?.ky ||
    (language === 'ky' ? 'Бишкек, Кыргызстан' : 'г. Бишкек, Кыргызстан');

  const copyrightText =
    portalSettings?.footer?.copyrightText?.[language] ||
    portalSettings?.footer?.copyrightText?.ky ||
    (language === 'ky' ? 'Бардык укуктар корголгон.' : 'Все права защищены.');

  const lawNote =
    portalSettings?.footer?.lawNote?.[language] ||
    portalSettings?.footer?.lawNote?.ky ||
    (language === 'ky' ? 'КР Автордук укук жөнүндө мыйзамы менен корголгон' : 'Защищено законом КР об авторском праве');

  const watermarkNote =
    portalSettings?.watermarkText?.[language] ||
    portalSettings?.watermarkText?.ky ||
    (language === 'ky' ? 'Жеке лицензиялык суу белгиси' : 'Персональный водяной знак');

  const showCategories = portalSettings?.footer?.showCategories !== false;
  const showContacts = portalSettings?.footer?.showContacts !== false;
  const showProtection = portalSettings?.footer?.showProtectionNote !== false;

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Author */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-700 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif font-black text-xl text-white tracking-tight">
                {brandName}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
              {description}
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{authorName} • {authorBadge}</span>
            </div>

            {/* Social / Quick Action Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-semibold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {telegram && (
                <a
                  href={telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-800/80 text-sky-300 text-xs font-semibold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Categories */}
          {showCategories && (
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                {language === 'ky' ? 'Категориялар' : 'Категории'}
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectCategory && onSelectCategory('all')}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    {language === 'ky' ? 'Бардык материалдар' : 'Все материалы'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectCategory && onSelectCategory('lesson_plans')}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    {language === 'ky' ? 'Календардык пландар' : 'Календарные планы'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectCategory && onSelectCategory('worksheets')}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    {language === 'ky' ? 'Жумуш барактары' : 'Рабочие листы и карточки'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectCategory && onSelectCategory('tests')}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    {language === 'ky' ? 'Тесттер жана текшерүү' : 'Тесты и контроль'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectCategory && onSelectCategory('speed_reading')}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    {language === 'ky' ? 'Тез окуу тренажеру' : 'Скорочтение и тренажеры'}
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Col 3: Protection Notice & Contacts */}
          {showContacts && (
            <div className={!showCategories ? 'md:col-span-2' : ''}>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                {language === 'ky' ? 'Коргоо жана байланыш' : 'Защита и контакты'}
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {showProtection && (
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-xs text-slate-300">{watermarkNote}</span>
                  </li>
                )}
                {email && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                    <a href={`mailto:${email}`} className="text-slate-300 hover:text-white transition-colors truncate">
                      {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-slate-300 hover:text-white transition-colors">
                      {phone}
                    </a>
                  </li>
                )}
                {supportHours && (
                  <li className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{supportHours}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © 2025-2026 {brandName} • {authorName}. {copyrightText}
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>{address}</span>
            <span>{lawNote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
