import "i18next";
import type { I18nStrings } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "fx";
    resources: {
      fx: I18nStrings;
    };
  }
}
