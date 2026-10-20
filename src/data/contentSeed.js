import { CATALOG_CONTENT } from "../catalog/adapter.js";
import { EDITORIAL_CONTENT } from "./editorialContent.js";
export const CONTENT_SEED = [...CATALOG_CONTENT.filter(item => item.locale === "en"), ...EDITORIAL_CONTENT.filter(item => item.locale === "en")];
