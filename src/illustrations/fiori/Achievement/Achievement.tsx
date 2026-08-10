import { createIllustration } from "../../createIllustration";

export const Achievement = createIllustration({
  name: "Achievement",
  title: "Great job!",
  subtitle: "Congratulations on your outstanding performance and dedication!",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Achievement;
