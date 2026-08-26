import React, { useState, useEffect, useCallback } from 'react';
import { User, Material, Language, License, PortalSettings } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Catalog } from './components/Catalog';
import { HowItWorks } from './components/HowItWorks';
import { MyMaterials } from './components/MyMaterials';
import { AdminPanel } from './components/AdminPanel';
import { MaterialModal } from './components/MaterialModal';
import { PurchaseModal } from './components/PurchaseModal';
import { ProtectedViewer } from './components/ProtectedViewer';
import { AuthModal } from './components/AuthModal';
import { Megaphone, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('ky');
  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [userLicenses, setUserLicenses] = useState<License[]>([]);
  const [portalSettings, setPortalSettings] = useState<PortalSettings | null>(null);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals & Viewer states
  const [selectedMaterialForDetails, setSelectedMaterialForDetails] = useState<Material | null>(null);
  const [selectedMaterialForBuy, setSelectedMaterialForBuy] = useState<Material | null>(null);
  const [activeViewerMaterialId, setActiveViewerMaterialId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // Load User & Catalog on Mount
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Check logged in user
      const authData = await api.getMe();
      if (authData?.user) {
        setUser(authData.user);
        // Load user licenses
        const lics = await api.getUserLicenses().catch(() => []);
        setUserLicenses(lics);
      } else {
        setUser(null);
        setUserLicenses([]);
      }

      // 2. Load catalog
      const mats = await api.getMaterials();
      setMaterials(mats);

      // 3. Load Portal Settings
      const settings = await api.getSettings().catch(() => null);
      if (settings) {
        setPortalSettings(settings);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Refresh licenses when purchase happens or print occurs
  const refreshUserLicenses = async () => {
    if (!user) return;
    try {
      const lics = await api.getUserLicenses();
      setUserLicenses(lics);
      const mats = await api.getMaterials();
      setMaterials(mats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'ky' ? 'ru' : 'ky'));
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setAuthModalOpen(false);
    refreshUserLicenses();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setUserLicenses([]);
    setCurrentTab('catalog');
    api.getMaterials().then(setMaterials);
  };

  const handleOpenViewer = (materialId: string) => {
    setActiveViewerMaterialId(materialId);
  };

  const handlePurchaseSuccess = (licenseId: string) => {
    refreshUserLicenses();
    if (selectedMaterialForBuy) {
      setActiveViewerMaterialId(selectedMaterialForBuy.id);
    }
    setSelectedMaterialForBuy(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Announcement Banner (if configured and active) */}
      {portalSettings?.announcement?.enabled && !dismissedBanner && (
        <div
          id="portal-announcement-banner"
          className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-between shadow-xs ${
            portalSettings.announcement.type === 'warning'
              ? 'bg-amber-500 text-amber-950'
              : portalSettings.announcement.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-700 text-white'
          }`}
        >
          <div className="max-w-7xl mx-auto flex-1 flex items-center justify-center gap-2 text-center">
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>
              {portalSettings.announcement.text?.[language] ||
                portalSettings.announcement.text?.ky ||
                portalSettings.announcement.textKy ||
                ''}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDismissedBanner(true)}
            className="p-1 hover:bg-black/10 rounded-lg transition-colors ml-2"
            title="Жабуу"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Navigation */}
      <Header
        user={user}
        language={language}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onToggleLanguage={handleToggleLanguage}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        userLicensesCount={userLicenses.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'catalog' && (
          <Catalog
            materials={materials}
            language={language}
            onOpenDetails={setSelectedMaterialForDetails}
            onBuy={setSelectedMaterialForBuy}
            onOpenViewer={handleOpenViewer}
            onGoToHowItWorks={() => setCurrentTab('how-it-works')}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorks
            language={language}
            onGoToCatalog={() => setCurrentTab('catalog')}
          />
        )}

        {currentTab === 'my-materials' && (
          <MyMaterials
            user={user}
            language={language}
            onOpenViewer={handleOpenViewer}
            onGoToCatalog={() => setCurrentTab('catalog')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPanel
            currentUser={user}
            language={language}
            onSettingsUpdated={(updated) => setPortalSettings(updated)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer language={language} portalSettings={portalSettings} />

      {/* Detail Material Modal */}
      {selectedMaterialForDetails && (
        <MaterialModal
          material={selectedMaterialForDetails}
          language={language}
          onClose={() => setSelectedMaterialForDetails(null)}
          onBuy={(mat) => {
            setSelectedMaterialForDetails(null);
            setSelectedMaterialForBuy(mat);
          }}
          onOpenViewer={(id) => {
            setSelectedMaterialForDetails(null);
            handleOpenViewer(id);
          }}
        />
      )}

      {/* Purchase Checkout Modal */}
      {selectedMaterialForBuy && (
        <PurchaseModal
          material={selectedMaterialForBuy}
          user={user}
          language={language}
          onClose={() => setSelectedMaterialForBuy(null)}
          onSuccess={handlePurchaseSuccess}
          onOpenAuth={() => {
            setAuthInitialMode('login');
            setAuthModalOpen(true);
          }}
        />
      )}

      {/* Protected Document Viewer (Core Security Engine) */}
      {activeViewerMaterialId && (
        <ProtectedViewer
          materialId={activeViewerMaterialId}
          user={user}
          language={language}
          onClose={() => setActiveViewerMaterialId(null)}
          onRefreshLicenses={refreshUserLicenses}
        />
      )}

      {/* Authentication Modal */}
      {authModalOpen && (
        <AuthModal
          initialMode={authInitialMode}
          language={language}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
