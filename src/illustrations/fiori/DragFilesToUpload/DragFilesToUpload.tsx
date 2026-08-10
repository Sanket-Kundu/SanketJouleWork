import { createIllustration } from "../../createIllustration";

export const DragFilesToUpload = createIllustration({
  name: "DragFilesToUpload",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default DragFilesToUpload;
