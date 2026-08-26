import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Layers,
  ShieldCheck,
  Printer,
  Clock,
  Sparkles,
  Lock,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Material, Language } from '../types';
import { translations, CATEGORY_LABELS } from '../translations';
import { api } from '../services/api';

interface MaterialModalProps {
  material: Material | null;
  language: Language;
  onClose: () => void;
  onBuy: (material: Material) => void;
  onOpenViewer: (materialId: string) => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  material,
  language,
  onClose,
  onBuy,
  onOpenViewer
}) => {
  const [sampleData, setSampleData] = useState<any>(null);
  const [loadingSample, setLoadingSample] = useState(false);

  useEffect(() => {
    if (material) {
      setLoadingSample(true);
      api
        .getMaterialSample(material.id)
        .then((data) => setSampleData(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingSample(false));
    } else {
      setSampleData(null);
    }
  }, [material]);

  if (!material) return null;

  const t = translations[language];
  const title = material.title[language] || material.title.ru;
  const description = material.description[language] || material.description.ru;
  const subject = material.subject[language] || material.subject.ru;
  const categoryName = CATEGORY_LABELS[material.category]?.[language] || material.category;
  const hasPurchased = (material as any).hasLicense;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        id="material-detail-modal"
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
            <span className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200">
              {categoryName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700">{material.grade}</span>
          </div>
          <button
            id="close-material-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Info */}
          <div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-slate-900 leading-tight mb-2">
              {title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-medium text-slate-800">
                {t.subject}: <strong className="text-slate-900">{subject}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {material.pageCount} {t.pagesCount}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {material.academicYear}
              </span>
              <span>•</span>
              <span className="text-indigo-700 font-bold">{t.authorTag}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>{description}</p>
          </div>

          {/* Key License Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{t.printLimitInfo}</p>
                <p className="text-xs font-bold text-slate-900">{t.printCount}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{t.accessDuration}</p>
                <p className="text-xs font-bold text-slate-900">
                  {material.defaultAccessDays > 0
                    ? `${material.defaultAccessDays} ${t.days}`
                    : t.unlimited}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Суу белгиси (Watermark)</p>
                <p className="text-xs font-bold text-emerald-800">Персоналдуу коргоо</p>
              </div>
            </div>
          </div>

          {/* Sample Preview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span>
                  {language === 'ky'
                    ? 'Ознакомительный үзүндү (Акысыз үлгү)'
                    : 'Ознакомительный фрагмент (Бесплатный образец)'}
                </span>
              </h4>
              <span className="text-xs text-slate-500">
                {sampleData?.samplePages?.length || 1} {t.pageOf} {material.pageCount}
              </span>
            </div>

            {loadingSample ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 animate-pulse">
                Жүктөлүүдө... / Загрузка ознакомительного фрагмента...
              </div>
            ) : sampleData?.samplePages ? (
              <div className="space-y-3">
                {sampleData.samplePages.map((page: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 font-sans font-semibold text-slate-700">
                      <span>{page.title}</span>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-lg">
                        Бет {page.pageNumber}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-sans">{page.content}</p>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-sans italic flex items-center justify-between">
                      <span>© {material.authorName}</span>
                      <span>Үлгү көрүнүш (Ознакомление)</span>
                    </div>
                  </div>
                ))}

                {material.pageCount > (sampleData.samplePages.length || 1) && (
                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-dashed border-indigo-300 text-center text-xs text-indigo-900 flex flex-col items-center justify-center gap-1">
                    <Lock className="w-4 h-4 text-indigo-700" />
                    <p className="font-semibold">
                      {language === 'ky'
                        ? `Калган ${material.pageCount - (sampleData.samplePages.length || 1)} бет толук сатып алгандан кийин ачылат.`
                        : `Остальные ${material.pageCount - (sampleData.samplePages.length || 1)} стр. доступны в защищённом окне после покупки.`}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Legal Warning Notice */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{t.licenseWarning}</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold block">{t.price}</span>
            <span className="font-serif font-black text-2xl text-slate-900">
              {material.price} <span className="text-xs font-sans font-medium text-slate-500">{t.currency}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {t.closeViewer}
            </button>

            {hasPurchased ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenViewer(material.id);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{t.openMaterialBtn}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onBuy(material);
                }}
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.buyBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
