import React from 'react';
import {
  UserPlus,
  CreditCard,
  KeyRound,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HowItWorksProps {
  language: Language;
  onGoToCatalog: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ language, onGoToCatalog }) => {
  const t = translations[language];

  const steps = [
    {
      icon: UserPlus,
      title: t.step1Title,
      desc: t.step1Desc,
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      icon: CreditCard,
      title: t.step2Title,
      desc: t.step2Desc,
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      icon: KeyRound,
      title: t.step3Title,
      desc: t.step3Desc,
      color: 'bg-amber-100 text-amber-900'
    },
    {
      icon: Printer,
      title: t.step4Title,
      desc: t.step4Desc,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div id="how-it-works-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ky' ? 'Жөнөкөй жана корголгон процесс' : 'Простой и прозрачный процесс'}</span>
        </div>
        <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-900 mb-3">
          {t.howItWorksTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {language === 'ky'
            ? 'Биздин платформа мугалимдердин убактысын үнөмдөө жана автордук материалдарды мыйзамдуу, коопсуз коргоо үчүн түзүлгөн.'
            : 'Наша система создана для удобного приобретения проверенных авторских материалов с гарантией легальности и персональной защиты.'}
        </p>
      </div>

      {/* Steps Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Architecture Bento Card */}
      <div className="bg-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xs border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800 text-indigo-200 text-xs font-bold mb-4 border border-indigo-700">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>{t.securityArchitectureTitle}</span>
          </div>

          <h3 className="font-serif font-black text-2xl sm:text-3xl text-white mb-3">
            {language === 'ky'
              ? 'Эмне үчүн материалдар корголгон жана коопсуз?'
              : 'Как устроена защита авторских прав на платформе?'}
          </h3>

          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed mb-6">
            {t.securityArchExpl}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-indigo-100 mb-8">
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">{language === 'ky' ? 'Жеке суу белгиси:' : 'Персональный водяной знак:'}</strong>{' '}
                {language === 'ky' ? 'Ар бир баракта сатып алуучунун почтасы жана лицензия номери чагылдырылат.' : 'Каждая страница содержит email покупателя и уникальный ID лицензии.'}
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">{language === 'ky' ? 'Сервердик печать лимити:' : 'Контроль попыток печати:'}</strong>{' '}
                {language === 'ky' ? 'Басып чыгарууга 1 жолу гана уруксат берилет, сервер ар бир аракетти эсептейт.' : 'Разрешена 1 попытка печати, списываемая сервером.'}
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">{language === 'ky' ? 'Жабык сактагыч:' : 'Закрытое хранилище:'}</strong>{' '}
                {language === 'ky' ? 'Файлдарга ачык түз ссылкалар берилбейт.' : 'Оригиналы файлов недоступны по публичным ссылкам.'}
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">{language === 'ky' ? 'Калыбына келтирүү:' : 'Восстановление:'}</strong>{' '}
                {language === 'ky' ? 'Принтер бузулса, автор-администратор печатты кайра ачып бере алат.' : 'При сбое принтера автор может восстановить попытку в админ-панели.'}
              </span>
            </div>
          </div>

          <button
            onClick={onGoToCatalog}
            className="px-6 py-3 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{t.heroCta}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
