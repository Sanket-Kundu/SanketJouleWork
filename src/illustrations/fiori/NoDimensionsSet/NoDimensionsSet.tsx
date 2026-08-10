import { createIllustration } from "../../createIllustration";

export const NoDimensionsSet = createIllustration({
  name: "NoDimensionsSet",
  title: "No chart data",
  subtitle: "Try adjusting your chart settings.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoDimensionsSet;
