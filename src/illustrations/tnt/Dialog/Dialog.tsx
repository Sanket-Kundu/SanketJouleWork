import { createIllustration } from "../../createIllustration";

export const Dialog = createIllustration({
  name: "TntDialog",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Dialog;
