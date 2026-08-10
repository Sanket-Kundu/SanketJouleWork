import { createIllustration } from "../../createIllustration";

export const AddingColumns = createIllustration({
  name: "AddingColumns",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default AddingColumns;
