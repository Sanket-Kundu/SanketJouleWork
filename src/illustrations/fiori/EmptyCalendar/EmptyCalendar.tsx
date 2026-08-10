import { createIllustration } from "../../createIllustration";

export const EmptyCalendar = createIllustration({
  name: "EmptyCalendar",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default EmptyCalendar;
