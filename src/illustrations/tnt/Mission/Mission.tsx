import { createIllustration } from "../../createIllustration";

export const Mission = createIllustration({
  name: "TntMission",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Mission;
