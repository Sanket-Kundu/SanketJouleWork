import { createIllustration } from "../../createIllustration";

export const NoApplications = createIllustration({
  name: "TntNoApplications",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoApplications;
