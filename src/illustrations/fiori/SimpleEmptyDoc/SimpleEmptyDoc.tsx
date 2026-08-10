import { createIllustration } from "../../createIllustration";

export const SimpleEmptyDoc = createIllustration({
  name: "SimpleEmptyDoc",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleEmptyDoc;
