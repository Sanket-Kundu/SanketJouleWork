import { useTranslation } from "react-i18next";
import { isRTLLocale } from "./types";

export function useDirection(): "ltr" | "rtl" {
  const { i18n } = useTranslation();
  return isRTLLocale(i18n.language) ? "rtl" : "ltr";
}
