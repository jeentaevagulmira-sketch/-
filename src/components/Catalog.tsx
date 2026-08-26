import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Printer,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { Material, MaterialCategory, Language } from '../types';
import { translations, CATEGORY_LABELS } from '../translations';
import { MaterialCard } from './MaterialCard';

interface CatalogProps {
  materials: Material[];
  language: Language;
  onOpenDetails: (material: Material) => void;
  onBuy: (material: Material) => void;
  onOpenViewer: (materialId: string) => void;
  onGoToHowItWorks: () => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  materials,
  language,
  onOpenDetails,
  onBuy,
  onOpenViewer,
  onGoToHowItWorks
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const t = translations[language];

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: t.allCategories },
    { id: 'calendar_plans', label: CATEGORY_LABELS.calendar_plans[language] },
    { id: 'worksheets', label: CATEGORY_LABELS.worksheets[language] },
    { id: 'speed_reading', label: CATEGORY_LABELS.speed_reading[language] },
    { id: 'tests', label: CATEGORY_LABELS.tests[language] },
    { id: 'preschool', label: CATEGORY_LABELS.preschool[language] },
    { id: 'math', label: CATEGORY_LABELS.math[language] },
    { id: 'kyrgyz_lang', label: CATEGORY_LABELS.kyrgyz_lang[language] },
    { id: 'primary_school', label: CATEGORY_LABELS.primary_school[language] }
  ];

  const grades = [
    { id: 'all', label: t.allGrades },
    { id: '1', label: t.grade1 },
    { id: '2', label: t.grade2 },
    { id: '3', label: t.grade3 },
    { id: '4', label: t.grade4 },
    { id: 'preschool', label: t.preschoolGrade }
  ];

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      // Category match
      if (selectedCategory !== 'all' && m.category !== selectedCategory) {
        return false;
      }
      // Grade match
      if (selectedGrade !== 'all') {
        if (selectedGrade === 'preschool' && !m.grade.toLowerCase().includes('дошкольн') && !m.grade.toLowerCase().includes('мектепке')) {
          return false;
        }
        if (selectedGrade !== 'preschool' && !m.grade.includes(selectedGrade)) {
          return false;
        }
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch =
          m.title.ky.toLowerCase().includes(q) || m.title.ru.toLowerCase().includes(q);
        const descMatch =
          m.description.ky.toLowerCase().includes(q) || m.description.ru.toLowerCase().includes(q);
        const subjectMatch =
          m.subject.ky.toLowerCase().includes(q) || m.subject.ru.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !subjectMatch) {
          return false;
        }
      }
      return true;
    });
  }, [materials, selectedCategory, selectedGrade, searchQuery]);

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Bento Grid Top Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Tile 1: Main Brand & Search Hero (Col 8) */}
        <div className="md:col-span-8 bg-indigo-700 text-white rounded-3xl p-7 sm:p-9 relative overflow-hidden shadow-xs flex flex-col justify-between">
          {/* Subtle decorative glow */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-indigo-600/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/40 text-indigo-100 text-xs font-bold mb-4 border border-indigo-400/30 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.heroSecurityBadge}</span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight leading-snug mb-3">
              {t.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed mb-6 max-w-xl">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="relative z-10 pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#catalog-grid"
              className="px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <span>{t.heroCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onGoToHowItWorks}
              className="px-5 py-3 bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-xs rounded-xl border border-indigo-400/30 transition-colors inline-flex items-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-200" />
              <span>{t.navHowItWorks}</span>
            </button>
          </div>
        </div>

        {/* Tile 2: Author Profile & Trust Bento Card (Col 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Тастыкталган автор
              </span>
            </div>

            <h3 className="font-serif font-black text-lg text-slate-900 mb-1">
              {t.authorTag}
            </h3>
            <p className="text-xs text-indigo-700 font-semibold mb-3">
              КР Билим берүү отличниги
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ky'
                ? 'Кыргызстандын башталгыч жана орто класстарынын мугалимдери үчүн 15 жылдык практикалык тажрыйбанын негизинде иштелип чыккан методикалар.'
                : 'Проверенные практикой методические пособия, разработанные в строгом соответствии со стандартами МОиН КР.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Бишкек, Кыргызстан</span>
            <span className="font-semibold text-slate-700">2025–2026 окуу жылы</span>
          </div>
        </div>

        {/* Tile 3: Security Architecture Bento (Col 4) */}
        <div className="md:col-span-4 bg-amber-50 rounded-3xl border border-amber-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Printer className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-bold text-base text-amber-950 mb-1">
              {language === 'ky' ? 'Корголгон 1 жолу печать' : 'Контроль 1 печати'}
            </h4>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              {language === 'ky'
                ? 'Ар бир материал сервердик эсептөө менен корголуп, кагазга басып чыгарууга 1 гана уруксат берилет.'
                : 'Серверный контроль квот: документ разрешено распечатать 1 раз с персональным водяным знаком покупателя.'}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-amber-200/70 flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Жеке суу белгиси (Email + ID)</span>
          </div>
        </div>

        {/* Tile 4: Category Quick Explorer Bento (Col 4) */}
        <div className="md:col-span-4 bg-slate-900 text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {language === 'ky' ? 'Багыттар' : 'Направления'}
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="font-serif font-bold text-base text-white mb-2">
              {language === 'ky' ? 'Негизги бөлүмдөр' : 'Популярные категории'}
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.slice(1, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
            {language === 'ky' ? 'Календардык пландар, тесттер, тренажерлор' : 'Планы, дидактика, тесты'}
          </p>
        </div>

        {/* Tile 5: Fast Grade Quick Selector Bento (Col 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1 block">
              {language === 'ky' ? 'Класстар боюнча' : 'По классам'}
            </span>
            <h4 className="font-serif font-bold text-base text-slate-900 mb-3">
              {language === 'ky' ? 'Классты тандаңыз' : 'Выберите класс'}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {grades.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGrade(g.id)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all text-center ${
                    selectedGrade === g.id
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 mt-2">
            {language === 'ky' ? '1–4-класс жана мектепке чейинки' : '1–4 классы и дошкольная подготовка'}
          </div>
        </div>
      </section>

      {/* Main Catalog Explorer Section */}
      <div id="catalog-grid" className="pt-4 space-y-6">
        {/* Search and Category Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          {/* Top Search & Reset Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Status Count */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
              <span>{filteredMaterials.length} {language === 'ky' ? 'материал' : 'материалов'}</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Price currency indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <span>
            {language === 'ky' ? 'Табылган материалдар:' : 'Найдено материалов:'}{' '}
            <strong className="text-slate-900 font-bold">{filteredMaterials.length}</strong>
          </span>
          <span className="text-indigo-700 font-semibold">
            {language === 'ky' ? 'Баалар Кыргыз сомунда (KGS)' : 'Цены в сомах (KGS)'}
          </span>
        </div>

        {/* Bento Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
              {language === 'ky' ? 'Материал табылган жок' : 'Материалы не найдены'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'ky'
                ? 'Издөө суроосун же тандалган категорияны өзгөртүп көрүңүз.'
                : 'Попробуйте изменить запрос поиска или сбросить фильтры.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedGrade('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Фильтрлерди тазалоо / Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((mat) => (
              <MaterialCard
                key={mat.id}
                material={mat}
                language={language}
                onOpenDetails={onOpenDetails}
                onBuy={onBuy}
                onOpenViewer={onOpenViewer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
