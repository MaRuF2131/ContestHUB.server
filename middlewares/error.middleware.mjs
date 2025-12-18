
export const errorHandler = async (err, req, res, next) => {
   console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
