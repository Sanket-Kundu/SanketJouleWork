import { createIllustration } from "../../createIllustration";

export const SimpleMagnifier = createIllustration({
  name: "SimpleMagnifier",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleMagnifier;
