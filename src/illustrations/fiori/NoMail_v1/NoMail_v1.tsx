import { createIllustration } from "../../createIllustration";

export const NoMail_v1 = createIllustration({
  name: "NoMail_v1",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoMail_v1;
