import { createIllustration } from "../../createIllustration";

export const SimpleBell = createIllustration({
  name: "SimpleBell",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleBell;
