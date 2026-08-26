export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
  phone?: string;
  school?: string;
}

export type MaterialCategory =
  | 'calendar_plans'
  | 'primary_school'
  | 'math'
  | 'kyrgyz_lang'
  | 'russian_lang'
  | 'preschool'
  | 'worksheets'
  | 'tests'
  | 'speed_reading'
  | 'developmental';

export interface MaterialPage {
  pageNumber: number;
  title: string;
  content: string;
  type?: 'text' | 'table' | 'exercise' | 'lesson_plan' | 'worksheet';
  meta?: Record<string, any>;
}

export interface Material {
  id: string;
  title: {
    ky: string;
    ru: string;
  };
  category: MaterialCategory;
  grade: string; // e.g., "1-класс / 1 класс", "2-класс"
  subject: {
    ky: string;
    ru: string;
  };
  academicYear: string; // "2025-2026"
  pageCount: number;
  price: number; // in KGS (сом)
  coverImage: string;
  description: {
    ky: string;
    ru: string;
  };
  samplePagesCount: number; // number of pages visible before purchase
  defaultPrintLimit: number; // default: 1
  defaultAccessDays: number; // 0 for unlimited, or e.g. 365
  authorName: string; // "Гулмира Жээнтаева"
  isPublished?: boolean; // If false, hidden from general users catalog
  fileUrl?: string; // Protected file document / payload
  fileName?: string;
  fileType?: string;
  pages?: MaterialPage[]; // Protected pages content (server-side only returned with active license)
  createdAt: string;
  updatedAt: string;
}

export type LicenseStatus = 'active' | 'expired' | 'revoked';

export interface License {
  id: string; // e.g. "LICENSE-2026-000001"
  userId: string;
  userEmail: string;
  userName: string;
  materialId: string;
  materialTitle: string;
  purchaseId: string;
  purchaseDate: string;
  expirationDate: string | null; // ISO string or null for lifetime
  printLimit: number;
  printUsed: number;
  status: LicenseStatus;
  lastPrintedAt?: string;
  watermarkNote?: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentProvider =
  | 'mbank'
  | 'odengi'
  | 'megapay'
  | 'bakai'
  | 'optimabank'
  | 'demirbank'
  | 'finca'
  | 'aiyl'
  | 'keremet'
  | 'rsk'
  | 'halyk'
  | 'elsom'
  | 'elcart'
  | 'visa'
  | 'bank_transfer'
  | 'mock_payment';

export interface PaymentProof {
  receiptNumber?: string;
  senderName?: string;
  senderPhone?: string;
  senderCardOrAccount?: string;
  screenshotUrl?: string;
  notes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  userEmail: string;
  materialId: string;
  materialTitle: string;
  amount: number;
  currency: 'KGS';
  provider: PaymentProvider;
  status: PaymentStatus;
  createdAt: string;
  completedAt?: string;
  transactionId: string;
  licenseId?: string;
  proof?: PaymentProof;
}

export type AuditAction =
  | 'AUTH_LOGIN'
  | 'AUTH_REGISTER'
  | 'AUTH_LOGOUT'
  | 'MATERIAL_VIEW_SAMPLE'
  | 'MATERIAL_ACCESS_ATTEMPT'
  | 'MATERIAL_ACCESS_GRANTED'
  | 'MATERIAL_ACCESS_DENIED'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_COMPLETED'
  | 'LICENSE_CREATED'
  | 'PRINT_REQUESTED'
  | 'PRINT_SUCCESS'
  | 'PRINT_BLOCKED_LIMIT_EXCEEDED'
  | 'PRINT_RESTORED_BY_ADMIN'
  | 'LICENSE_STATUS_CHANGED'
  | 'USER_BLOCKED'
  | 'USER_UNBLOCKED'
  | 'MATERIAL_CREATED'
  | 'MATERIAL_UPDATED'
  | 'MATERIAL_DELETED'
  | 'PORTAL_SETTINGS_UPDATED';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: AuditAction;
  materialId?: string;
  materialTitle?: string;
  licenseId?: string;
  details?: string;
  ip?: string;
  userAgent?: string;
}

export type Language = 'ky' | 'ru';

export interface BankRequisiteConfig {
  id: string;
  name: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  color?: string;
  accountNumber: string;
  receiver?: string;
  recipientName?: string;
  enabled: boolean;
  instruction?: string;
  instructions?: { ky?: string; ru?: string } | string;
}

export interface FooterSettings {
  description?: {
    ky: string;
    ru: string;
  };
  copyrightText?: {
    ky: string;
    ru: string;
  };
  address?: {
    ky: string;
    ru: string;
  };
  lawNote?: {
    ky: string;
    ru: string;
  };
  authorBadge?: {
    ky: string;
    ru: string;
  };
  showCategories?: boolean;
  showContacts?: boolean;
  showProtectionNote?: boolean;
  socialLinks?: {
    whatsapp?: string;
    telegram?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface PortalSettings {
  siteName?: {
    ky: string;
    ru: string;
  };
  siteDescription?: {
    ky: string;
    ru: string;
  };
  authorName?: string;
  authorTitle?: {
    ky: string;
    ru: string;
  } | string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactTelegram?: string;
  contactEmail?: string;
  logoUrl?: string;
  logoText?: string;
  currency?: string; // e.g. "KGS" or "сом"
  supportedLanguages?: Language[];
  defaultLanguage?: Language;
  termsOfService?: {
    ky: string;
    ru: string;
  };
  supportHours?: {
    ky: string;
    ru: string;
  } | string;
  announcement?: {
    enabled: boolean;
    type: 'info' | 'warning' | 'success';
    text?: { ky: string; ru: string };
    textKy?: string;
    textRu?: string;
  };
  defaultLicense?: {
    printLimit: number;
    accessDays: number;
    watermarkNoteKy?: string;
    watermarkNoteRu?: string;
  };
  defaultPrintLimit?: number;
  defaultAccessDays?: number;
  watermarkText?: {
    ky: string;
    ru: string;
  };
  footer?: FooterSettings;
  bankRequisites: BankRequisiteConfig[];
}
