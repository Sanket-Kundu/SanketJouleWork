import { createIllustration } from "../../createIllustration";

export const NoActivities = createIllustration({
  name: "NoActivities",
  title: "You\'ve not added any activities yet",
  subtitle: "Would you like to add one now?",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoActivities;
