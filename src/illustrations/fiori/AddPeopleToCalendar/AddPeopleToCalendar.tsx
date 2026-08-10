import { createIllustration } from "../../createIllustration";

export const AddPeopleToCalendar = createIllustration({
  name: "AddPeopleToCalendar",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default AddPeopleToCalendar;
