import { createIllustration } from "../../createIllustration";

export const Avatar = createIllustration({
  name: "TntAvatar",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Avatar;
