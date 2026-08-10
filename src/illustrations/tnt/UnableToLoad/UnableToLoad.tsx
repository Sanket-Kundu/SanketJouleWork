import { createIllustration } from "../../createIllustration";

export const UnableToLoad = createIllustration({
  name: "TntUnableToLoad",
  title: "Unable to load data",
  subtitle: "Check your internet connection. And if that\'s not it, try reloading. If that still doesn\'t help, check with your administrator.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default UnableToLoad;
