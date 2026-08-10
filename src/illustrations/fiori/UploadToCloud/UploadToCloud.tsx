import { createIllustration } from "../../createIllustration";

export const UploadToCloud = createIllustration({
  name: "UploadToCloud",
  title: "Migrate to SAP Integration Suite",
  subtitle: "Move your integration content from the existing Process Integration subscription to the Cloud Integration capability.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default UploadToCloud;
