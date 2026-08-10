import { createIllustration } from "../../createIllustration";

export const SimpleReload = createIllustration({
  name: "SimpleReload",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleReload;
