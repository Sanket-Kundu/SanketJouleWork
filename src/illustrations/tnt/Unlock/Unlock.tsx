import { createIllustration } from "../../createIllustration";

export const Unlock = createIllustration({
  name: "TntUnlock",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Unlock;
