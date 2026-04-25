import { ZodError } from "zod";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const parsedData = schema.parse(req.body);
      req.body = parsedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Extract the first error message safely
        const message = error.issues?.[0]?.message || error.errors?.[0]?.message || "Invalid input";

        // Check if API route
        if (req.originalUrl.startsWith("/api")) {
          return res.status(400).json({ success: false, message });
        }

        // Web route: flash error and redirect back
        req.flash("flashdata", {
          type: "danger",
          message,
        });
        
        const back = req.get("Referer") || "/";
        return res.redirect(back);
      }
      next(error);
    }
  };
};
