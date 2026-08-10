import { createIllustration } from "../../createIllustration";

export const NoSavedItems = createIllustration({
  name: "NoSavedItems",
  title: "You\'ve no pins",
  subtitle: "Would you like to add one now?",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoSavedItems;
