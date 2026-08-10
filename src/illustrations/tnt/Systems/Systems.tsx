import { createIllustration } from "../../createIllustration";

export const Systems = createIllustration({
  name: "TntSystems",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Systems;
