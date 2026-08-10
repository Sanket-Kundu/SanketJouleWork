import { createIllustration } from "../../createIllustration";

export const FaceID = createIllustration({
  name: "TntFaceID",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default FaceID;
