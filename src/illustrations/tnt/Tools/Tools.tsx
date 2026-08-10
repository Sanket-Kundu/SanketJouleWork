import { createIllustration } from "../../createIllustration";

export const Tools = createIllustration({
  name: "TntTools",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Tools;
