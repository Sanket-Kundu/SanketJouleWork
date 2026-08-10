import { createIllustration } from "../../createIllustration";

export const SleepingBell = createIllustration({
  name: "SleepingBell",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SleepingBell;
