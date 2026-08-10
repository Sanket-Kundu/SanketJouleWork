import { createIllustration } from "../../createIllustration";

export const Compass = createIllustration({
  name: "TntCompass",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Compass;
