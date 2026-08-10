import { createIllustration } from "../../createIllustration";

export const AddColumn = createIllustration({
  name: "AddColumn",
  title: "Looks like there\'s free space",
  subtitle: "You can add more columns in the table settings.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default AddColumn;
