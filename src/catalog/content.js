// Editorial content is kept in one file for a backend-free catalog.
// Replace the contact placeholders only with verified company details.

export const company = {
  persianName: "آپتوس ایران",
  legalDescriptor: "مجتمع تولیدی و پژوهشی آپتوس ایران",
  englishName: "APTUS IRAN",
  about: "آپتوس ایران با تمرکز بر تولید صنعتی قطعات بتنی پیش‌ساخته، به توسعه سامانه‌ای مدولار برای ساخت سوله‌های صنعتی پرداخته است. در این رویکرد، طراحی قطعات، تولید کارخانه‌ای، حمل و نصب به‌صورت یک مجموعه هماهنگ دیده می‌شوند تا اجرای سازه با کیفیت قابل کنترل و عملیات کارگاهی کمتر انجام شود.",
  location: "ایران",
  address: "کرج - مهرشهر - بلوار ارم - خیابان دوم غربی - مجتمع تولیدی و پژوهشی آپتوس ایران", // نشانی دقیق شرکت یا کارخانه
  phone: "026 - 33100", // شماره تماس رسمی، با پیش‌شماره
  certificates: [], // نمونه: [{ title: "نام گواهی", issuer: "مرجع صدور", href: "/catalog/assets/...pdf" }]
};

// Explore 3D view: coordinates are PERCENT of the 3D image itself (x from left, y from top).
//   pin    = where the numbered circle sits (in free white space)
//   anchor = the exact point on the part that the dashed line touches
// Tip: open the site with ?calibrate=1 and click on the image to read new coordinates.
export const spans = [
  { module: 5, clearCm: 1200, axesCm: 1320 },
  { module: 6, clearCm: 1440, axesCm: 1560 },
  { module: 7, clearCm: 1680, axesCm: 1800 },
  { module: 8, clearCm: 1920, axesCm: 2040 },
  { module: 9, clearCm: 2160, axesCm: 2280 },
  { module: 10, clearCm: 2400, axesCm: 2520 }
];

export const heights = [
  { module: 3, underRoofCm: 720 },
  { module: 4, underRoofCm: 960 },
  { module: 5, underRoofCm: 1200 }
];

export const parts = [
  {
    id: "column", number: "01", name: "ستون پیش‌ساخته", english: "COLUMN",
    image: "/catalog/assets/parts/column.png", pin: [27.6, 41.4], anchor: [38.2, 48.1],
    role: "عضو باربر قائم و محل استقرار تیرهای سازه",
    description: "ستون پیش‌ساخته، بار سقف را به فونداسیون منتقل می‌کند. نشیمن‌های تعبیه‌شده روی قطعه، موقعیت اتصال اجزای بالایی قاب را مشخص می‌کنند.",
    points: ["جزئی از قاب اصلی سازه", "دارای محل اتصال تیر طولی و رفتر", "استقرار در فونداسیون گلدانی"]
  },
  {
    id: "longitudinal-beam", number: "02", name: "تیر طولی", english: "LONGITUDINAL BEAM",
    image: "/catalog/assets/parts/longitudinal-beam.png", pin: [48.0, 18.1], anchor: [53.1, 25.4],
    role: "پیوند قاب‌ها در امتداد طول سوله",
    description: "تیر طولی میان قاب‌های متوالی قرار می‌گیرد و پیوستگی سازه را در جهت طولی فراهم می‌کند. جایگاه و جزئیات اتصال آن با طرح نهایی سازه هماهنگ می‌شود.",
    points: ["اتصال قاب‌های متوالی", "تولید به‌صورت قطعه پیش‌ساخته", "هماهنگ با مدول‌بندی طولی"]
  },
  {
    id: "girder", number: "03", name: "شاه‌تیر / رفتر بتنی", english: "ROOF GIRDER",
    image: "/catalog/assets/parts/girder.png", pin: [85.5, 13.5], anchor: [82.4, 19.7],
    role: "عضو اصلی باربر سقف در دهانه سوله",
    description: "رفتر یا شاه‌تیر شیب‌دار، دهانه قاب را پوشش می‌دهد و بار اجزای سقف را به ستون‌ها منتقل می‌کند. ابعاد آن متناسب با تیپ دهانه و طراحی پروژه تعیین می‌شود.",
    points: ["تشکیل فرم شیب‌دار سقف", "انتقال بار سقف به ستون‌ها", "هماهنگ با تیپ انتخابی دهانه"]
  },
  {
    id: "purlin", number: "04", name: "پرلین", english: "PURLIN",
    image: "/catalog/assets/parts/purlin.png", pin: [73.9, 13.1], anchor: [67.4, 18.6],
    role: "تکیه‌گاه فرعی پوشش سقف",
    description: "پرلین‌ها روی سازه اصلی سقف قرار می‌گیرند و زیرسازی لازم برای پوشش نهایی سقف را ایجاد می‌کنند. آرایش آن‌ها با نوع پوشش انتخابی هماهنگ می‌شود.",
    points: ["عضو فرعی سقف", "تکیه‌گاه پوشش نهایی", "هماهنگ با آرایش رفترها"]
  },
  {
    id: "self-standing-wall", number: "05", name: "دیوار خودایستا", english: "SELF-STANDING WALL",
    image: "/catalog/assets/parts/self-standing-wall.png", pin: [52.9, 69.4], anchor: [57.5, 62.6],
    role: "پوشش پیرامونی بتنی به سفارش خریدار",
    description: "در صورت سفارش، امکان اجرای دیوار بتنی خودایستا تا ارتفاع ۲٫۲۰ متر از کف تمام‌شده هم‌زمان با اسکلت سوله پیش‌بینی شده است.",
    points: ["گزینه سفارشی برای پیرامون سوله", "ارتفاع تا ۲٫۲۰ متر از کف تمام‌شده", "قابل اجرا همراه با اسکلت"]
  },
  {
    id: "tie-beam", number: "06", name: "شناژ", english: "TIE BEAM",
    image: "/catalog/assets/parts/tie-beam.png", pin: [31.2, 60.6], anchor: [41.2, 64.9],
    role: "پیوند اجزای تراز پایه",
    description: "شناژ در تراز پایه، میان اجزای فونداسیون قرار می‌گیرد و در یکپارچگی مجموعه و تعریف لبه‌های استقرار قطعات پیرامونی نقش دارد.",
    points: ["قرارگیری در تراز پایه", "هماهنگی با فونداسیون", "قطعه‌ای از مجموعه پیش‌ساخته"]
  },
  {
    id: "foundation", number: "07", name: "فونداسیون گلدانی", english: "POCKET FOUNDATION",
    image: "/catalog/assets/parts/foundation.png", pin: [22.2, 48.1], anchor: [38.5, 52.8],
    role: "محل استقرار و انتقال بار ستون به زمین",
    description: "فونداسیون گلدانی برای جانمایی ستون پیش‌ساخته طراحی می‌شود. شکل گلدانی آن محل استقرار ستون را مشخص کرده و مراحل نصب قطعات سازه‌ای را منظم می‌کند.",
    points: ["تکیه‌گاه ستون پیش‌ساخته", "محل مشخص برای جانمایی ستون", "جزئی از سیستم پی و قاب"]
  },
  {
    id: "wall-base", number: "08", name: "زیر دیواری", english: "WALL BASE",
    image: "/catalog/assets/parts/wall-base.png", pin: [11.3, 82.8], anchor: [17.2, 77.1],
    role: "پایه استقرار دیوار پیرامونی",
    description: "قطعه زیر دیواری در امتداد پیرامون سوله قرار می‌گیرد و بستر نصب دیوارهای بتنی پیش‌ساخته را تشکیل می‌دهد.",
    points: ["قطعه پیرامونی در تراز پایین", "تکیه‌گاه دیوار بتنی", "هماهنگ با آرایش فونداسیون"]
  },
  {
    id: "corner-wall", number: "09", name: "دیوار کنج بتنی پیش‌ساخته", english: "CORNER WALL",
    image: "/catalog/assets/part-gallery/corner-wall-1.png", pin: null, anchor: null,
    role: "تکمیل جداره پیرامونی در چهار گوشه سوله",
    description: "قطعه‌ای پیش‌ساخته برای پوشش محل تلاقی دیوارهای خودایستا و ستون‌های گوشه.",
    points: ["استقرار در چهار گوشه", "تکمیل پیوستگی ظاهری جداره", "طراحی متناسب با هندسه اتصال"]
  }
];

export const benefits = [
  "سرعت بالای ساخت و اجرا",
  "کنترل کیفیت در محیط کارخانه",
  "دوام در شرایط آب‌وهوایی مختلف",
  "مقاومت در برابر حریق مطابق الزامات طرح",
  "کاهش عملیات بتن‌ریزی درجا هنگام نصب",
  "امکان پیش‌بینی جرثقیل سقفی تا ۱۰ تن",
  "انعطاف در انتخاب پوشش سقف و دیوار",
  "قابلیت اجرا در پهنه‌های لرزه‌خیز ایران",
  "امکان ساماندهی مسیر تأسیسات",
  "هماهنگی مدول‌ها با فضاهای جانبی",
  "امکان ایجاد بازشو و دسترسی در دهانه‌ها",
  "کاهش وابستگی کارگاه به زیرساخت‌های اولیه"
];

// Icons for the benefits ribbon (files live in /catalog/assets/benefits/)
export const benefitIcons = [
  { file: "stopwatch", title: "سرعت در اجرای اسکلت و پوسته خارجی بنا" },
  { file: "pci", title: "تولید بر اساس استانداردهای بین‌المللی PCI" },
  { file: "aci", title: "طراحی مطابق آیین‌نامه ACI" },
  { file: "isiri", title: "انطباق با استانداردهای ملی ایران" },
  { file: "code-2800", title: "مقاوم در برابر زلزله مطابق استاندارد ۲۸۰۰" },
  { file: "earthquake", title: "رفتار مطمئن در پهنه‌های لرزه‌خیز" },
  { file: "mabhas6", title: "بارگذاری منطبق بر مبحث ششم مقررات ملی" },
  { file: "expand", title: "امکان توسعه در سطح" },
  { file: "storage", title: "انبارسازی در فضای باز برای مدت طولانی" },
  { file: "steel", title: "کاهش قابل توجه مصرف مصالح فولادی" },
  { file: "no-brick", title: "حذف مصالح بنایی در دیوار پیرامونی" },
  { file: "blast", title: "مقاوم در برابر موج انفجار" },
  { file: "chemical", title: "مقاوم در برابر خوردگی شیمیایی" },
  { file: "fire", title: "مقاومت در برابر حریق" },
  { file: "energy", title: "عایق حرارتی و جلوگیری از اتلاف انرژی" },
  { file: "acoustic", title: "عایق‌بندی آکوستیک" },
  { file: "recycle", title: "قابلیت بازیافت" },
  { file: "mixer-truck", title: "صرفه‌جویی در حمل مصالح دیوارکشی و فونداسیون" },
  { file: "payback", title: "کاهش دوره بازگشت سرمایه" },
  { file: "productivity", title: "افزایش بهره‌وری و عمر مفید بنا" },
  { file: "savings", title: "کاهش هزینه‌های بالاسری و نماسازی" }
];
