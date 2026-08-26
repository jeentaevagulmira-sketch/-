import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  AlertTriangle,
  FileText,
  Info,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Material, License, Language, User } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';

interface ProtectedViewerProps {
  materialId: string;
  user: User | null;
  language: Language;
  onClose: () => void;
  onRefreshLicenses?: () => void;
}

export const ProtectedViewer: React.FC<ProtectedViewerProps> = ({
  materialId,
  user,
  language,
  onClose,
  onRefreshLicenses
}) => {
  const [material, setMaterial] = useState<Material | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [printing, setPrinting] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [printSuccessModal, setPrintSuccessModal] = useState<{
    watermark: string;
    printUsed: number;
    printLimit: number;
    printsRemaining: number;
  } | null>(null);

  const t = translations[language];

  // Fetch protected content securely from server
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .getProtectedMaterial(materialId)
      .then((data) => {
        if (!isMounted) return;
        setMaterial(data.material);
        setLicense(data.license);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Ошибка доступа к материалу');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [materialId]);

  // Intercept Ctrl+P / Cmd+P to prevent unauthorized browser print attempts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        handlePrintRequest();
      }
      // Disable save as shortcut
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
    };

    const handleBeforePrint = () => {
      // If not explicitly in printing state, body data-print-authorized is false
    };

    const handleAfterPrint = () => {
      document.body.removeAttribute('data-print-authorized');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      document.body.removeAttribute('data-print-authorized');
    };
  }, [material, license, user]);

  const title = material?.title[language] || material?.title.ru || 'Материал';
  const pages = material?.pages || [];
  const currentPage = pages[currentPageIndex] || null;

  // Print Handling (Calls server endpoint to decrement attempt & stamp printable document)
  const handlePrintRequest = async () => {
    if (!material) return;

    if (license && license.printUsed >= license.printLimit && user?.role !== 'ADMIN') {
      alert(
        language === 'ky'
          ? 'Басып чыгаруу лимити толук колдонулган (1ден 1). Эгер принтериңиз иштебей калса, автор-администраторго кайрылыңыз.'
          : 'Лимит печати использован (1 из 1). Если у вас произошел сбой принтера, обратитесь к администратору для восстановления попытки.'
      );
      return;
    }

    const confirmMsg =
      language === 'ky'
        ? 'Көңүл буруңуз! Бул баскычты басканда сиздин 1 басып чыгаруу мүмкүнчүлүгүңүз СЕРВЕРДЕ колдонулат. Документке сиздин жеке суу белгиңиз (watermark) коюлат. Улантасызбы?'
        : 'Внимание! Нажатие кнопки спишет 1 разрешённую попытку печати НА СЕРВЕРЕ. В документ будет внедрен ваш персональный водяной знак. Продолжить?';

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setPrinting(true);
    try {
      const printResult = await api.requestPrint(material.id);

      // Update local license state
      if (license) {
        setLicense({
          ...license,
          printUsed: printResult.printUsed,
          printLimit: printResult.printLimit
        });
      }

      if (onRefreshLicenses) onRefreshLicenses();

      // Show print confirmation with watermark details
      setPrintSuccessModal({
        watermark: printResult.watermark,
        printUsed: printResult.printUsed,
        printLimit: printResult.printLimit,
        printsRemaining: printResult.printsRemaining
      });

      // Mark body as authorized for native print media query
      document.body.setAttribute('data-print-authorized', 'true');

      // Trigger native browser print dialog for the watermarked payload
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.removeAttribute('data-print-authorized');
        }, 1500);
      }, 500);
    } catch (err: any) {
      document.body.removeAttribute('data-print-authorized');
      alert(err.message || 'Ошибка запроса печати');
    } finally {
      setPrinting(false);
    }
  };

  const watermarkString =
    license
      ? `© ${material?.authorName || 'Гулмира Жээнтаева'} | Лицензия: ${license.id} | Пользователь: ${user?.email || license.userEmail} | Для личного использования. Передача запрещена.`
      : `[АДМИНИСТРАТИВНЫЙ ПРОСМОТР] © ${material?.authorName || 'Гулмира Жээнтаева'} | ${user?.email || 'admin'}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950 flex flex-col">
      {/* Top Secure Header Bar */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Lock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif font-black text-sm sm:text-base text-slate-100 truncate">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-indigo-400 font-medium">{material?.authorName}</span>
              <span>•</span>
              <span>{pages.length} {t.pagesCount}</span>
              {license && (
                <>
                  <span>•</span>
                  <span className="font-mono text-emerald-400 font-semibold">{license.id}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Security Info Toggle */}
          <button
            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
            className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center gap-1.5"
            title="О системе защиты"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline font-medium">{language === 'ky' ? 'Коргоо модели' : 'Модель защиты'}</span>
          </button>

          {/* Print Button (Enforces 1 print attempt server limit) */}
          <div className="flex items-center gap-2">
            {license ? (
              <div className="hidden sm:flex flex-col text-right text-[11px]">
                <span className="text-slate-400">
                  {t.printStatus}: <strong className="text-white">{license.printUsed} / {license.printLimit}</strong>
                </span>
                <span className={license.printUsed >= license.printLimit ? 'text-red-400 font-bold' : 'text-emerald-400 font-medium'}>
                  {license.printUsed >= license.printLimit ? t.printLimitReached : `${t.printsRemaining}: ${Math.max(0, license.printLimit - license.printUsed)}`}
                </span>
              </div>
            ) : user?.role === 'ADMIN' ? (
              <span className="text-[11px] text-indigo-400 font-medium hidden sm:inline">Админ-тест</span>
            ) : null}

            <button
              id="request-print-btn"
              onClick={handlePrintRequest}
              disabled={printing || (license ? license.printUsed >= license.printLimit : false)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                license && license.printUsed >= license.printLimit
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-700 hover:bg-indigo-800 text-white'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>{t.printBtn}</span>
            </button>
          </div>

          <button
            id="close-viewer-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title={t.closeViewer}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Security Architecture Info Panel (Collapsible) */}
      {showSecurityInfo && (
        <div className="bg-slate-900 text-slate-200 border-b border-slate-800 p-4 text-xs">
          <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-indigo-400 text-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>{language === 'ky' ? '«Билим Материалдары» коргоо модели:' : 'Модель защиты «Билим Материалдары»:'}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-slate-300">
                <p>✅ <strong>Сервердик текшерүү:</strong> Документтин тексти жана барактары серверде активдүү лицензия болгондо гана берилет.</p>
                <p>✅ <strong>Ачык PDF шилтемелери жок:</strong> Файлды түз дарек аркылуу жүктөө бөгөттөлгөн.</p>
                <p>✅ <strong>Суу белгиси:</strong> Ар бир баракка жана басып чыгарууга сиздин Email ({user?.email}) жана лицензия номериңиз жазылат.</p>
                <p>⚠️ <strong>Чынчыл эскертүү:</strong> Браузерлер экранды сүрөткө тартууну (screenshot) техникалык жактан толук тыя албайт, бирок жеке суу белгиси документти мыйзамсыз тараткандарды так аныктоого мүмкүндүк берет.</p>
              </div>
            </div>
            <button
              onClick={() => setShowSecurityInfo(false)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Viewer Main Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex flex-col items-center justify-start">
        {loading ? (
          <div className="my-auto text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">
              {language === 'ky'
                ? 'Сервер лицензияңызды текшерип, корголгон барактарды жүктөдө...'
                : 'Сервер проверяет лицензию и расшифровывает защищённые страницы...'}
            </p>
          </div>
        ) : error ? (
          <div className="my-auto max-w-md p-6 bg-slate-900 border border-red-800 rounded-3xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-black text-lg text-white">
              {language === 'ky' ? 'Кирүү мүмкүнчүлүгү чектелген' : 'Доступ ограничен'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              {t.closeViewer}
            </button>
          </div>
        ) : currentPage ? (
          <div className="w-full max-w-3xl space-y-6">
            {/* The Protected Document Sheet (A4 format styled) */}
            <div
              id="printable-material-document"
              className="relative bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-14 min-h-[750px] border border-slate-300 select-text overflow-hidden font-sans flex flex-col justify-between"
            >
              {/* Diagonal Semi-transparent Security Watermark */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden opacity-[0.09] select-none">
                <div className="transform -rotate-35 text-slate-900 font-black text-2xl sm:text-3xl text-center leading-loose whitespace-pre-line tracking-wider max-w-lg">
                  {`БИЛИМ МАТЕРИАЛДАРЫ\n${license?.id || 'PROTECTED'}\n${user?.email || 'Jeentaeva Gulmira'}\nЖЕКЕ КОЛДОНУУГА`}
                </div>
              </div>

              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 z-10">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                  <span>{material?.subject[language] || material?.subject.ru}</span>
                  <span>{material?.academicYear}</span>
                </div>
                <h1 className="font-serif font-black text-lg sm:text-xl text-slate-900 leading-snug">
                  {title}
                </h1>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mt-2">
                  <span>Автор: {material?.authorName}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    Бет {currentPage.pageNumber} / {pages.length}
                  </span>
                </div>
              </div>

              {/* Page Section Title */}
              <div className="mb-4 z-10">
                <h2 className="font-serif font-bold text-base text-indigo-950 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-200">
                  {currentPage.title}
                </h2>
              </div>

              {/* Page Content Render */}
              <div className="flex-1 text-sm text-slate-800 leading-relaxed font-sans z-10 whitespace-pre-wrap py-2">
                {currentPage.content}
              </div>

              {/* Document Footer: Legal non-removable Watermark Footer on every page */}
              <div className="pt-6 mt-8 border-t border-slate-300 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
                <div className="text-left">
                  <p className="font-bold text-slate-700">
                    © {material?.authorName} • {license?.id || 'ЛИЦЕНЗИЯ'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Пользователь: {user?.email} | Жеке пайдалануу үчүн гана. Үчүнчү жактарга берүүгө тыюу салынат.
                  </p>
                </div>
                <div className="text-right text-[10px] font-mono shrink-0">
                  Бет {currentPage.pageNumber} / {pages.length}
                </div>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white">
              <button
                id="prev-page-btn"
                onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentPageIndex === 0
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.previousPage}</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                Бет <strong className="text-white">{currentPageIndex + 1}</strong> {t.pageOf} <strong>{pages.length}</strong>
              </span>

              <button
                id="next-page-btn"
                onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                disabled={currentPageIndex >= pages.length - 1}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentPageIndex >= pages.length - 1
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{t.nextPage}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Print Confirmation Modal */}
      {printSuccessModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-slate-900 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto border border-indigo-200">
              <Printer className="w-6 h-6" />
            </div>

            <h3 className="font-serif font-black text-lg">
              {language === 'ky' ? 'Басып чыгаруу аракети жазылды' : 'Попытка печати зафиксирована'}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ky'
                ? `Серверде басып чыгаруу аракети колдонулду (${printSuccessModal.printUsed} ичинен ${printSuccessModal.printLimit}). Документке сиздин жеке суу белгиңиз киргизилди.`
                : `Сервер списал 1 разрешённую попытку печати (Использовано: ${printSuccessModal.printUsed} из ${printSuccessModal.printLimit}). В распечатку внедрен персональный водяной знак.`}
            </p>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] font-mono text-slate-700 text-left">
              <p className="font-bold text-slate-900 mb-1">Водяной знак документа:</p>
              <p className="break-all">{printSuccessModal.watermark}</p>
            </div>

            <button
              onClick={() => setPrintSuccessModal(null)}
              className="w-full py-3 bg-indigo-700 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 transition-colors shadow-xs"
            >
              Түшүндүм / Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
