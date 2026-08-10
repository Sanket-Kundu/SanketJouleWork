import { createIllustration } from "../../createIllustration";

export const SimpleBalloon = createIllustration({
  name: "SimpleBalloon",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleBalloon;
