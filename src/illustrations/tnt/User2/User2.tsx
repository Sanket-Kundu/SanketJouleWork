import { createIllustration } from "../../createIllustration";

export const User2 = createIllustration({
  name: "TntUser2",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default User2;
