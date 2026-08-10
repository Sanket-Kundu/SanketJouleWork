import { createIllustration } from "../../createIllustration";

export const KeyTask = createIllustration({
  name: "KeyTask",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default KeyTask;
