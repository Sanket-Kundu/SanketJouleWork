import { createIllustration } from "../../createIllustration";

export const NoTasks_v1 = createIllustration({
  name: "NoTasks_v1",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoTasks_v1;
