import { createIllustration } from "../../createIllustration";

export const SimpleCalendar = createIllustration({
  name: "SimpleCalendar",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleCalendar;
