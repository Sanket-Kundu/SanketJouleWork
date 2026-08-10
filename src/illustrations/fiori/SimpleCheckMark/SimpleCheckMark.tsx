import { createIllustration } from "../../createIllustration";

export const SimpleCheckMark = createIllustration({
  name: "SimpleCheckMark",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleCheckMark;
