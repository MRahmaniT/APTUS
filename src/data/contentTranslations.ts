export interface LocalizedContentSeed {
  title: string;
  abstract: string;
  category: string;
}

export const CONTENT_TRANSLATIONS: Record<"fa" | "tr", Record<string, LocalizedContentSeed>> = {
  fa: {
    "single-storey-design": {
      title: "طراحی سازه یک‌طبقه",
      abstract: "راهکار یکپارچه سازه پیش‌ساخته برای ساختمان‌های یک‌طبقه با اجرای سریع سازه و پوسته.",
      category: "طرح‌ها",
    },
    "double-storey-design": {
      title: "طراحی سازه دوطبقه",
      abstract: "سیستم پیش‌ساخته دوطبقه با تعادل میان سرعت اجرا، شفافیت سازه‌ای و انعطاف معماری.",
      category: "طرح‌ها",
    },
    "multi-storey-design": {
      title: "طراحی سازه چندطبقه",
      abstract: "راهکار مقیاس‌پذیر پیش‌ساخته برای پروژه‌های چندطبقه با تکرارپذیری بالا و چرخه اجرای سریع طبقات.",
      category: "طرح‌ها",
    },
    facades: {
      title: "طراحی نما",
      abstract: "راهکارهای نمای بتنی پیش‌ساخته با امکان تنظیم بافت، بازشو، پرداخت و ریتم پنل‌ها.",
      category: "طرح‌ها",
    },
    foundations: {
      title: "فونداسیون‌های پیش‌ساخته",
      abstract: "قطعات فونداسیون کارخانه‌ای برای کاهش عملیات تر در کارگاه و تسریع شروع نصب سازه.",
      category: "المان‌های پیش‌ساخته",
    },
    columns: {
      title: "ستون‌های سازه‌ای",
      abstract: "ستون‌های بتنی پیش‌ساخته دقیق برای ایجاد اسکلت مطمئن پروژه‌های صنعتی و تجاری.",
      category: "المان‌های پیش‌ساخته",
    },
    beams: {
      title: "شاهتیرها و تیرها",
      abstract: "سیستم تیر پیش‌ساخته و پیش‌تنیده برای دهانه‌های بلند، کیفیت قابل کنترل و نصب سریع اسکلت.",
      category: "المان‌های پیش‌ساخته",
    },
    "wall-panels": {
      title: "دیوارهای پیش‌ساخته",
      abstract: "پنل‌های دیواری پیش‌ساخته بادوام برای بسته‌شدن سریع ساختمان، کیفیت سطح کنترل‌شده و عملکرد مناسب پوسته.",
      category: "المان‌های پیش‌ساخته",
    },
    slabs: {
      title: "دال‌های سقف و کف",
      abstract: "دال‌های توخالی و توپر پیش‌ساخته برای دهانه‌های بهینه، تولید تکرارپذیر و اجرای سریع طبقات.",
      category: "المان‌های پیش‌ساخته",
    },
    "tie-beams": {
      title: "شناژهای پیش‌ساخته",
      abstract: "شناژهای بتنی پیش‌ساخته برای هماهنگی فونداسیون و اسکلت با کاهش قالب‌بندی و زمان عمل‌آوری در کارگاه.",
      category: "المان‌های پیش‌ساخته",
    },
    "architectural-panels": {
      title: "پنل‌های معماری",
      abstract: "پنل‌های بتنی پیش‌ساخته سفارشی با ترکیب دوام بتن و آزادی در بیان معماری.",
      category: "المان‌های پیش‌ساخته",
    },
    "corner-elements": {
      title: "المان‌های کنج",
      abstract: "قطعات کنج هماهنگ برای ساده‌سازی اتصال نماها و حفظ خطوط معماری تمیز در گوشه‌ها.",
      category: "المان‌های پیش‌ساخته",
    },
    modular: {
      title: "واحدهای مدولار",
      abstract: "ماژول‌های حجمی بتنی پیش‌ساخته با تکمیل کارخانه‌ای و مونتاژ سریع در سیستم‌های ساختمانی بزرگ‌تر.",
      category: "المان‌های پیش‌ساخته",
    },
    "aips-building-system-introduction": {
      title: "معرفی سیستم ساختمانی AIPS",
      abstract: "APTUS در حال توسعه یک فرایند یکپارچه پیش‌ساخته با تمرکز بر تکرارپذیری، سرعت و کیفیت کنترل‌شده است.",
      category: "شرکت",
    },
    "why-factory-quality-matters": {
      title: "چرا کیفیت کنترل‌شده کارخانه‌ای اهمیت دارد",
      abstract: "انتقال تولید بتن به محیط کنترل‌شده، تکرارپذیری، بازرسی و برنامه‌ریزی را بهبود می‌دهد.",
      category: "دیدگاه‌ها",
    },
    "aptus-industry-exhibition-preview": {
      title: "پیش‌نمایش حضور APTUS در نمایشگاه صنعتی",
      abstract: "نگاهی به سیستم‌ها، نمونه‌ها و گفت‌وگوهای فنی که APTUS در نمایشگاه بعدی ارائه خواهد کرد.",
      category: "رویدادها",
    },
    "industrial-production-facility": {
      title: "مجموعه تولید صنعتی",
      abstract: "راهبرد سازه و پوسته پیش‌ساخته تکرارپذیر برای برنامه اجرایی سریع پروژه صنعتی.",
      category: "صنعتی",
    },
    "modular-residential-concept": {
      title: "کانسپت مسکونی مدولار",
      abstract: "طرح مسکونی مبتنی بر ماژول‌های پیش‌ساخته تکرارشونده، بازشوهای هماهنگ و پرداخت کنترل‌شده کارخانه‌ای.",
      category: "مسکونی",
    },
    "education-building-study": {
      title: "مطالعه ساختمان آموزشی",
      abstract: "مطالعه‌ای پیش‌ساخته با تمرکز بر فضاهای آموزشی بادوام، بسته‌شدن سریع ساختمان و نمای کم‌نیاز به نگهداری.",
      category: "آموزشی",
    },
  },
  tr: {
    "single-storey-design": {
      title: "Tek Katlı Yapı Tasarımı",
      abstract: "Tek katlı yapılar için hızlı taşıyıcı sistem ve cephe kurulumu sağlayan koordineli prefabrik çözüm.",
      category: "Tasarımlar",
    },
    "double-storey-design": {
      title: "İki Katlı Yapı Tasarımı",
      abstract: "Hız, yapısal netlik ve mimari esnekliği dengeleyen tekrarlanabilir iki katlı prefabrik sistem.",
      category: "Tasarımlar",
    },
    "multi-storey-design": {
      title: "Çok Katlı Yapı Tasarımı",
      abstract: "Tekrarlanabilirlik ve hızlı kat döngülerinin önemli olduğu çok katlı projeler için ölçeklenebilir prefabrik yaklaşım.",
      category: "Tasarımlar",
    },
    facades: {
      title: "Cephe Tasarımı",
      abstract: "Doku, açıklık, yüzey ve panel ritminin projeye göre ayarlanabildiği mimari prefabrik cephe çözümleri.",
      category: "Tasarımlar",
    },
    foundations: {
      title: "Prefabrik Temeller",
      abstract: "Şantiyedeki ıslak imalatları azaltan ve taşıyıcı sistem montajını hızlandıran fabrika üretimi temel elemanları.",
      category: "Prefabrik Elemanlar",
    },
    columns: {
      title: "Taşıyıcı Kolonlar",
      abstract: "Ticari ve endüstriyel projeler için güvenilir taşıyıcı omurga oluşturan hassas prefabrik kolonlar.",
      category: "Prefabrik Elemanlar",
    },
    beams: {
      title: "Ana Kirişler ve Kirişler",
      abstract: "Uzun açıklıklar, öngörülebilir kalite ve hızlı montaj için tasarlanmış prefabrik ve öngerilmeli kiriş sistemleri.",
      category: "Prefabrik Elemanlar",
    },
    "wall-panels": {
      title: "Duvar Panelleri",
      abstract: "Dayanıklı cephe, kontrollü yüzey kalitesi ve hızlı bina kapanışı için yüksek performanslı prefabrik duvar panelleri.",
      category: "Prefabrik Elemanlar",
    },
    slabs: {
      title: "Çatı ve Döşeme Plakları",
      abstract: "Verimli açıklıklar, tekrarlanabilir üretim ve hızlı kat döngüleri için boşluklu ve dolu döşeme sistemleri.",
      category: "Prefabrik Elemanlar",
    },
    "tie-beams": {
      title: "Bağ Kirişleri",
      abstract: "Temel ve taşıyıcı sistemi koordine ederken şantiye kalıbını ve kür süresini azaltan prefabrik bağ kirişleri.",
      category: "Prefabrik Elemanlar",
    },
    "architectural-panels": {
      title: "Mimari Paneller",
      abstract: "Betonun dayanıklılığını esnek mimari ifade ile birleştiren özel prefabrik paneller.",
      category: "Prefabrik Elemanlar",
    },
    "corner-elements": {
      title: "Köşe Elemanları",
      abstract: "Cephe geçişlerini sadeleştiren ve birleşimlerde temiz mimari çizgileri koruyan koordineli köşe elemanları.",
      category: "Prefabrik Elemanlar",
    },
    modular: {
      title: "Modüler Üniteler",
      abstract: "Fabrikada tamamlanarak daha büyük bina sistemlerine hızlıca monte edilen hacimsel prefabrik modüller.",
      category: "Prefabrik Elemanlar",
    },
    "aips-building-system-introduction": {
      title: "AIPS Yapı Sistemine Giriş",
      abstract: "APTUS; tekrarlanabilirlik, hız ve kontrollü kaliteye odaklanan entegre bir prefabrik iş akışı geliştiriyor.",
      category: "Şirket",
    },
    "why-factory-quality-matters": {
      title: "Fabrika Kontrollü Kalite Neden Önemlidir",
      abstract: "Beton üretimini kontrollü ortama taşımak tekrarlanabilirliği, denetimi ve planlamayı iyileştirir.",
      category: "İçgörüler",
    },
    "aptus-industry-exhibition-preview": {
      title: "APTUS Endüstri Fuarı Önizlemesi",
      abstract: "APTUS'un bir sonraki sektör fuarına taşıyacağı sistemler, prototipler ve teknik görüşmeler için kısa bir önizleme.",
      category: "Etkinlikler",
    },
    "industrial-production-facility": {
      title: "Endüstriyel Üretim Tesisi",
      abstract: "Hızlı endüstriyel inşaat sırasına göre tasarlanmış tekrarlanabilir prefabrik taşıyıcı ve cephe stratejisi.",
      category: "Endüstriyel",
    },
    "modular-residential-concept": {
      title: "Modüler Konut Konsepti",
      abstract: "Tekrarlanan prefabrik modüller, koordineli açıklıklar ve fabrika kontrollü yüzeyler üzerine kurulu konut konsepti.",
      category: "Konut",
    },
    "education-building-study": {
      title: "Eğitim Yapısı Çalışması",
      abstract: "Dayanıklı öğrenme alanları, hızlı bina kapanışı ve düşük bakım gerektiren dış sistemlere odaklanan prefabrik çalışma.",
      category: "Eğitim",
    },
  },
};
