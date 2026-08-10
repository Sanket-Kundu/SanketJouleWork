import { createIllustration } from "../../createIllustration";

export const Components = createIllustration({
  name: "TntComponents",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Components;
