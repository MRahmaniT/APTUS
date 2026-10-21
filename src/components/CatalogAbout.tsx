import { useAppContext } from "../controllers/AppContext";
import { catalogDetails } from "../data/catalogDetails";
import { catalogPresentation } from "../data/catalogPresentation";

// Original catalog company introduction, mission statements, goals and SVG icons.
const about = {
  "icons": {
    "research": "<svg viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14 6h16M18 6v18L6 50a5 5 0 0 0 4.5 7.5h24A5 5 0 0 0 39 50L26 24V6\"/><path d=\"M11 40h24\"/><circle cx=\"47\" cy=\"23\" r=\"7\"/><path d=\"M47 11v4M47 31v4M35 23h4M55 23h4M38.5 14.5l2.8 2.8M52.7 28.7l2.8 2.8M55.5 14.5l-2.8 2.8M41.3 28.7l-2.8 2.8\"/><circle cx=\"22\" cy=\"47\" r=\"1.3\"/><circle cx=\"29\" cy=\"50\" r=\"1.3\"/></svg>",
    "products": "<svg viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 22 24 14l18 8-18 8Z\"/><path d=\"M6 22v14l18 8V30M24 44l18-8V22\"/><path d=\"M34 50l12 6 14-7-8-4\"/><path d=\"M46 42l14-7 3 2-14 7\"/></svg>",
    "contractor": "<svg viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 58V10M22 58V10M12 20h10M12 30h10M12 40h10M12 50h10M12 20l10 10M12 30l10 10M12 40l10 10\"/><path d=\"M3 10h42M17 3v7M35 10v10\"/><path d=\"M32 20h6v5h-6z\"/><path d=\"M33 58V42h24v16M29 58h32\"/><path d=\"M38 46h2M44 46h2M50 46h2M38 52h2M44 52h2M50 52h2\"/></svg>"
  },
  "missions": [
    {
      "icon": "research",
      "title": "تحقیق و توسعه",
      "text": "تولید دانش و نوآوری در عرصه صنعت بتن با اجرای پروژه‌های تحقیقاتی و پژوهشی"
    },
    {
      "icon": "products",
      "title": "تولید انواع محصولات بتنی",
      "text": "شامل بتن آماده، کفپوش، جدول، بلوک، دیوار، نیوجرسی و …"
    },
    {
      "icon": "contractor",
      "title": "پیمانکار عمومی",
      "text": "با داشتن بالاترین رتبه مرتبط کشوری"
    }
  ],
  "goals": [
    "ارتقاء جایگاه اجتماعی سازمان",
    "توسعه بازارهای فروش و افزایش سهم بازار",
    "ارتقاء سطح عملکرد و مشارکت منابع انسانی",
    "توسعه و ارتقاء سطح بهره‌وری فرآیند تولید",
    "ثبات کیفیت محصولات تولیدی و ترویج هویت آن در بازار",
    "مشتری‌مداری و ایجاد بالاترین استانداردها برای رضایتمندی مشتریان",
    "توسعه و ارتقاء اصول ایمنی، بهداشت و محیط زیست در محدوده کاری سازمان"
  ],
  "introTitle": "آپتوس ایران",
  "intro": "شرکت آپتوس ایران با بیش از چهار دهه فعالیت در صنعت ساختمان کشور به‌عنوان یک سازمان دانش‌محور، همواره در تلاش بوده است که با اتکا به دانش فنی و تجربه نیروی انسانی متخصص خود نقش بسزایی را در توسعه و تعالی زیرساخت‌های عمرانی و تأمین نیاز مشتریان ایفا نماید؛ از این‌رو مأموریت یا محدوده کاری اصلی این شرکت به شرح ذیل معین گردیده است:",
  "slogan": "ما کیفیت می‌سازیم",
  "philosophy": "بر این اساس روند حرکتی شرکت آپتوس ایران با اعتقاد راسخ به اصل بهبود مستمر و اجرای اثربخش فرآیندهای کاری در چارچوب نظام مدیریت یکپارچه تداوم یافته است؛ از این‌رو کاملاً مشهود است که با تثبیت سطح کیفی محصولات، شعار «ما کیفیت می‌سازیم» در تأمین رضایت مشتریان و سایر ذینفعان تبلور یافته است. با چنین نگرشی، تعالی و نیل به اهداف ذیل، مؤلفه‌های رشد و توسعه مجموعه را مشخص می‌نماید:"
};
function Arrow() {
 return <svg className="directional-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export default function CatalogAbout() {
 const {locale}=useAppContext();
 const d=catalogDetails(locale),ui=catalogPresentation[locale];
 return <div className="section-inner">
  <div className="section-head"><div><span className="eyebrow"/><h2>{ui.about.title}</h2></div></div>
  {locale==="fa" ? <>
   <div className="about-intro">
    <div className="about-badge"><strong>40<sup>+</sup></strong><span>سال فعالیت در صنعت ساختمان کشور</span></div>
    <div className="about-intro-text"><h3>{about.introTitle}</h3><p>{about.intro}</p></div>
   </div>
   <div className="mission-grid">{about.missions.map((mission,index)=><article className="mission-card" key={mission.icon}><span className="mission-index" aria-hidden="true">{"0"+(index+1)}</span><div className="mission-icon" dangerouslySetInnerHTML={{__html:about.icons[mission.icon as keyof typeof about.icons]}}/><h4>{mission.title}</h4><p>{mission.text}</p></article>)}</div>
   <div className="about-philosophy">
    <div className="about-slogan"><span className="slogan-mark" aria-hidden="true">“</span><strong>{about.slogan}</strong><p>{about.philosophy}</p></div>
    <ol className="goal-list">{about.goals.map((goal,index)=><li key={goal}><bdi>{String(index+1).padStart(2,"0")}</bdi><span>{goal}</span></li>)}</ol>
   </div>
  </> : <div className="about-grid"><div className="about-quote"><span className="large-quote" aria-hidden="true">“</span><p>{ui.about.quote}</p><span className="about-rule"/></div><div className="about-body"><p>{d.about}</p><p>{ui.about.extra}</p><a className="text-link" href="#system">{ui.about.link}<Arrow/></a></div></div>}
 </div>;
}
