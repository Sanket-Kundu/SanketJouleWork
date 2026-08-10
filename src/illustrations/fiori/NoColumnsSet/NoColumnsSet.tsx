import { createIllustration } from "../../createIllustration";

export const NoColumnsSet = createIllustration({
  name: "NoColumnsSet",
  title: "Add columns to see the content",
  subtitle: "Select the columns you need in the table settings.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoColumnsSet;
