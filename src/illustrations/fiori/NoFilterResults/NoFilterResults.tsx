import { createIllustration } from "../../createIllustration";

export const NoFilterResults = createIllustration({
  name: "NoFilterResults",
  title: "No results found",
  subtitle: "Try adjusting your filter criteria.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoFilterResults;
