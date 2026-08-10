import { createIllustration } from "../../createIllustration";

export const Help = createIllustration({
  name: "TntHelp",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Help;
