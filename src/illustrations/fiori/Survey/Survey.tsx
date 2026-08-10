import { createIllustration } from "../../createIllustration";

export const Survey = createIllustration({
  name: "Survey",
  title: "Your Opinion Matters",
  subtitle: "We want to hear what you think about SAP software. Share your feedback with us by taking our short survey.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Survey;
