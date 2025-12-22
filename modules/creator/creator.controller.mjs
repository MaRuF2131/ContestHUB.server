import { deleteFromCloudinary } from "../../utils/CDN/cloudinaryUpload.mjs";
import { creatorservice } from "./creator.service.mjs";

export const creatorController = {
  // Create contest
  async create(req, res) {
    try {
    const {
      price,
      prizeMoney,
      type,
      description,
      taskInstruction,
      deadline,
      name,
    } = req.body;
      const info = {
      name,
      price: Number(price),
      prizeMoney: Number(prizeMoney),
      type,
      description,
      taskInstruction,
      deadline: new Date(deadline),
      creator:req?.user?.username,
      creatorEmail:req?.user?.email,
      winnerID:"",
      imageUrl: req?.imageData?.secure_url,
      imagePublicId: req?.imageData?.public_id,
      createdAt: new Date(),
      status: "Pending",
      participants: 0,
    };
    if (req.imageData && req.imageData.secure_url) {
      info.imageUrl = req.imageData.secure_url;
      info.imagePublicId = req.imageData.public_id;
    }else{
      res.status(403).json({message:"Image is required"})
    }
      const Contest = await creatorservice.createContest({
       ...info
      });

      res.status(201).json({
        success:true,
        data:Contest,
        message: "Successfully created contest"
      });
    } catch (error) {
      console.log(error);     
      res
        .status(500)
        .json({ message: "Failed to create contest", error });
    }
  },

  // List / Paginated 
  async list(req, res) {
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
        { type: { $regex: search, $options: 'i' } },
      ]
      }
      const contest = await creatorservice.getContest(
       filter,
       {
        page,
        limit
       }
      );

      res.status(201).json(contest);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to fetch contest", error });
    }
  },

  // Update contest
  async update(req, res) {
    try {
      const { id } = req.params ;
      const info={price,prizeMoney,type,description,taskInstruction,deadline,name} = req.body;
      const updated = await creatorservice.updateContest(id, info);
      res.status(201).json({
        success:true,
        data:updated,
        message: "Successfully update contest"
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update contest", error });
    }
  },

  // Delete contest
  async remove(req, res) {
    try {
      const { id } = req.params;
      const result=  await creatorservice.deleteContest(id);
      console.log("rs",result);
      
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
