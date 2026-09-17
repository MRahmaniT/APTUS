import { Locale } from "../config/translations";
import { EditablePage, getSeedPage } from "../data/pageSeed";
import { ServerRepository } from "./ServerRepository";

function settingKey(path: string, locale: Locale) {
  return `page:${locale}:${path}`;
}

export const PageRepository = {
  async get(path: string, locale: Locale): Promise<EditablePage | null> {
    const stored = await ServerRepository.getSiteSetting<EditablePage>(settingKey(path, locale));
    return stored || getSeedPage(path, locale);
  },

  async save(page: EditablePage) {
    await ServerRepository.updateSiteSetting(settingKey(page.path, page.locale), { ...page });
    return page;
  },
};
