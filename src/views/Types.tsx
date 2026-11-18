import { Link, useParams } from "react-router";
import { useState } from "react";
import Modal from "../components/Modal";
import { typeFamilies } from "../data/typeFamilies";

const heights = [{ module: 3, meters: 7.2 }, { module: 4, meters: 9.6 }, { module: 5, meters: 12 }];
const spans = [{ module: 5, meters: 12 }, { module: 6, meters: 14.4 }, { module: 7, meters: 16.8 },
  { module: 8, meters: 19.2 }, { module: 9, meters: 21.6 }, { module: 10, meters: 24 }];
const dimensions = new Intl.NumberFormat("fa-IR");
const typeCode = (span: number, height: number) => `${span}M × ${height}H`;

function RoofIcon({ family = 0 }: { family?: number }) {
  const crossSection = [
    "M5 27V14L24 5 43 14v13",
    "M5 27V15L14.5 6 24 15 33.5 6 43 15v12M24 15v12",
    "M5 27V16L12 8 19 16 31 4 43 16v11M19 16v11",
  ][family];
  return <svg className="roof-icon" viewBox="0 0 48 32" fill="none" aria-hidden="true">
    <path d={crossSection} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export default function Types() {
  return <section className="section-inner types-overview">
    <h1>تیپ‌بندی</h1>
    <div className="type-family-grid">{typeFamilies.map((family, index) =>
      <Link className="type-family" to={"/types/" + family.slug} key={family.slug}>
        <RoofIcon family={index}/><h2>{family.title}</h2><strong>مشاهده اطلاعات ←</strong>
      </Link>,
    )}</div>
  </section>;
}

export function TypeDetail() {
  const { slug } = useParams();
  const [selected, setSelected] = useState<{h: typeof heights[number]; s: typeof spans[number]} | null>(null);
  const family = typeFamilies.find(type => type.slug === slug);
  if (!family) return <section className="section-inner types-overview"><h1>تیپ پیدا نشد.</h1><Link to="/types">بازگشت به تیپ‌بندی‌ها</Link></section>;
  const isReference = family !== typeFamilies[0];
  return <div className="catalog-home type-detail">
    <section className="section-inner types-overview" aria-labelledby="type-family-title">
      <div className="type-detail-heading">
        <h1 id="type-family-title">{family.title}</h1>
        <Link className="outline-button" to="/types">بازگشت به تیپ‌بندی‌ها</Link>
      </div>
      {isReference && <p className="type-table-note">این جدول، مرجع کاتالوگ سوله تک‌دهانه است. ابعاد تیپ‌بندی دودهانه پس از تأیید منتشر می‌شود.</p>}
      <p className="type-table-hint">برای دیدن همه دهانه‌ها، جدول را افقی پیمایش کنید.</p>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="جدول ۱۸ ترکیب ارتفاع و دهانه">
        <table className="types-table">
          <thead><tr><th scope="col" className="row-corner">ارتفاع زیر سقف<br/><small>دهانه خالص</small></th>
            {spans.map(s => <th key={s.module} scope="col"><bdi className="latin-token">{s.module}M</bdi><small>{dimensions.format(s.meters)} متر</small></th>)}
          </tr></thead>
          <tbody>{heights.map(h => <tr key={h.module}>
            <th scope="row"><bdi className="latin-token">{h.module}H</bdi><small>{dimensions.format(h.meters)} متر</small></th>
            {spans.map(s => <td key={s.module}><button type="button" className="type-cell" onClick={() => setSelected({h, s})}>
              <RoofIcon/><strong dir="ltr">{typeCode(s.module, h.module)}</strong><span aria-hidden="true">↗</span>
            </button></td>)}
          </tr>)}</tbody>
        </table>
      </div>
    </section>
    {selected && <Modal title={"تیپ " + typeCode(selected.s.module, selected.h.module)} onClose={() => setSelected(null)} className="type-matrix-dialog">
      <dl><div><dt>دهانه خالص</dt><dd>{dimensions.format(selected.s.meters)} متر</dd></div>
        <div><dt>ارتفاع زیر سقف</dt><dd>{dimensions.format(selected.h.meters)} متر</dd></div></dl>
      {isReference && <p>ابعاد مرجع سوله تک‌دهانه در کاتالوگ آپتوس</p>}
    </Modal>}
  </div>;
}
