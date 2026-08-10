import { createIllustration } from "../../createIllustration";

export const UnableToUpload = createIllustration({
  name: "UnableToUpload",
  title: "Unable to upload data",
  subtitle: "Check your Internet connection. If that doesn’t help, check the file format and file size. Otherwise contact your administrator.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default UnableToUpload;
