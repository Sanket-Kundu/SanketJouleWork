import { createIllustration } from "../../createIllustration";

export const SearchFolder = createIllustration({
  name: "SearchFolder",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SearchFolder;
