import { createIllustration } from "../../createIllustration";

export const Lock = createIllustration({
  name: "TntLock",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Lock;
