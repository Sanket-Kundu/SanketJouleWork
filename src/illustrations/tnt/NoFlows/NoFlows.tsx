import { createIllustration } from "../../createIllustration";

export const NoFlows = createIllustration({
  name: "TntNoFlows",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoFlows;
