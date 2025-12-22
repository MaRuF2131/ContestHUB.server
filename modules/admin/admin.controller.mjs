import { adminservice } from "./admin.service.mjs";

export const adminController = {
  // List / Paginated 
  async Contestlist(req, res) {
    try {
      const { status, type,search, page, limit } = req.query;
      const filter={}
      if(status !=='Pending' && status !=='Confirmed' && status !=='Rejected' && status !=='all'){
         return res.status(401).json({message:"Invalid Status"})
      }
      if(type !='all'){
        filter.type=type
      }
      if(status !=='all'){
        filter.status=status
      }
      if(search !=''){
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { creator: { $regex: search, $options: 'i' } },
      ]
      }
      const contest = await adminservice.getContest(
       filter,
       {
        page,
        limit
       }
      );

      res.status(201).json(contest);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch contest", error });
    }
  },
  // List / Paginated 
  async Userlist(req, res) {
    try {
      const { type,search, page, limit } = req.query;
      const filter={}
      if(type !=='admin' && type !=='user' && type !=='creator' && type !=='all'){
         return res.status(401).json({message:"Invalid Role"})
      }
      if(type !='all'){
        filter.role=type
      }
      if(search !=''){
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
      }
      const user = await adminservice.getUser(
       filter,
       {
        page,
        limit
       }
      );
      console.log("user",user);
      
      res.status(200).json(user);
    } catch (error) {
      console.log("error",error);
      
      res
        .status(500)
        .json({ message: "Failed to fetch contest", error });
    }
  },

  // Update user role
  async updateRole(req, res) {
    try {
      const { id } = req.params ;
      const {role}=req.body;
      console.log("role",role);
      
      if(role!='user' && role!='creator' && role!='admin'){
       return res.status(403).json({ message: 'Invalid role' });
      }
      const updated = await adminservice.updateUserRole(id, role);
      if(!updated){
        return res.status(403).json({message:"Faild to update"})
      }
      res.status(201).json({
        success:true,
        data:updated,
        message: "Successfully update user role"
      });
    } catch (error) {
      console.log("rr",error);
      
      res
        .status(500)
        .json({ message: "Failed to update user role", error });
    }
  },
  // Update contest status
  async updateStatus(req, res) {
    try {
      const { id } = req.params ;
      const {status}=req.body;
      if(status!='Confirmed' && status!='Rejected'){
       return res.status(403).json({ message: 'Invalid status' });
      }
      const updated = await adminservice.updateContestStatus(id, status);
      if(!updated){
        return res.status(403).json({message:"Faild to update"})
      }
      res.status(201).json({
        success:true,
        data:updated,
        message: "Successfully update contest status"
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update contest status", error });
    }
  },
    // Delete contest
    async remove(req, res) {
      try {
        const { id } = req.params;
        const result=  await adminservice.deleteContest(id);
              if(!result){
                return res.status(404).json({ message: "contest not found" });
              }
              if(result?.imagePublicId){
                try {
                  await deleteFromCloudinary(result?.imagePublicId);
                  console.log(`🗑️ Cloudinary image deleted for product:`, result?.imagePublicId);
                } catch (cloudErr) {
                  console.error("⚠️ Cloudinary delete error:", cloudErr.message);
                }
              }
              res.status(200).json({ message: "contest deleted" });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to delete contest", error });
      }
    },
};
