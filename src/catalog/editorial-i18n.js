// Translations of the supplied APTUS editorial documents and new catalog UI.
export const editorialUI = {
  fa: {
    nav: { home: "صفحۀ اصلی", types: "تیپ‌بندی", standard: "سوله تک‌دهانه", facades: "نماسازی", parts: "اجزای بتنی", overview: "همه اجزا", interactive: "نمای تعاملی", applications: "کاربری‌ها", benefits: "مزایا", contact: "درباره ما", contactInfo: "ارتباط با ما", documents: "گواهینامه‌ها" },
    more: "اطلاعات بیشتر", fullText: "متن کامل و تصاویر قطعه", sourcePdf: "فایل فنی اصلی", gallery: "نماهای بیشتر", galleryAlt: "نمای شماره {number} از {name}",
    facades: { title: "نماسازی با ساندویچ پنل", aside: "طرح‌های ارائه‌شده برای جداره بتنی و پوشش ساندویچ‌پنل", caption: "نمونه طرح", all: "مشاهده همه طرح‌ها", note: "نمونه طرح‌های نماسازی با ساندویچ پنل برای جداره بتنی پیش‌ساخته." },
    applications: { title: "پنج نمونه از کاربری‌های سوله پیش‌ساخته بتنی", note: "تصاویر، نمونه‌های تصویری کاربری هستند و الزاماً پروژه اجراشده آپتوس را نشان نمی‌دهند." },
    benefits: { all: "همه مزایا", detail: "فهرست کامل مزایای سیستم سوله بتنی پیش‌ساخته سریع‌الاحداث آپتوس", count: "۲۵ مزیت", preview: "مشاهده همه مزایا", collapse: "بستن فهرست" },
    documents: { all: "همه مدارک", title: "مدارک و گواهی‌نامه‌ها", view: "مشاهده فایل", preview: "مدارک ارائه‌شده" },
    part: { preview: "خلاصه قطعه", details: "شرح فنی قطعه", source: "نسخه اصلی سند فنی", additional: "تصاویر تکمیلی", total: "جزء {number} از ۹", corner: "قطعه تکمیلی جداره؛ جایگاه آن در شماتیک هشت‌نقطه‌ای مشخص نشده است." }
  },
  en: {
    nav: { home: "Home", types: "Systems", standard: "Single-span types", facades: "Facade studies", parts: "Components", overview: "All components", interactive: "Interactive view", applications: "Applications", benefits: "Advantages", contact: "About us", contactInfo: "Contact", documents: "Certificates" },
    more: "Learn more", fullText: "Full description and images", sourcePdf: "Original technical PDF", gallery: "More views", galleryAlt: "View {number} of {name}",
    facades: { title: "Facade concepts", aside: "Supplied concepts for concrete perimeter walls and sandwich-panel cladding", caption: "Concept", all: "See every concept", note: "Facade concepts supplied in the APTUS archive." },
    applications: { title: "Possible applications", aside: "Five application categories in the supplied materials", note: "Images illustrate potential uses and do not necessarily show completed APTUS projects." },
    benefits: { all: "All advantages", detail: "Complete list of system advantages", count: "25 advantages", preview: "Explore all advantages", collapse: "Collapse list" },
    documents: { all: "All documents", title: "Certificates and documents", intro: "Documents supplied for APTUS. Please check each original file for its date and current status.", view: "Open file", preview: "Supplied documents" },
    part: { preview: "Component preview", details: "Technical description", source: "Original technical document", additional: "Additional images", total: "Component {number} of 9", corner: "Additional perimeter component; it has no numbered point on the eight-point assembly diagram." }
  },
  tr: {
    nav: { home: "Başlangıç", types: "Tipler", standard: "Tek açıklıklı tipler", facades: "Cephe tasarımları", parts: "Bileşenler", overview: "Tüm bileşenler", interactive: "Etkileşimli görünüm", applications: "Kullanım alanları", benefits: "Avantajlar", contact: "Hakkımızda", contactInfo: "İletişim", documents: "Belgeler" },
    more: "Daha fazla bilgi", fullText: "Tam açıklama ve görseller", sourcePdf: "Özgün teknik PDF", gallery: "Diğer görseller", galleryAlt: "{name} için {number} numaralı görünüm",
    facades: { title: "Cephe fikirleri", aside: "Beton çevre duvarı ve sandviç panel kaplamaya yönelik sunulan tasarımlar", caption: "Tasarım", all: "Tüm tasarımlar", note: "APTUS arşivinde sağlanan cephe tasarımları." },
    applications: { title: "Olası kullanım alanları", aside: "Sağlanan materyallerde yer alan beş kullanım kategorisi", note: "Görseller olası kullanımları gösterir; APTUS tarafından tamamlanmış projeleri göstermeleri gerekmez." },
    benefits: { all: "Tüm avantajlar", detail: "Sistem avantajlarının tam listesi", count: "25 avantaj", preview: "Tüm avantajları incele", collapse: "Listeyi kapat" },
    documents: { all: "Tüm belgeler", title: "Sertifikalar ve belgeler", intro: "APTUS için sağlanan belgeler. Tarih ve güncel durumu özgün dosyadan kontrol edin.", view: "Dosyayı aç", preview: "Sağlanan belgeler" },
    part: { preview: "Bileşen özeti", details: "Teknik açıklama", source: "Özgün teknik belge", additional: "Ek görseller", total: "9 bileşenden {number}.", corner: "Ek çevre duvarı bileşeni; sekiz noktalı montaj şemasında işaretli değildir." }
  }
};

export const editorialParts = {
  en: {
    column: {
      role: "Primary vertical and lateral load-bearing member",
      paragraphs: [
        "Precast concrete columns transfer gravity and lateral forces from the upper structure into the foundation. Their design considers axial load, shear, bending moments, strength and stability.",
        "The columns are produced under controlled factory conditions and installed in pocket foundations after delivery. This allows control over reinforcement and production quality while accelerating installation.",
        "Column types vary with their position in the plan and the members connected to them. Corner and intermediate columns have different arrangements of projecting beam seats to suit their connections."
      ]
    },
    "longitudinal-beam": {
      role: "Rigid longitudinal connection between structural frames",
      paragraphs: [
        "Precast longitudinal beams run between successive columns and connect the main frames along the shed. Their rigid column connections distribute longitudinal forces and let the frames act together as a three-dimensional moment-resisting system under lateral loading and longitudinal movement.",
        "The integrated action of beams, frames and roof makes it possible to omit diagonal braces in various parts of the shed, leaving more usable space for circulation and equipment.",
        "These precast elements rest on the column's designated projecting beam seats and connect through designed details. A coordinated layout supports fast installation and reduces on-site work."
      ]
    },
    girder: {
      name: "Precast concrete roof girder", role: "Main roof-frame member transferring loads to columns",
      paragraphs: [
        "The roof girder receives loads from cladding, purlins, use and environmental effects, then transfers them to columns and foundations. It is designed for bending, shear, axial force and torsion according to the span and loading conditions.",
        "Factory-made girders are designed in several types to standardize production, simplify quality control and speed on-site installation.",
        "The girder-to-column joint uses an embedded I-shaped steel section and an eight-piece bolted connection. It transfers the designed forces while allowing the main precast frame to be assembled on site."
      ]
    },
    purlin: {
      name: "Precast concrete purlin", role: "Roof element transferring cladding loads to the girders",
      paragraphs: [
        "Precast concrete purlins take the roof-covering loads to the main girders, which pass them through the columns to the foundations.",
        "In the documented arrangement, the connection of purlins, girders and reinforced lightweight-concrete panels contributes to diaphragm action. The roof is modeled as a rigid diaphragm to distribute in-plane forces to the load-bearing members.",
        "The system uses one purlin type with a center-to-center length of 7.20 m.",
        "Starter reinforcement and grout form the purlin-to-girder connection, providing support and structural continuity at the joint."
      ]
    },
    "self-standing-wall": {
      role: "Independent precast perimeter wall",
      paragraphs: [
        "The lower perimeter walls are designed independently of the main frame and have no structural connection to the columns. Their own foundation takes the wall loads. A tie beam integrated at the base of each precast wall is bolted to the foundation; the wall foundation also acts as the tie between columns.",
        "Three modular wall types have center-to-center lengths of 4.8, 6 and 7.2 m for the longitudinal and transverse bays. This matches the structural grid and helps production, shipping and assembly.",
        "Each wall carries its own loads and imposed actions such as wind, transferring them through the base and fixings to its foundation rather than the main frame.",
        "The precast approach reduces work on site and supports consistent dimensions and installation quality. Modular access openings can be placed where the architectural plan requires them."
      ]
    },
    "tie-beam": {
      role: "Transverse precast ties for overall structural stability",
      paragraphs: [
        "Transverse tie beams are provided at selected positions along the shed to improve overall stability, link the cross frames, and control deformation and torsion along its length. Two tie beams extend across the full width.",
        "They connect elements on both sides, help distribute lateral and torsional forces, and improve system behavior, especially in longer sheds.",
        "The ties are also precast and coordinated with the other elements for faster assembly on site."
      ]
    },
    foundation: {
      role: "Precast pocket foundation for column loads",
      paragraphs: [
        "The pocket foundation transfers vertical and lateral forces and moments from the precast column into the ground. The column is seated in its socket; grout completes the connection according to the designed detail after installation.",
        "Four single-span foundation types are designated F50F2, F51F2, F52F2 and F53F2, reflecting different positions, forces and geometry. Their dimensions and reinforcement follow the requirements of each location.",
        "The socket gives the column a defined position and facilitates assembly. Independent production of columns and foundations supports factory quality control and reduces work on site.",
        "The documented foundation dimensions are based on site and geotechnical conditions in Alborz province. For a different location or soil, the design must be checked and revised as needed using the project's geotechnical study and design loads."
      ]
    },
    "corner-wall": {
      name: "Precast corner wall", role: "Completes the perimeter at the four corners",
      paragraphs: [
        "Precast corner-wall elements cover the junction between the self-standing walls and corner columns at the four corners of the shed, giving the perimeter a continuous appearance.",
        "Each piece is designed for the geometry of that junction. Factory production reduces the on-site work and materials needed to finish these areas."
      ]
    }
  },
  tr: {
    column: {
      role: "Düşey ve yatay yüklere karşı ana taşıyıcı kolon",
      paragraphs: [
        "Prefabrik beton kolonlar, üst yapıdan gelen düşey ve yatay yükleri temele aktarır. Tasarımda eksenel kuvvet, kesme, eğilme momentleri, dayanım ve stabilite dikkate alınır.",
        "Kontrollü fabrika koşullarında üretilen kolonlar, sahaya taşındıktan sonra soket temellere yerleştirilir. Bu yöntem donatı ve üretim kalitesinin kontrolünü, daha hızlı montajı sağlar.",
        "Kolon tipleri plandaki konuma ve bağlanan elemanlara göre değişir. Köşe ve ara kolonlardaki konsol kirişlerin yerleşimi bağlantı gereksinimlerine göre farklıdır."
      ]
    },
    "longitudinal-beam": {
      role: "Ana çerçeveler arasında rijit boyuna bağlantı",
      paragraphs: [
        "Prefabrik boyuna kirişler ardışık kolonlar arasında uzanır ve ana çerçeveleri yapı boyunca rijit bağlantılarla birleştirir. Yükleri dağıtarak çerçevelerin yatay kuvvetlere karşı bütünleşik üç boyutlu moment aktaran sistem gibi çalışmasını sağlar.",
        "Kiriş, çerçeve ve çatının birlikte çalışması, bazı bölümlerde çapraz gergilerin kaldırılmasına olanak tanır; geçiş ve ekipman yerleşimi için daha açık alan bırakır.",
        "Elemanlar kolonlarda öngörülen konsol kirişlere oturur ve tasarlanmış detaylarla bağlanır. Düzenli prefabrik yerleşim sahadaki işleri azaltır ve montajı hızlandırır."
      ]
    },
    girder: {
      name: "Prefabrik beton ana çatı kirişi", role: "Çatı yüklerini kolonlara aktaran ana taşıyıcı",
      paragraphs: [
        "Ana çatı kirişi; kaplama, aşık, kullanım ve çevre yüklerini alarak kolonlara ve temellere iletir. Açıklık ve yüklere göre eğilme, kesme, eksenel kuvvet ve burulma için tasarlanır.",
        "Kirişler fabrikada birkaç standart tipte üretilir; bu, kalite kontrolünü ve sahadaki montajı kolaylaştırır.",
        "Kolon bağlantısında gömülü I kesitli çelik parça ve sekiz parçalı cıvatalı birleşim kullanılır. Bu birleşim tasarım kuvvetlerini aktarırken prefabrik ana çerçevenin sahada montajını sağlar."
      ]
    },
    purlin: {
      name: "Prefabrik beton aşık", role: "Çatı kaplama yüklerini ana kirişlere aktarır",
      paragraphs: [
        "Prefabrik beton aşıklar, çatı kaplamasından gelen yükleri ana kirişlere; oradan kolonlara ve temellere iletir.",
        "Belgelenen düzenlemede aşıkların ana kirişlerle ve donatılı hafif beton panellerle bağlantısı çatı diyaframı davranışına katkı sağlar. Çatı, düzlem içi kuvvetlerin dağıtılması için rijit diyafram olarak modellenmiştir.",
        "Sistemde akslar arası uzunluğu 7,20 m olan tek bir aşık tipi kullanılır.",
        "Aşıklar ana kirişlere filiz donatıları ve grout ile bağlanır; birleşimde mesnet ve süreklilik sağlanır."
      ]
    },
    "self-standing-wall": {
      role: "Ana çerçeveden bağımsız prefabrik çevre duvarı",
      paragraphs: [
        "Alt çevre duvarları ana çerçeveden bağımsız tasarlanır; kolonlarla yapısal bağlantıları yoktur. Yükleri kendi temellerine aktarırlar. Duvar tabanındaki bütünleşik bağ kirişi, temele cıvatalanır; duvar temeli kolonlar arasındaki bağı da oluşturur.",
        "Boyuna ve enine açıklıklar için akslar arası 4,8, 6 ve 7,2 m uzunluklarında üç modüler duvar tipi vardır. Ölçüler yapısal ızgaraya uyum sağlayarak üretimi, taşımayı ve montajı kolaylaştırır.",
        "Duvar; kendi ağırlığını ve rüzgâr gibi etkileri taşır, bunları bağlantıları aracılığıyla kendi temeline aktarır; ana çerçeveye yük bindirmez.",
        "Prefabrik çözüm sahadaki işleri azaltır, ölçü ve montaj kalitesini destekler. Mimari planda gereken yerlerde modüler giriş açıklıkları düzenlenebilir."
      ]
    },
    "tie-beam": {
      role: "Yapının bütünlüğü için enine prefabrik bağ",
      paragraphs: [
        "Enine bağ kirişleri, genel stabiliteyi artırmak, enine çerçeveleri birleştirmek ve boyuna doğrultudaki deformasyon ile burulmayı sınırlamak için belirli aralıklarla kullanılır. İki bağ kirişi yapının tüm enini geçer.",
        "Her iki taraftaki elemanları bağlayıp yatay ve burulma kuvvetlerinin dağılımına yardımcı olurlar; özellikle uzun yapılarda bütünleşik davranışı iyileştirirler.",
        "Bu bağlar da diğer elemanlarla uyumlu prefabrik parçalar olarak üretilir ve sahada hızlı monte edilir."
      ]
    },
    foundation: {
      role: "Kolon yükleri için prefabrik soket temel",
      paragraphs: [
        "Soket temel, kolondan gelen düşey ve yatay kuvvetler ile momentleri zemine aktarır. Prefabrik kolon yuvasına yerleştirilir ve bağlantı, montajdan sonra tasarım detaylarına göre grout ile tamamlanır.",
        "Tek açıklıklı yapıda konum, kuvvet ve geometriye göre F50F2, F51F2, F52F2 ve F53F2 olmak üzere dört temel tipi öngörülmüştür. Ölçüler ve donatı her konumun tasarımına göre belirlenir.",
        "Soket geometrisi kolonun yerini tanımlar ve montajı kolaylaştırır. Kolonlarla temellerin bağımsız üretimi kalite kontrolünü ve sahadaki işlerin azaltılmasını destekler.",
        "Belgelenen ölçüler Alborz bölgesinin zemin ve jeoteknik koşullarına dayanır. Farklı bir yer veya zemin için tasarım, proje yükleri ve jeoteknik etütle yeniden kontrol edilmeli, gerekirse değiştirilmelidir."
      ]
    },
    "corner-wall": {
      name: "Prefabrik köşe duvarı", role: "Çevre duvarını dört köşede tamamlar",
      paragraphs: [
        "Prefabrik köşe duvarları, yapının dört köşesinde bağımsız duvarlarla köşe kolonlarının birleşimini kapatarak çevre duvarına kesintisiz bir görünüm verir.",
        "Parçalar bağlantı geometrisine göre tasarlanır. Fabrika üretimi, bu alanları tamamlamak için sahada gereken iş ve malzemeyi azaltır."
      ]
    }
  }
};

export const editorialBenefits = {
  en: [
    { title: "Construction and execution", items: [
      "Rapid installation of the structural frame and exterior envelope", "Production to international standards", "Design earthquake resistance to Iranian Standard 2800", "Loading in line with Chapter 6 of the National Building Regulations", "Damaged elements can be replaced", "Horizontal expansion is possible", "Long-term outdoor storage is possible", "No diagonal bracing elements", "Can use lightweight concrete roof systems", "Significant reduction in structural steel", "Precast concrete perimeter walls replace masonry", "Resistance to blast waves and indirect debris when reinforced lightweight-concrete panels are used", "Resistance to natural and chemical corrosion"
    ] },
    { title: "Fire, energy and acoustic performance", items: [
      "Fire performance according to national building requirements", "Thermal insulation in line with Chapter 19 to limit energy loss", "Less material waste and its associated energy loss", "Acoustic insulation", "Recyclability"
    ] },
    { title: "Economics and operation", items: [
      "Less waste from wall construction", "Shorter investment payback period through faster construction", "Longer service life against corrosion and fire", "Potential savings on perimeter wall finishes", "Potential savings in transporting wall and foundation materials", "Lower energy use in operation", "Lower fixed and overhead project costs"
    ] }
  ],
  tr: [
    { title: "Yapım ve uygulama", items: [
      "Taşıyıcı sistem ve dış kabuğun hızlı montajı", "Uluslararası standartlara göre üretim", "İran Standardı 2800'e göre tasarım depremine dayanım", "Ulusal Yapı Yönetmeliği 6. Bölüme uygun yükleme", "Hasarlı elemanların değiştirilebilmesi", "Yatay genişleme olanağı", "Açık alanda uzun süreli depolama", "Çapraz gergi elemanlarının kaldırılması", "Hafif beton çatı sistemlerinin kullanımı", "Yapısal çelik kullanımında önemli azalma", "Çevre duvarında yığma malzeme yerine prefabrik beton", "Donatılı hafif beton paneller kullanıldığında patlama dalgası ve dolaylı parçalara karşı dayanım", "Doğal ve kimyasal korozyona dayanım"
    ] },
    { title: "Yangın, enerji ve akustik", items: [
      "Ulusal yapı kurallarına göre yangın performansı", "Enerji kaybını azaltmak için 19. Bölüme uygun ısı yalıtımı", "Daha az malzeme kaybı ve buna bağlı enerji kaybı", "Akustik yalıtım", "Geri dönüştürülebilirlik"
    ] },
    { title: "Ekonomi ve işletme", items: [
      "Duvar yapımında daha az malzeme kaybı", "Hızlı uygulamayla daha kısa yatırım geri dönüş süresi", "Korozyon ve yangına karşı daha uzun kullanım ömrü", "Çevre duvarı cephesinde olası tasarruf", "Duvar ve temel malzemelerinin taşınmasında olası tasarruf", "İşletmede daha az enerji tüketimi", "Daha düşük sabit ve genel proje giderleri"
    ] }
  ]
};

export const editorialApplications = {
  en: { education: "Educational buildings", storage: "Warehouses", production: "Light manufacturing and assembly", industry: "Heavy industry", sport: "Sports buildings" },
  tr: { education: "Eğitim yapıları", storage: "Depolar", production: "Hafif üretim ve montaj", industry: "Ağır sanayi", sport: "Spor yapıları" }
};

export const editorialDocumentTitles = {
  en: ["Commendation · 1402", "Commendation · 1404", "Certificate · 1402", "Safety qualification · 1404", "Scanned certificate", "ISO 14001", "ISO 45001", "ISO 9001", "Ready-mix concrete production permit · 1402", "Precast element production permit · 1403", "Precast element permit · reverse and front", "Research and development permit"],
  tr: ["Takdirname · 1402", "Takdirname · 1404", "Sertifika · 1402", "İş güvenliği yeterliği · 1404", "Taranmış sertifika", "ISO 14001", "ISO 45001", "ISO 9001", "Hazır beton üretim izni · 1402", "Prefabrik eleman üretim izni · 1403", "Prefabrik eleman izni · ön ve arka", "Araştırma ve geliştirme izni"]
};
