import helmet from "helmet";
import cors from "cors";
import { sanitizeMiddleware } from "../utils/sanitizer";
import { apiLimiter } from "../middlewares/rateLimit.middleware";

export const security = (app) => {
  app.use(apiLimiter)
  app.use(helmet());

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );
  app.use(sanitizeMiddleware());
};
