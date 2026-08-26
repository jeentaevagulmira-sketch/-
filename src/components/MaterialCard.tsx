import React from 'react';
import {
  FileText,
  CheckCircle2,
  Lock,
  Printer,
  Sparkles,
  Calendar,
  Layers,
  Eye
} from 'lucide-react';
import { Material, Language } from '../types';
import { translations, CATEGORY_LABELS } from '../translations';

interface MaterialCardProps {
  material: Material;
  language: Language;
  onOpenDetails: (material: Material) => void;
  onBuy: (material: Material) => void;
  onOpenViewer: (materialId: string) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  language,
  onOpenDetails,
  onBuy,
  onOpenViewer
}) => {
  const t = translations[language];
  const title = material.title[language] || material.title.ru;
  const description = material.description[language] || material.description.ru;
  const subject = material.subject[language] || material.subject.ru;
  const categoryName = CATEGORY_LABELS[material.category]?.[language] || material.category;

  const hasPurchased = (material as any).hasLicense;

  return (
    <div
      id={`material-card-${material.id}`}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
    >
      {/* Cover Image & Badges with Inner Nested Radius */}
      <div className="p-3 pb-0">
        <div
          className="relative h-48 sm:h-52 bg-slate-100 rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => onOpenDetails(material)}
        >
          <img
            src={material.coverImage}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-900/85 text-white backdrop-blur-md border border-white/20">
              {material.grade}
            </span>
            {hasPurchased ? (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.purchasedBadge}
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-white/95 text-indigo-700 shadow-xs border border-indigo-100">
                <Lock className="w-3 h-3 text-indigo-600" />
                {material.price} {t.currency}
              </span>
            )}
          </div>

          {/* Bottom meta over image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">
              {categoryName}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-300" />
                {material.pageCount} {t.pagesCount}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                {material.academicYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">{subject}</span>
            <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
              {material.authorName}
            </span>
          </div>

          <h3
            onClick={() => onOpenDetails(material)}
            className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer mb-2 transition-colors"
          >
            {title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Card Footer: Price & Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              {t.price}
            </span>
            <span className="font-serif font-black text-xl text-indigo-700">
              {material.price} <span className="text-xs font-sans font-medium text-slate-500">{t.currency}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`details-btn-${material.id}`}
              onClick={() => onOpenDetails(material)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title={t.detailsBtn}
            >
              <Eye className="w-4 h-4" />
            </button>

            {hasPurchased ? (
              <button
                id={`open-btn-${material.id}`}
                onClick={() => onOpenViewer(material.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.openMaterialBtn}</span>
              </button>
            ) : (
              <button
                id={`buy-btn-${material.id}`}
                onClick={() => onBuy(material)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.buyBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
