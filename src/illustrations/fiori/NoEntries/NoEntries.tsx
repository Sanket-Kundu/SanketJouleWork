import { createIllustration } from "../../createIllustration";

export const NoEntries = createIllustration({
  name: "NoEntries",
  title: "There are no entries yet",
  subtitle: "When there are, you\'ll see them here.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoEntries;
