import React, { useEffect, useState } from "react";
import AccordionGallery from "../components/AccordionGallery";
import { useAppContext } from "../controllers/AppContext";
import { ApiService } from "../services/api";


export default function Home() {
  const { t, locale } = useAppContext();
  
  const isFa = locale === 'fa';
  const isTr = locale === 'tr';

  const [cmsData, setCmsData] = useState<{ title?: string, subtitle?: string }>({});

  useEffect(() => {
    async function fetchCMS() {
      try {
        const cmsData = await ApiService.getCMSContent("home");

        if (cmsData) {
          setCmsData(cmsData);
        }
      } catch (e) {
        console.error("Failed to load CMS", e);
      }
    }

    fetchCMS();
  }, []);

  const GALLERY_ITEMS = [
    {
      image: "/images/i.avif",
      label: t("nav", "app_industrial"),
      link: "/applications/industrial",
      alt: "Industrial facility",
    },
    {
      image: "/images/w.avif",
      label: t("nav", "app_warehouses"),
      link: "/applications/warehouses",
      alt: "Warehouse interior",
    },
    {
      image: "/images/mu.jpg",
      label: t("nav", "app_manufacturing"),
      link: "/applications/manufacturing",
      alt: "Production facility",
    },
    {
      image: "/images/s.jpg",
      label: t("nav", "app_sports"),
      link: "/applications/sports",
      alt: "Sports facility structure",
    },
    {
      image: "/images/e.jpg",
      label: t("nav", "app_educational"),
      link: "/applications/educational",
      alt: "Educational building",
    },
  ];

  const PRODUCTS_GRID = [
    {
      src: "https://images.unsplash.com/photo-1614595737476-42487331b8a1?w=600&h=600&fit=crop&auto=format",
      alt: "Precast concrete panels on modern building",
      title: isFa ? "پنل‌های دیواری" : isTr ? "Duvar Panelleri" : "Wall Panels",
      description: isFa 
        ? "پنل‌های دیواری پیش‌ساخته با عملکرد بالا که برای نصب سریع و عایق حرارتی فوق‌العاده طراحی شده‌اند."
        : isTr ? "Hızlı kurulum ve üstün ısı yalıtımı için tasarlanmış yüksek performanslı prefabrik duvar panelleri."
        : "High-performance precast wall panels designed for rapid installation and superior thermal insulation.",
      link: "/products/wall-panels"
    },
    {
      src: "https://images.unsplash.com/photo-1549791084-5f78368b208b?w=600&h=600&fit=crop&auto=format",
      alt: "White concrete residential building",
      title: isFa ? "ستون‌های سازه‌ای" : isTr ? "Yapısal Kolonlar" : "Structural Columns",
      description: isFa
        ? "ستون‌های مهندسی دقیق که ستون فقرات سازه‌ای پروژه‌های تجاری سنگین را فراهم می‌کنند."
        : isTr ? "Ağır ticari projeler için yapısal omurga sağlayan hassas mühendislik kolonları."
        : "Precision-engineered columns that provide the structural backbone for heavy-duty commercial projects.",
      link: "/products/columns"
    },
    {
      src: "https://images.unsplash.com/photo-1614595737683-1740e41bfaac?w=600&h=600&fit=crop&auto=format",
      alt: "Concrete building with bare trees",
      title: isFa ? "دال‌های سقف و کف" : isTr ? "Çatı ve Zemin Döşemeleri" : "Roof & Floor Slabs",
      description: isFa
        ? "دال‌های توخالی و توپر بهینه‌سازی شده برای دهانه‌های بلند و ظرفیت باربری بالا."
        : isTr ? "Uzun açıklıklar ve yüksek yük taşıma kapasiteleri için optimize edilmiş boşluklu ve dolu döşemeler."
        : "Hollow-core and solid slabs optimized for long spans and high load-bearing capacities.",
      link: "/products/slabs"
    },
    {
      src: "https://images.unsplash.com/photo-1586871608370-4adee64d1794?w=600&h=600&fit=crop&auto=format",
      alt: "White concrete wall detail",
      title: isFa ? "شاه‌تیرها و تیرها" : isTr ? "Kirişler" : "Girders & Beams",
      description: isFa
        ? "تیرهای بتنی پیش‌تنیده که دوام و انعطاف‌پذیری معماری بی‌نظیری را ارائه می‌دهند."
        : isTr ? "Eşsiz dayanıklılık ve mimari esneklik sunan öngerilmeli beton kirişler."
        : "Pre-stressed concrete beams offering unmatched durability and architectural flexibility.",
      link: "/products/beams"
    },
    {
      src: "https://images.unsplash.com/photo-1720762256650-ea429f429226?w=600&h=600&fit=crop&auto=format",
      alt: "Black and white building facade",
      title: isFa ? "سیستم‌های نما" : isTr ? "Cephe Sistemleri" : "Facade Systems",

      description: isFa
        ? "پنل‌های پیش‌ساخته معماری با پرداخت‌های سفارشی، بافت‌ها و قاب‌های یکپارچه پنجره."
        : isTr ? "Özel yüzeyler, dokular ve entegre pencere çerçeveleri ile mimari prefabrik paneller."
        : "Architectural precast panels with custom finishes, textures, and integrated window frames.",
      link: "/products/facades"
    },
    {
      src: "https://images.unsplash.com/photo-1691425700573-5e2e6e4f6157?w=600&h=600&fit=crop&auto=format",
      alt: "Building with multiple balconies",
      title: isFa ? "واحدهای ماژولار" : isTr ? "Modüler Üniteler" : "Modular Units",
      description: isFa
        ? "ماژول‌های سه‌بعدی کاملاً حجمی بتنی که آماده نصب سریع تحویل داده می‌شوند."
        : isTr ? "Tak ve çalıştır montaj için hazır teslim edilen tamamen hacimsel 3D beton modüller."
        : "Fully volumetric 3D concrete modules delivered ready for plug-and-play assembly.",
      link: "/products/modular"
    }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-3">
            {isFa ? "سیستم‌های بتن پیش‌ساخته" : isTr ? "Prefabrik Beton Sistemleri" : "Precast Concrete Systems"}
          </p>
          <h1
            style={{ fontFamily: isFa ? "inherit" : "var(--font-display)" }}
            className="text-5xl md:text-6xl font-semibold leading-[1.05] text-[#111] max-w-2xl mb-4"
          >
            {cmsData.title ? (
              <>{cmsData.title}</>
            ) : isFa ? (
              <>ساخت آینده،<br /><em className="font-normal not-italic">پنل به پنل</em></>
            ) : isTr ? (
              <>Geleceği inşa ediyoruz,<br /><em className="font-normal italic">panel panel</em></>
            ) : (
              <>Building the future,<br /><em className="font-normal italic">panel by panel</em></>
            )}
          </h1>
          <p className="text-base font-light text-[#666] max-w-lg leading-relaxed whitespace-pre-line">
            {cmsData.subtitle ? (
              <>{cmsData.subtitle}</>
            ) : isFa 
              ? "قطعات بتنی پیش‌ساخته با مهندسی دقیق برای پروژه‌های مسکونی، تجاری و زیربنایی در سراسر جهان."
              : isTr 
              ? "Dünya çapında konut, ticari ve altyapı projeleri için hassas mühendislik ürünü prefabrik beton elemanlar."
              : "Precision-engineered precast concrete elements for residential, commercial, and infrastructure projects worldwide."}
          </p>
        </div>

        <AccordionGallery
          items={GALLERY_ITEMS}
          defaultIndex={2}
          expandRatio={0.52}
          trigger="hover"
          duration={0.5}
          height={500}
          gap={8}
          radius={8}
          grayscale={true}
          showLabels={true}
          accentColor="#e5c87a"
          overlayColor="#0a0a0a"
        />
      </section>

      {/* Explanation + 9-cell grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 border-t border-[#e5e5e0]">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-14 items-start">
          {/* Left: explanation */}
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-4">
              {isFa ? "آنچه ما می‌سازیم" : isTr ? "Ne İnşa Ediyoruz" : "What We Build"}
            </p>
            <h2
              style={{ fontFamily: isFa ? "inherit" : "var(--font-display)" }}
              className="text-4xl font-semibold leading-tight text-[#111] mb-6"
            >
              {isFa ? (
                <>بتن پیش‌ساخته،<br /><em className="font-normal not-italic">بازآفرینی شده</em></>
              ) : isTr ? (
                <>Prefabrik beton,<br /><em className="font-normal italic">yeniden hayal edildi</em></>
              ) : (
                <>Precast concrete,<br /><em className="font-normal italic">reimagined</em></>
              )}
            </h2>

            <p className="text-justify text-[15px] text-[#444] leading-relaxed mb-4">
              {isFa 
                ? "Aptus متخصص در قطعات بتنی پیش‌ساخته در کارخانه - دیوارها، دال‌ها، ستون‌ها، تیرها و واحدهای ماژولار کامل - است که آماده مونتاژ در محل تحویل داده می‌شوند. این امر زمان ساخت را به شدت کاهش داده و کیفیت ثابت را تضمین می‌کند."
                : isTr 
                ? "Aptus, sahada montaja hazır olarak teslim edilen fabrikada üretilmiş prefabrik beton bileşenlerde (duvarlar, döşemeler, kolonlar, kirişler ve tam modüler üniteler) uzmanlaşmıştır. Bu, inşaat süresini önemli ölçüde azaltır ve tutarlı kaliteyi garanti eder."
                : "Aptus specializes in off-site manufactured precast concrete components — walls, slabs, columns, beams, and full modular units — that are delivered ready to assemble on site. This dramatically reduces construction time and guarantees consistent quality."}
            </p>

            <p className="text-justify text-[15px] text-[#444] leading-relaxed mb-4">
              {isFa 
                ? "خانه‌های پیش‌ساخته ما برای کارایی حرارتی، مقاومت لرزه‌ای و طول عمر بالا مهندسی شده‌اند. هر پنل قبل از ارسال به محل پروژه، در یک محیط کنترل‌شده تحت پروتکل‌های سختگیرانه تضمین کیفیت ریخته‌گری می‌شود."
                : isTr 
                ? "Prefabrik evlerimiz ısı yalıtımı, sismik direnç ve uzun ömür için tasarlanmıştır. Her panel, proje sahasına gönderilmeden önce sıkı QA protokolleri altında iklim kontrollü bir tesiste dökülür."
                : "Our precast houses are engineered for thermal efficiency, seismic resistance, and longevity. Each panel is cast in a climate-controlled facility under rigorous QA protocols before shipping to the project site."}
            </p>

            <p className="text-justify text-[15px] text-[#444] leading-relaxed mb-8">
              {isFa 
                ? "چه در حال ساخت یک خانه ویلایی تک‌خانواره باشید، چه یک مجتمع مسکونی چند طبقه یا یک تاسیسات تجاری، ما راه‌حل‌های کلید در دست پیش‌ساخته را از کمک در طراحی تا پشتیبانی نصب ارائه می‌دهیم."
                : isTr 
                ? "İster tek ailelik bir ev, ister çok katlı bir konut kompleksi veya ticari bir tesis inşa ediyor olun, tasarımdan kurulum desteğine kadar anahtar teslimi prefabrik çözümler sunuyoruz."
                : "Whether you are building a single-family home, a multi-storey residential complex, or a commercial facility, we supply turnkey precast solutions from design assistance through installation support."}
            </p>

            <div className="grid grid-cols-2 gap-6 border-t border-[#e5e5e0] pt-8">
              {[
                { value: "30+", label: isFa ? "سال تجربه" : isTr ? "Yıllık Deneyim" : "Years of expertise" },
                { value: "1,200+", label: isFa ? "پروژه موفق" : isTr ? "Tamamlanan Proje" : "Projects completed" },
                { value: "48 hrs", label: isFa ? "میانگین زمان تحویل پنل" : isTr ? "Ort. Panel Teslimatı" : "Avg. panel delivery" },
                { value: "ISO 9001", label: isFa ? "کیفیت تایید شده" : isTr ? "Sertifikalı Kalite" : "Certified quality" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p
                    style={{ fontFamily: isFa ? "inherit" : "var(--font-display)" }}
                    className="text-3xl font-semibold text-[#111]"
                  >
                    {value}
                  </p>
                  <p className="text-xs text-[#888] mt-1 leading-snug">{label}</p>
                </div>
              ))}
            </div>

            <a
              href="/projects"
              className="inline-flex items-center gap-2 mt-10 px-6 py-3 bg-[#111] text-white text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
            >
              {isFa ? "مشاهده تمام پروژه‌ها" : isTr ? "Tüm Projeleri Görüntüle" : "View all projects"}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Right: Products grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRODUCTS_GRID.map(({ src, alt, title, description, link }) => (
              <a
                href={link}
                key={title}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-[#e0e0db] block"
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Hover Backdrop Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 group-hover:backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  {/* Title (Always visible, shifts up on hover) */}
                  <h3 className="text-xl font-bold mb-0 group-hover:mb-3 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                    {title}
                  </h3>
                  
                  {/* Hidden content (Slides up and fades in) */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                    <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 ease-[cubic-bezier(0.25,1,0.5,1)]">
                      <p className="text-sm text-gray-200 line-clamp-3 mb-5 font-light leading-relaxed">
                        {description}
                      </p>
                      
                      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300">
                        {isFa ? "اطلاعات بیشتر" : isTr ? "Daha Fazla" : "Learn more"}
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* AIPS Building System Section */}
      <section className="bg-[#111] text-white py-24 rounded-[2rem] max-w-7x1 mx-auto overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#e5c87a] mb-4 uppercase">
                {isFa ? "سیستم ساختمانی AIPS" : isTr ? "AIPS Yapı Sistemi" : "AIPS Building System"}
              </p>
              <h2
                style={{ fontFamily: isFa ? "inherit" : "var(--font-display)" }}
                className="text-4xl md:text-5xl font-semibold leading-tight mb-8"
              >
                {isFa ? (
                  <>سیستم پیش‌ساخته<br />یکپارچه پیشرفته</>
                ) : isTr ? (
                  <>Gelişmiş Entegre<br />Prefabrik Sistem</>
                ) : (
                  <>Advanced Integrated<br />Precast System</>
                )}
              </h2>
              
              <div className="text-justify space-y-6 text-[#a1a1aa] text-lg font-light leading-relaxed">
                <p>
                  {isFa 
                    ? "سیستم AIPS (سیستم پیش‌ساخته یکپارچه پیشرفته) نشان‌دهنده اوج مهندسی سازه مدرن است. با انتقال 80 درصد از فرآیند ساخت‌وساز به یک محیط کنترل‌شده کارخانه‌ای، ما تاخیرهای درون کارگاهی، ضایعات و اثرات زیست‌محیطی را به شدت کاهش می‌دهیم."
                    : isTr 
                    ? "AIPS (Gelişmiş Entegre Prefabrik Sistem), modern yapı mühendisliğinin zirvesini temsil eder. İnşaat sürecinin %80'ini kontrollü bir fabrika ortamına taşıyarak saha içi gecikmeleri, israfı ve çevresel etkiyi büyük ölçüde azaltıyoruz."
                    : "The AIPS (Advanced Integrated Precast System) represents the pinnacle of modern structural engineering. By moving 80% of the construction process to a controlled factory environment, we drastically reduce on-site delays, waste, and environmental impact."}
                </p>
                <p>
                  {isFa 
                    ? "طراحی شده برای مقیاس‌پذیری و مقاومت در برابر زلزله، AIPS از دال‌های توخالی پیش‌تنیده، دیوارهای بتنی خودتراکم و اتصالات صلب اختصاصی که با دقت مکانیکی مونتاژ می‌شوند استفاده می‌کند."
                    : isTr 
                    ? "Ölçeklenebilirlik ve sismik dayanıklılık için tasarlanan AIPS, öngerilmeli boşluklu döşemeler, kendiliğinden yerleşen beton duvarlar ve mekanik hassasiyetle monte edilen tescilli rijit bağlantılar kullanır."
                    : "Designed for scalability and seismic resilience, AIPS utilizes pre-stressed hollow core slabs, self-consolidating concrete walls, and proprietary rigid connections that assemble with mechanical precision."}
                </p>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{isFa ? "۵۰٪ سریعتر" : isTr ? "%50 Daha Hızlı" : "50% Faster"}</h4>
                  <p className="text-sm text-[#a1a1aa]">
                    {isFa ? "تسریع در زمان‌بندی تحویل پروژه در مقایسه با روش‌های سنتی ریخته‌گری در محل." : isTr ? "Geleneksel yerinde döküm yöntemlerine kıyasla proje teslim sürelerinde hızlanma." : "Acceleration in project delivery timelines compared to traditional cast-in-place methods."}
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{isFa ? "ضایعات صفر" : isTr ? "Sıfır Atık" : "Zero Waste"}</h4>
                  <p className="text-sm text-[#a1a1aa]">
                    {isFa ? "بهینه‌سازی قالب‌بندی و استفاده از بتن که منجر به ضایعات مواد نزدیک به صفر می‌شود." : isTr ? "Sıfıra yakın malzeme atığı ile sonuçlanan optimize edilmiş kalıp ve beton kullanımı." : "Optimized formwork and concrete utilization resulting in near-zero material waste."}
                  </p>
                </div>
              </div>
              
              <a
                href="/aips"
                className="inline-flex items-center gap-2 mt-12 px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                {isFa ? "کشف سیستم AIPS" : isTr ? "AIPS Sistemini Keşfedin" : "Discover the AIPS System"}
              </a>
            </div>

            {/* Right Image */}
            <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&h=1000&fit=crop&auto=format"
                alt="AIPS Structural Engineering Diagram"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent"></div>
              
              {/* Overlay Badge */}
              <div className="absolute bottom-8 left-8 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#e5c87a]"></div>
                  <span className="text-sm font-medium tracking-wide">
                    {isFa ? "گرید لرزه‌ای A+" : isTr ? "Sismik Sınıf A+" : "Seismic Grade A+"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {isFa ? "تست شده و تایید شده برای مناطق با زلزله‌خیزی بالا." : isTr ? "Yüksek büyüklükteki bölgeler için test edilmiş ve onaylanmıştır." : "Tested and certified for high-magnitude zones."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
