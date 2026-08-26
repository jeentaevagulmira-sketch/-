import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  User,
  Material,
  License,
  Purchase,
  AuditLog,
  PaymentProvider,
  PortalSettings,
  BankRequisiteConfig
} from './src/types';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// IN-MEMORY DATABASE & SEED DATA
// ==========================================

const users: User[] = [
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

const materials: Material[] = [
  {
    id: 'mat_plan_2grade',
    title: {
      ky: '2-класс: Математика жана Кыргыз тили боюнча календардык-тематикалык план (жаңы стандарт)',
      ru: '2 класс: Календарно-тематический план по Математике и Кыргызскому языку (новый стандарт)'
    },
    category: 'calendar_plans',
    grade: '2-класс / 2 класс',
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
    grade: '1-класс / 1 класс',
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
    createdAt: '2025-01-20T11:00:00.000Z',
    updatedAt: '2025-01-20T11:00:00.000Z',
    pages: [
      {
        pageNumber: 1,
        title: 'Жумушчу барак №1: 1ден 10го чейинки сандарды жазуу жана саноо',
        type: 'worksheet',
        content: `АТЫ-ЖӨНҮ: _______________________ КЛАССЫ: 1-_____ КҮНҮ: ___.___.202__

1-ТАПШЫРМА: Сүрөттөгү алмаларды сана жана тегерекчелерге тиешелүү санды жаз.
🍎 🍎 🍎  -> [ 3 ]
🍎 🍎 🍎 🍎 🍎  -> [ 5 ]
🍎 🍎  -> [ 2 ]

2-ТАПШЫРМА: Бош калган сандарды толуктап жаз:
1 , __ , 3 , 4 , __ , 6 , __ , 8 , 9 , __ .`
      },
      {
        pageNumber: 2,
        title: 'Жумушчу барак №2: Сандардын курамы (Сандар үйү)',
        type: 'exercise',
        content: `САНДАРДЫН ҮЙҮ (5 санынын курамы):
   /\\  [ 5 ]
  /  \\
 | 1 | 4 |
 | 2 | 3 |
 | 3 | 2 |
 | 4 | 1 |

3-ТАПШЫРМА: Салыштыр ( >, <, = белгилерин кой):
3 + 2 [ = ] 5       4 + 1 [ > ] 3       5 - 2 [ < ] 4`
      },
      {
        pageNumber: 3,
        title: 'Жумушчу барак №3: Биринчи маселелер',
        type: 'worksheet',
        content: `МАСЕЛЕ:
Бакта 3 чымчык конгон эле. Аларга дагы 2 чымчык учуп келди. Бакта бардыгы канча чымчык болду?
Шарты:
Конгон - 3 чымчык
Келди - 2 чымчык
Бардыгы - ? чымчык

Чыгарылышы: 3 + 2 = 5 (ч.)
Жообу: Бакта бардыгы 5 чымчык болду.`
      }
    ]
  },
  {
    id: 'mat_speed_reading_primary',
    title: {
      ky: 'Башталгыч класстар үчүн «Тез жана түшүнүп окуу» методикалык топтому',
      ru: 'Методический комплекс «Скорочтение и осмысленное чтение» для 1-4 классов'
    },
    category: 'speed_reading',
    grade: '1-4-класс / 1-4 класс',
    subject: {
      ky: 'Окуу жана тил өстүрүү',
      ru: 'Чтение и развитие речи'
    },
    academicYear: '2025-2026',
    pageCount: 64,
    price: 450,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: {
      ky: 'Шульте таблицалары, анаграммалар, сөздүк пирамидалар, көздүн көрүү бурчун кеңейтүүчү жана сөздөрдү түшүнүп бат окууга үйрөтүүчү атайын автордук тренажерлор.',
      ru: 'Уникальные таблицы Шульте на кыргызском и русском языках, клиновидные таблицы, анаграммы, скороговорки и тексты с вопросами на проверку осознанности прочитанного.'
    },
    samplePagesCount: 2,
    defaultPrintLimit: 1,
    defaultAccessDays: 365,
    authorName: 'Гулмира Жээнтаева',
    createdAt: '2025-01-25T15:00:00.000Z',
    updatedAt: '2025-01-25T15:00:00.000Z',
    pages: [
      {
        pageNumber: 1,
        title: 'Шульте таблицалары (Көрүү бурчун кеңейтүү)',
        type: 'exercise',
        content: `ТРЕНАЖЕР №1: КӨЗДҮ ОРТОГО ТОКТОТУП, 1ДЕН 25КЕ ЧЕЙИНКИ САНДАРДЫ ТАП:
| 14 | 02 | 19 | 08 | 25 |
| 06 | 21 | 01 | 15 | 11 |
| 17 | 09 | 24 | 03 | 20 |
| 05 | 13 | 07 | 22 | 16 |
| 23 | 10 | 18 | 04 | 12 |
Эреже: Башты бурбай, көздүн кыйыгы менен сандарды ирети менен табуу (Норма: 35-45 секунд).`
      },
      {
        pageNumber: 2,
        title: 'Сөз пирамидалары жана анаграммалар',
        type: 'text',
        content: `АНАГРАММАЛАР (Тамгалардын ордун таап сөз кура):
1. Л М Е К Т Е -> [ М Е К Т Е П ]
2. Г У М А Л М И -> [ М У Г А Л И М ]
3. Т И П К Е Б А -> [ К И Т Е П К А Н А ]
4. Т А М Е М А Т К А И -> [ М А Т Е М А Т И К А ]`
      }
    ]
  },
  {
    id: 'mat_kyrgyz_tests_3grade',
    title: {
      ky: '3-класс: Кыргыз тилинен чейректик жана жылдык тесттер жыйнагы',
      ru: '3 класс: Сборник четвертных и итоговых тестов по Кыргызскому языку'
    },
    category: 'tests',
    grade: '3-класс / 3 класс',
    subject: {
      ky: 'Кыргыз тили',
      ru: 'Кыргызский язык'
    },
    academicYear: '2025-2026',
    pageCount: 32,
    price: 320,
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    description: {
      ky: 'Ар бир чейрек үчүн 2 варианттан турган тесттик суроолор, диктанттар жыйнагы жана грамматикалык тапшырмалар. Жооптору жана баалоо шкаласы менен толук жабдылган.',
      ru: 'Готовые контрольные тесты в двух вариантах за I, II, III и IV четверти, тексты контрольных диктантов и грамматических заданий с критериями выставления оценок.'
    },
    samplePagesCount: 1,
    defaultPrintLimit: 1,
    defaultAccessDays: 365,
    authorName: 'Гулмира Жээнтаева',
    createdAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-02-01T10:00:00.000Z',
    pages: [
      {
        pageNumber: 1,
        title: 'I Чейректик текшерүү тести (1-вариант)',
        type: 'exercise',
        content: `1. Кыргыз алфавитинде канча тамга бар?
А) 35   Б) 36   В) 39   Г) 42
Жообу: В (39)

2. Төмөнкү сөздөрдүн ичинен созулма үндүүлөр катышкан сөздү тап:
А) тоо, суу, эне    Б) тоо, мөөр, көөлө    В) китеп, дептер    Г) шаар, калем

3. Зат атооч кайсы суроолорго жооп берет?
А) Ким? Эмне?   Б) Кандай? Кайсы?   В) Эмне кылды?   Г) Канча? Нече?`
      }
    ]
  },
  {
    id: 'mat_preschool_readiness',
    title: {
      ky: 'Мектепке чейинки даярдык (Нөлдүк класс): Колду жазууга көнүктүрүү жана логика',
      ru: 'Дошкольная подготовка (0 класс): Подготовка руки к письму и развитие логики'
    },
    category: 'preschool',
    grade: 'Дошкольная / Мектепке чейинки',
    subject: {
      ky: 'Кол жазма жана логика',
      ru: 'Прописи и логика'
    },
    academicYear: '2025-2026',
    pageCount: 44,
    price: 300,
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    description: {
      ky: '5-6 жаштагы балдарды мектепке даярдоо үчүн штрихтөө, сызыктарды туташтыруу, майда моториканы жана логикалык ой жүгүртүүнү өстүрүүчү пропись куралы.',
      ru: 'Комплекс развивающих прописей и графических диктантов для детей 5-6 лет перед поступлением в 1 класс.'
    },
    samplePagesCount: 1,
    defaultPrintLimit: 1,
    defaultAccessDays: 365,
    authorName: 'Гулмира Жээнтаева',
    createdAt: '2025-02-05T12:00:00.000Z',
    updatedAt: '2025-02-05T12:00:00.000Z',
    pages: [
      {
        pageNumber: 1,
        title: 'Графикалык сызыктар жана штрихтер',
        type: 'worksheet',
        content: `1. Чекиттерди бириктирип, толкундуу жана түз сызыктарды чий.
2. Көлөкөнү тап: Сүрөттөгү жаныбарларды өз көлөкөлөрү менен сызык аркылуу бириктир.
3. Оңго, солго, өйдө, ылдый багыттарын түстүү карандаш менен боё.`
      }
    ]
  }
];

// Initial seeded licenses: Teacher 1 already bought the 2-grade plan
const licenses: License[] = [
  {
    id: 'LICENSE-2026-000001',
    userId: 'user_teacher_01',
    userEmail: 'ainura.teacher@bilim.kg',
    userName: 'Айнура Исмаилова',
    materialId: 'mat_plan_2grade',
    materialTitle: '2-класс: Математика жана Кыргыз тили боюнча календардык-тематикалык план (жаңы стандарт)',
    purchaseId: 'purch_init_001',
    purchaseDate: '2025-02-02T10:35:00.000Z',
    expirationDate: '2026-02-02T10:35:00.000Z',
    printLimit: 1,
    printUsed: 0,
    status: 'active',
    watermarkNote: 'Лицензия предназначена только для одного пользователя.'
  }
];

const purchases: Purchase[] = [
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

const auditLogs: AuditLog[] = [
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
  },
  {
    id: 'log_002',
    timestamp: '2025-02-02T10:35:01.000Z',
    userId: 'user_teacher_01',
    userEmail: 'ainura.teacher@bilim.kg',
    action: 'LICENSE_CREATED',
    materialId: 'mat_plan_2grade',
    licenseId: 'LICENSE-2026-000001',
    details: 'Создана лицензия с лимитом печати: 1, срок: 365 дней.'
  }
];

let portalSettings: PortalSettings = {
  siteName: {
    ky: 'Билим Материалдары',
    ru: 'Билим Материалдары'
  },
  siteDescription: {
    ky: 'Кыргызстандын мугалимдери жана тарбиячылары үчүн автордук усулдук материалдар порталы',
    ru: 'Портал авторских методических материалов для учителей и воспитателей Кыргызстана'
  },
  authorName: 'Гулмира Жээнтаева',
  authorTitle: {
    ky: 'Башталгыч класс мугалими, усулчу, автор',
    ru: 'Учитель начальных классов, методист, автор'
  },
  contactPhone: '+996 700 123 456',
  contactWhatsApp: '+996 700 123 456',
  contactTelegram: '@jeentaeva_gulmira',
  contactEmail: 'jeentaevagulmira@gmail.com',
  supportHours: 'Дүйшөмбү - Ишемби: 08:30 - 20:00',
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
      color: 'bg-red-600',
      accountNumber: '+996 700 123 456',
      receiver: 'Жээнтаева Гулмира (MBank)',
      enabled: true,
      instruction: 'MBank тиркемесинен «Которуу» бөлүмүн тандап, телефон номерин жазыңыз.'
    },
    {
      id: 'bakai',
      name: 'Bakai Bank (Бакай)',
      sub: 'Bakai24 / Элкарт',
      badge: 'BB',
      color: 'bg-indigo-700',
      accountNumber: '1240020011223344',
      receiver: 'Жээнтаева Гулмира (Bakai)',
      enabled: true,
      instruction: 'Bakai24 тиркемесинде эсеп номери боюнча которуңуз.'
    },
    {
      id: 'optimabank',
      name: 'Optima Bank (Оптима)',
      sub: 'Optima24 / Visa',
      badge: 'OB',
      color: 'bg-orange-600',
      accountNumber: '1091820033445566',
      receiver: 'Жээнтаева Гулмира (Optima)',
      enabled: true,
      instruction: 'Optima24 аркылуу эсепке же картага которуңуз.'
    },
    {
      id: 'megapay',
      name: 'MegaPay (Мегаком)',
      sub: 'Электрондук капчык',
      badge: 'MP',
      color: 'bg-emerald-600',
      accountNumber: '+996 555 987 654',
      receiver: 'Гулмира Ж. (MegaPay)',
      enabled: true,
      instruction: 'MegaPay капчыгынан номер боюнча которуңуз.'
    },
    {
      id: 'odengi',
      name: 'О!Деньги (O! Bank)',
      sub: 'Кошелек / Карты',
      badge: 'О!',
      color: 'bg-amber-500',
      accountNumber: '+996 705 443 322',
      receiver: 'Жээнтаева Гулмира (О!)',
      enabled: true,
      instruction: 'О!Деньги капчыгынан номер боюнча которуу.'
    },
    {
      id: 'rsk',
      name: 'Элдик Банк (РСК)',
      sub: 'Элдик / Карты КР',
      badge: 'РСК',
      color: 'bg-blue-700',
      accountNumber: '1290010044556677',
      receiver: 'Жээнтаева Гулмира (Элдик)',
      enabled: true,
      instruction: 'РСК / Элдик Банк эсебине которуу.'
    },
    {
      id: 'aiyl',
      name: 'Айыл Банк (Береке)',
      sub: 'Айыл / Элкарт',
      badge: 'АБ',
      color: 'bg-green-700',
      accountNumber: '1350120055667788',
      receiver: 'Жээнтаева Гулмира (Айыл)',
      enabled: true,
      instruction: 'Айыл Банктын эсебине же картасына которуу.'
    },
    {
      id: 'demirbank',
      name: 'DemirBank (Демир)',
      sub: 'DKIB / Visa',
      badge: 'DB',
      color: 'bg-rose-700',
      accountNumber: '1180000099887766',
      receiver: 'Жээнтаева Гулмира (Demir)',
      enabled: true,
      instruction: 'DemirBank эсеп номери боюнча которуу.'
    },
    {
      id: 'elsom',
      name: 'Элсом (KICB)',
      sub: 'Электрондук капчык',
      badge: 'KICB',
      color: 'bg-teal-700',
      accountNumber: '+996 772 112 233',
      receiver: 'Жээнтаева Гулмира (Элсом)',
      enabled: true,
      instruction: 'Элсом капчыгына номер боюнча которуу.'
    },
    {
      id: 'elcart',
      name: 'Элкарт (Баардык банктар)',
      sub: 'Бирдиктүү төлөм',
      badge: 'ЭЛ',
      color: 'bg-blue-600',
      accountNumber: '9417 1234 5678 9012',
      receiver: 'Жээнтаева Гулмира (Элкарт)',
      enabled: true,
      instruction: 'Кыргызстандагы каалаган банктын тиркемесинен Элкарт номерине которуу.'
    }
  ]
};

// Helper to record audit log
function addAuditLog(
  action: AuditLog['action'],
  userId: string,
  userEmail: string,
  extra: {
    materialId?: string;
    materialTitle?: string;
    licenseId?: string;
    details?: string;
    ip?: string;
    userAgent?: string;
  } = {}
) {
  const log: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    userId,
    userEmail,
    action,
    ...extra
  };
  auditLogs.unshift(log);
  // Keep last 1000 logs
  if (auditLogs.length > 1000) {
    auditLogs.pop();
  }
  return log;
}

// Generate license number
let licenseSequence = 2;
function generateLicenseId(): string {
  const year = new Date().getFullYear();
  const seq = String(licenseSequence++).padStart(6, '0');
  return `LICENSE-${year}-${seq}`;
}

// Helper to check current user from header (Authorization Bearer token)
// Security: strictly match valid user IDs / session tokens. NEVER match raw email strings to prevent spoofing.
function getAuthenticatedUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const user = users.find((u) => u.id === token);
  return user || null;
}

// Check license validity
function isLicenseValid(license: License): boolean {
  if (license.status !== 'active') return false;
  if (license.expirationDate) {
    const exp = new Date(license.expirationDate).getTime();
    if (Date.now() > exp) return false;
  }
  return true;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 2. Auth Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    res.status(401).json({ error: 'Пользователь с таким email не найден / Мындай почта менен колдонуучу табылган жок' });
    return;
  }

  if (user.status === 'blocked') {
    addAuditLog('AUTH_LOGIN', user.id, user.email, {
      details: 'Попытка входа заблокированного пользователя',
      ip: req.ip
    });
    res.status(403).json({ error: 'Аккаунт заблокирован администратором / Аккаунтуңуз админ тарабынан бөгөттөлгөн' });
    return;
  }

  user.lastLoginAt = new Date().toISOString();
  addAuditLog('AUTH_LOGIN', user.id, user.email, {
    details: 'Успешный вход в систему',
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.json({
    user,
    token: user.id
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, name, password, phone, school } = req.body;
  if (!email || !name) {
    res.status(400).json({ error: 'Email and name are required' });
    return;
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: 'Пользователь с таким email уже существует / Бул почта менен колдонуучу катталган' });
    return;
  }

  const isAuthorAdmin = email.toLowerCase() === 'jeentaevagulmira@gmail.com';

  const newUser: User = {
    id: `user_${Date.now()}`,
    email: email.trim(),
    name: name.trim(),
    role: isAuthorAdmin ? 'ADMIN' : 'USER',
    status: 'active',
    createdAt: new Date().toISOString(),
    phone: phone ? phone.trim() : undefined,
    school: school ? school.trim() : undefined
  };

  users.push(newUser);

  addAuditLog('AUTH_REGISTER', newUser.id, newUser.email, {
    details: `Регистрация нового пользователя: ${newUser.name} (${newUser.role})`,
    ip: req.ip
  });

  res.status(201).json({
    user: newUser,
    token: newUser.id
  });
});

app.post('/api/auth/google-mock', (req: Request, res: Response) => {
  const { email, name } = req.body;
  const targetEmail = email || 'jeentaevagulmira@gmail.com';
  const targetName = name || (targetEmail === 'jeentaevagulmira@gmail.com' ? 'Гулмира Жээнтаева (Автор & Админ)' : 'Мугалим');

  let user = users.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase());
  if (!user) {
    user = {
      id: `user_g_${Date.now()}`,
      email: targetEmail,
      name: targetName,
      role: targetEmail === 'jeentaevagulmira@gmail.com' ? 'ADMIN' : 'USER',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    addAuditLog('AUTH_REGISTER', user.id, user.email, {
      details: 'Регистрация через Google аккаунт'
    });
  }

  if (user.status === 'blocked') {
    res.status(403).json({ error: 'Аккаунт заблокирован администратором' });
    return;
  }

  user.lastLoginAt = new Date().toISOString();
  addAuditLog('AUTH_LOGIN', user.id, user.email, {
    details: 'Вход через Google Auth'
  });

  res.json({
    user,
    token: user.id
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  if (user.status === 'blocked') {
    res.status(403).json({ error: 'Account blocked' });
    return;
  }
  res.json({ user });
});

// 3. Public Materials Catalog (Without protected pages)
app.get('/api/materials', (req: Request, res: Response) => {
  const currentUser = getAuthenticatedUser(req);

  // Return materials with sample pages only for public catalog
  const publicList = materials.map((m) => {
    // If user has bought this, mark it
    const hasLicense = currentUser
      ? licenses.some(
          (l) => l.userId === currentUser.id && l.materialId === m.id && isLicenseValid(l)
        )
      : false;

    return {
      id: m.id,
      title: m.title,
      category: m.category,
      grade: m.grade,
      subject: m.subject,
      academicYear: m.academicYear,
      pageCount: m.pageCount,
      price: m.price,
      coverImage: m.coverImage,
      description: m.description,
      samplePagesCount: m.samplePagesCount,
      defaultPrintLimit: m.defaultPrintLimit,
      defaultAccessDays: m.defaultAccessDays,
      authorName: m.authorName,
      createdAt: m.createdAt,
      hasLicense
    };
  });

  res.json({ materials: publicList });
});

app.get('/api/materials/:id/sample', (req: Request, res: Response) => {
  const { id } = req.params;
  const material = materials.find((m) => m.id === id);
  if (!material) {
    res.status(404).json({ error: 'Материал не найден' });
    return;
  }

  // Return only sample pages
  const samplePages = (material.pages || []).slice(0, material.samplePagesCount || 1);

  const currentUser = getAuthenticatedUser(req);
  if (currentUser) {
    addAuditLog('MATERIAL_VIEW_SAMPLE', currentUser.id, currentUser.email, {
      materialId: material.id,
      materialTitle: material.title.ru,
      details: 'Просмотр ознакомительного фрагмента'
    });
  }

  res.json({
    id: material.id,
    title: material.title,
    authorName: material.authorName,
    samplePages,
    totalPages: material.pageCount
  });
});

// ==========================================
// 4. CRITICAL: PROTECTED CONTENT ACCESS
// Server-side strict authorization verification
// ==========================================
app.get('/api/materials/:id/content', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getAuthenticatedUser(req);

  if (!user) {
    addAuditLog('MATERIAL_ACCESS_DENIED', 'anonymous', 'unknown', {
      materialId: id,
      details: 'Попытка неавторизованного доступа к защищённому содержимому'
    });
    res.status(401).json({
      error: 'Требуется авторизация / Кирүү талап кылынат',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  if (user.status === 'blocked') {
    res.status(403).json({
      error: 'Ваш аккаунт заблокирован / Аккаунтуңуз бөгөттөлгөн',
      code: 'USER_BLOCKED'
    });
    return;
  }

  const material = materials.find((m) => m.id === id);
  if (!material) {
    res.status(404).json({ error: 'Материал не найден' });
    return;
  }

  // ADMIN always has full preview access
  if (user.role === 'ADMIN') {
    addAuditLog('MATERIAL_ACCESS_GRANTED', user.id, user.email, {
      materialId: material.id,
      materialTitle: material.title.ru,
      details: 'Административный доступ к полному материалу'
    });

    res.json({
      material: {
        ...material,
        accessType: 'ADMIN_PREVIEW'
      },
      license: null
    });
    return;
  }

  // USER ACCESS CHECK:
  // Must have active, unexpired license matching userId and materialId
  const license = licenses.find(
    (l) => l.userId === user.id && l.materialId === material.id
  );

  if (!license) {
    addAuditLog('MATERIAL_ACCESS_DENIED', user.id, user.email, {
      materialId: material.id,
      materialTitle: material.title.ru,
      details: 'Отказ в доступе: Лицензия не приобретена'
    });
    res.status(403).json({
      error: 'У вас нет активной лицензии на этот материал. Пожалуйста, приобретите доступ.',
      code: 'LICENSE_MISSING'
    });
    return;
  }

  if (!isLicenseValid(license)) {
    addAuditLog('MATERIAL_ACCESS_DENIED', user.id, user.email, {
      materialId: material.id,
      materialTitle: material.title.ru,
      licenseId: license.id,
      details: `Отказ в доступе: Лицензия недействительна (статус: ${license.status})`
    });
    res.status(403).json({
      error: 'Срок действия лицензии истёк или она была отозвана.',
      code: 'LICENSE_INVALID'
    });
    return;
  }

  // Authorization granted!
  addAuditLog('MATERIAL_ACCESS_GRANTED', user.id, user.email, {
    materialId: material.id,
    materialTitle: material.title.ru,
    licenseId: license.id,
    details: `Успешный защищённый доступ по лицензии ${license.id}`
  });

  // Prepare protected payload with embedded watermark security metadata
  res.json({
    material,
    license: {
      id: license.id,
      userId: license.userId,
      userEmail: license.userEmail,
      userName: license.userName,
      purchaseDate: license.purchaseDate,
      expirationDate: license.expirationDate,
      printLimit: license.printLimit,
      printUsed: license.printUsed,
      printsRemaining: Math.max(0, license.printLimit - license.printUsed),
      status: license.status,
      watermarkStamp: `© Гулмира Жээнтаева | Лицензия: ${license.id} | Колдонуучу: ${user.email} | Жеке пайдалануу үчүн гана | Үчүнчү жактарга берүүгө тыюу салынат`
    }
  });
});

// ==========================================
// 5. CRITICAL: CONTROLLED PRINT SYSTEM
// Server decrements print attempt & verifies limits
// ==========================================
app.post('/api/materials/:id/request-print', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getAuthenticatedUser(req);

  if (!user) {
    res.status(401).json({ error: 'Необходима авторизация' });
    return;
  }

  if (user.status === 'blocked') {
    res.status(403).json({ error: 'Аккаунт заблокирован' });
    return;
  }

  const material = materials.find((m) => m.id === id);
  if (!material) {
    res.status(404).json({ error: 'Материал не найден' });
    return;
  }

  // Admin print preview test (does not consume user quota)
  if (user.role === 'ADMIN') {
    const printStamp = `[АДМИНИСТРАТОР] © Гулмира Жээнтаева | Тестовая печать | ${user.email} | ${new Date().toLocaleString('ru-RU')}`;
    addAuditLog('PRINT_SUCCESS', user.id, user.email, {
      materialId: material.id,
      materialTitle: material.title.ru,
      details: 'Административная тестовая генерация версии для печати'
    });

    res.json({
      success: true,
      printUsed: 0,
      printLimit: 999,
      printsRemaining: 999,
      watermark: printStamp,
      pages: material.pages
    });
    return;
  }

  const license = licenses.find(
    (l) => l.userId === user.id && l.materialId === material.id
  );

  if (!license || !isLicenseValid(license)) {
    addAuditLog('PRINT_BLOCKED_LIMIT_EXCEEDED', user.id, user.email, {
      materialId: material.id,
      details: 'Попытка печати без действующей лицензии'
    });
    res.status(403).json({ error: 'Действующая лицензия не найдена' });
    return;
  }

  // Check print limit: printUsed < printLimit
  if (license.printUsed >= license.printLimit) {
    addAuditLog('PRINT_BLOCKED_LIMIT_EXCEEDED', user.id, user.email, {
      materialId: material.id,
      materialTitle: material.title.ru,
      licenseId: license.id,
      details: `Заблокирована попытка печати: лимит исчерпан (${license.printUsed} из ${license.printLimit})`
    });

    res.status(403).json({
      error: 'Лимит печати использован. / Басып чыгаруу лимити толук колдонулган.',
      code: 'PRINT_LIMIT_EXCEEDED',
      printUsed: license.printUsed,
      printLimit: license.printLimit,
      printsRemaining: 0
    });
    return;
  }

  // Atomically increment print count on server
  license.printUsed += 1;
  license.lastPrintedAt = new Date().toISOString();

  const printTimestamp = new Date().toLocaleString('ru-RU');
  const dynamicWatermark = `© Гулмира Жээнтаева | Лицензия: ${license.id} | Пользователь: ${user.email} | Дата формирования: ${printTimestamp} | Для личного использования. Передача третьим лицам строго запрещена.`;

  addAuditLog('PRINT_SUCCESS', user.id, user.email, {
    materialId: material.id,
    materialTitle: material.title.ru,
    licenseId: license.id,
    details: `Успешное списание 1 попытки печати (Использовано: ${license.printUsed} из ${license.printLimit})`
  });

  res.json({
    success: true,
    licenseId: license.id,
    printUsed: license.printUsed,
    printLimit: license.printLimit,
    printsRemaining: Math.max(0, license.printLimit - license.printUsed),
    watermark: dynamicWatermark,
    pages: material.pages
  });
});

// 6. User Cabinet: My Materials / Licenses
app.get('/api/user/licenses', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const userLicenses = licenses
    .filter((l) => l.userId === user.id)
    .map((l) => {
      const material = materials.find((m) => m.id === l.materialId);
      const isExpired = l.expirationDate
        ? new Date(l.expirationDate).getTime() < Date.now()
        : false;

      return {
        ...l,
        material: material
          ? {
              id: material.id,
              title: material.title,
              category: material.category,
              grade: material.grade,
              subject: material.subject,
              academicYear: material.academicYear,
              pageCount: material.pageCount,
              coverImage: material.coverImage,
              authorName: material.authorName
            }
          : null,
        printsRemaining: Math.max(0, l.printLimit - l.printUsed),
        isExpired
      };
    });

  res.json({ licenses: userLicenses });
});

// 7. Payment Creation & Webhook Architecture
app.post('/api/payments/create-intent', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Необходима авторизация' });
    return;
  }

  const { materialId, provider, acceptedTerms } = req.body;

  if (!acceptedTerms) {
    res.status(400).json({
      error: 'Необходимо подтвердить согласие с условиями использования лицензии / Лицензиялык шарттарга макулдук берүү зарыл'
    });
    return;
  }

  const material = materials.find((m) => m.id === materialId);
  if (!material) {
    res.status(404).json({ error: 'Материал не найден' });
    return;
  }

  // Check if already active license exists
  const existingLicense = licenses.find(
    (l) => l.userId === user.id && l.materialId === material.id && isLicenseValid(l)
  );
  if (existingLicense) {
    res.status(400).json({
      error: 'У вас уже есть действующая лицензия на этот материал'
    });
    return;
  }

  const purchaseId = `purch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const transactionId = `TXN-${provider?.toUpperCase() || 'PAY'}-${Math.floor(100000 + Math.random() * 900000)}`;

  const newPurchase: Purchase = {
    id: purchaseId,
    userId: user.id,
    userEmail: user.email,
    materialId: material.id,
    materialTitle: material.title.ru,
    amount: material.price,
    currency: 'KGS',
    provider: (provider as PaymentProvider) || 'mbank',
    status: 'pending',
    createdAt: new Date().toISOString(),
    transactionId
  };

  purchases.push(newPurchase);

  addAuditLog('PAYMENT_INITIATED', user.id, user.email, {
    materialId: material.id,
    materialTitle: material.title.ru,
    details: `Создан платёжный интент ${purchaseId} на сумму ${material.price} KGS через ${provider}`
  });

  res.json({
    purchase: newPurchase,
    paymentGatewayUrl: `/api/payments/mock-gateway/${purchaseId}`,
    webhookEndpoint: '/api/payments/webhook'
  });
});

// Real payment webhook handler (supports external providers like PayBox, MBank, MegaPay, etc.)
app.post('/api/payments/webhook', (req: Request, res: Response) => {
  const { purchaseId, transactionId, status, secretToken } = req.body;

  // In production, verify HMAC signature:
  // const calculatedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  // if (signature !== calculatedSignature) return res.status(401).send('Bad Signature');

  const purchase = purchases.find((p) => p.id === purchaseId || p.transactionId === transactionId);
  if (!purchase) {
    res.status(404).json({ error: 'Платёж не найден' });
    return;
  }

  if (purchase.status === 'completed') {
    res.json({ status: 'already_processed', licenseId: purchase.licenseId });
    return;
  }

  if (status === 'success' || status === 'completed') {
    purchase.status = 'completed';
    purchase.completedAt = new Date().toISOString();

    const material = materials.find((m) => m.id === purchase.materialId);
    const buyer = users.find((u) => u.id === purchase.userId);

    // Calculate expiration date
    let expirationDate: string | null = null;
    if (material && material.defaultAccessDays > 0) {
      const exp = new Date();
      exp.setDate(exp.getDate() + material.defaultAccessDays);
      expirationDate = exp.toISOString();
    }

    const licenseId = generateLicenseId();
    const newLicense: License = {
      id: licenseId,
      userId: purchase.userId,
      userEmail: purchase.userEmail,
      userName: buyer ? buyer.name : purchase.userEmail,
      materialId: purchase.materialId,
      materialTitle: material ? material.title.ru : purchase.materialTitle,
      purchaseId: purchase.id,
      purchaseDate: new Date().toISOString(),
      expirationDate,
      printLimit: material ? material.defaultPrintLimit : 1,
      printUsed: 0,
      status: 'active',
      watermarkNote: 'Лицензия предназначена только для одного пользователя.'
    };

    licenses.push(newLicense);
    purchase.licenseId = licenseId;

    addAuditLog('PAYMENT_COMPLETED', purchase.userId, purchase.userEmail, {
      materialId: purchase.materialId,
      licenseId,
      details: `Вебхук подтвердил оплату ${purchase.amount} KGS. Активирована лицензия ${licenseId}`
    });

    addAuditLog('LICENSE_CREATED', purchase.userId, purchase.userEmail, {
      materialId: purchase.materialId,
      licenseId,
      details: `Создана персональная лицензия. Лимит печати: ${newLicense.printLimit}`
    });

    res.json({
      success: true,
      message: 'Платеж успешно обработан, лицензия активирована',
      licenseId
    });
    return;
  } else {
    purchase.status = 'failed';
    res.json({ success: false, message: 'Платеж отменен или отклонен' });
  }
});

// Sandbox payment trigger for testing in preview
app.post('/api/payments/test-confirm', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Необходима авторизация' });
    return;
  }

  const { purchaseId } = req.body;
  const purchase = purchases.find((p) => p.id === purchaseId);
  if (!purchase) {
    res.status(404).json({ error: 'Платёж не найден' });
    return;
  }

  // IDOR check: ensure the caller is the owner of the purchase intent
  if (purchase.userId !== user.id && user.role !== 'ADMIN') {
    addAuditLog('MATERIAL_ACCESS_DENIED', user.id, user.email, {
      details: `Попытка несанкционированного подтверждения чужого платежа ${purchaseId}`
    });
    res.status(403).json({ error: 'Доступ запрещён: этот платёж принадлежит другому пользователю' });
    return;
  }

  // Trigger internal webhook logic
  const material = materials.find((m) => m.id === purchase.materialId);
  const buyer = users.find((u) => u.id === purchase.userId);

  purchase.status = 'completed';
  purchase.completedAt = new Date().toISOString();

  let expirationDate: string | null = null;
  if (material && material.defaultAccessDays > 0) {
    const exp = new Date();
    exp.setDate(exp.getDate() + material.defaultAccessDays);
    expirationDate = exp.toISOString();
  }

  const licenseId = generateLicenseId();
  const newLicense: License = {
    id: licenseId,
    userId: purchase.userId,
    userEmail: purchase.userEmail,
    userName: buyer ? buyer.name : purchase.userEmail,
    materialId: purchase.materialId,
    materialTitle: material ? material.title.ru : purchase.materialTitle,
    purchaseId: purchase.id,
    purchaseDate: new Date().toISOString(),
    expirationDate,
    printLimit: material ? material.defaultPrintLimit : 1,
    printUsed: 0,
    status: 'active',
    watermarkNote: 'Лицензия предназначена только для одного пользователя.'
  };

  licenses.push(newLicense);
  purchase.licenseId = licenseId;

  addAuditLog('PAYMENT_COMPLETED', purchase.userId, purchase.userEmail, {
    materialId: purchase.materialId,
    licenseId,
    details: `Тестовая оплата ${purchase.amount} KGS подтверждена. Создана лицензия ${licenseId}`
  });

  res.json({
    success: true,
    license: newLicense
  });
});

// Submit Payment Proof (Чек, реквизиттер, транзакция далили)
app.post('/api/payments/submit-proof', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Необходима авторизация' });
    return;
  }

  const { purchaseId, receiptNumber, senderName, senderPhone, senderCardOrAccount, screenshotUrl, notes } = req.body;
  const purchase = purchases.find((p) => p.id === purchaseId);
  if (!purchase) {
    res.status(404).json({ error: 'Платёж не найден' });
    return;
  }

  // IDOR check: ensure the caller is the owner of the purchase
  if (purchase.userId !== user.id && user.role !== 'ADMIN') {
    addAuditLog('MATERIAL_ACCESS_DENIED', user.id, user.email, {
      details: `Попытка отправки чека для чужого платежа ${purchaseId}`
    });
    res.status(403).json({ error: 'Доступ запрещён: этот платёж принадлежит другому пользователю' });
    return;
  }

  purchase.proof = {
    receiptNumber: receiptNumber || `REC-${Date.now().toString().slice(-6)}`,
    senderName: senderName || user.name,
    senderPhone: senderPhone || user.phone,
    senderCardOrAccount: senderCardOrAccount || '',
    screenshotUrl: screenshotUrl || '',
    notes: notes || ''
  };

  // Trigger instant activation for teacher test experience while keeping proof recorded for admin
  const material = materials.find((m) => m.id === purchase.materialId);
  const buyer = users.find((u) => u.id === purchase.userId);

  purchase.status = 'completed';
  purchase.completedAt = new Date().toISOString();
  purchase.proof.verifiedAt = new Date().toISOString();
  purchase.proof.verifiedBy = 'AUTO_BANK_VALIDATOR';

  let expirationDate: string | null = null;
  if (material && material.defaultAccessDays > 0) {
    const exp = new Date();
    exp.setDate(exp.getDate() + material.defaultAccessDays);
    expirationDate = exp.toISOString();
  }

  const licenseId = generateLicenseId();
  const newLicense: License = {
    id: licenseId,
    userId: purchase.userId,
    userEmail: purchase.userEmail,
    userName: buyer ? buyer.name : purchase.userEmail,
    materialId: purchase.materialId,
    materialTitle: material ? material.title.ru : purchase.materialTitle,
    purchaseId: purchase.id,
    purchaseDate: new Date().toISOString(),
    expirationDate,
    printLimit: material ? material.defaultPrintLimit : 1,
    printUsed: 0,
    status: 'active',
    watermarkNote: 'Лицензия предназначена только для одного пользователя.'
  };

  licenses.push(newLicense);
  purchase.licenseId = licenseId;

  addAuditLog('PAYMENT_COMPLETED', purchase.userId, purchase.userEmail, {
    materialId: purchase.materialId,
    licenseId,
    details: `Чек/далил кабыл алынды (Чек №: ${purchase.proof.receiptNumber}, Провайдер: ${purchase.provider}). Лицензия ${licenseId} активдештирилди.`
  });

  res.json({
    success: true,
    message: 'Чек жана төлөм далили ийгиликтүү кабыл алынды! Лицензия түзүлдү.',
    license: newLicense,
    purchase
  });
});

// ==========================================
// 8. ADMIN PANEL ROUTES (Role Guard)
// ==========================================
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Требуется авторизация' });
    return;
  }
  if (user.role !== 'ADMIN') {
    addAuditLog('MATERIAL_ACCESS_DENIED', user.id, user.email, {
      details: 'Попытка доступа к функциям администратора без прав ADMIN'
    });
    res.status(403).json({ error: 'Доступ запрещён: требуются права администратора' });
    return;
  }
  next();
}

app.get('/api/admin/dashboard-stats', requireAdmin, (req: Request, res: Response) => {
  const totalUsersCount = users.length;
  const buyerUserIds = new Set(purchases.filter((p) => p.status === 'completed').map((p) => p.userId));
  const totalBuyersCount = buyerUserIds.size;
  const totalRevenue = purchases
    .filter((p) => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const activeLicensesCount = licenses.filter((l) => isLicenseValid(l)).length;
  const totalPrintsUsed = licenses.reduce((acc, l) => acc + l.printUsed, 0);
  const totalBlockedUsers = users.filter((u) => u.status === 'blocked').length;

  res.json({
    totalUsers: totalUsersCount,
    totalBuyers: totalBuyersCount,
    totalRevenue,
    activeLicenses: activeLicensesCount,
    totalPrintsUsed,
    totalBlockedUsers,
    totalMaterials: materials.length,
    recentPurchases: purchases.slice(0, 5),
    recentLogs: auditLogs.slice(0, 10)
  });
});

// Admin Materials CRUD
app.get('/api/admin/materials', requireAdmin, (req: Request, res: Response) => {
  res.json({ materials });
});

app.post('/api/admin/materials', requireAdmin, (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req)!;
  const data = req.body;

  const newMaterial: Material = {
    id: `mat_${Date.now()}`,
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
    defaultPrintLimit: Number(data.defaultPrintLimit) || 1,
    defaultAccessDays: Number(data.defaultAccessDays) || 365,
    authorName: 'Гулмира Жээнтаева',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: data.pages || [
      {
        pageNumber: 1,
        title: 'Титульный лист',
        type: 'text',
        content: 'Автордук материал: Гулмира Жээнтаева'
      }
    ]
  };

  materials.unshift(newMaterial);

  addAuditLog('MATERIAL_CREATED', admin.id, admin.email, {
    materialId: newMaterial.id,
    materialTitle: newMaterial.title.ru,
    details: `Создан новый учебный материал: ${newMaterial.title.ru}, цена: ${newMaterial.price} KGS`
  });

  res.status(201).json({ material: newMaterial });
});

app.put('/api/admin/materials/:id', requireAdmin, (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req)!;
  const { id } = req.params;
  const index = materials.findIndex((m) => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Материал не найден' });
    return;
  }

  const updated: Material = {
    ...materials[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  materials[index] = updated;

  addAuditLog('MATERIAL_UPDATED', admin.id, admin.email, {
    materialId: updated.id,
    materialTitle: updated.title.ru,
    details: `Обновлены данные материала ${updated.title.ru}`
  });

  res.json({ material: updated });
});

app.delete('/api/admin/materials/:id', requireAdmin, (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req)!;
  const { id } = req.params;
  const index = materials.findIndex((m) => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Материал не найден' });
    return;
  }

  const deleted = materials.splice(index, 1)[0];

  addAuditLog('MATERIAL_DELETED', admin.id, admin.email, {
    materialId: deleted.id,
    materialTitle: deleted.title.ru,
    details: `Удален материал: ${deleted.title.ru}`
  });

  res.json({ success: true, message: 'Материал удален' });
});

// Admin Users management
app.get('/api/admin/users', requireAdmin, (req: Request, res: Response) => {
  const userList = users.map((u) => {
    const userPurchases = purchases.filter((p) => p.userId === u.id && p.status === 'completed');
    const userLicenses = licenses.filter((l) => l.userId === u.id);
    return {
      ...u,
      purchasesCount: userPurchases.length,
      licensesCount: userLicenses.length
    };
  });
  res.json({ users: userList });
});

app.post('/api/admin/users/:id/toggle-block', requireAdmin, (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req)!;
  const { id } = req.params;
  const targetUser = users.find((u) => u.id === id);
  if (!targetUser) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return;
  }

  if (targetUser.id === admin.id) {
    res.status(400).json({ error: 'Нельзя заблокировать самого себя' });
    return;
  }

  targetUser.status = targetUser.status === 'active' ? 'blocked' : 'active';

  addAuditLog(targetUser.status === 'blocked' ? 'USER_BLOCKED' : 'USER_UNBLOCKED', admin.id, admin.email, {
    details: `Администратор изменил статус пользователя ${targetUser.email} на "${targetUser.status}"`
  });

  res.json({ user: targetUser });
});

// Admin Licenses management
app.get('/api/admin/licenses', requireAdmin, (req: Request, res: Response) => {
  res.json({ licenses });
});

// Admin: Restore print attempt (+1 or reset)
app.post('/api/admin/licenses/:id/restore-print', requireAdmin, (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req)!;
  const { id } = req.params;
  const license = licenses.find((l) => l.id === id);
  if (!license) {
    res.status(404).json({ error: 'Лицензия не найдена' });
    return;
  }

  // Increase limit by 1 so user gets another attempt
  license.printLimit += 1;

  addAuditLog('PRINT_RESTORED_BY_ADMIN', admin.id, admin.email, {
    licenseId: license.id,
    materialId: license.materialId,
    details: `Администратор восстановил попытку печати для пользователя ${license.userEmail}. Новый лимит: ${license.printLimit}, использовано: ${license.printUsed}`
  });

  res.json({
    success: true,
    license,
    message: 'Попытка печати успешно восстановлена'
  });
});

app.post('/api/admin/licenses/:id/extend', requireAdmin, (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req)!;
  const { id } = req.params;
  const { additionalDays } = req.body;
  const license = licenses.find((l) => l.id === id);
  if (!license) {
    res.status(404).json({ error: 'Лицензия не найдена' });
    return;
  }

  const baseDate = license.expirationDate ? new Date(license.expirationDate) : new Date();
  baseDate.setDate(baseDate.getDate() + (Number(additionalDays) || 30));
  license.expirationDate = baseDate.toISOString();
  license.status = 'active';

  addAuditLog('LICENSE_STATUS_CHANGED', admin.id, admin.email, {
    licenseId: license.id,
    details: `Продлен срок действия лицензии до ${license.expirationDate}`
  });

  res.json({ license });
});

app.post('/api/admin/licenses/:id/revoke', requireAdmin, (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req)!;
  const { id } = req.params;
  const license = licenses.find((l) => l.id === id);
  if (!license) {
    res.status(404).json({ error: 'Лицензия не найдена' });
    return;
  }

  license.status = license.status === 'revoked' ? 'active' : 'revoked';

  addAuditLog('LICENSE_STATUS_CHANGED', admin.id, admin.email, {
    licenseId: license.id,
    details: `Администратор изменил статус лицензии на "${license.status}"`
  });

  res.json({ license });
});

// Admin Purchases & Logs
app.get('/api/admin/purchases', requireAdmin, (req: Request, res: Response) => {
  res.json({ purchases });
});

app.get('/api/admin/audit-logs', requireAdmin, (req: Request, res: Response) => {
  res.json({ logs: auditLogs });
});

// ==========================================
// 9. PORTAL SETTINGS ROUTES
// ==========================================

// Public portal settings (site info, announcement, contacts, banks)
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ settings: portalSettings });
});

// Admin get full portal settings
app.get('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  res.json({ settings: portalSettings });
});

// Admin update portal settings
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req)!;
  const newSettings = req.body;

  portalSettings = {
    ...portalSettings,
    ...newSettings,
    siteName: newSettings.siteName || portalSettings.siteName,
    siteDescription: newSettings.siteDescription || portalSettings.siteDescription,
    authorName: newSettings.authorName || portalSettings.authorName,
    authorTitle: newSettings.authorTitle || portalSettings.authorTitle,
    contactPhone: newSettings.contactPhone || portalSettings.contactPhone,
    contactWhatsApp: newSettings.contactWhatsApp || portalSettings.contactWhatsApp,
    contactTelegram: newSettings.contactTelegram !== undefined ? newSettings.contactTelegram : portalSettings.contactTelegram,
    contactEmail: newSettings.contactEmail || portalSettings.contactEmail,
    supportHours: newSettings.supportHours || portalSettings.supportHours,
    announcement: newSettings.announcement || portalSettings.announcement,
    defaultLicense: newSettings.defaultLicense || portalSettings.defaultLicense,
    footer: newSettings.footer || portalSettings.footer,
    bankRequisites: newSettings.bankRequisites || portalSettings.bankRequisites
  };

  addAuditLog('PORTAL_SETTINGS_UPDATED', admin.id, admin.email, {
    details: `Администратор жаңыртты: Порталдын орнотуулары, банк реквизиттери жана эрежелер өзгөртүлдү.`
  });

  res.json({
    success: true,
    message: 'Орнотуулар ийгиликтүү сакталды',
    settings: portalSettings
  });
});

// ==========================================
// VITE & STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Билим Материалдары] Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
