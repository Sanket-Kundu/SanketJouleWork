import { createIllustration } from "../../createIllustration";

export const AddPeople = createIllustration({
  name: "AddPeople",
  title: "You\'ve not added anyone to the calendar yet",
  subtitle: "Do you want to add someone now?",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default AddPeople;
