import { createIllustration } from "../../createIllustration";

export const EmptyPlanningCalendar = createIllustration({
  name: "EmptyPlanningCalendar",
  title: "Nothing planned yet",
  subtitle: "There are no activities in this time frame.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default EmptyPlanningCalendar;
