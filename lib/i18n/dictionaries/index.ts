import type { Lang } from "../config";
import { en, type Dictionary } from "./en";
import { fr } from "./fr";

export type { Dictionary };

const DICTIONARIES: Record<Lang, Dictionary> = { en, fr };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang] ?? en;
}
