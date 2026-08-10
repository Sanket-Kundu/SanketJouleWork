import { createIllustration } from "../../createIllustration";

export const UnableToLoadImage = createIllustration({
  name: "UnableToLoadImage",
  title: "Unable to load image",
  subtitle: "We couldn\'t find the image at the specified location, or the server isn\'t responding.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default UnableToLoadImage;
