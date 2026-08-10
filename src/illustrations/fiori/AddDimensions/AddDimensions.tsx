import { createIllustration } from "../../createIllustration";

export const AddDimensions = createIllustration({
  name: "AddDimensions",
  title: "Some dimensions are missing",
  subtitle: "Add more dimensions to complete your chart.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default AddDimensions;
