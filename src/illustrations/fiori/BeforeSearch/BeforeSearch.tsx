import { createIllustration } from "../../createIllustration";

export const BeforeSearch = createIllustration({
  name: "BeforeSearch",
  title: "Let\'s get some results",
  subtitle: "Start by providing your search criteria.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default BeforeSearch;
