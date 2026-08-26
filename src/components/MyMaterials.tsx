import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  FileText,
  Printer,
  Clock,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { License, Language, User } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';

interface MyMaterialsProps {
  user: User | null;
  language: Language;
  onOpenViewer: (materialId: string) => void;
  onGoToCatalog: () => void;
}

export const MyMaterials: React.FC<MyMaterialsProps> = ({
  user,
  language,
  onOpenViewer,
  onGoToCatalog
}) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  const fetchLicenses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getUserLicenses();
      setLicenses(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки лицензий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
          <FolderLock className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-black text-2xl text-slate-900 mb-2">
          {t.myMaterialsTitle}
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          {language === 'ky'
            ? 'Сатып алган материалдарыңызды көрүү үчүн өз аккаунтуңузга кириңиз.'
            : 'Для просмотра ваших купленных материалов войдите в систему.'}
        </p>
      </div>
    );
  }

  return (
    <div id="my-materials-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bento Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <FolderLock className="w-4 h-4 text-indigo-600" />
            <span>{language === 'ky' ? 'Жеке кабинет' : 'Личный кабинет учителя'}</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
            {t.myMaterialsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.myMaterialsSubtitle} ({user.email})
          </p>
        </div>

        <button
          onClick={onGoToCatalog}
          className="px-5 py-3 text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.goToCatalog}</span>
        </button>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Жүктөлүүдө... / Загрузка лицензий...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs border border-red-200">{error}</div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <FolderLock className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
              {t.noPurchasedMaterials}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              {language === 'ky'
                ? 'Сиз азырынча эч кандай материал сатып ала элексиз. Каталогдон керектүү классты тандап, жеке лицензия алыңыз.'
                : 'Вы еще не приобрели ни одного материала. Выберите нужный класс или предмет в каталоге и получите персональный защищенный доступ.'}
            </p>
            <button
              onClick={onGoToCatalog}
              className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.goToCatalog}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {licenses.map((lic) => {
              const material = (lic as any).material;
              const title = material?.title?.[language] || material?.title?.ru || lic.materialTitle;
              const printsRemaining = Math.max(0, lic.printLimit - lic.printUsed);
              const isLimitReached = lic.printUsed >= lic.printLimit;

              return (
                <div
                  key={lic.id}
                  id={`license-card-${lic.id}`}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Top Status and License Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                        {lic.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                          lic.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lic.status === 'active' ? t.statusActive : lic.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug mb-2">
                      {title}
                    </h3>

                    {material && (
                      <p className="text-xs text-slate-500 mb-4">
                        {material.grade} • {material.pageCount} {t.pagesCount} • {material.academicYear}
                      </p>
                    )}

                    {/* License Stats Grid (Print status & Expiration) */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 my-4 text-xs">
                      {/* Prints */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Printer className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t.printStatus}:</span>
                        </div>
                        <p className="font-bold text-slate-900">
                          {lic.printUsed} {language === 'ky' ? 'ичинен' : 'из'} {lic.printLimit} {t.printsUsed}
                        </p>
                        <p className={`text-[11px] font-bold ${isLimitReached ? 'text-red-600' : 'text-emerald-700'}`}>
                          {isLimitReached ? t.printLimitReached : `${t.printsRemaining}: ${printsRemaining}`}
                        </p>
                      </div>

                      {/* Expiration */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{t.accessDuration}:</span>
                        </div>
                        <p className="font-bold text-slate-900">
                          {lic.expirationDate
                            ? new Date(lic.expirationDate).toLocaleDateString(language === 'ky' ? 'ky-KG' : 'ru-RU')
                            : t.unlimited}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {language === 'ky' ? 'Сатып алынды:' : 'Куплено:'} {new Date(lic.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t.watermarkText}</span>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 font-medium">
                      {material?.authorName || 'Гулмира Жээнтаева'}
                    </span>
                    <button
                      id={`open-viewer-btn-${lic.materialId}`}
                      onClick={() => onOpenViewer(lic.materialId)}
                      className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{t.openMaterialBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
