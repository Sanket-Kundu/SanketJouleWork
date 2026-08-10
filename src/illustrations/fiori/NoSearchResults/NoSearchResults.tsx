import { createIllustration } from "../../createIllustration";

export const NoSearchResults = createIllustration({
  name: "NoSearchResults",
  title: "We could not find this.",
  subtitle: "Try adjusting your search.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoSearchResults;
