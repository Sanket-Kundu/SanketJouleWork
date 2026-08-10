import { createIllustration } from "../../createIllustration";

export const SimpleTask = createIllustration({
  name: "SimpleTask",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleTask;
