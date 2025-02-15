// conf/cors.ts
import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Determine if we're running in API mode
    const isApiMode = process.argv.includes('--api');

    // If no origin is provided (non-browser requests) and we're in API mode, allow it.
    if (!origin && isApiMode) {
      return callback(null, true);
    }

    // Otherwise, only allow the frontend URL
    if (origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    // Reject all other origins
    return callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200, // Some legacy browsers (or clients) might need this
};
