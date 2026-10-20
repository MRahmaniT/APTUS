import { getSeedPage } from "../data/pageSeed";
import { ServerRepository } from "./ServerRepository";
function settingKey(path, locale) {
    return `page:${locale}:${path}`;
}
export const PageRepository = {
    async get(path, locale) {
        const stored = await ServerRepository.getSiteSetting(settingKey(path, locale));
        return stored || getSeedPage(path, locale);
    },
    async save(page) {
        await ServerRepository.updateSiteSetting(settingKey(page.path, page.locale), { ...page });
        return page;
    },
};
