import { createIllustration } from "../../createIllustration";

export const NoUsers = createIllustration({
  name: "TntNoUsers",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoUsers;
