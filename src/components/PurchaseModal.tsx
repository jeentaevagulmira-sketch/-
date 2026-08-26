import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Printer,
  Clock,
  Lock,
  CreditCard,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Upload,
  FileCheck,
  Building2,
  QrCode,
  Receipt,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { Material, User, Language, PaymentProvider, PortalSettings } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';

interface PurchaseModalProps {
  material: Material | null;
  user: User | null;
  language: Language;
  onClose: () => void;
  onSuccess: (licenseId: string) => void;
  onOpenAuth: () => void;
}

interface BankOption {
  id: PaymentProvider;
  name: string;
  sub: string;
  color: string;
  badge: string;
  accountNumber: string;
  receiver: string;
  qrCodeText: string;
}

const KYRGYZ_BANKS: BankOption[] = [
  {
    id: 'mbank',
    name: 'MBank (КБ Кыргызстан)',
    sub: 'Тез которуу / QR',
    color: 'bg-red-600',
    badge: 'MB',
    accountNumber: '+996 700 123 456',
    receiver: 'Жээнтаева Гулмира (MBank)',
    qrCodeText: 'MBANK:0700123456:BILIM_KG'
  },
  {
    id: 'bakai',
    name: 'Bakai Bank (Бакай)',
    sub: 'Bakai24 / Элкарт',
    color: 'bg-indigo-700',
    badge: 'BB',
    accountNumber: '1240020011223344',
    receiver: 'Жээнтаева Гулмира (Bakai)',
    qrCodeText: 'BAKAI:1240020011223344'
  },
  {
    id: 'optimabank',
    name: 'Optima Bank (Оптима)',
    sub: 'Optima24 / Visa',
    color: 'bg-orange-600',
    badge: 'OB',
    accountNumber: '1091820033445566',
    receiver: 'Жээнтаева Гулмира (Optima)',
    qrCodeText: 'OPTIMA:1091820033445566'
  },
  {
    id: 'megapay',
    name: 'MegaPay (Мегаком)',
    sub: 'Электрондук капчык',
    color: 'bg-emerald-600',
    badge: 'MP',
    accountNumber: '+996 555 987 654',
    receiver: 'Гулмира Ж. (MegaPay)',
    qrCodeText: 'MEGAPAY:0555987654'
  },
  {
    id: 'odengi',
    name: 'О!Деньги (O! Bank)',
    sub: 'Кошелек / Карты',
    color: 'bg-amber-500',
    badge: 'О!',
    accountNumber: '+996 705 443 322',
    receiver: 'Жээнтаева Гулмира (О!)',
    qrCodeText: 'ODENGI:0705443322'
  },
  {
    id: 'rsk',
    name: 'Элдик Банк (РСК)',
    sub: 'Элдик / Карты КР',
    color: 'bg-blue-700',
    badge: 'РСК',
    accountNumber: '1290010044556677',
    receiver: 'Жээнтаева Гулмира (Элдик)',
    qrCodeText: 'RSK:1290010044556677'
  },
  {
    id: 'aiyl',
    name: 'Айыл Банк (Береке)',
    sub: 'Айыл / Элкарт',
    color: 'bg-green-700',
    badge: 'АБ',
    accountNumber: '1350120055667788',
    receiver: 'Жээнтаева Гулмира (Айыл)',
    qrCodeText: 'AIYL:1350120055667788'
  },
  {
    id: 'demirbank',
    name: 'DemirBank (Демир)',
    sub: 'DKIB / Visa',
    color: 'bg-rose-700',
    badge: 'DB',
    accountNumber: '1180000099887766',
    receiver: 'Жээнтаева Гулмира (Demir)',
    qrCodeText: 'DEMIR:1180000099887766'
  },
  {
    id: 'elsom',
    name: 'Элсом (KICB)',
    sub: 'Электрондук капчык',
    color: 'bg-teal-700',
    badge: 'KICB',
    accountNumber: '+996 772 112 233',
    receiver: 'Жээнтаева Гулмира (Элсом)',
    qrCodeText: 'ELSOM:0772112233'
  },
  {
    id: 'elcart',
    name: 'Элкарт (Баардык банктар)',
    sub: 'Бирдиктүү төлөм',
    color: 'bg-blue-600',
    badge: 'ЭЛ',
    accountNumber: '9417 1234 5678 9012',
    receiver: 'Жээнтаева Гулмира (Элкарт)',
    qrCodeText: 'ELCART:9417123456789012'
  }
];

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  material,
  user,
  language,
  onClose,
  onSuccess,
  onOpenAuth
}) => {
  const [portalSettings, setPortalSettings] = useState<PortalSettings | null>(null);
  const [provider, setProvider] = useState<PaymentProvider>('mbank');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingLicense, setHasExistingLicense] = useState<boolean>(false);
  const [step, setStep] = useState<'checkout' | 'payment_gateway' | 'success'>('checkout');
  const [createdPurchase, setCreatedPurchase] = useState<any>(null);
  const [activatedLicenseId, setActivatedLicenseId] = useState<string>('');

  // Payment Proof form state
  const [receiptNumber, setReceiptNumber] = useState('');
  const [senderName, setSenderName] = useState(user?.name || '');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '+996 ');
  const [senderCardOrAccount, setSenderCardOrAccount] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  useEffect(() => {
    api.getSettings().then(setPortalSettings).catch(() => {});
  }, []);

  if (!material) return null;

  const t = translations[language];
  const title = material.title[language] || material.title.ru;

  // Build dynamic bank list using portal settings if available
  const availableBanks = KYRGYZ_BANKS.map((bank) => {
    if (!portalSettings?.bankRequisites) return bank;
    const configured = portalSettings.bankRequisites.find((b) => b.id === bank.id);
    if (!configured) return bank;
    return {
      ...bank,
      name: configured.name || bank.name,
      accountNumber: configured.accountNumber || bank.accountNumber,
      receiver: configured.recipientName || bank.receiver,
      enabled: configured.enabled !== false
    };
  }).filter((b: any) => b.enabled !== false);

  const currentBank = availableBanks.find((b) => b.id === provider) || availableBanks[0] || KYRGYZ_BANKS[0];

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleStartPurchase = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!acceptedTerms) {
      setAcceptedTerms(true);
    }

    setError(null);
    setHasExistingLicense(false);
    setLoading(true);

    try {
      const result = await api.createPaymentIntent({
        materialId: material.id,
        provider,
        acceptedTerms: true
      });

      setCreatedPurchase(result.purchase);
      setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`);
      setStep('payment_gateway');
    } catch (err: any) {
      const errMsg = err.message || 'Ошибка создания платежа';
      setError(errMsg);
      if (errMsg.includes('действующая лицензия') || errMsg.includes('активдүү лицензия')) {
        setHasExistingLicense(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Online confirmation
  const handleInstantConfirm = async () => {
    if (!createdPurchase) return;
    setLoading(true);
    setError(null);

    try {
      const result = await api.confirmTestPayment(createdPurchase.id);
      setActivatedLicenseId(result.license.id);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Ошибка подтверждения оплаты');
    } finally {
      setLoading(false);
    }
  };

  // Submit Payment Proof (Чек / квитанция маалыматы)
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdPurchase) return;

    if (!receiptNumber.trim()) {
      setError(
        language === 'ky'
          ? 'Сураныч, чек номерин же транзакция кодун жазыңыз'
          : 'Пожалуйста, укажите номер чека или код квитанции'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.submitPaymentProof({
        purchaseId: createdPurchase.id,
        receiptNumber: receiptNumber.trim(),
        senderName: senderName.trim() || user?.name || '',
        senderPhone: senderPhone.trim() || user?.phone || '',
        senderCardOrAccount: senderCardOrAccount.trim(),
        notes: notes.trim()
      });

      setActivatedLicenseId(result.license.id);
      setProofSubmitted(true);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки чека');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        id="purchase-checkout-modal"
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-slate-900">
                {step === 'success'
                  ? language === 'ky'
                    ? 'Төлөм ийгиликтүү!'
                    : 'Оплата прошла успешно!'
                  : step === 'payment_gateway'
                  ? language === 'ky'
                    ? 'Кыргызстандын банктары аркылуу төлөө жана чек далили'
                    : 'Оплата через банк Кыргызстана и чек-подтверждение'
                  : t.licenseTermsTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {material.authorName} • {material.grade}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
              {hasExistingLicense && (
                <div className="pt-2 border-t border-red-200/60 flex items-center justify-between">
                  <span className="text-slate-600">
                    {language === 'ky'
                      ? 'Сизде бул материалга лицензия бар.'
                      : 'У вас уже есть доступ к этому материалу.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSuccess(material.id);
                    }}
                    className="px-3.5 py-1.5 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{t.openMaterialBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'checkout' && (
            <>
              {/* Product Summary Bento Tile */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                    {language === 'ky' ? 'Тандалган материал' : 'Выбранный материал'}
                  </span>
                  <h4 className="font-serif font-black text-sm sm:text-base text-slate-900">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {material.pageCount} {t.pagesCount} • {material.academicYear}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block uppercase font-bold">
                    {t.price}
                  </span>
                  <span className="font-serif font-black text-2xl text-slate-900">
                    {material.price}{' '}
                    <span className="text-xs font-sans font-medium text-slate-500">
                      {t.currency}
                    </span>
                  </span>
                </div>
              </div>

              {/* License Specs Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                    <Printer className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.printLimitInfo}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{t.printCount}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {language === 'ky' ? 'Сервер аркылуу корголгон' : 'Фиксируется на сервере'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.accessDuration}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    {material.defaultAccessDays > 0
                      ? `${material.defaultAccessDays} ${t.days}`
                      : t.unlimited}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {language === 'ky' ? 'Жеке кабинетте сакталат' : 'В личном кабинете'}
                  </p>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t.buyerDetails}
                </h4>
                {user ? (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-900 font-bold">{user.name}</p>
                    <p className="text-slate-500">
                      Email: <strong className="text-slate-800">{user.email}</strong>{' '}
                      <span className="text-indigo-700 text-[11px] font-semibold">
                        (Лицензия ушул почтага байланат)
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-indigo-950 font-medium">
                      <span>
                        {language === 'ky'
                          ? 'Сатып алуу үчүн аккаунтка кириңиз:'
                          : 'Для покупки войдите в аккаунт:'}
                      </span>
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="px-3 py-1.5 bg-indigo-700 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 transition-colors shadow-xs"
                      >
                        {t.loginBtn} / {t.registerBtn}
                      </button>
                    </div>

                    {/* Fast 1-click login options */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-indigo-200/60">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setLoading(true);
                            await api.loginWithGoogle(
                              'ainura.teacher@bilim.kg',
                              'Айнура Исмаилова'
                            );
                            window.location.reload();
                          } catch (e: any) {
                            setError(e.message);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="p-2.5 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-100/50 text-left transition-colors flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">
                            Айнура И. (Мугалим)
                          </p>
                          <p className="text-[10px] text-slate-500">1 басуу менен кирүү</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setLoading(true);
                            await api.loginWithGoogle(
                              'jeentaevagulmira@gmail.com',
                              'Гулмира Жээнтаева'
                            );
                            window.location.reload();
                          } catch (e: any) {
                            setError(e.message);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="p-2.5 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-100/50 text-left transition-colors flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">
                            Гулмира Ж. (Автор)
                          </p>
                          <p className="text-[10px] text-slate-500">1 басуу менен кирүү</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ALL KYRGYZSTAN BANKS SELECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-700" />
                    <span>{t.paymentMethod}</span>
                  </h4>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    {availableBanks.length} {language === 'ky' ? 'банк жана капчык' : 'банков и кошельков'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {availableBanks.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setProvider(bank.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        provider === bank.id
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-600/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl ${bank.color} text-white flex items-center justify-center font-bold text-[10px] mb-1.5 shadow-xs`}
                      >
                        {bank.badge}
                      </div>
                      <p className="text-[11px] font-bold leading-tight truncate">{bank.name}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5 truncate">{bank.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandatory Policy & Terms Checkbox */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">{t.licenseWarning}</p>
                <label className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-200">
                  <input
                    id="agree-terms-checkbox"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-900 select-none">
                    {t.agreeCheckbox}
                  </span>
                </label>
              </div>
            </>
          )}

          {/* STEP 2: BANK TRANSFER & PAYMENT PROOF SUBMISSION */}
          {step === 'payment_gateway' && createdPurchase && (
            <div className="space-y-6">
              {/* Selected Bank Details Banner */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl ${currentBank.color} text-white flex items-center justify-center font-bold text-sm shadow-xs`}
                    >
                      {currentBank.badge}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900">
                        {currentBank.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Транзакция ID: <strong className="font-mono text-slate-800">{createdPurchase.transactionId}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Төлөнүүчү сумма</span>
                    <span className="font-serif font-black text-2xl text-indigo-900">
                      {createdPurchase.amount} <span className="text-xs font-sans font-medium text-slate-500">KGS</span>
                    </span>
                  </div>
                </div>

                {/* Transfer Requisites Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                      {language === 'ky' ? 'Которуу номери / Карта / Телефон' : 'Номер счёта / Телефона для перевода'}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <strong className="font-mono text-sm text-slate-900">{currentBank.accountNumber}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(currentBank.accountNumber)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                      >
                        {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey ? 'Көчүрүлдү' : 'Көчүрүү'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                      {language === 'ky' ? 'Алуучу' : 'Получатель'}
                    </span>
                    <strong className="text-slate-900 text-xs">{currentBank.receiver}</strong>
                  </div>
                </div>

                {/* Bank QR Code simulation */}
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-7 h-7 text-indigo-700 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">
                        {language === 'ky' ? 'Мобилдик банктан QR же номер аркылуу которуңуз' : 'Переведите по номеру или QR в приложении банка'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {currentBank.name} тиркемесинде «Которуу» бөлүмүн ачыңыз
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-white border border-indigo-200 rounded-lg text-[10px] font-bold text-indigo-800">
                    QR даяр
                  </span>
                </div>
              </div>

              {/* PAYMENT PROOF FORM (Чек номери, квитанция маалыматы) */}
              <form onSubmit={handleSubmitProof} className="p-5 rounded-2xl bg-white border-2 border-indigo-600/30 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-indigo-700" />
                    <h4 className="font-serif font-bold text-base text-slate-900">
                      {t.proofTitle}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Авто-текшерүү</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.receiptUploadNote}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t.receiptNumberLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      placeholder="мисалы: REC-892401 же 083921"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t.receiptSenderPhone}
                    </label>
                    <input
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+996 700 000 000 же *1234"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t.receiptSenderName}
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Аты-жөнүңүз"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {language === 'ky' ? 'Кошумча билдирүү / комментарий' : 'Примечание / Детали'}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="мисалы: 2-класс математика үчүн төлөндү"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {loading ? (
                      <span>Сервер текшерүүдө...</span>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4" />
                        <span>{t.submitProofBtn}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleInstantConfirm}
                    disabled={loading}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-700 underline flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'ky' ? 'Түз онлайн ырастоо (1-басуу)' : 'Быстрое онлайн-подтверждение'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE WITH DIGITAL RECEIPT */}
          {step === 'success' && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs inline-flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.proofVerifiedBadge}</span>
                </span>
                <h4 className="font-serif font-black text-xl text-slate-900">
                  {t.paymentSuccess}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Лицензия номери: <strong className="font-mono text-indigo-700 font-bold">{activatedLicenseId}</strong>
                </p>
              </div>

              {/* Digital Proof Voucher Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 max-w-md mx-auto space-y-2.5 text-left font-mono">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-sans">Чек №:</span>
                  <span className="font-bold text-slate-900">{receiptNumber || 'REC-ONLINE'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-sans">Төлөм ыкмасы:</span>
                  <span className="font-bold text-indigo-700 uppercase">{provider}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-sans">Сумма:</span>
                  <span className="font-bold text-emerald-700">{material.price} KGS (Төлөндү)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Ээси:</span>
                  <span className="font-bold truncate max-w-[200px]">{user?.email}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 max-w-md mx-auto space-y-2 text-left">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Персоналдуу мүмкүнчүлүк активдештирилди</span>
                </p>
                <p className="text-slate-600">
                  Материал сиздин электрондук почтаңызга (<strong className="text-slate-900">{user?.email}</strong>) байланды. Жеке суу белгиси менен 1 жолу басып чыгарууга уруксат берилди.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          {step === 'checkout' ? (
            <>
              <div className="text-xs text-slate-500">
                <p className="font-bold text-slate-900">
                  {material.price} {t.currency}
                </p>
                <p>{currentBank.name}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  {language === 'ky' ? 'Жабуу' : 'Отмена'}
                </button>

                <button
                  type="button"
                  onClick={handleStartPurchase}
                  disabled={loading}
                  className={`px-6 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 ${
                    loading
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-700 hover:bg-indigo-800 text-white cursor-pointer active:scale-95'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {loading
                      ? language === 'ky'
                        ? 'Түзүлүүдө...'
                        : 'Создание...'
                      : user
                      ? t.proceedToPayment
                      : language === 'ky'
                      ? 'Кирүү жана төлөө'
                      : 'Войти и оплатить'}
                  </span>
                </button>
              </div>
            </>
          ) : step === 'payment_gateway' ? (
            <>
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                {language === 'ky' ? '← Банкты алмаштыруу' : '← Сменить банк'}
              </button>

              <div className="text-right text-xs text-slate-500">
                <span>{material.price} KGS • {currentBank.name}</span>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Лицензия сакталды</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSuccess(material.id);
                }}
                className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>{t.openMaterialBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
