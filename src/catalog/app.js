import { company, spans, heights, parts, benefitIcons } from "./content.js";
import { copy, translatedParts } from "./i18n.js";
import { partCopy, benefitGroups, applications, facades, documents } from "./supplied-content.js";
import { editorialUI, editorialParts, editorialBenefits, editorialApplications, editorialDocumentTitles } from "./editorial-i18n.js";
export function mountCatalog(app, locale = "fa") {
    const controller = new AbortController();
    const params = new URLSearchParams(window.location.search);
    const lang = locale;
    const ui = copy[lang];
    const extra = editorialUI[lang];
    const isFa = lang === "fa";
    const number = new Intl.NumberFormat(lang === "fa" ? "en-US" : lang === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 1 });
    const n = value => number.format(value);
    const text = (template, values = {}) => Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);
    const faPartRoles = {
        column: "عضو اصلی باربر قائم و جانبی",
        "longitudinal-beam": "اتصال گیردار قاب‌های اصلی در راستای طولی",
        girder: "انتقال بارهای سقف به ستون‌ها",
        purlin: "انتقال بار پوشش سقف به شاه‌تیرها",
        "self-standing-wall": "جداره پیرامونی مستقل از قاب اصلی",
        "tie-beam": "پیوند عرضی قاب‌ها و کنترل تغییرشکل",
        foundation: "انتقال نیروهای ستون به بستر خاک"
    };
    const localizedParts = parts.map(part => ({
        ...part, ...(partCopy[part.id] || {}),
        ...(isFa ? { name: partCopy[part.id]?.sourceTitle || part.name, role: faPartRoles[part.id] || part.role } : {}),
        ...(translatedParts[lang]?.[part.id] || {}),
        ...(editorialParts[lang]?.[part.id] || {})
    }));
    const localizedBenefits = isFa ? benefitGroups : editorialBenefits[lang];
    const localizedApplications = applications.map(item => ({ ...item, title: editorialApplications[lang]?.[item.id] || item.title }));
    const localizedDocuments = documents.map((item, index) => ({ ...item, title: editorialDocumentTitles[lang]?.[index] || item.title }));
    const companyName = isFa ? company.persianName : company.englishName;
    const country = isFa ? company.location : ui.about.location;
    const sectionIds = ["about", "system", "types", "facades", "parts", "applications", "explore", "benefits", "contact"];
    const pageLink = id => `/${isFa ? "" : `?lang=${lang}`}#${id}`;
    const typeLink = (h, s) => `/?type=${h}H-${s}M${isFa ? "" : `&lang=${lang}`}`;
    const partLink = id => `/?part=${id}${isFa ? "" : `&lang=${lang}`}`;
    const detailLink = (key, value = "all") => `/?${key}=${encodeURIComponent(value)}${isFa ? "" : `&lang=${lang}`}`;
    const typeName = (h, s) => `${s}M × ${h}H`;
    const contactPhone = company.phone ? String(company.phone).replace(/[^+\d]/g, "") : "";
    const ariaPart = part => text(ui.parts.imageAlt, { name: part.name });
    const arrow = kind => `<svg class="directional-arrow ${kind === "back" ? "is-back" : ""}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const safe = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
    document.documentElement.lang = lang;
    document.documentElement.dir = isFa ? "rtl" : "ltr";
    if (!isFa)
        app.querySelector('meta[name="description"]')?.setAttribute("content", ui.cover.sub);
    function sectionHead(index, title, aside = "") {
        return `<div class="section-head"><div><span class="eyebrow"></span><h2>${title}</h2></div>${aside ? `<p class="section-aside">${aside}</p>` : ""}</div>`;
    }
    const brandLogo = () => `<svg class="brand-logo" viewBox="0 0 1680 496" role="img" aria-label="آپتوس ایران" xmlns="http://www.w3.org/2000/svg"><path fill="#676767" fill-rule="evenodd" d="M1192 13H1666V488H1192Z M1207 26V473H1651V26Z"/><polygon fill="#f58220" points="1644,302 1575,232 1574,395 1284,395 1282,362 1215,429 1214,463 1644,463"/><polygon fill="#f58220" points="1436,92 1214,314 1214,411 1484,141"/><polygon fill="#f58220" points="1395,33 1644,283 1643,185 1491,33"/><g class="brand-logo-text" fill="#676767" direction="rtl" font-family="Tahoma,Arial,'Segoe UI',sans-serif"><text class="brand-logo-title" x="1167" y="180" font-size="138" font-weight="400">آپتوس ایران</text><text class="brand-logo-sub" x="1158" y="430" font-size="86" font-weight="400">شرکت ســاختمانی، تولیدی و پژوهشی</text></g></svg>`;
    function header() { return ""; }
    function footer() { return ""; }
    function roofIcon() {
        return `<svg class="roof-icon" viewBox="0 0 72 42" aria-hidden="true"><path d="M6 37V17L36 7l30 10v20" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 39h64" fill="none" stroke="currentColor" stroke-width="1" opacity=".32"/></svg>`;
    }
    function benefitsList() {
        return `<ol class="benefits-single-list" role="list">${localizedBenefits.flatMap(group => group.items).map((item, i) => `<li><bdi>${String(i + 1).padStart(2, "0")}</bdi><span>${safe(item)}</span></li>`).join("")}</ol>`;
    }
    const aboutIcons = {
        research: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 6h16M18 6v18L6 50a5 5 0 0 0 4.5 7.5h24A5 5 0 0 0 39 50L26 24V6"/><path d="M11 40h24"/><circle cx="47" cy="23" r="7"/><path d="M47 11v4M47 31v4M35 23h4M55 23h4M38.5 14.5l2.8 2.8M52.7 28.7l2.8 2.8M55.5 14.5l-2.8 2.8M41.3 28.7l-2.8 2.8"/><circle cx="22" cy="47" r="1.3"/><circle cx="29" cy="50" r="1.3"/></svg>`,
        products: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22 24 14l18 8-18 8Z"/><path d="M6 22v14l18 8V30M24 44l18-8V22"/><path d="M34 50l12 6 14-7-8-4"/><path d="M46 42l14-7 3 2-14 7"/></svg>`,
        contractor: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 58V10M22 58V10M12 20h10M12 30h10M12 40h10M12 50h10M12 20l10 10M12 30l10 10M12 40l10 10"/><path d="M3 10h42M17 3v7M35 10v10"/><path d="M32 20h6v5h-6z"/><path d="M33 58V42h24v16M29 58h32"/><path d="M38 46h2M44 46h2M50 46h2M38 52h2M44 52h2M50 52h2"/></svg>`
    };
    const aboutMissions = [
        { icon: "research", title: "تحقیق و توسعه", text: "تولید دانش و نوآوری در عرصه صنعت بتن با اجرای پروژه‌های تحقیقاتی و پژوهشی" },
        { icon: "products", title: "تولید انواع محصولات بتنی", text: "شامل بتن آماده، کفپوش، جدول، بلوک، دیوار، نیوجرسی و …" },
        { icon: "contractor", title: "پیمانکار عمومی", text: "با داشتن بالاترین رتبه مرتبط کشوری" }
    ];
    const aboutGoals = [
        "ارتقاء جایگاه اجتماعی سازمان",
        "توسعه بازارهای فروش و افزایش سهم بازار",
        "ارتقاء سطح عملکرد و مشارکت منابع انسانی",
        "توسعه و ارتقاء سطح بهره‌وری فرآیند تولید",
        "ثبات کیفیت محصولات تولیدی و ترویج هویت آن در بازار",
        "مشتری‌مداری و ایجاد بالاترین استانداردها برای رضایتمندی مشتریان",
        "توسعه و ارتقاء اصول ایمنی، بهداشت و محیط زیست در محدوده کاری سازمان"
    ];
    function aboutSection(abstract) {
        if (!isFa)
            return `<section id="about" class="page-section about-section"><div class="section-inner">
      ${sectionHead(1, ui.about.title, ui.about.aside)}
      <div class="about-grid"><div class="about-quote"><span class="large-quote" aria-hidden="true">“</span><p>${ui.about.quote}</p><span class="about-rule"></span></div><div class="about-body"><p>${abstract}</p><p>${ui.about.extra}</p><a class="text-link" href="${pageLink("system")}">${ui.about.link}${arrow()}</a></div></div>
    </div></section>`;
        return `<section id="about" class="page-section about-section about-rich"><div class="section-inner">
      ${sectionHead(1, ui.about.title, ui.about.aside)}
      <div class="about-intro">
        <div class="about-badge"><strong>40<sup>+</sup></strong><span>سال فعالیت در صنعت ساختمان کشور</span></div>
        <div class="about-intro-text">
          <h3>آپتوس ایران</h3>
          <p>شرکت آپتوس ایران با بیش از چهار دهه فعالیت در صنعت ساختمان کشور به‌عنوان یک سازمان دانش‌محور، همواره در تلاش بوده است که با اتکا به دانش فنی و تجربه نیروی انسانی متخصص خود نقش بسزایی را در توسعه و تعالی زیرساخت‌های عمرانی و تأمین نیاز مشتریان ایفا نماید؛ از این‌رو مأموریت یا محدوده کاری اصلی این شرکت به شرح ذیل معین گردیده است:</p>
        </div>
      </div>
      <div class="mission-grid">${aboutMissions.map((item, i) => `<article class="mission-card"><span class="mission-index" aria-hidden="true">0${i + 1}</span><div class="mission-icon">${aboutIcons[item.icon]}</div><h4>${item.title}</h4><p>${item.text}</p></article>`).join("")}</div>
      <div class="about-philosophy">
        <div class="about-slogan">
          <span class="slogan-mark" aria-hidden="true">“</span>
          <strong>ما کیفیت می‌سازیم</strong>
          <p>بر این اساس روند حرکتی شرکت آپتوس ایران با اعتقاد راسخ به اصل بهبود مستمر و اجرای اثربخش فرآیندهای کاری در چارچوب نظام مدیریت یکپارچه تداوم یافته است؛ از این‌رو کاملاً مشهود است که با تثبیت سطح کیفی محصولات، شعار «ما کیفیت می‌سازیم» در تأمین رضایت مشتریان و سایر ذینفعان تبلور یافته است. با چنین نگرشی، تعالی و نیل به اهداف ذیل، مؤلفه‌های رشد و توسعه مجموعه را مشخص می‌نماید:</p>
        </div>
        <ol class="goal-list">${aboutGoals.map((goal, i) => `<li><bdi>${String(i + 1).padStart(2, "0")}</bdi><span>${goal}</span></li>`).join("")}</ol>
      </div>
      <!-- <a class="text-link" href="${pageLink("system")}">${ui.about.link}${arrow()}</a> -->
    </div></section>`;
    }
    const aiBrand = `<span class="en-l1"><b>A</b>ptus <b>I</b>ndustrial <b>P</b>refabricated <b>S</b>ystem</span><span class="en-l2"><b>F</b>ast <b>F</b>abricated <b>P</b>roduct <span class="en-abbr">(AIPS-FFP)</span></span>`;
    const coverEnglish = (cls) => isFa ? `<p class="cover-en ${cls}" lang="en" dir="ltr">${aiBrand}</p>` : "";
    function catalog() {
        const abstract = isFa ? company.about : ui.about.abstract;
        document.title = isFa ? "سوله بتنی پیش‌ساخته آپتوس | APTUS IRAN" : lang === "tr" ? "APTUS İran | Prefabrik Beton Yapı Kataloğu" : "APTUS Iran | Precast Concrete Shed Catalog";
        return `${header()}<div class="catalog-main">
    <section id="cover" class="cover-section" aria-labelledby="cover-title">
      <div class="cover-copy">
        <!-- <div class="cover-kicker"><span class="orange-line"></span><span>${ui.cover.kicker}</span></div> -->
        <div class="cover-title-wrap"><div class="cover-hero"><h1 id="cover-title">${ui.cover.title}</h1>${coverEnglish("cover-en--inflow")}</div></div>
        <!-- <a class="cover-scroll" href="${pageLink("about")}">${ui.cover.enter}<span aria-hidden="true">↓</span></a> -->
      </div>
      <!-- <div class="cover-company"><svg class="brand-logo" viewBox="0 0 1680 496" role="img" aria-label="آپتوس ایران" xmlns="http://www.w3.org/2000/svg"><path fill="#676767" fill-rule="evenodd" d="M1192 13H1666V488H1192Z M1207 26V473H1651V26Z"/><polygon fill="#f58220" points="1644,302 1575,232 1574,395 1284,395 1282,362 1215,429 1214,463 1644,463"/><polygon fill="#f58220" points="1436,92 1214,314 1214,411 1484,141"/><polygon fill="#f58220" points="1395,33 1644,283 1643,185 1491,33"/><g class="brand-logo-text" fill="#676767" direction="rtl" font-family="Tahoma,Arial,'Segoe UI',sans-serif"><text class="brand-logo-title" x="1167" y="180" font-size="138" font-weight="400">آپتوس ایران</text><text class="brand-logo-sub" x="1158" y="430" font-size="86" font-weight="400">شرکت ســاختمانی، تولیدی و پژوهشی</text></g></svg></div> -->
      ${coverEnglish("cover-en--side")}
      <div class="cover-visual"><div class="visual-stage"><img src="/catalog/assets/cover-render3.png" alt="${ui.cover.visualAlt}"></div></div>
    </section>

    ${aboutSection(abstract)}

    <section id="system" class="page-section system-section"><div class="section-inner">
      ${sectionHead(2, ui.system.title, ui.system.aside)}
      <div class="system-grid"><div class="system-picture"><figure class="system-photo"><img src="/catalog/assets/render.png" alt="${ui.system.imageAlt}" loading="lazy"></figure><figure class="system-cad"><img src="/catalog/assets/system-3d-view.png" alt="${isFa ? "نمای سه‌بعدی سوله پیش‌ساخته" : lang === "tr" ? "Prefabrik beton yapının 3B görünümü" : "3D view of the precast concrete shed"}" loading="lazy"></figure></div><div class="system-copy"><p>${ui.system.p1}</p><p>${ui.system.p2}</p></div></div></div>
    </div></section>
    
    <section id="explore" class="page-section explore-section explore-full" aria-label="${safe(ui.explore.title)}">
      <div class="explore-hero">
        <div class="explore-bar"><div class="explore-title"><h2>${ui.explore.title}</h2></div><p>${ui.explore.diagramTitle}</p></div>
        <div class="model-stage"><div class="model-frame" id="model-frame">
          <img id="model-img" src="/catalog/assets/semi-assembly.png" alt="${ui.explore.diagramAlt}">
          <svg class="leader-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${localizedParts.filter(part => part.pin && part.anchor).map(part => `<line data-pin-of="${part.id}" x1="${part.pin[0]}" y1="${part.pin[1]}" x2="${part.anchor[0]}" y2="${part.anchor[1]}"/>`).join("")}</svg>
          ${localizedParts.filter(part => part.pin && part.anchor).map(part => `<i class="pin-dot" data-pin-of="${part.id}" style="left:${part.anchor[0]}%;top:${part.anchor[1]}%" aria-hidden="true"></i>`).join("")}
          ${localizedParts.filter(part => part.pin).map(part => `<button type="button" class="pin" data-part="${part.id}" data-pin-of="${part.id}" style="left:${part.pin[0]}%;top:${part.pin[1]}%" aria-label="${text(ui.explore.select, { name: part.name })}"><span>${n(Number(part.number))}</span></button>`).join("")}
        </div></div>
        <!-- <p class="diagram-source">${ui.explore.diagramHelp}</p> -->
      </div>
      <div class="explore-dock">
        <div class="part-selector" role="group" aria-label="${ui.explore.selectGroup}">${localizedParts.map(part => `<button type="button" data-part="${part.id}"><bdi>${n(Number(part.number))}</bdi> ${safe(part.name)}</button>`).join("")}</div>
        <aside class="part-dock" aria-live="polite" id="part-preview"></aside>
      </div>
    </section>

    <section id="types" class="page-section types-section"><div class="section-inner">
      ${sectionHead(3, ui.types.title, ui.types.aside)}
      <div class="table-wrap" tabindex="0" role="region" aria-label="${ui.types.region}"><table class="types-table"><thead><tr><th scope="col" class="row-corner">${ui.types.underRoof}<br><small>${ui.types.clearSpan}</small></th>${spans.map(s => `<th scope="col"><span class="latin-token" dir="ltr">${s.module}M</span><small>${n(s.clearCm / 100)} ${ui.types.meter}</small></th>`).join("")}</tr></thead><tbody>${heights.map(h => `<tr><th scope="row"><span class="latin-token" dir="ltr">${h.module}H</span><small>${n(h.underRoofCm / 100)} ${ui.types.meter}</small></th>${spans.map(s => `<td><a class="type-cell" href="${typeLink(h.module, s.module)}" aria-label="${text(ui.types.cell, { type: typeName(h.module, s.module), span: n(s.clearCm / 100), height: n(h.underRoofCm / 100) })}">${roofIcon()}<strong dir="ltr">${typeName(h.module, s.module)}</strong><span><!-- ${ui.types.view} --> ${arrow()}</span></a></td>`).join("")}</tr>`).join("")}</tbody></table></div>
    </div></section>

    <section id="facades" class="page-section facades-section"><div class="section-inner">
      ${sectionHead(4, extra.facades.title, extra.facades.aside)}
      <div class="facade-grid">${facades.slice(0, 6).map((item, i) => `<figure class="facade-card"><img src="${item.image}" alt="${text(extra.galleryAlt, { number: n(i + 1), name: extra.facades.title })}" loading="lazy"><figcaption>${extra.facades.caption} <bdi>${n(i + 1).toString().padStart(2)}</bdi></figcaption></figure>`).join("")}</div>
      <div class="section-action"><a class="solid-button" href="${detailLink("facades")}">${extra.facades.all}${arrow()}</a></div>
    </div></section>

    <section id="applications" class="page-section applications-section"><div class="section-inner">
      ${sectionHead(6, extra.applications.title, extra.applications.aside)}
      <div class="applications-grid">${localizedApplications.map((item, i) => `<article class="application-card" id="application-${item.id}"><img src="${item.image}" alt="${safe(item.title)}" loading="lazy"><div><!-- <span class="eyebrow">${String(i + 1).padStart(2, "0")} / 05</span> --><h3>${safe(item.title)}</h3></div></article>`).join("")}</div>
    </div></section>

    <section id="benefits" class="page-section benefits-section"><div class="section-inner">
      ${sectionHead(8, ui.benefits.title)}
      <div class="benefits-window">
        <div class="benefits-scroll" id="benefits-scroll" role="region" aria-label="${safe(ui.benefits.title)}">${benefitsList()}</div>
        <button class="benefits-toggle" type="button" aria-expanded="false" aria-controls="benefits-scroll"><span>${extra.benefits.preview}</span><span class="benefits-chevron" aria-hidden="true"></span></button>
      </div>
      <div class="benefit-ribbon" dir="ltr" role="region" aria-label="${safe(ui.benefits.title)}">
        <div class="ribbon-track">${[0, 1].map(round => benefitIcons.map(item => `<figure class="ribbon-card" dir="rtl" ${round ? 'aria-hidden="true"' : ""}><div class="ribbon-icon"><img src="/catalog/assets/benefits/${item.file}.png" alt="" loading="lazy" draggable="false"></div><figcaption>${safe(item.title)}</figcaption></figure>`).join("")).join("")}</div>
      </div>
    </div></section>

  </div>${footer()}`;
    }
    function frameDiagram(h, s) {
        /*
         * Professional technical-drawing style dimensions
         * - Thin orange dimension lines
         * - Closed filled arrowheads
         * - Proper extension lines
         * - Dimensions inside the frame, matching the supplied sketch
         * - Consistent typography
         */
        const width = 250 + s.module * 32;
        const x1 = (760 - width) / 2;
        const x2 = x1 + width;
        const bottom = 296;
        const eaves = 190 - (h.module - 3) * 27;
        const peak = eaves - 35;
        const innerX1 = x1 + 6.5;
        const innerX2 = x2 - 6.5;
        const underRoofY = eaves + 6.5;
        /* Dimension styling */
        const dimColor = "#f58220";
        const dimTextColor = "#58595b";
        const extensionStroke = 1.15;
        const dimensionStroke = 1.5;
        const textSize = 17;
        /* -----------------------------------------
           HORIZONTAL DIMENSION — CLEAR SPAN
           ----------------------------------------- */
        const horizontalDimY = bottom - 12;
        const horizontalExtTop = bottom - 4;
        const horizontalExtBottom = horizontalDimY - 8;
        /* -----------------------------------------
           VERTICAL DIMENSION — UNDER ROOF HEIGHT
           ----------------------------------------- */
        const verticalDimX = innerX1 + 24;
        const verticalExtEnd = verticalDimX + 8;
        const verticalTextX = verticalDimX + 46;
        const verticalTextY = (bottom + underRoofY) / 2;
        const horizontalLabel = `${n(s.clearCm / 100)} m`;
        const verticalLabel = `${n(h.underRoofCm / 100)} m`;
        return `
  <svg
    class="frame-diagram"
    role="img"
    aria-label="${text(ui.detail.frameAlt, { type: typeName(h.module, s.module) })}"
    viewBox="${x1 - 35} ${peak - 35} ${width + 70} ${bottom - peak + 85}"
    direction="ltr"
    xmlns="http://www.w3.org/2000/svg"
  >

    <defs>

      <!-- Professional filled technical-drawing arrow -->
      <marker
        id="dimArrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path
          d="M0 0 L10 5 L0 10 Z"
          fill="${dimColor}"
        />
      </marker>

    </defs>


    <!-- =========================================
         REFERENCE / GROUND LINE
         ========================================= -->

    <path
      d="M70 ${bottom + 8} H690"
      stroke="#e6e6e6"
      stroke-width="1.4"
      stroke-dasharray="5 5"
      fill="none"
    />


    <!-- =========================================
         MAIN STRUCTURE
         ========================================= -->

    <path
      d="
        M${x1} ${bottom}
        V${eaves}
        L380 ${peak}
        L${x2} ${eaves}
        V${bottom}
      "
      fill="none"
      stroke="#58595b"
      stroke-width="13"
      stroke-linejoin="round"
    />

    <!-- Base plates -->

    <path
      d="
        M${x1 - 21} ${bottom + 2}
        h42
        v18
        h-42
        z

        M${x2 - 21} ${bottom + 2}
        h42
        v18
        h-42
        z
      "
      fill="#666666"
    />


    <!-- =========================================
         HORIZONTAL DIMENSION
         CLEAR SPAN
         ========================================= -->


    <!-- Extension lines -->

    <path
      d="
        M${innerX1} ${horizontalExtTop}
        V${horizontalExtBottom}

        M${innerX2} ${horizontalExtTop}
        V${horizontalExtBottom}
      "
      fill="none"
      stroke="${dimColor}"
      stroke-width="${extensionStroke}"
    />


    <!-- Dimension line -->

    <path
      d="
        M${innerX1} ${horizontalDimY}
        H${innerX2}
      "
      fill="none"
      stroke="${dimColor}"
      stroke-width="${dimensionStroke}"
      marker-start="url(#dimArrow)"
      marker-end="url(#dimArrow)"
    />


    <!-- Dimension label background -->

    <rect
      x="${(x1 + x2) / 2 - 45}"
      y="${horizontalDimY - textSize / 2 - 5}"
      width="90"
      height="${textSize + 10}"
      rx="2"
      fill="#ffffff"
    />


    <!-- Dimension label -->

    <text
      x="${(x1 + x2) / 2}"
      y="${horizontalDimY}"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="Arial, Helvetica, sans-serif"
      font-size="${textSize}"
      font-weight="500"
      letter-spacing="0.2"
      fill="${dimTextColor}"
    >
      ${horizontalLabel}
    </text>



    <!-- =========================================
         VERTICAL DIMENSION
         UNDER-ROOF HEIGHT
         ========================================= -->


    <!-- Horizontal extension lines -->

    <path
      d="
        M${innerX1 + 3} ${underRoofY}
        H${verticalExtEnd}

        M${innerX1 + 3} ${bottom}
        H${verticalExtEnd}
      "
      fill="none"
      stroke="${dimColor}"
      stroke-width="${extensionStroke}"
    />


    <!-- Vertical dimension line -->

    <path
      d="
        M${verticalDimX} ${bottom}
        V${underRoofY}
      "
      fill="none"
      stroke="${dimColor}"
      stroke-width="${dimensionStroke}"
      marker-start="url(#dimArrow)"
      marker-end="url(#dimArrow)"
    />


    <!-- Vertical dimension label background -->

    <rect
      x="${verticalTextX - 34}"
      y="${verticalTextY - textSize / 2 - 5}"
      width="68"
      height="${textSize + 10}"
      rx="2"
      fill="#ffffff"
    />


    <!-- Vertical dimension label -->

    <text
      x="${verticalTextX}"
      y="${verticalTextY}"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="Arial, Helvetica, sans-serif"
      font-size="${textSize}"
      font-weight="500"
      letter-spacing="0.2"
      fill="${dimTextColor}"
    >
      ${verticalLabel}
    </text>

  </svg>`;
    }
    function typeDetail(h, s) {
        const all = heights.flatMap(a => spans.map(b => [a, b]));
        const index = all.findIndex(([a, b]) => a.module === h.module && b.module === s.module);
        const previous = all[(index - 1 + all.length) % all.length], next = all[(index + 1) % all.length];
        const type = typeName(h.module, s.module);
        document.title = `${text(ui.detail.typeTitle, { type })} | APTUS IRAN`;
        return `${header("types")}<div class="detail-main"><div class="detail-container"><nav class="breadcrumbs" aria-label="${ui.detail.catalog}"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("types")}">${ui.types.title}</a><span>›</span><strong dir="ltr">${type}</strong></nav>
    <div class="detail-heading"><div><span class="eyebrow">AIPS / ${String(index + 1).padStart(2, "0")}</span><h1>${text(ui.detail.typeTitle, { type: `<bdi dir="ltr">${type}</bdi>` })}</h1><p>${text(ui.detail.typeDescription, { height: n(h.underRoofCm / 100), span: n(s.clearCm / 100) })}</p></div><a class="outline-button" href="${pageLink("types")}">${ui.detail.backTypes}${arrow("back")}</a></div>
    <div class="detail-grid type-detail-grid"><div class="detail-visual"><div class="drawing-header"><span>${ui.detail.frame}</span><bdi dir="ltr">AIPS / ${h.module}H-${s.module}M</bdi></div>${frameDiagram(h, s)}<div class="drawing-foot">${ui.detail.drawingNote}</div></div></div>
    <div class="detail-lower"><div><span class="eyebrow">AIPS / ${type}</span><h2>${ui.detail.notes}</h2><p>${text(ui.detail.p1, { spanCode: `<bdi dir="ltr">${s.module}M</bdi>`, heightCode: `<bdi dir="ltr">${h.module}H</bdi>` })}</p><p>${ui.detail.p2}</p></div><nav class="type-navigation" aria-label="${ui.detail.otherTypes}"><span>${ui.detail.otherTypes}</span><a href="${typeLink(previous[0].module, previous[1].module)}">${arrow("back")}<span>${ui.detail.previous} <bdi dir="ltr">${typeName(previous[0].module, previous[1].module)}</bdi></span></a><a href="${typeLink(next[0].module, next[1].module)}"><span>${ui.detail.next} <bdi dir="ltr">${typeName(next[0].module, next[1].module)}</bdi></span>${arrow()}</a></nav></div>
  </div></div>${footer()}`;
    }
    function partDetail(part) {
        document.title = `${part.name} | APTUS IRAN`;
        return `${header("parts")}<div class="detail-main"><div class="detail-container"><nav class="breadcrumbs" aria-label="${ui.detail.catalog}"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("explore")}">${ui.explore.title}</a><span>›</span><strong>${part.name}</strong></nav>
    <div class="detail-heading"><div><span class="eyebrow">AIPS / ${part.number}</span><h1>${safe(part.name)}</h1><p>${safe(part.role)}</p></div><a class="outline-button" href="${pageLink("explore")}">${extra.nav.overview}${arrow("back")}</a></div>
    <div class="part-detail-layout"><div class="part-detail-image"><!-- <span>${text(extra.part.total, { number: n(Number(part.number)) })}</span> --><img src="${part.image}" alt="${safe(ariaPart(part))}"><small lang="en" dir="ltr">${part.english}</small></div><div class="part-detail-copy"><span class="eyebrow">AIPS / ${part.number}</span><h2>${extra.part.details}</h2>${(part.paragraphs || [part.description]).map(p => `<p>${safe(p)}</p>`).join("")}${part.technicalPdf ? `<!-- <a class="outline-button source-pdf" href="${part.technicalPdf}" target="_blank" rel="noopener">${extra.part.source} <span aria-hidden="true">↗</span></a> -->` : ""}${!part.pin ? `<!-- <p class="detail-note">${extra.part.corner}</p> -->` : ""}</div></div>
    ${part.gallery?.length ? `<section class="component-gallery"><div class="section-head"><h2>${extra.part.additional}</h2><span class="section-aside">${extra.gallery}</span></div><div class="component-gallery-grid">${part.gallery.map((src, i) => `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" loading="lazy" alt="${text(extra.galleryAlt, { number: n(i + 1), name: safe(part.name) })}"></a>`).join("")}</div></section>` : ""}
    <div class="detail-bottom-link"><span>${ui.detail.placement}</span><a href="${pageLink("explore")}">${ui.explore.title}${arrow("back")}</a></div>
  </div></div>${footer()}`;
    }
    function benefitsDetail() {
        document.title = `${extra.benefits.detail} | APTUS IRAN`;
        return `${header("benefits")}<div class="detail-main"><div class="detail-container"><nav class="breadcrumbs"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("benefits")}">${ui.benefits.title}</a></nav><div class="detail-heading"><div><span class="eyebrow">AIPS / 25</span><h1>${extra.benefits.detail}</h1><p>${extra.benefits.count}</p></div><a class="outline-button" href="${pageLink("benefits")}">${ui.benefits.title}${arrow("back")}</a></div><div class="benefits-window benefits-window-full">${benefitsList()}</div></div></div>${footer()}`;
    }
    function facadesDetail() {
        document.title = `${extra.facades.title} | APTUS IRAN`;
        return `${header("types")}<div class="detail-main"><div class="detail-container"><nav class="breadcrumbs"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("facades")}">${extra.facades.title}</a></nav><div class="detail-heading"><div><span class="eyebrow">AIPS / ${n(facades.length)}</span><h1>${extra.facades.title}</h1><p>${extra.facades.note}</p></div><a class="outline-button" href="${pageLink("facades")}">${extra.nav.facades}${arrow("back")}</a></div><div class="facade-grid facade-grid-full">${facades.map((item, i) => `<figure class="facade-card"><img src="${item.image}" alt="${text(extra.galleryAlt, { number: n(i + 1), name: extra.facades.title })}" loading="lazy"><figcaption>${extra.facades.caption} <bdi>${String(i + 1).padStart(2, "0")}</bdi></figcaption></figure>`).join("")}</div></div></div>${footer()}`;
    }
    function documentsDetail() {
        document.title = `${extra.documents.title} | APTUS IRAN`;
        return `${header("contact")}<div class="detail-main"><div class="detail-container"><nav class="breadcrumbs"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("contact")}">${ui.contact.title}</a></nav><div class="detail-heading"><div><span class="eyebrow">APTUS / DOCS</span><h1>${extra.documents.title}</h1><p>${extra.documents.intro}</p></div><a class="outline-button" href="${pageLink("contact")}">${extra.nav.contactInfo}${arrow("back")}</a></div><div class="document-grid">${localizedDocuments.map(doc => `<a class="document-card" href="${doc.href}" target="_blank" rel="noopener"><span class="document-icon" aria-hidden="true">▤</span><span class="document-index">${doc.id} / ${String(localizedDocuments.length).padStart(2, "0")}</span><strong>${safe(doc.title)}</strong><span class="document-action">${extra.documents.view} <span aria-hidden="true">↗</span></span></a>`).join("")}</div></div></div>${footer()}`;
    }
    function setActivePart(id) {
        const part = localizedParts.find(item => item.id === id);
        if (!part)
            return;
        app.querySelectorAll("[data-part],[data-pin-of]").forEach(element => {
            const selected = (element.dataset.part || element.dataset.pinOf) === id;
            element.classList.toggle("is-active", selected);
            if (element.dataset.part)
                element.setAttribute("aria-pressed", String(selected));
        });
        const paragraphs = (part.paragraphs || [part.description]).slice(0, 2).map(p => `<p class="dock-text">${safe(p)}</p>`).join("");
        app.querySelector("#part-preview").innerHTML = `<div class="dock-image"><img src="${part.image}" alt="${safe(text(ui.explore.imageAlt, { name: part.name }))}"></div><div class="dock-body"><div class="dock-top"><!-- <span class="eyebrow">AIPS / ${part.number}</span> --><!-- <span class="dock-label" lang="en" dir="ltr">${part.english}</span> --></div><h3>${safe(part.name)}</h3>${paragraphs}<a class="solid-button" href="${partLink(part.id)}">${extra.more}${arrow()}</a></div>`;
    }
    function bind() {
        const benefitsToggle = app.querySelector(".benefits-toggle");
        benefitsToggle?.addEventListener("click", () => {
            const open = benefitsToggle.getAttribute("aria-expanded") !== "true";
            const scroll = app.querySelector("#" + "benefits-scroll");
            benefitsToggle.setAttribute("aria-expanded", String(open));
            benefitsToggle.querySelector("span").textContent = open ? extra.benefits.collapse : extra.benefits.preview;
            benefitsToggle.closest(".benefits-window").classList.toggle("is-expanded", open);
            if (open)
                scroll.setAttribute("tabindex", "0");
            else {
                scroll.removeAttribute("tabindex");
                scroll.scrollTop = 0;
            }
        }, { signal: controller.signal });
        const modelImg = app.querySelector("#" + "model-img");
        const modelFrame = app.querySelector("#" + "model-frame");
        if (modelImg && modelFrame) {
            const fit = () => { if (modelImg.naturalWidth)
                modelFrame.style.setProperty("--ar", (modelImg.naturalWidth / modelImg.naturalHeight).toFixed(4)); };
            if (modelImg.complete)
                fit();
            else
                modelImg.addEventListener("load", fit, { signal: controller.signal });
            if (params.has("calibrate")) {
                const readout = document.createElement("div");
                readout.className = "calibrate-readout";
                readout.textContent = "Calibrate: click on the 3D image to read [x, y] in percent";
                app.appendChild(readout);
                modelFrame.addEventListener("click", event => {
                    const box = modelFrame.getBoundingClientRect();
                    const x = ((event.clientX - box.left) / box.width * 100).toFixed(1);
                    const y = ((event.clientY - box.top) / box.height * 100).toFixed(1);
                    readout.textContent = `[${x}, ${y}]`;
                    console.log(`[${x}, ${y}]`);
                }, { signal: controller.signal });
            }
        }
        app.querySelectorAll("[data-part]").forEach(button => button.addEventListener("click", () => setActivePart(button.dataset.part), { signal: controller.signal }));
        if (app.querySelector("#part-preview"))
            setActivePart(localizedParts[0].id);
        if (location.hash && !params.has("type") && !params.has("part"))
            requestAnimationFrame(() => {
                try {
                    app.querySelector("#" + decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
                }
                catch { }
            });
    }
    const typeMatch = /^([345])H-([5-9]|10)M$/.exec(params.get("type") || "");
    if (typeMatch) {
        app.innerHTML = typeDetail(heights.find(h => h.module === Number(typeMatch[1])), spans.find(s => s.module === Number(typeMatch[2])));
    }
    else if (params.get("benefits") === "all") {
        app.innerHTML = benefitsDetail();
    }
    else if (params.get("facades") === "all") {
        app.innerHTML = facadesDetail();
    }
    else if (params.get("documents") === "all") {
        app.innerHTML = documentsDetail();
    }
    else {
        const part = localizedParts.find(item => item.id === params.get("part"));
        app.innerHTML = part ? partDetail(part) : catalog();
    }
    bind();
    return () => { controller.abort(); app.replaceChildren(); };
}
