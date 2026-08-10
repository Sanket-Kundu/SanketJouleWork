import { createIllustration } from "../../createIllustration";

export const Radar = createIllustration({
  name: "TntRadar",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Radar;
