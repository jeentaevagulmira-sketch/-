import fs from 'fs';
import path from 'path';
import {
  User,
  Material,
  License,
  Purchase,
  AuditLog,
  AuditAction,
  PortalSettings,
  BankRequisiteConfig
} from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Collection file paths
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const MATERIALS_FILE = path.join(DATA_DIR, 'materials.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PURCHASES_FILE = path.join(DATA_DIR, 'purchases.json');
const LICENSES_FILE = path.join(DATA_DIR, 'licenses.json');
const PRINT_LOGS_FILE = path.join(DATA_DIR, 'print_logs.json');

// Ensure data dir exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    ensureDataDir();
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filePath, fallback);
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    ensureDataDir();
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// ==========================================
// SEED DATA DEFAULTS
// ==========================================
const DEFAULT_USERS: User[] = [
  {
    id: 'user_admin_01',
    email: 'jeentaevagulmira@gmail.com',
    name: 'Гулмира Жээнтаева (Автор & Администратор)',
    role: 'ADMIN',
    status: 'active',
    createdAt: '2025-01-10T08:00:00.000Z',
    phone: '+996 700 123456',
    school: 'Бишкек ш. №5 Улуттук мектеп-гимназия'
  },
  {
    id: 'user_teacher_01',
    email: 'ainura.teacher@bilim.kg',
    name: 'Айнура Исмаилова (Башталгыч класс мугалими)',
    role: 'USER',
    status: 'active',
    createdAt: '2025-02-01T10:30:00.000Z',
    phone: '+996 555 987654',
    school: 'Ош ш. №14 орто мектеби'
  },
  {
    id: 'user_teacher_02',
    email: 'bakyt.school@mail.ru',
    name: 'Бакыт Токтогулов',
    role: 'USER',
    status: 'active',
    createdAt: '2025-02-15T14:20:00.000Z',
    phone: '+996 777 443322',
    school: 'Каракол ш. Токтогул атындагы мектеп'
  }
];

const DEFAULT_SETTINGS: PortalSettings = {
  siteName: {
    ky: 'Билим Материалдары',
    ru: 'Билим Материалдары'
  },
  siteDescription: {
    ky: 'Кыргызстандын башталгыч жана орто мектеп мугалимдери үчүн автордук окуу куралдарынын, календардык пландарынын жана тесттеринин расмий корголгон онлайн платформасы.',
    ru: 'Официальная защищенная платформа авторских методических пособий, календарных планов и дидактических материалов для учителей школ Кыргызстана.'
  },
  authorName: 'Гулмира Жээнтаева',
  authorTitle: {
    ky: 'Башталгыч класс мугалими, усулчу, автор, КР Билим берүү отличниги',
    ru: 'Учитель начальных классов, методист, автор, Отличник образования КР'
  },
  contactPhone: '+996 700 123 456',
  contactWhatsApp: '+996 700 123 456',
  contactTelegram: '@jeentaeva_gulmira',
  contactEmail: 'jeentaevagulmira@gmail.com',
  logoUrl: '',
  logoText: 'БИЛИМ',
  currency: 'KGS',
  supportedLanguages: ['ky', 'ru'],
  defaultLanguage: 'ky',
  termsOfService: {
    ky: `1. ЖАЛПЫ ЖОБОЛОР
Бул платформада жайгаштырылган бардык окуу-методикалык материалдар, календардык пландар, тесттер жана жумушчу баракчалар автор Гулмира Жээнтаеванын интеллектуалдык менчиги болуп саналат.

2. ЛИЦЕНЗИЯ ЖАНА ПАЙДАЛАНУУ ЭРЕЖЕСИ
Сатып алынган материалдар жеке мугалимдин өзүнүн сабактарында колдонуусу үчүн гана берилет.
Материалдарды башка мугалимдерге, WhatsApp/Telegram тайпаларына, социалдык тармактарга же интернет сайттарга таратууга КАТУУ ТЫЮУ САЛЫНАТ.

3. ПЕЧАТЬ ЖАНА СУУ БЕЛГИСИ
Ар бир баракка сатып алуучунун аты-жөнү, Email дареги жана жеке лицензия номери автоматтык түрдө коргоочу суу белгиси (Watermark) катары басылат. Печать аракети администратор белгилеген лимит боюнча жүргүзүлөт.

4. ЖООПКЕРЧИЛИК
Автордук укукту бузган жана материалдарды мыйзамсыз тараткан учурда Кыргыз Республикасынын Автордук жана чектеш укуктар жөнүндө мыйзамына ылайык жоопкерчиликке тартылат.`,
    ru: `1. ОБЩИЕ ПОЛОЖЕНИЯ
Все учебно-методические пособия, календарно-тематические планы, тесты и рабочие тетради на платформе являются интеллектуальной собственностью автора Гульмиры Жээнтаевой.

2. ПРАВИЛА ИСПОЛЬЗОВАНИЯ ЛИЦЕНЗИИ
Приобретенные материалы предназначены исключительно для личного использования педагогом на своих уроках.
Запрещается передача, перепродажа или публикация файлов в мессенджерах (WhatsApp, Telegram), соцсетях или на открытых веб-ресурсах.

3. ПЕЧАТЬ И ВОДЯНОЙ ЗНАК
При печати на каждую страницу наносится защитный водяной знак с ФИО покупателя, Email и уникальным номером лицензии. Печать контролируется установленным лимитом.

4. ОТВЕТСТВЕННОСТЬ
Нарушение авторских прав влечет ответственность в соответствии с законодательством Кыргызской Республики об авторском праве.`
  },
  supportHours: {
    ky: 'Дүйшөмбү - Ишемби: 08:30 - 20:00',
    ru: 'Понедельник - Суббота: 08:30 - 20:00'
  },
  announcement: {
    enabled: true,
    type: 'info',
    textKy: 'Урматтуу мугалимдер! 2025-2026-окуу жылына карата жаңыланган календардык пландар жана сабак иштелмелери жүктөлдү.',
    textRu: 'Уважаемые педагоги! Обновлённые календарные планы и поурочные разработки на 2025-2026 учебный год доступны к покупке.'
  },
  defaultLicense: {
    printLimit: 1,
    accessDays: 365,
    watermarkNoteKy: 'Лицензия 1 колдонуучу үчүн гана. Таратууга жана көчүрүүгө тыюу салынат.',
    watermarkNoteRu: 'Лицензия предназначена только для одного пользователя. Копирование и распространение запрещено.'
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
      whatsapp: '+996 700 123 456',
      telegram: '@jeentaeva_gulmira',
      instagram: '',
      youtube: ''
    }
  },
  bankRequisites: [
    {
      id: 'mbank',
      name: 'MBank (КБ Кыргызстан)',
      sub: 'Тез которуу / QR',
      badge: 'MB',
      badgeColor: 'bg-red-700 text-white',
      accountNumber: '+996 700 123 456',
      recipientName: 'Жээнтаева Гулмира (MBank)',
      receiver: 'Жээнтаева Гулмира (MBank)',
      enabled: true,
      instructions: {
        ky: 'MBank тиркемесинде «Которуу» бөлүмүн тандап, көрсөтүлгөн телефон номерине акча салыңыз.',
        ru: 'В приложении MBank выберите «Перевод» и отправьте сумму по номеру телефона.'
      }
    },
    {
      id: 'bakai',
      name: 'Bakai Bank (Бакай Банк)',
      sub: 'Bakai24 / Элкарт',
      badge: 'BB',
      badgeColor: 'bg-indigo-700 text-white',
      accountNumber: '1240020011223344',
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
    }
  ]
};

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'mat_plan_2grade',
    title: {
      ky: '2-класс: Математика жана Кыргыз тили боюнча календардык-тематикалык план (жаңы стандарт)',
      ru: '2 класс: Календарно-тематический план по Математике и Кыргызскому языку (новый стандарт)'
    },
    category: 'calendar_plans',
    grade: '2-класс',
    subject: {
      ky: 'Математика / Кыргыз тили',
      ru: 'Математика / Кыргызский язык'
    },
    academicYear: '2025-2026',
    pageCount: 38,
    price: 350,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    description: {
      ky: 'КР Билим берүү жана илим министрлигинин жаңы стандартына ылайык иштелип чыккан толук 2025-2026-окуу жылынын календардык-тематикалык планы. Бардык сааттар, компетенциялар жана баалоо критерийлери так көрсөтүлгөн.',
      ru: 'Полный календарно-тематический план на весь учебный год 2025-2026 в соответствии с новыми стандартами МОиН КР. Включает разбивки часов, цели, ключевые компетенции и дескрипторы оценивания.'
    },
    samplePagesCount: 2,
    defaultPrintLimit: 1,
    defaultAccessDays: 365,
    authorName: 'Гулмира Жээнтаева',
    isPublished: true,
    createdAt: '2025-01-15T09:00:00.000Z',
    updatedAt: '2025-01-15T09:00:00.000Z',
    pages: [
      {
        pageNumber: 1,
        title: 'Титулдук барак жана түшүндүрмө кат',
        type: 'lesson_plan',
        content: `КЫРГЫЗ РЕСПУБЛИКАСЫНЫН БИЛИМ БЕРҮҮ ЖАНА ИЛИМ МИНИСТРЛИГИ
2-КЛАСС ҮЧҮН КАЛЕНДАРДЫК-ТЕМАТИКАЛЫК ПЛАН
Сабак: Математика жана Кыргыз тили (Окуу)
Окуу жылы: 2025-2026
Автор-түзүүчү: Гулмира Жээнтаева

ТҮШҮНДҮРМӨ КАТ:
Бул календардык план КР Билим берүү жана илим министрлиги бекиткен Базистик окуу планынын жана Предметтик стандартынын негизинде түзүлдү.
Жумалык саат жүктөмү: Математика - 4 саат (жылына 136 саат), Кыргыз тили - 4 саат (жылына 136 саат).`
      },
      {
        pageNumber: 2,
        title: 'I Чейрек. 1-4-жумалардын тематикалык бөлүштүрүлүшү',
        type: 'table',
        content: `№ | Тема | Сааты | Мөөнөтү | Күтүлүүчү натыйжалар жана компетенциялар
1 | 1-класста өтүлгөндөрдү кайталоо. 1ден 20га чейинки сандар. | 1 | 02.09 | Сандардын курамын, катарын билет (НК1, ПК1)
2 | Ондуктар жана бирдиктер. 100гө чейин саноо. | 1 | 04.09 | 2 орундуу сандарды окуйт жана жазат (ПК2)
3 | Сандарды салыштыруу (>, <, = белгилери). | 1 | 06.09 | Сандардын чоң-кичинесин аныктайт (ПК1)
4 | Түз сызык, кесинди, шоола. Сызыктардын узундугун ченөө. | 1 | 09.09 | Сызгыч менен кесинди чийет (ПК3)`
      },
      {
        pageNumber: 3,
        title: 'I Чейрек. 5-8-жумалар: Кошуу жана кемитүү амалдары',
        type: 'table',
        content: `5 | 100дүн ичинде ондуктан аттабай кошуу жана кемитүү. | 1 | 11.09 | Оозеки жана жазуу түрүндө эсептейт.
6 | Маселе жана анын түзүлүшү: шарты, суроосу, чыгарылышы, жообу. | 1 | 13.09 | Маселенин кыска шартын түзөт.
7 | Кашалуу туюнтмалар. Амалдардын аткарылыш тартиби. | 1 | 16.09 | Кашаанын ичиндеги амалды биринчи аткарат.
8 | Чейректик текшерүү иши №1. | 1 | 18.09 | Өтүлгөн материал боюнча билимди бекемдөө.`
      },
      {
        pageNumber: 4,
        title: 'Баалоо критерийлери жана дескрипторлор',
        type: 'text',
        content: `ФОРМАТИВДИК ЖАНА СУММАТИВДИК БААЛООНУН ТАБЛИЦАСЫ:
- "5" (Эң жакшы): Бардык тапшырмаларды өз алдынча, катасыз чыгарат, логикалык ой жүгүртүүсү так.
- "4" (Жакшы): 1-2 майда эреже катасы бар, бирок негизги алгоритмди туура колдонот.
- "3" (Канааттандырарлык): Мугалимдин жетектөөчү суроолору менен гана маселени чыгарат.
Методикалык сунуш: Ар бир теманын аягында окуучулардын кайтарым байланышын уюштуруу зарыл.`
      }
    ]
  },
  {
    id: 'mat_math_worksheets_1grade',
    title: {
      ky: '1-класс үчүн Математикадан 50 автордук жумушчу баракча (Worksheets)',
      ru: '50 авторских рабочих листов по Математике для 1 класса (Worksheets)'
    },
    category: 'worksheets',
    grade: '1-класс',
    subject: {
      ky: 'Математика',
      ru: 'Математика'
    },
    academicYear: '2025-2026',
    pageCount: 50,
    price: 290,
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    description: {
      ky: '1-класстын окуучулары үчүн сандардын курамы, логикалык эсептер, фигуралар жана саноо боюнча кызыктуу сүрөттүү жумуш барактары. Басып чыгарууга жана сабакта колдонууга абдан ыңгайлуу.',
      ru: 'Красочные практические карточки и рабочие листы для первоклассников: состав чисел до 10 и 20, геометрические фигуры, логические лабиринты и текстовые задачки в картинках.'
    },
    samplePagesCount: 2,
    defaultPrintLimit: 1,
    defaultAccessDays: 365,
    authorName: 'Гулмира Жээнтаева',
    isPublished: true,
    createdAt: '2025-01-20T11:00:00.000Z',
    updatedAt: '2025-01-20T11:00:00.000Z',
    pages: [
      {
        pageNumber: 1,
        title: '№1-тапшырма. Сандардын курамы (1ден 10го чейин)',
        type: 'worksheet',
        content: `ЖУМУШЧУ БАРАКЧА №1
Тема: 5 жана 6 сандарынын курамы.
Окуучунун аты-жөнү: ___________________ Дата: ___________

1. Үлгү боюнча бош тегерекчелерге керектүү сандарды жаз:
   5 = 1 + [  ]        5 = 2 + [  ]        5 = 3 + [  ]        5 = 4 + [  ]
   6 = 1 + [  ]        6 = 2 + [  ]        6 = 3 + [  ]        6 = 5 + [  ]

2. Логикалык тапшырма:
   Айгүлдүн 3 алмасы бар эле. Бакыт ага дагы 2 алма берди. Айгүлдө канча алма болду?
   Чыгарылышы: _________________  Жообу: [  ] алма.`
      },
      {
        pageNumber: 2,
        title: '№2-тапшырма. Салыштыруу жана геометриялык фигуралар',
        type: 'worksheet',
        content: `ЖУМУШЧУ БАРАКЧА №2
Тема: Чоң, кичине же барабар белгилерин кой (>, <, =).

1. Туюнтмаларды салыштыр:
   7 + 2 [  ] 10         8 - 3 [  ] 5         4 + 4 [  ] 9 - 1
   6 + 3 [  ] 8          9 - 4 [  ] 6         10 - 2 [  ] 7 + 1

2. Геометриялык фигураларды санап, санын жаз:
   Үч бурчтуктар: [  ] даана
   Төрт бурчтуктар: [  ] даана
   Тегеректер: [  ] даана`
      }
    ]
  },
  {
    id: 'mat_speed_reading_preschool',
    title: {
      ky: 'Тез окуу жана эске тутуу: Мектепке даярдоо жана 1-класс (Автордук тренажер)',
      ru: 'Скорочтение и развитие памяти: Дошкольники и 1 класс (Авторский тренажер)'
    },
    category: 'speed_reading',
    grade: 'Мектепке чейинки / 1-класс',
    subject: {
      ky: 'Тез окуу / Өнүктүрүү',
      ru: 'Скорочтение / Развитие'
    },
    academicYear: '2025-2026',
    pageCount: 42,
    price: 320,
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    description: {
      ky: 'Баланын окуу ылдамдыгын 2-3 эсеге арттыруучу Шульте таблицалары, анаграммалар, көңүл буруу көнүгүүлөрү жана кыска тексттердин жыйнагы.',
      ru: 'Методика скорочтения и концентрации внимания: таблицы Шульте, лабиринты внимания, чтение по слогам и развитие периферического зрения.'
    },
    samplePagesCount: 2,
    defaultPrintLimit: 1,
    defaultAccessDays: 365,
    authorName: 'Гулмира Жээнтаева',
    isPublished: true,
    createdAt: '2025-01-25T14:00:00.000Z',
    updatedAt: '2025-01-25T14:00:00.000Z',
    pages: [
      {
        pageNumber: 1,
        title: 'Шульте таблицалары менен иштөө эрежеси',
        type: 'exercise',
        content: `ТЕЗ ОКУУ ТРЕНАЖЕРУ. 1-САБАК.
Шульте таблицасы 1ден 25ке чейинки чачыранды сандардан турат.
Максаты: Көздүн көрүү бурчун (перифериялык көрүүнү) кеңейтүү жана кунт коюуну күчөтүү.

Көнүгүү тартиби:
1. Көзүңүздү таблицанын так ортосуна коюңуз.
2. Башты кыймылдатпай, көз менен гана 1ден 25ке чейинки сандарды ирети менен табыңыз.
3. Убакытты секундомер менен өлчөңүз (Норма: 30-45 секунд).`
      }
    ]
  },
  {
    id: 'mat_kyrgyz_tests_3grade',
    title: {
      ky: '3-класс: Кыргыз тили боюнча чейректик жана жылдык тесттер жыйнагы',
      ru: '3 класс: Сборник четвертных и годовых тестов по Кыргызскому языку'
    },
    category: 'tests',
    grade: '3-класс',
    subject: {
      ky: 'Кыргыз тили',
      ru: 'Кыргызский язык'
    },
    academicYear: '2025-2026',
    pageCount: 30,
    price: 280,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    description: {
      ky: '3-класстын программасы боюнча 1-4-чейректердин бардык темаларын камтыган даяр 4 варианттагы тесттер жана жооптору.',
      ru: 'Комплексные тесты по кыргызскому языку за 3 класс: грамматика, орфография, части речи и синтаксис. Готовые ключи и варианты.'
    },
    samplePagesCount: 1,
    defaultPrintLimit: 1,
    defaultAccessDays: 365,
    authorName: 'Гулмира Жээнтаева',
    isPublished: true,
    createdAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-02-01T10:00:00.000Z',
    pages: [
      {
        pageNumber: 1,
        title: 'I Чейрек боюнча тест №1 (1-вариант)',
        type: 'exercise',
        content: `КЫРГЫЗ ТИЛИ. 3-КЛАСС. I ЧЕЙРЕК. ТЕСТ №1.

1. Зат атооч кайсы суроолорго жооп берет?
   А) Кандай? Кайсы?
   Б) Ким? Эмне? Кимдер? Эмнелер?
   В) Эмне кылды? Эмне кылып жатат?

2. "Мектеп" деген сөзгө кайсы мүчө уланганда көптүк маанини билдирет?
   А) -тер
   Б) -тор
   В) -тар`
      }
    ]
  }
];

const DEFAULT_LICENSES: License[] = [
  {
    id: 'LICENSE-2026-000001',
    userId: 'user_teacher_01',
    userEmail: 'ainura.teacher@bilim.kg',
    userName: 'Айнура Исмаилова',
    materialId: 'mat_plan_2grade',
    materialTitle: '2-класс: Математика жана Кыргыз тили боюнча календардык-тематикалык план',
    purchaseId: 'purch_init_001',
    purchaseDate: '2025-02-02T10:35:00.000Z',
    expirationDate: '2026-02-02T10:35:00.000Z',
    printLimit: 1,
    printUsed: 0,
    status: 'active',
    watermarkNote: 'Лицензия предназначена только для одного пользователя.'
  }
];

const DEFAULT_PURCHASES: Purchase[] = [
  {
    id: 'purch_init_001',
    userId: 'user_teacher_01',
    userEmail: 'ainura.teacher@bilim.kg',
    materialId: 'mat_plan_2grade',
    materialTitle: '2-класс: Математика жана Кыргыз тили боюнча календардык-тематикалык план',
    amount: 350,
    currency: 'KGS',
    provider: 'mbank',
    status: 'completed',
    createdAt: '2025-02-02T10:34:00.000Z',
    completedAt: '2025-02-02T10:35:00.000Z',
    transactionId: 'MBK-99882211',
    licenseId: 'LICENSE-2026-000001'
  }
];

const DEFAULT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    timestamp: '2025-02-02T10:35:00.000Z',
    userId: 'user_teacher_01',
    userEmail: 'ainura.teacher@bilim.kg',
    action: 'PAYMENT_COMPLETED',
    materialId: 'mat_plan_2grade',
    materialTitle: '2-класс: Календардык план',
    licenseId: 'LICENSE-2026-000001',
    details: 'Оплата 350 KGS через MBank успешно подтверждена вебхуком.',
    ip: '212.112.96.14',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
];

// ==========================================
// DATABASE ENGINE
// ==========================================
class DatabaseStore {
  private users: User[] = [];
  private materials: Material[] = [];
  private settings: PortalSettings = DEFAULT_SETTINGS;
  private licenses: License[] = [];
  private purchases: Purchase[] = [];
  private logs: AuditLog[] = [];
  private licenseSeq = 100;

  constructor() {
    this.init();
  }

  private init() {
    ensureDataDir();
    this.users = readJsonFile<User[]>(USERS_FILE, DEFAULT_USERS);
    this.materials = readJsonFile<Material[]>(MATERIALS_FILE, DEFAULT_MATERIALS);
    this.settings = readJsonFile<PortalSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
    this.licenses = readJsonFile<License[]>(LICENSES_FILE, DEFAULT_LICENSES);
    this.purchases = readJsonFile<Purchase[]>(PURCHASES_FILE, DEFAULT_PURCHASES);
    this.logs = readJsonFile<AuditLog[]>(PRINT_LOGS_FILE, DEFAULT_LOGS);

    // Ensure all materials have isPublished flag
    this.materials.forEach((m) => {
      if (m.isPublished === undefined) {
        m.isPublished = true;
      }
    });

    this.licenseSeq = this.licenses.length + 100;
  }

  // --- SETTINGS ---
  getSettings(): PortalSettings {
    return this.settings;
  }

  updateSettings(newSettings: Partial<PortalSettings>): PortalSettings {
    this.settings = {
      ...this.settings,
      ...newSettings,
      siteName: newSettings.siteName || this.settings.siteName,
      siteDescription: newSettings.siteDescription || this.settings.siteDescription,
      authorName: newSettings.authorName || this.settings.authorName,
      authorTitle: newSettings.authorTitle || this.settings.authorTitle,
      contactPhone: newSettings.contactPhone || this.settings.contactPhone,
      contactWhatsApp: newSettings.contactWhatsApp || this.settings.contactWhatsApp,
      contactTelegram: newSettings.contactTelegram !== undefined ? newSettings.contactTelegram : this.settings.contactTelegram,
      contactEmail: newSettings.contactEmail || this.settings.contactEmail,
      logoUrl: newSettings.logoUrl !== undefined ? newSettings.logoUrl : this.settings.logoUrl,
      logoText: newSettings.logoText !== undefined ? newSettings.logoText : this.settings.logoText,
      currency: newSettings.currency || this.settings.currency || 'KGS',
      supportedLanguages: newSettings.supportedLanguages || this.settings.supportedLanguages || ['ky', 'ru'],
      defaultLanguage: newSettings.defaultLanguage || this.settings.defaultLanguage || 'ky',
      termsOfService: newSettings.termsOfService || this.settings.termsOfService,
      supportHours: newSettings.supportHours || this.settings.supportHours,
      announcement: newSettings.announcement || this.settings.announcement,
      defaultLicense: newSettings.defaultLicense || this.settings.defaultLicense,
      footer: newSettings.footer || this.settings.footer,
      bankRequisites: newSettings.bankRequisites || this.settings.bankRequisites
    };
    writeJsonFile(SETTINGS_FILE, this.settings);
    return this.settings;
  }

  // --- MATERIALS ---
  getMaterials(includeUnpublished = false): Material[] {
    if (includeUnpublished) {
      return this.materials;
    }
    return this.materials.filter((m) => m.isPublished !== false);
  }

  getAllMaterials(): Material[] {
    return this.materials;
  }

  getMaterialById(id: string): Material | undefined {
    return this.materials.find((m) => m.id === id);
  }

  createMaterial(data: Partial<Material>): Material {
    const newMaterial: Material = {
      id: `mat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: data.title || { ky: 'Жаңы материал', ru: 'Новый материал' },
      category: data.category || 'primary_school',
      grade: data.grade || '1-класс',
      subject: data.subject || { ky: 'Математика', ru: 'Математика' },
      academicYear: data.academicYear || '2025-2026',
      pageCount: Number(data.pageCount) || (data.pages ? data.pages.length : 10),
      price: Number(data.price) || 250,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      description: data.description || { ky: '', ru: '' },
      samplePagesCount: Number(data.samplePagesCount) || 1,
      defaultPrintLimit: Number(data.defaultPrintLimit) || this.settings.defaultPrintLimit || 1,
      defaultAccessDays: Number(data.defaultAccessDays) || this.settings.defaultAccessDays || 365,
      authorName: data.authorName || this.settings.authorName || 'Гулмира Жээнтаева',
      isPublished: data.isPublished !== false,
      fileUrl: data.fileUrl || '',
      fileName: data.fileName || '',
      fileType: data.fileType || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: data.pages || [
        {
          pageNumber: 1,
          title: 'Титулдук барак',
          type: 'text',
          content: 'Автордук материал: Гулмира Жээнтаева'
        }
      ]
    };
    this.materials.unshift(newMaterial);
    writeJsonFile(MATERIALS_FILE, this.materials);
    return newMaterial;
  }

  updateMaterial(id: string, updates: Partial<Material>): Material | null {
    const index = this.materials.findIndex((m) => m.id === id);
    if (index === -1) return null;
    this.materials[index] = {
      ...this.materials[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeJsonFile(MATERIALS_FILE, this.materials);
    return this.materials[index];
  }

  deleteMaterial(id: string): boolean {
    const index = this.materials.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.materials.splice(index, 1);
    writeJsonFile(MATERIALS_FILE, this.materials);
    return true;
  }

  // --- USERS ---
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Partial<User>): User {
    const newUser: User = {
      id: userData.id || `user_${Date.now()}`,
      email: (userData.email || '').trim(),
      name: (userData.name || '').trim(),
      role: userData.role || (userData.email?.toLowerCase() === 'jeentaevagulmira@gmail.com' ? 'ADMIN' : 'USER'),
      status: userData.status || 'active',
      createdAt: new Date().toISOString(),
      phone: userData.phone?.trim(),
      school: userData.school?.trim()
    };
    this.users.push(newUser);
    writeJsonFile(USERS_FILE, this.users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = {
      ...this.users[index],
      ...updates
    };
    writeJsonFile(USERS_FILE, this.users);
    return this.users[index];
  }

  // --- LICENSES ---
  getLicenses(): License[] {
    return this.licenses;
  }

  getLicenseById(id: string): License | undefined {
    return this.licenses.find((l) => l.id === id);
  }

  getUserLicenses(userId: string): License[] {
    return this.licenses.filter((l) => l.userId === userId);
  }

  createLicense(licData: Partial<License>): License {
    const year = new Date().getFullYear();
    const seq = String(++this.licenseSeq).padStart(6, '0');
    const newLicense: License = {
      id: licData.id || `LICENSE-${year}-${seq}`,
      userId: licData.userId || '',
      userEmail: licData.userEmail || '',
      userName: licData.userName || '',
      materialId: licData.materialId || '',
      materialTitle: licData.materialTitle || '',
      purchaseId: licData.purchaseId || '',
      purchaseDate: licData.purchaseDate || new Date().toISOString(),
      expirationDate: licData.expirationDate !== undefined ? licData.expirationDate : null,
      printLimit: licData.printLimit !== undefined ? licData.printLimit : 1,
      printUsed: licData.printUsed || 0,
      status: licData.status || 'active',
      lastPrintedAt: licData.lastPrintedAt,
      watermarkNote: licData.watermarkNote || 'Лицензия предназначена только для одного пользователя.'
    };
    this.licenses.unshift(newLicense);
    writeJsonFile(LICENSES_FILE, this.licenses);
    return newLicense;
  }

  updateLicense(id: string, updates: Partial<License>): License | null {
    const index = this.licenses.findIndex((l) => l.id === id);
    if (index === -1) return null;
    this.licenses[index] = {
      ...this.licenses[index],
      ...updates
    };
    writeJsonFile(LICENSES_FILE, this.licenses);
    return this.licenses[index];
  }

  // --- PURCHASES ---
  getPurchases(): Purchase[] {
    return this.purchases;
  }

  getPurchaseById(id: string): Purchase | undefined {
    return this.purchases.find((p) => p.id === id);
  }

  createPurchase(data: Partial<Purchase>): Purchase {
    const newPurchase: Purchase = {
      id: data.id || `purch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: data.userId || '',
      userEmail: data.userEmail || '',
      materialId: data.materialId || '',
      materialTitle: data.materialTitle || '',
      amount: data.amount || 0,
      currency: (data.currency as any) || 'KGS',
      provider: data.provider || 'mbank',
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      completedAt: data.completedAt,
      transactionId: data.transactionId || `TX-${Date.now()}`,
      licenseId: data.licenseId,
      proof: data.proof
    };
    this.purchases.unshift(newPurchase);
    writeJsonFile(PURCHASES_FILE, this.purchases);
    return newPurchase;
  }

  updatePurchase(id: string, updates: Partial<Purchase>): Purchase | null {
    const index = this.purchases.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.purchases[index] = {
      ...this.purchases[index],
      ...updates
    };
    writeJsonFile(PURCHASES_FILE, this.purchases);
    return this.purchases[index];
  }

  // --- AUDIT & PRINT LOGS ---
  getAuditLogs(): AuditLog[] {
    return this.logs;
  }

  addLog(
    action: AuditAction,
    userId: string,
    userEmail: string,
    options?: {
      materialId?: string;
      materialTitle?: string;
      licenseId?: string;
      details?: string;
      ip?: string;
      userAgent?: string;
    }
  ): AuditLog {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId,
      userEmail,
      action,
      materialId: options?.materialId,
      materialTitle: options?.materialTitle,
      licenseId: options?.licenseId,
      details: options?.details,
      ip: options?.ip,
      userAgent: options?.userAgent
    };
    this.logs.unshift(log);
    if (this.logs.length > 2000) {
      this.logs = this.logs.slice(0, 2000);
    }
    writeJsonFile(PRINT_LOGS_FILE, this.logs);
    return log;
  }
}

export const db = new DatabaseStore();
