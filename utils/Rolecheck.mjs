import mongo from "../MongoDB.mjs";

const rolecheck = async (req, res, next) => {
  try {
    const db = await mongo();
    const email = req?.user?.email;

    if (!email) {
      console.log("err5");
      return res.status(401).json({ message: "Unauthorized: No email found in token" });
    }

    const result = await db.collection("user_roles").findOne({ email });

    if (!result) {
      return res.status(404).json({ message: "No role found for this user" });
    }
    if(result?.role!=req?.user?.role){
      console.log("err6");
      return res.status(401).json({message:"Unauthorized:Reload or Loging again"})
    }
    req.role = result?.role;
    next();
  } catch (error) {
    console.error("Failed to find user role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default rolecheck;
