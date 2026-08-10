import { createIllustration } from "../../createIllustration";

export const NoTasks = createIllustration({
  name: "NoTasks",
  title: "You\'ve no tasks",
  subtitle: "When you do, you\'ll see them here.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoTasks;
