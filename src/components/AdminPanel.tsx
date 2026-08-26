import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  DollarSign,
  Printer,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Ban,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  Clock,
  Layers,
  KeyRound,
  FileCode,
  FileText,
  AlertCircle,
  Settings,
  Sliders,
  Building2,
  CreditCard,
  Megaphone,
  Save,
  Phone,
  Mail,
  Globe,
  RefreshCw,
  Sparkles,
  Info,
  Check,
  AlertTriangle,
  PanelBottom,
  MessageSquare,
  Send,
  ExternalLink
} from 'lucide-react';
import {
  User,
  Material,
  License,
  Purchase,
  AuditLog,
  Language,
  MaterialCategory,
  PortalSettings,
  BankRequisiteConfig
} from '../types';
import { translations, CATEGORY_LABELS } from '../translations';
import { api } from '../services/api';

interface AdminPanelProps {
  currentUser: User | null;
  language: Language;
  onSettingsUpdated?: (settings: PortalSettings) => void;
}

const DEFAULT_PORTAL_SETTINGS: PortalSettings = {
  siteName: {
    ky: 'БИЛИМ МАТЕРИАЛДАРЫ',
    ru: 'БИЛИМ МАТЕРИАЛДАРЫ'
  },
  siteDescription: {
    ky: 'Кыргызстандын мугалимдери үчүн автордук электрондук окуу куралдары',
    ru: 'Авторские электронные учебные материалы для учителей Кыргызстана'
  },
  authorName: 'Гулмира Жээнтаева',
  authorTitle: {
    ky: 'КР Билим берүүсүнүн отличниги, башталгыч класстардын мугалими',
    ru: 'Отличник образования КР, учитель начальных классов'
  },
  contactPhone: '+996 555 123 456',
  contactWhatsApp: '+996 555 123 456',
  contactTelegram: '@jeentaeva_bilim',
  contactEmail: 'jeentaevagulmira@gmail.com',
  supportHours: {
    ky: 'Дүйшөмбү - Ишемби, 08:00 - 20:00',
    ru: 'Понедельник - Суббота, 08:00 - 20:00'
  },
  announcement: {
    enabled: true,
    type: 'info',
    text: {
      ky: 'Жаңы 2025-2026 окуу жылына карата календардык пландар жана жумушчу баракчалар жаңыланды!',
      ru: 'Календарные планы и рабочие листы на новый 2025-2026 учебный год обновлены!'
    }
  },
  defaultPrintLimit: 1,
  defaultAccessDays: 365,
  watermarkText: {
    ky: 'ЛИЦЕНЗИЯЛЫК МАТЕРИАЛ • БАШКАЛАРГА ТАРАТУУГА ТЫЮУ САЛЫНАТ',
    ru: 'ЛИЦЕНЗИОННЫЙ МАТЕРИАЛ • РАСПРОСТРАНЕНИЕ ЗАПРЕЩЕНО'
  },
  footer: {
    description: {
      ky: 'Кыргызстандын башталгыч жана орто мектеп мугалимдери үчүн автордук окуу куралдарынын, календардык пландарынын жана тесттеринин расмий корголгон онлайн платформасы.',
      ru: 'Официальная защищенная платформа авторских методических пособий, календарных планов и дидактических материалов для учителей школ Кыргызстана.'
    },
    copyrightText: {
      ky: 'Бардык укуктар корголгон.',
      ru: 'Все права защищены.'
    },
    address: {
      ky: 'Бишкек, Кыргызстан',
      ru: 'г. Бишкек, Кыргызстан'
    },
    lawNote: {
      ky: 'КР Автордук укук жөнүндө мыйзамы менен корголгон',
      ru: 'Защищено законом КР об авторском праве'
    },
    authorBadge: {
      ky: 'КР Билим берүү отличниги',
      ru: 'Отличник образования КР'
    },
    showCategories: true,
    showContacts: true,
    showProtectionNote: true,
    socialLinks: {
      whatsapp: '+996 555 123 456',
      telegram: '@jeentaeva_bilim',
      instagram: '',
      youtube: ''
    }
  },
  bankRequisites: [
    {
      id: 'mbank',
      name: 'MBank (КБ Кыргызстан)',
      sub: 'Капчык же карта',
      badge: 'MB',
      badgeColor: 'bg-indigo-700 text-white',
      accountNumber: '9417 0000 1234 5678',
      recipientName: 'Гулмира Жээнтаева (MBank)',
      receiver: 'Гулмира Жээнтаева (MBank)',
      enabled: true,
      instructions: {
        ky: 'MBank тиркемесинде карта номери же QR аркылуу которуңуз.',
        ru: 'Перевод по номеру карты или QR в приложении MBank.'
      }
    },
    {
      id: 'bakai',
      name: 'Bakai Bank (Бакай Банк)',
      sub: 'Эсеп / Карта',
      badge: 'BB',
      badgeColor: 'bg-blue-700 text-white',
      accountNumber: '1240000011223344',
      recipientName: 'Жээнтаева Гулмира (Bakai)',
      receiver: 'Жээнтаева Гулмира (Bakai)',
      enabled: true,
      instructions: {
        ky: 'Bakai Bank тиркемесинде эсеп номерине которуу.',
        ru: 'Перевод на счет в приложении Bakai Bank.'
      }
    },
    {
      id: 'optima',
      name: 'Optima Bank (Оптима)',
      sub: 'Optima24 / Visa',
      badge: 'OB',
      badgeColor: 'bg-red-700 text-white',
      accountNumber: '4169 0000 8877 6655',
      recipientName: 'Жээнтаева Гулмира (Optima)',
      receiver: 'Жээнтаева Гулмира (Optima)',
      enabled: true,
      instructions: {
        ky: 'Optima24 аркылуу карта же эсеп номерине которуу.',
        ru: 'Перевод через Optima24 на карту или счет.'
      }
    },
    {
      id: 'megapay',
      name: 'MegaPay (Мегаком)',
      sub: 'Электрондук капчык',
      badge: 'MP',
      badgeColor: 'bg-emerald-700 text-white',
      accountNumber: '+996 555 123 456',
      recipientName: 'Жээнтаева Гулмира (MegaPay)',
      receiver: 'Жээнтаева Гулмира (MegaPay)',
      enabled: true,
      instructions: {
        ky: 'MegaPay тиркемесинен телефон номерине которуу.',
        ru: 'Перевод в MegaPay по номеру телефона.'
      }
    },
    {
      id: 'odengi',
      name: 'О!Деньги (Мой О!)',
      sub: 'Электрондук капчык',
      badge: 'O!',
      badgeColor: 'bg-pink-700 text-white',
      accountNumber: '+996 700 987 654',
      recipientName: 'Жээнтаева Гулмира (О!Деньги)',
      receiver: 'Жээнтаева Гулмира (О!Деньги)',
      enabled: true,
      instructions: {
        ky: 'Мой О! тиркемесинде капчык номерине которуу.',
        ru: 'Перевод по номеру кошелька в Мой О!.'
      }
    },
    {
      id: 'eldik',
      name: 'Элдик Банк (РСК Банк)',
      sub: 'Эсеп / Карта',
      badge: 'ЭБ',
      badgeColor: 'bg-sky-700 text-white',
      accountNumber: '1290000044332211',
      recipientName: 'Жээнтаева Гулмира (Элдик)',
      receiver: 'Жээнтаева Гулмира (Элдик)',
      enabled: true,
      instructions: {
        ky: 'Элдик Банк эсеп же карта номери боюнча которуу.',
        ru: 'Перевод по номеру счета или карты в Элдик Банк.'
      }
    },
    {
      id: 'ayilbank',
      name: 'Айыл Банк (Береке)',
      sub: 'Айыл / Элкарт',
      badge: 'АБ',
      badgeColor: 'bg-green-700 text-white',
      accountNumber: '1350120055667788',
      recipientName: 'Жээнтаева Гулмира (Айыл)',
      receiver: 'Жээнтаева Гулмира (Айыл)',
      enabled: true,
      instructions: {
        ky: 'Айыл Банктын эсебине же картасына которуу.',
        ru: 'Перевод на счет или карту Айыл Банка.'
      }
    },
    {
      id: 'demirbank',
      name: 'DemirBank (Демир)',
      sub: 'DKIB / Visa',
      badge: 'DB',
      badgeColor: 'bg-rose-700 text-white',
      accountNumber: '1180000099887766',
      recipientName: 'Жээнтаева Гулмира (Demir)',
      receiver: 'Жээнтаева Гулмира (Demir)',
      enabled: true,
      instructions: {
        ky: 'DemirBank эсеп номери боюнча которуу.',
        ru: 'Перевод по номеру счета DemirBank.'
      }
    },
    {
      id: 'elsom',
      name: 'Элсом (KICB)',
      sub: 'Электрондук капчык',
      badge: 'KICB',
      badgeColor: 'bg-teal-700 text-white',
      accountNumber: '+996 772 112 233',
      recipientName: 'Жээнтаева Гулмира (Элсом)',
      receiver: 'Жээнтаева Гулмира (Элсом)',
      enabled: true,
      instructions: {
        ky: 'Элсом капчыгына номер боюнча которуу.',
        ru: 'Перевод в кошельке Элсом по номеру телефона.'
      }
    },
    {
      id: 'elcart',
      name: 'Элкарт (Баардык банктар)',
      sub: 'Бирдиктүү төлөм',
      badge: 'ЭЛ',
      badgeColor: 'bg-blue-600 text-white',
      accountNumber: '9417 1234 5678 9012',
      recipientName: 'Жээнтаева Гулмира (Элкарт)',
      receiver: 'Жээнтаева Гулмира (Элкарт)',
      enabled: true,
      instructions: {
        ky: 'Кыргызстандагы каалаган банктын тиркемесинен Элкарт номерине которуу.',
        ru: 'Перевод на карту Элкарт из любого банковского приложения Кыргызстана.'
      }
    }
  ]
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, language, onSettingsUpdated }) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'materials' | 'users' | 'licenses' | 'purchases' | 'audit' | 'architecture' | 'settings'
  >('dashboard');

  const [stats, setStats] = useState<any>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [portalSettings, setPortalSettings] = useState<PortalSettings>(DEFAULT_PORTAL_SETTINGS);
  const [settingsForm, setSettingsForm] = useState<PortalSettings>(JSON.parse(JSON.stringify(DEFAULT_PORTAL_SETTINGS)));
  const [activeSettingsSection, setActiveSettingsSection] = useState<'general' | 'announcement' | 'license' | 'banks' | 'footer'>('general');
  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // New Material Form Modal
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formMaterial, setFormMaterial] = useState<{
    titleKy: string;
    titleRu: string;
    category: MaterialCategory;
    grade: string;
    subjectKy: string;
    subjectRu: string;
    academicYear: string;
    pageCount: number;
    price: number;
    coverImage: string;
    descKy: string;
    descRu: string;
    defaultPrintLimit: number;
    defaultAccessDays: number;
    samplePagesCount: number;
    page1Title: string;
    page1Content: string;
  }>({
    titleKy: '',
    titleRu: '',
    category: 'calendar_plans',
    grade: '1-класс',
    subjectKy: 'Математика',
    subjectRu: 'Математика',
    academicYear: '2025-2026',
    pageCount: 30,
    price: 300,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    descKy: '',
    descRu: '',
    defaultPrintLimit: 1,
    defaultAccessDays: 365,
    samplePagesCount: 1,
    page1Title: '1-сабак. Киришүү',
    page1Content: 'Сабактын максаты жана пландаштырылган иш-аракеттер...'
  });

  const t = translations[language];

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, matsData, usersData, licsData, purchData, logsData, settingsData] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAdminMaterials().catch(() => []),
        api.getAdminUsers().catch(() => []),
        api.getAdminLicenses().catch(() => []),
        api.getAdminPurchases().catch(() => []),
        api.getAdminAuditLogs().catch(() => []),
        api.getAdminSettings().catch(() => api.getSettings().catch(() => null))
      ]);
      if (statsData) setStats(statsData);
      if (matsData) setMaterials(matsData);
      if (usersData) setUsers(usersData);
      if (licsData) setLicenses(licsData);
      if (purchData) setPurchases(purchData);
      if (logsData) setLogs(logsData);
      if (settingsData) {
        setPortalSettings(settingsData);
        setSettingsForm(JSON.parse(JSON.stringify(settingsData)));
      } else {
        setSettingsForm(JSON.parse(JSON.stringify(DEFAULT_PORTAL_SETTINGS)));
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Action: Restore Print attempt for user (+1 print quota)
  const handleRestorePrint = async (licenseId: string) => {
    try {
      await api.restorePrintAttempt(licenseId);
      setMessage(language === 'ky' ? 'Басып чыгаруу аракети ийгиликтүү кошулду (+1)!' : 'Попытка печати успешно восстановлена (+1)!');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Ошибка');
    }
  };

  // Action: Extend license duration
  const handleExtendLicense = async (licenseId: string, days: number) => {
    try {
      await api.extendLicense(licenseId, days);
      setMessage(`Лицензия продлена на ${days} дней`);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Ошибка');
    }
  };

  // Action: Toggle Revoke License
  const handleToggleRevoke = async (licenseId: string) => {
    try {
      await api.revokeLicense(licenseId);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Ошибка');
    }
  };

  // Action: Block / Unblock User
  const handleToggleBlockUser = async (userId: string) => {
    try {
      await api.toggleBlockUser(userId);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Ошибка');
    }
  };

  // Action: Delete Material
  const handleDeleteMaterial = async (id: string) => {
    if (!window.confirm(t.confirmAction)) return;
    try {
      await api.deleteAdminMaterial(id);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Ошибка');
    }
  };

  // Action: Save Material
  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Material> = {
        title: {
          ky: formMaterial.titleKy || formMaterial.titleRu,
          ru: formMaterial.titleRu || formMaterial.titleKy
        },
        category: formMaterial.category,
        grade: formMaterial.grade,
        subject: {
          ky: formMaterial.subjectKy,
          ru: formMaterial.subjectRu
        },
        academicYear: formMaterial.academicYear,
        pageCount: Number(formMaterial.pageCount),
        price: Number(formMaterial.price),
        coverImage: formMaterial.coverImage,
        description: {
          ky: formMaterial.descKy,
          ru: formMaterial.descRu
        },
        defaultPrintLimit: Number(formMaterial.defaultPrintLimit),
        defaultAccessDays: Number(formMaterial.defaultAccessDays),
        samplePagesCount: Number(formMaterial.samplePagesCount),
        pages: [
          {
            pageNumber: 1,
            title: formMaterial.page1Title || 'Тема 1',
            type: 'text',
            content: formMaterial.page1Content || 'Мазмуну...'
          }
        ]
      };

      if (editingMaterial) {
        await api.updateAdminMaterial(editingMaterial.id, payload);
      } else {
        await api.createAdminMaterial(payload);
      }

      setShowAddMaterialModal(false);
      setEditingMaterial(null);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Ошибка сохранения');
    }
  };

  // Action: Save Portal Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settingsForm) return;
    setSavingSettings(true);
    try {
      const res = await api.updateAdminSettings(settingsForm);
      setPortalSettings(res.settings);
      setSettingsForm(JSON.parse(JSON.stringify(res.settings)));
      if (onSettingsUpdated) {
        onSettingsUpdated(res.settings);
      }
      setMessage(
        language === 'ky'
          ? 'Порталдын орнотуулары ийгиликтүү сакталды жана жаңыртылды!'
          : 'Настройки портала успешно сохранены и обновлены!'
      );
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Ошибка сохранения настроек');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleBank = (bankId: string) => {
    if (!settingsForm) return;
    setSettingsForm({
      ...settingsForm,
      bankRequisites: settingsForm.bankRequisites.map((b) =>
        b.id === bankId ? { ...b, enabled: !b.enabled } : b
      )
    });
  };

  const handleBankFieldChange = (
    bankId: string,
    field: keyof BankRequisiteConfig,
    value: any
  ) => {
    if (!settingsForm) return;
    setSettingsForm({
      ...settingsForm,
      bankRequisites: settingsForm.bankRequisites.map((b) =>
        b.id === bankId ? { ...b, [field]: value } : b
      )
    });
  };

  const handleAddCustomBank = () => {
    if (!settingsForm) return;
    const newId = 'bank_' + Date.now();
    const newBank: BankRequisiteConfig = {
      id: newId,
      name: language === 'ky' ? 'Жаңы банк / Капчык' : 'Новый банк / Кошелек',
      accountNumber: '',
      recipientName: settingsForm.authorName || 'Гулмира Жээнтаева',
      instructions: {
        ky: 'Котормонун комментарийине өзүңүздүн Email дарегиңизди жазыңыз',
        ru: 'В комментарии к переводу укажите ваш Email'
      },
      enabled: true,
      badgeColor: 'bg-indigo-700 text-white'
    };
    setSettingsForm({
      ...settingsForm,
      bankRequisites: [...settingsForm.bankRequisites, newBank]
    });
  };

  const handleRemoveBank = (bankId: string) => {
    if (!settingsForm) return;
    if (!window.confirm(language === 'ky' ? 'Бул банкты тизмеден өчүрүүнү каалайсызбы?' : 'Удалить этот банк из списка?')) return;
    setSettingsForm({
      ...settingsForm,
      bankRequisites: settingsForm.bankRequisites.filter((b) => b.id !== bankId)
    });
  };

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-stone-900 mb-2">
          Доступ запрещен
        </h2>
        <p className="text-sm text-stone-600">
          Данный раздел предназначен исключительно для автора и администратора платформы (Гулмира Жээнтаева).
        </p>
      </div>
    );
  }

  return (
    <div id="admin-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bento Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>{language === 'ky' ? 'Башкаруу борбору' : 'Панель управления автором'}</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
            {t.adminTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Администратор: <strong className="text-slate-900 font-bold">{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="admin-quick-settings-btn"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-bold text-xs rounded-xl transition-all flex items-center gap-2 border shadow-xs ${
              activeTab === 'settings'
                ? 'bg-indigo-900 text-white border-indigo-900 ring-2 ring-indigo-500'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border-indigo-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>{language === 'ky' ? '⚙️ Порталдын орнотуулары' : '⚙️ Настройки портала'}</span>
          </button>

          <button
            id="admin-add-material-btn"
            onClick={() => {
              setEditingMaterial(null);
              setShowAddMaterialModal(true);
            }}
            className="px-5 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addMaterialBtn}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between shadow-xs">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 py-1 text-xs">
        {[
          { id: 'dashboard', label: t.tabDashboard, icon: DollarSign },
          { id: 'materials', label: t.tabMaterials, icon: BookOpen, count: materials.length },
          { id: 'users', label: t.tabUsers, icon: Users, count: users.length },
          { id: 'licenses', label: t.tabLicenses, icon: ShieldCheck, count: licenses.length },
          { id: 'purchases', label: t.tabPurchases, icon: DollarSign, count: purchases.length },
          { id: 'audit', label: t.tabAuditLogs, icon: FileCode, count: logs.length },
          { id: 'architecture', label: t.tabArchitecture, icon: FileText },
          { id: 'settings', label: t.tabSettings, icon: Settings, isSpecial: true }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs ring-2 ring-indigo-500'
                  : tab.isSpecial
                  ? 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.isSpecial && !isActive ? 'text-indigo-600' : ''}`} />
              <span>{tab.label}</span>
              {tab.isSpecial && !isActive && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-200/80 text-indigo-900 font-extrabold">
                  {language === 'ky' ? 'Башкаруу' : 'Реквизиты'}
                </span>
              )}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-500 text-white font-extrabold' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Bento KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block mb-1">{t.totalUsers}</span>
                <p className="font-serif font-black text-2xl text-slate-900">{stats.totalUsers}</p>
                <span className="text-[10px] text-slate-400">мугалим катталган</span>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block mb-1">{t.totalBuyers}</span>
                <p className="font-serif font-black text-2xl text-indigo-700">{stats.totalBuyers}</p>
                <span className="text-[10px] text-indigo-500 font-medium">төлөм кылган</span>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block mb-1">{t.totalRevenue}</span>
                <p className="font-serif font-black text-2xl text-emerald-700">
                  {stats.totalRevenue} <span className="text-xs font-sans font-medium">KGS</span>
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">вебхук аркылуу</span>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block mb-1">{t.activeLicenses}</span>
                <p className="font-serif font-black text-2xl text-slate-900">{stats.activeLicenses}</p>
                <span className="text-[10px] text-slate-400">корголгон мүмкүнчүлүк</span>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block mb-1">{t.usedPrints}</span>
                <p className="font-serif font-black text-2xl text-slate-900">{stats.totalPrintsUsed}</p>
                <span className="text-[10px] text-slate-400">серверде жазылган</span>
              </div>
            </div>

            {/* Recent Purchases & Security Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Purchases */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <h3 className="font-serif font-bold text-base text-slate-900 mb-4 flex items-center justify-between">
                  <span>Акыркы төлөмдөр (Purchases)</span>
                  <span className="text-xs font-sans text-slate-400 font-normal">Жалпы: {purchases.length}</span>
                </h3>
                <div className="space-y-3">
                  {purchases.slice(0, 5).map((p) => (
                    <div key={p.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs flex items-center justify-between">
                      <div>
                        <p className="font-bold text-stone-900 truncate max-w-[200px]">{p.materialTitle}</p>
                        <p className="text-stone-500">{p.userEmail} • {p.provider.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700 block">{p.amount} KGS</span>
                        <span className="text-[10px] text-stone-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Logs */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <h3 className="font-serif font-bold text-base text-stone-900 mb-4 flex items-center justify-between">
                  <span>Коопсуздук журналы (Audit Trail)</span>
                  <span className="text-xs font-sans text-stone-400 font-normal">Жалпы: {logs.length}</span>
                </h3>
                <div className="space-y-2.5">
                  {logs.slice(0, 5).map((l) => (
                    <div key={l.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          {l.action}
                        </span>
                        <span className="text-[10px] text-stone-400">{new Date(l.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-stone-800 font-medium">{l.details || l.action}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{l.userEmail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MATERIALS MANAGEMENT */}
        {activeTab === 'materials' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Каталогдогу окуу материалдары ({materials.length})
              </h3>
              <button
                onClick={() => {
                  setEditingMaterial(null);
                  setShowAddMaterialModal(true);
                }}
                className="px-3 py-1.5 bg-amber-600 text-white font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Кошуу</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Материалдын аталышы</th>
                    <th className="p-3.5">Категория / Класс</th>
                    <th className="p-3.5">Баасы</th>
                    <th className="p-3.5">Беттер</th>
                    <th className="p-3.5">Печать лимити</th>
                    <th className="p-3.5 text-right">Аракеттер</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {materials.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.coverImage}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-stone-900 max-w-sm truncate">{m.title.ru}</p>
                            <p className="text-[11px] text-stone-500">{m.authorName} • {m.academicYear}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-stone-100 px-2 py-1 rounded text-stone-700 block w-max">
                          {m.category}
                        </span>
                        <span className="text-stone-500 mt-0.5 block">{m.grade}</span>
                      </td>
                      <td className="p-3.5 font-bold text-stone-900">{m.price} KGS</td>
                      <td className="p-3.5">{m.pageCount} бет</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-bold">
                          {m.defaultPrintLimit} жолу
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingMaterial(m);
                            setFormMaterial({
                              titleKy: m.title.ky,
                              titleRu: m.title.ru,
                              category: m.category,
                              grade: m.grade,
                              subjectKy: m.subject.ky,
                              subjectRu: m.subject.ru,
                              academicYear: m.academicYear,
                              pageCount: m.pageCount,
                              price: m.price,
                              coverImage: m.coverImage,
                              descKy: m.description.ky,
                              descRu: m.description.ru,
                              defaultPrintLimit: m.defaultPrintLimit,
                              defaultAccessDays: m.defaultAccessDays,
                              samplePagesCount: m.samplePagesCount,
                              page1Title: m.pages?.[0]?.title || '',
                              page1Content: m.pages?.[0]?.content || ''
                            });
                            setShowAddMaterialModal(true);
                          }}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(m.id)}
                          className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Колдонуучулар жана мугалимдер ({users.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Мугалимдин аты / Email</th>
                    <th className="p-3.5">Ролу</th>
                    <th className="p-3.5">Статус</th>
                    <th className="p-3.5">Сатып алуулар</th>
                    <th className="p-3.5">Катталган күн</th>
                    <th className="p-3.5 text-right">Бөгөттөө / Башкаруу</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50">
                      <td className="p-3.5">
                        <p className="font-bold text-stone-900">{u.name}</p>
                        <p className="text-stone-500 font-mono text-[11px]">{u.email}</p>
                        {u.school && <p className="text-[10px] text-stone-400">{u.school}</p>}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            u.role === 'ADMIN' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.status === 'active' ? 'Активдүү' : 'Бөгөттөлгөн (Blocked)'}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold">{(u as any).purchasesCount || 0} материал</td>
                      <td className="p-3.5 text-stone-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        {u.id !== currentUser.id && (
                          <button
                            onClick={() => handleToggleBlockUser(u.id)}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                              u.status === 'active'
                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? t.blockUserBtn : t.unblockUserBtn}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. LICENSES & RESTORE PRINT */}
        {activeTab === 'licenses' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Берилген лицензиялар жана печать абалы ({licenses.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Эгер мугалимде принтер иштебей калса, бул жерден <strong>«Восстановить печать (+1)»</strong> басыңыз.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Лицензия ID</th>
                    <th className="p-3.5">Колдонуучу (Email)</th>
                    <th className="p-3.5">Материал</th>
                    <th className="p-3.5">Печать лимити / Колдонулду</th>
                    <th className="p-3.5">Мөөнөтү</th>
                    <th className="p-3.5">Статус</th>
                    <th className="p-3.5 text-right">Печатты калыбына келтирүү</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {licenses.map((lic) => {
                    const isExhausted = lic.printUsed >= lic.printLimit;
                    return (
                      <tr key={lic.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-mono font-bold text-amber-800">{lic.id}</td>
                        <td className="p-3.5">
                          <p className="font-bold text-stone-900">{lic.userName}</p>
                          <p className="text-stone-500 font-mono text-[11px]">{lic.userEmail}</p>
                        </td>
                        <td className="p-3.5 max-w-xs truncate font-medium text-stone-800">
                          {lic.materialTitle}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-900">
                              {lic.printUsed} / {lic.printLimit}
                            </span>
                            {isExhausted ? (
                              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                Түгөндү
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                                Калды: {lic.printLimit - lic.printUsed}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 text-stone-600">
                          {lic.expirationDate ? new Date(lic.expirationDate).toLocaleDateString() : 'Мөөнөтсүз'}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              lic.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {lic.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            id={`restore-print-btn-${lic.id}`}
                            onClick={() => handleRestorePrint(lic.id)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                            title="Мугалимге дагы 1 жолу басып чыгаруу мүмкүнчүлүгүн берүү"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{t.restorePrintBtn}</span>
                          </button>
                          <button
                            onClick={() => handleExtendLicense(lic.id, 90)}
                            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-semibold"
                          >
                            +90 күн
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. PURCHASES & PROOF VERIFICATION */}
        {activeTab === 'purchases' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Төлөмдөр, квитанциялар жана чектер ({purchases.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Кыргызстандын банктарынан которулган төлөмдөр жана кардарлардын чек далилдери.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Транзакция ID</th>
                    <th className="p-3.5">Мугалим</th>
                    <th className="p-3.5">Материал</th>
                    <th className="p-3.5">Сумма</th>
                    <th className="p-3.5">Банк / Провайдер</th>
                    <th className="p-3.5">Чек / Далил</th>
                    <th className="p-3.5">Статус</th>
                    <th className="p-3.5">Дата</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="p-3.5 font-mono text-stone-700 font-bold">{p.transactionId}</td>
                      <td className="p-3.5">
                        <p className="font-semibold text-stone-900">{p.userEmail}</p>
                        {p.proof?.senderPhone && (
                          <p className="text-[11px] text-stone-500 font-mono">Тел: {p.proof.senderPhone}</p>
                        )}
                      </td>
                      <td className="p-3.5 text-stone-800 max-w-xs truncate font-medium">{p.materialTitle}</td>
                      <td className="p-3.5 font-bold text-emerald-700">{p.amount} {p.currency}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded font-bold uppercase text-[10px]">
                          {p.provider}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {p.proof?.receiptNumber ? (
                          <div className="space-y-0.5">
                            <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                              № {p.proof.receiptNumber}
                            </span>
                            {p.proof.senderName && (
                              <p className="text-[10px] text-slate-500">Аты: {p.proof.senderName}</p>
                            )}
                            {p.proof.notes && (
                              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">«{p.proof.notes}»</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-400">Онлайн төлөм</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-stone-500">{new Date(p.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 bg-stone-50">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Толук коопсуздук жана аракеттер журналы ({logs.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="p-3">Убактысы</th>
                    <th className="p-3">Аракет (Action)</th>
                    <th className="p-3">Колдонуучу (Email)</th>
                    <th className="p-3">Чоо-жайы (Details)</th>
                    <th className="p-3">IP / Түзмөк</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-stone-50">
                      <td className="p-3 text-stone-400 whitespace-nowrap">
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            l.action.includes('DENIED') || l.action.includes('BLOCKED')
                              ? 'bg-red-100 text-red-800'
                              : l.action.includes('SUCCESS') || l.action.includes('COMPLETED')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {l.action}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-stone-900 font-medium">{l.userEmail}</td>
                      <td className="p-3 font-sans text-stone-700 max-w-md">{l.details}</td>
                      <td className="p-3 text-stone-400 text-[10px]">{l.ip || '127.0.0.1'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. ARCHITECTURE & SECURITY BLUEPRINT */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Архитектура безопасности и правила доступа платформы</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ниже приведена детальная схема безопасности, структура базы данных Firestore, правила Cloud Storage, архитектура Webhook для платёжных систем Кыргызстана и описание реальных барьеров защиты.
              </p>

              {/* Security Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                  <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Реальная защита на уровне сервера:</span>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-stone-700">
                    <li>Файлы и страницы отдаются строго через авторизованный эндпоинт <code>/api/materials/:id/content</code>.</li>
                    <li>Сервер проверяет наличие активной непросроченной лицензии покупателя.</li>
                    <li>Квота печати декрементируется атомарно на сервере в <code>/api/materials/:id/request-print</code>.</li>
                    <li>Внедрение сквозного несмываемого водяного знака с Email и ID лицензии при любой попытке вывода.</li>
                    <li>Никаких публичных прямых URL на PDF в Cloud Storage.</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Честное описание ограничений браузера:</span>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-stone-700">
                    <li>Ни один браузер в мире не может заблокировать внешний фотоаппарат или смартфон, направленный на монитор.</li>
                    <li>Скриншоты ОС невозможно гарантированно запретить через JS.</li>
                    <li>Именно поэтому внедрен персональный водяной знак: при любой утечке в WhatsApp/Telegram легко вычислить покупателя по ID лицензии.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Firestore & Storage Schema Code Snippet */}
            <div className="bg-stone-900 text-stone-200 rounded-2xl p-6 shadow-xs font-mono text-xs space-y-4">
              <h4 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>firestore.rules & Storage Security Schema</span>
              </h4>
              <pre className="bg-stone-950 p-4 rounded-xl overflow-x-auto text-[11px] text-amber-300">
{`// ==========================================
// FIRESTORE SECURITY RULES
// ==========================================
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Materials catalog: public can read basic info, only ADMIN can write
    match /materials/{materialId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'ADMIN';
    }
    
    // Protected pages: readable ONLY if user has active license OR is ADMIN
    match /materials/{materialId}/protected_pages/{pageId} {
      allow read: if request.auth != null && (
        request.auth.token.role == 'ADMIN' ||
        exists(/databases/$(database)/documents/licenses/$(request.auth.uid + '_' + materialId))
      );
      allow write: if request.auth != null && request.auth.token.role == 'ADMIN';
    }
    
    // Licenses: User can read only THEIR OWN licenses. Write is SERVER-ONLY.
    match /licenses/{licenseId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        request.auth.token.role == 'ADMIN'
      );
      allow write: if false; // Only Cloud Functions / Server backend can write
    }
    
    // Purchases & Payments: User can read their purchases. Write is SERVER-ONLY.
    match /purchases/{purchaseId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        request.auth.token.role == 'ADMIN'
      );
      allow write: if false; // Confirmed strictly via Payment Webhook
    }
  }
}`}
              </pre>

              {/* Payment Webhook Integration points */}
              <div className="pt-2 text-stone-300 font-sans text-xs space-y-2">
                <p className="font-bold text-white">Интеграция с реальными платёжными шлюзами Кыргызстана:</p>
                <p className="text-stone-400 leading-relaxed">
                  Платформа использует единый контроллер <code>/api/payments/webhook</code> с валидацией сигнатуры транзакции. 
                  Для подключения реального шлюза (PayBox.money, MegaPay API, MBank QR / Merchant API, Balance.kg) достаточно указать <code>MERCHANT_ID</code> и <code>SECRET_KEY</code> в переменных окружения.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 8. SETTINGS & PORTAL MANAGEMENT */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Top Bar for Settings */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'ky' ? 'Порталдын системалык параметрлери' : 'Системные параметры портала'}</span>
                </div>
                <h2 className="font-serif font-black text-xl text-slate-900">
                  {language === 'ky' ? 'Порталды башкаруу жана орнотуулар' : 'Настройки портала и реквизитов'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ky'
                    ? 'Бул жерден сайттын маалыматтарын, байланыш номерлерин, кулактандыруу баннерин жана банк реквизиттерин оңдой аласыз.'
                    : 'Управление контактами автора, баннером объявлений, параметрами лицензии и платежными реквизитами Кыргызстана.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadAllData()}
                  disabled={loading}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  title="Жаңылоо"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{language === 'ky' ? 'Жаңылоо' : 'Обновить'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={savingSettings || !settingsForm}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {savingSettings
                      ? language === 'ky'
                        ? 'Сакталууда...'
                        : 'Сохранение...'
                      : language === 'ky'
                      ? 'Өзгөртүүлөрдү сактоо'
                      : 'Сохранить настройки'}
                  </span>
                </button>
              </div>
            </div>

            {!settingsForm ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
                <p className="text-xs font-medium">Жүктөлүүдө...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sub Sections Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'general', label: language === 'ky' ? '1. Негизги маалыматтар' : '1. Общие данные', icon: Building2 },
                    { id: 'announcement', label: language === 'ky' ? '2. Кулактандыруу баннери' : '2. Баннер объявления', icon: Megaphone },
                    { id: 'license', label: language === 'ky' ? '3. Лицензия жана суу белгиси' : '3. Лицензии и защита', icon: ShieldCheck },
                    { id: 'banks', label: language === 'ky' ? '4. Банктык реквизиттер' : '4. Банковские реквизиты', icon: CreditCard, count: settingsForm.bankRequisites?.length },
                    { id: 'footer', label: language === 'ky' ? '5. Төмөнкү панель (Подвал)' : '5. Нижняя панель (Подвал)', icon: PanelBottom }
                  ].map((sec) => {
                    const Icon = sec.icon;
                    const isSecActive = activeSettingsSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setActiveSettingsSection(sec.id as any)}
                        className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                          isSecActive
                            ? 'bg-indigo-700 text-white shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{sec.label}</span>
                        {sec.count !== undefined && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isSecActive ? 'bg-indigo-900 text-indigo-100 font-extrabold' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {sec.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 1. GENERAL PORTAL INFO */}
                {activeSettingsSection === 'general' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        <span>{language === 'ky' ? 'Портал жана автор жөнүндө маалымат' : 'Информация о портале и авторе'}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {language === 'ky'
                          ? 'Сайттын башкы бетинде, каталогдо жана төлөм барактарында чыгуучу аталыштар'
                          : 'Отображается в заголовке, подвале и контактах платформы'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      {/* Site Names */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Порталдын аталышы (Кыргызча):' : 'Название портала (Кыргызский):'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.siteName?.ky || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              siteName: { ...settingsForm.siteName, ky: e.target.value }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                          placeholder="БИЛИМ МАТЕРИАЛДАРЫ"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Порталдын аталышы (Орусча):' : 'Название портала (Русский):'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.siteName?.ru || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              siteName: { ...settingsForm.siteName, ru: e.target.value }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                          placeholder="БИЛИМ МАТЕРИАЛДАРЫ"
                        />
                      </div>

                      {/* Descriptions */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Кыскача сүрөттөмө (Кыргызча):' : 'Описание / Подзаголовок (Кыргызский):'}
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.siteDescription?.ky || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              siteDescription: { ...settingsForm.siteDescription, ky: e.target.value }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                          placeholder="Кыргызстандын мугалимдери үчүн автордук электрондук окуу куралдары"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Кыскача сүрөттөмө (Орусча):' : 'Описание / Подзаголовок (Русский):'}
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.siteDescription?.ru || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              siteDescription: { ...settingsForm.siteDescription, ru: e.target.value }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                          placeholder="Авторские электронные учебные материалы для учителей Кыргызстана"
                        />
                      </div>

                      {/* Author Info */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Автордун аты-жөнү (ФИО автора):' : 'ФИО Автора:'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.authorName || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, authorName: e.target.value })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                          placeholder="Гулмира Жээнтаева"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Автордун наамы / регалиясы:' : 'Звание / Регалии автора:'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.authorTitle?.ky || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              authorTitle: {
                                ky: e.target.value,
                                ru: settingsForm.authorTitle?.ru || e.target.value
                              }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                          placeholder="КР Билим берүүсүнүн отличниги, башталгыч класстардын мугалими"
                        />
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="border-t border-slate-100 pt-5 space-y-4">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-indigo-600" />
                        <span>{language === 'ky' ? 'Байланыш маалыматтары жана колдоо кызматы' : 'Контактные данные и поддержка'}</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 block">
                            {language === 'ky' ? 'Телефон номери:' : 'Номер телефона:'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.contactPhone || ''}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                            }
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                            placeholder="+996 555 123 456"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 block">
                            WhatsApp:
                          </label>
                          <input
                            type="text"
                            value={settingsForm.contactWhatsApp || ''}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, contactWhatsApp: e.target.value })
                            }
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                            placeholder="+996 555 123 456"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 block">
                            Telegram:
                          </label>
                          <input
                            type="text"
                            value={settingsForm.contactTelegram || ''}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, contactTelegram: e.target.value })
                            }
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                            placeholder="@jeentaeva_bilim"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 block">
                            Email:
                          </label>
                          <input
                            type="email"
                            value={settingsForm.contactEmail || ''}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                            }
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                            placeholder="jeentaevagulmira@gmail.com"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-700 block">
                            {language === 'ky' ? 'Иштөө тартиби / Сааттары:' : 'График работы / Время поддержки:'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.supportHours?.ky || ''}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                supportHours: {
                                  ky: e.target.value,
                                  ru: settingsForm.supportHours?.ru || e.target.value
                                }
                              })
                            }
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                            placeholder="Дүйшөмбү - Ишемби, 08:00 - 20:00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ANNOUNCEMENT BANNER */}
                {activeSettingsSection === 'announcement' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                          <Megaphone className="w-5 h-5 text-amber-500" />
                          <span>{language === 'ky' ? 'Сайттын шашылыш билдирүү баннери' : 'Баннер объявлений портала'}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {language === 'ky'
                            ? 'Сайттын эң башында бардык конокторго көрүнүүчү эскертүү же кулактандыруу'
                            : 'Отображается в верхней части сайта для всех пользователей'}
                        </p>
                      </div>

                      {/* Enable / Disable Toggle */}
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <span className="text-xs font-bold text-slate-700">
                          {settingsForm.announcement?.enabled
                            ? language === 'ky' ? 'Баннер күйгүзүлгөн' : 'Баннер активен'
                            : language === 'ky' ? 'Баннер өчүрүлгөн' : 'Баннер отключен'}
                        </span>
                        <div
                          onClick={() =>
                            setSettingsForm({
                              ...settingsForm,
                              announcement: {
                                ...settingsForm.announcement!,
                                enabled: !settingsForm.announcement?.enabled
                              }
                            })
                          }
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                            settingsForm.announcement?.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              settingsForm.announcement?.enabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </label>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Banner Type */}
                      <div>
                        <label className="font-bold text-slate-700 block mb-2">
                          {language === 'ky' ? 'Баннердин стили / түрү:' : 'Тип / стиль баннера:'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'info', label: language === 'ky' ? 'Маалыматтык (Көк)' : 'Информационный (Синий)', color: 'border-blue-500 bg-blue-50 text-blue-900' },
                            { id: 'warning', label: language === 'ky' ? 'Эскертүү (Сары)' : 'Внимание / Акция (Желтый)', color: 'border-amber-500 bg-amber-50 text-amber-900' },
                            { id: 'success', label: language === 'ky' ? 'Ийгиликтүү (Жашыл)' : 'Успех / Новость (Зеленый)', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' }
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() =>
                                setSettingsForm({
                                  ...settingsForm,
                                  announcement: {
                                    ...settingsForm.announcement!,
                                    type: t.id as any
                                  }
                                })
                              }
                              className={`p-3 rounded-xl border-2 text-left font-bold transition-all flex items-center justify-between ${
                                settingsForm.announcement?.type === t.id
                                  ? `${t.color} ring-2 ring-indigo-500/20`
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <span>{t.label}</span>
                              {settingsForm.announcement?.type === t.id && <Check className="w-4 h-4" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Texts */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block">
                            {language === 'ky' ? 'Билдирүүнүн тексти (Кыргызча):' : 'Текст объявления (Кыргызский):'}
                          </label>
                          <textarea
                            rows={3}
                            value={settingsForm.announcement?.text?.ky || ''}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                announcement: {
                                  ...settingsForm.announcement!,
                                  text: { ...settingsForm.announcement!.text, ky: e.target.value }
                                }
                              })
                            }
                            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                            placeholder="Жаңы 2025-2026 окуу жылына карата календардык пландар жаңыланды!"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block">
                            {language === 'ky' ? 'Билдирүүнүн тексти (Орусча):' : 'Текст объявления (Русский):'}
                          </label>
                          <textarea
                            rows={3}
                            value={settingsForm.announcement?.text?.ru || ''}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                announcement: {
                                  ...settingsForm.announcement!,
                                  text: { ...settingsForm.announcement!.text, ru: e.target.value }
                                }
                              })
                            }
                            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                            placeholder="Календарные планы на новый 2025-2026 учебный год обновлены!"
                          />
                        </div>
                      </div>

                      {/* Live Preview */}
                      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-2 mt-4">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {language === 'ky' ? 'Сайттагы жандуу алдын ала көрүнүшү:' : 'Предпросмотр баннера на сайте:'}
                        </p>
                        {settingsForm.announcement?.enabled ? (
                          <div
                            className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 ${
                              settingsForm.announcement?.type === 'warning'
                                ? 'bg-amber-50 border-amber-300 text-amber-900'
                                : settingsForm.announcement?.type === 'success'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : 'bg-blue-50 border-blue-300 text-blue-900'
                            }`}
                          >
                            <Megaphone className="w-4 h-4 shrink-0" />
                            <span>
                              {language === 'ky'
                                ? settingsForm.announcement?.text?.ky || 'Кулактандыруу тексти...'
                                : settingsForm.announcement?.text?.ru || 'Текст объявления...'}
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-200/60 rounded-xl text-slate-500 italic text-center">
                            {language === 'ky' ? 'Баннер өчүрүлгөн (сайтта көрсөтүлбөйт)' : 'Баннер выключен (не отображается на сайте)'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. LICENSES & WATERMARK PROTECTION */}
                {activeSettingsSection === 'license' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                        <span>{language === 'ky' ? 'Демейки лицензия жана суу белгиси (Watermark)' : 'Параметры лицензий и водяного знака'}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {language === 'ky'
                          ? 'Жаңы сатылып алынган материалдарга автоматтык түрдө коюлуучу эрежелер'
                          : 'Правила, автоматически применяемые к новым покупкам'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Демейки басып чыгаруу лимити (Print Limit):' : 'Лимит печати по умолчанию (копий):'}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={settingsForm.defaultPrintLimit || 1}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, defaultPrintLimit: Number(e.target.value) })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                        />
                        <p className="text-[10px] text-slate-500">
                          {language === 'ky' ? 'Сатып алуучу 1 лицензия менен канча жолу басып чыгара алат (сунушталат: 1)' : 'Сколько раз покупатель может распечатать материал (рекомендуется: 1)'}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Демейки кирүү мөөнөтү (күндөрдө):' : 'Срок действия лицензии по умолчанию (дни):'}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={3650}
                          value={settingsForm.defaultAccessDays || 365}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, defaultAccessDays: Number(e.target.value) })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                        />
                        <p className="text-[10px] text-slate-500">
                          {language === 'ky' ? '365 күн = 1 жылдык толук окуу жылы' : '365 дней = 1 полный учебный год'}
                        </p>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Суу белгисиндеги автордук эскертүү тексти (Кыргызча):' : 'Текст водяного знака при печати (Кыргызский):'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.watermarkText?.ky || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              watermarkText: { ...settingsForm.watermarkText, ky: e.target.value }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                          placeholder="ЛИЦЕНЗИЯЛЫК МАТЕРИАЛ • БАШКАЛАРГА ТАРАТУУГА ТЫЮУ САЛЫНАТ"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Суу белгисиндеги автордук эскертүү тексти (Орусча):' : 'Текст водяного знака при печати (Русский):'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.watermarkText?.ru || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              watermarkText: { ...settingsForm.watermarkText, ru: e.target.value }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                          placeholder="ЛИЦЕНЗИОННЫЙ МАТЕРИАЛ • РАСПРОСТРАНЕНИЕ ЗАПРЕЩЕНО"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. BANK REQUISITES */}
                {activeSettingsSection === 'banks' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-indigo-600" />
                          <span>{language === 'ky' ? 'Кыргызстандын банктары жана капчыктары' : 'Реквизиты банков и кошельков Кыргызстана'}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {language === 'ky'
                            ? 'Сатып алуучуларга көрсөтүлүүчү эсептер, карта номерлери жана төлөм нускамалары'
                            : 'Отображаются в модальном окне оформления заказа'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCustomBank}
                        className="px-4 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{language === 'ky' ? 'Жаңы банк кошуу' : 'Добавить банк'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {settingsForm.bankRequisites?.map((bank, index) => (
                        <div
                          key={bank.id || index}
                          className={`p-5 rounded-2xl border transition-all ${
                            bank.enabled
                              ? 'bg-slate-50 border-slate-300 shadow-xs'
                              : 'bg-slate-100/60 border-dashed border-slate-300 opacity-60'
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${bank.badgeColor || 'bg-slate-800 text-white'}`}>
                                {bank.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Enable / Disable Toggle */}
                              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                <span className="text-[10px] font-bold text-slate-600">
                                  {bank.enabled
                                    ? language === 'ky' ? 'Күйгүзүлгөн' : 'Вкл'
                                    : language === 'ky' ? 'Өчүрүлгөн' : 'Выкл'}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={bank.enabled}
                                  onChange={() => handleToggleBank(bank.id)}
                                  className="w-4 h-4 accent-indigo-600 rounded"
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => handleRemoveBank(bank.id)}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                title="Өчүрүү"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Bank Form Fields */}
                          <div className="space-y-3">
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                {language === 'ky' ? 'Банктын / Капчыктын аталышы:' : 'Название банка / сервиса:'}
                              </label>
                              <input
                                type="text"
                                value={bank.name}
                                onChange={(e) => handleBankFieldChange(bank.id, 'name', e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                                placeholder="MBank"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                {language === 'ky' ? 'Эсеп / Карта / Телефон номери:' : 'Номер карты / счета / телефона:'}
                              </label>
                              <input
                                type="text"
                                value={bank.accountNumber}
                                onChange={(e) => handleBankFieldChange(bank.id, 'accountNumber', e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-indigo-900 tracking-wider"
                                placeholder="9417 0000 0000 0000 же +996 555 123 456"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                {language === 'ky' ? 'Алуучунун аты-жөнү (ФИО):' : 'ФИО получателя:'}
                              </label>
                              <input
                                type="text"
                                value={bank.recipientName}
                                onChange={(e) => handleBankFieldChange(bank.id, 'recipientName', e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900"
                                placeholder="Гулмира Ж."
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                {language === 'ky' ? 'Төлөөчүгө нускама:' : 'Инструкция для плательщика:'}
                              </label>
                              <input
                                type="text"
                                value={bank.instructions?.ky || ''}
                                onChange={(e) =>
                                  handleBankFieldChange(bank.id, 'instructions', {
                                    ...bank.instructions,
                                    ky: e.target.value,
                                    ru: bank.instructions?.ru || e.target.value
                                  })
                                }
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-[11px]"
                                placeholder="Котормонун комментарийине өзүңүздүн Email жазыңыз"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. FOOTER / ТӨМӨНКҮ ПАНЕЛЬ ОРНОТУУЛАРЫ */}
                {activeSettingsSection === 'footer' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                          <PanelBottom className="w-5 h-5 text-indigo-600" />
                          <span>{language === 'ky' ? 'Төмөнкү панелдин орнотуулары (Подвал сайта)' : 'Настройки нижней панели (Подвал сайта)'}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {language === 'ky'
                            ? 'Сайттын эң төмөнкү бөлүгүндөгү сүрөттөмө, байланыштар, дарек жана автордук укук жазуулары'
                            : 'Описание, контакты, адрес, копирайт и ссылки в самом низу платформы'}
                        </p>
                      </div>
                    </div>

                    {/* Footer description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Төмөнкү панелдеги кыскача сүрөттөмө (Кыргызча):' : 'Текст описания в подвале (Кыргызский):'}
                        </label>
                        <textarea
                          rows={3}
                          value={settingsForm.footer?.description?.ky || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              footer: {
                                ...settingsForm.footer,
                                description: {
                                  ky: e.target.value,
                                  ru: settingsForm.footer?.description?.ru || e.target.value
                                }
                              }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                          placeholder="Кыргызстандын башталгыч жана орто мектеп мугалимдери үчүн автордук окуу куралдарынын расмий корголгон онлайн платформасы."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Төмөнкү панелдеги кыскача сүрөттөмө (Орусча):' : 'Текст описания в подвале (Русский):'}
                        </label>
                        <textarea
                          rows={3}
                          value={settingsForm.footer?.description?.ru || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              footer: {
                                ...settingsForm.footer,
                                description: {
                                  ky: settingsForm.footer?.description?.ky || e.target.value,
                                  ru: e.target.value
                                }
                              }
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                          placeholder="Официальная защищенная платформа авторских методических пособий для учителей школ Кыргызстана."
                        />
                      </div>
                    </div>

                    {/* Author Badge & City/Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Автордун төш белгиси / Званиеси:' : 'Бейдж / Звание автора в подвале:'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.footer?.authorBadge?.ky || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              footer: {
                                ...settingsForm.footer,
                                authorBadge: {
                                  ky: e.target.value,
                                  ru: settingsForm.footer?.authorBadge?.ru || e.target.value
                                }
                              }
                            })
                          }
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                          placeholder="КР Билим берүү отличниги"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Шаар / Регион (Дарек):' : 'Город / Регион (Адрес):'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.footer?.address?.ky || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              footer: {
                                ...settingsForm.footer,
                                address: {
                                  ky: e.target.value,
                                  ru: settingsForm.footer?.address?.ru || e.target.value
                                }
                              }
                            })
                          }
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                          placeholder="Бишкек, Кыргызстан"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">
                          {language === 'ky' ? 'Автордук укук эскертүүсү (Копирайт):' : 'Копирайт / Все права защищены:'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.footer?.copyrightText?.ky || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              footer: {
                                ...settingsForm.footer,
                                copyrightText: {
                                  ky: e.target.value,
                                  ru: settingsForm.footer?.copyrightText?.ru || e.target.value
                                }
                              }
                            })
                          }
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                          placeholder="Бардык укуктар корголгон."
                        />
                      </div>
                    </div>

                    {/* Law Protection Note */}
                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-700 block">
                        {language === 'ky' ? 'Мыйзамдык коргоо эскертүүсү:' : 'Правовая сноска о защите авторских прав:'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.footer?.lawNote?.ky || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            footer: {
                              ...settingsForm.footer,
                              lawNote: {
                                ky: e.target.value,
                                ru: settingsForm.footer?.lawNote?.ru || e.target.value
                              }
                            }
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                        placeholder="КР Автордук укук жөнүндө мыйзамы менен корголгон"
                      />
                    </div>

                    {/* Switches for Footer Elements */}
                    <div className="border-t border-slate-100 pt-4">
                      <label className="font-bold text-slate-700 text-xs block mb-3">
                        {language === 'ky' ? 'Төмөнкү панелде көрсөтүлүүчү блоктор:' : 'Отображаемые блоки в нижней панели:'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={settingsForm.footer?.showCategories !== false}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                footer: {
                                  ...settingsForm.footer,
                                  showCategories: e.target.checked
                                }
                              })
                            }
                            className="w-4 h-4 accent-indigo-600 rounded"
                          />
                          <span className="font-bold text-slate-800">
                            {language === 'ky' ? 'Категориялар блогу' : 'Блок категорий'}
                          </span>
                        </label>

                        <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={settingsForm.footer?.showContacts !== false}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                footer: {
                                  ...settingsForm.footer,
                                  showContacts: e.target.checked
                                }
                              })
                            }
                            className="w-4 h-4 accent-indigo-600 rounded"
                          />
                          <span className="font-bold text-slate-800">
                            {language === 'ky' ? 'Байланыштар блогу' : 'Блок контактов'}
                          </span>
                        </label>

                        <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={settingsForm.footer?.showProtectionNote !== false}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                footer: {
                                  ...settingsForm.footer,
                                  showProtectionNote: e.target.checked
                                }
                              })
                            }
                            className="w-4 h-4 accent-indigo-600 rounded"
                          />
                          <span className="font-bold text-slate-800">
                            {language === 'ky' ? 'Суу белгисинин эскертүүсү' : 'Сноска водяного знака'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* LIVE PREVIEW OF FOOTER */}
                    <div className="border-t border-slate-100 pt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{language === 'ky' ? 'Төмөнкү панелдин жандуу алдын ала көрүнүшү (Live Preview):' : 'Живой предпросмотр подвала (Live Preview):'}</span>
                        </span>
                        <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                          {language === 'ky' ? 'Формадан дароо жаңыланат' : 'Обновляется на лету'}
                        </span>
                      </div>

                      {/* Mini Preview Box */}
                      <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 text-xs shadow-inner space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
                          <div>
                            <div className="flex items-center gap-2 font-serif font-black text-white text-sm mb-1">
                              <BookOpen className="w-4 h-4 text-indigo-400" />
                              <span>{settingsForm.siteName?.[language] || settingsForm.siteName?.ky || 'БИЛИМ МАТЕРИАЛДАРЫ'}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 max-w-sm">
                              {settingsForm.footer?.description?.[language] ||
                                settingsForm.footer?.description?.ky ||
                                settingsForm.siteDescription?.[language] ||
                                settingsForm.siteDescription?.ky ||
                                'Автордук усулдук материалдар онлайн платформасы.'}
                            </p>
                            <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-amber-400 bg-slate-800 px-2 py-1 rounded-lg">
                              <ShieldCheck className="w-3 h-3" />
                              <span>{settingsForm.authorName || 'Гулмира Жээнтаева'} • {settingsForm.footer?.authorBadge?.[language] || settingsForm.footer?.authorBadge?.ky || 'КР Билим берүү отличниги'}</span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-400 space-y-1">
                            <p className="font-bold text-white">{language === 'ky' ? 'Байланыш:' : 'Контакты:'}</p>
                            <p className="text-slate-300 font-mono">{settingsForm.contactEmail || 'jeentaevagulmira@gmail.com'}</p>
                            <p className="text-slate-300 font-mono">{settingsForm.contactPhone || '+996 555 123 456'}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
                          <span>
                            © 2025-2026 {settingsForm.siteName?.[language] || 'БИЛИМ МАТЕРИАЛДАРЫ'} • {settingsForm.authorName || 'Гулмира Жээнтаева'}. {settingsForm.footer?.copyrightText?.[language] || 'Бардык укуктар корголгон.'}
                          </span>
                          <span>{settingsForm.footer?.address?.[language] || 'Бишкек, Кыргызстан'} • {settingsForm.footer?.lawNote?.[language] || 'КР Автордук укук жөнүндө мыйзамы менен корголгон'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Save Bar */}
                <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                      <Save className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {language === 'ky' ? 'Өзгөртүүлөрдү серверде сактоо' : 'Сохранить все изменения на сервере'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {language === 'ky'
                          ? 'Бардык өзгөртүүлөр дароо колдонуучуларга жеткиликтүү болот жана коопсуздук журналына жазылат.'
                          : 'Все параметры вступят в силу немедленно и будут зафиксированы в журнале аудита.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    disabled={savingSettings}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {savingSettings
                        ? language === 'ky'
                          ? 'Сакталууда...'
                          : 'Сохранение...'
                        : language === 'ky'
                        ? 'Бардык орнотууларды сактоо'
                        : 'Сохранить все настройки'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Material Modal */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingMaterial ? 'Материалды өзгөртүү' : 'Жаңы окуу материалын кошуу'}
              </h3>
              <button
                onClick={() => setShowAddMaterialModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Аталышы (Кыргызча):</label>
                  <input
                    type="text"
                    required
                    value={formMaterial.titleKy}
                    onChange={(e) => setFormMaterial({ ...formMaterial, titleKy: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                    placeholder="мисалы: 2-класс Математика боюнча календардык план"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Название (Русский):</label>
                  <input
                    type="text"
                    required
                    value={formMaterial.titleRu}
                    onChange={(e) => setFormMaterial({ ...formMaterial, titleRu: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                    placeholder="например: Календарный план по математике"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Категория:</label>
                  <select
                    value={formMaterial.category}
                    onChange={(e) => setFormMaterial({ ...formMaterial, category: e.target.value as any })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="calendar_plans">Календардык план</option>
                    <option value="primary_school">Башталгыч класс</option>
                    <option value="math">Математика</option>
                    <option value="kyrgyz_lang">Кыргыз тили</option>
                    <option value="russian_lang">Орус тили</option>
                    <option value="worksheets">Жумуш барактары</option>
                    <option value="tests">Тесттер</option>
                    <option value="speed_reading">Тез окуу</option>
                    <option value="preschool">Даярдоо</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Класс:</label>
                  <input
                    type="text"
                    value={formMaterial.grade}
                    onChange={(e) => setFormMaterial({ ...formMaterial, grade: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                    placeholder="2-класс"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Баасы (сом):</label>
                  <input
                    type="number"
                    value={formMaterial.price}
                    onChange={(e) => setFormMaterial({ ...formMaterial, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Беттер саны:</label>
                  <input
                    type="number"
                    value={formMaterial.pageCount}
                    onChange={(e) => setFormMaterial({ ...formMaterial, pageCount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Обложканын сүрөтү (URL):</label>
                <input
                  type="text"
                  value={formMaterial.coverImage}
                  onChange={(e) => setFormMaterial({ ...formMaterial, coverImage: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Кыскача түшүндүрмө (Кыргызча/Орусча):</label>
                <textarea
                  rows={2}
                  value={formMaterial.descKy}
                  onChange={(e) => setFormMaterial({ ...formMaterial, descKy: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  placeholder="Материал жөнүндө толук маалымат..."
                />
              </div>

              {/* Protected Page Content */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900">Корголгон мазмуну (1-барак):</p>
                <input
                  type="text"
                  value={formMaterial.page1Title}
                  onChange={(e) => setFormMaterial({ ...formMaterial, page1Title: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded text-xs"
                  placeholder="Барактын темасы"
                />
                <textarea
                  rows={4}
                  value={formMaterial.page1Content}
                  onChange={(e) => setFormMaterial({ ...formMaterial, page1Content: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded text-xs font-mono"
                  placeholder="Бул жерге сабактын тексти, тапшырмалар, тест суроолору жазылат..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg"
                >
                  Жокко чыгаруу
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Сактоо
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
