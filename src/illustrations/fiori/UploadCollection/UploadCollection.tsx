import { createIllustration } from "../../createIllustration";

export const UploadCollection = createIllustration({
  name: "UploadCollection",
  title: "Drop files here",
  subtitle: "You can also upload several files all at once.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default UploadCollection;
