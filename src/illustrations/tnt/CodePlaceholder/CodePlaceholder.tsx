import { createIllustration } from "../../createIllustration";

export const CodePlaceholder = createIllustration({
  name: "TntCodePlaceholder",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default CodePlaceholder;
