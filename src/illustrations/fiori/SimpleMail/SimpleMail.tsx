import { createIllustration } from "../../createIllustration";

export const SimpleMail = createIllustration({
  name: "SimpleMail",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleMail;
