import { createIllustration } from "../../createIllustration";

export const SearchEarth = createIllustration({
  name: "SearchEarth",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SearchEarth;
