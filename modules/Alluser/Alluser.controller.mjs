import { AllUserservice } from "./Alluser.service.mjs";

export const AllUserController = {
  // List / Paginated 
  async list(req, res) {
    try {
      const { status:tranding, type,search, page, limit } = req.query;
      const filter={}
      let srt={};
      const allowedTranding = [
        "populer",
        "latest",
        "most prize",
        "low entry fee",
        "all",
      ];
      
      if (!allowedTranding.includes(tranding)) {
        return res.status(400).json({ message: "Invalid trending value" });
      }
      if(type !='all'){
        filter.type=type
      }
      if(tranding =='populer'){
         srt={prizeMoney:-1,participants:-1,price:1}
      }
      if(tranding =='most prize'){
         srt={prizeMoney:-1}
      }
      if(tranding =='low entry fee'){
         srt={price:1}
      }
      if(tranding =='latest'){
         srt={createdAt:-1}
      }
      if(search !=''){
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ]
      }
      const contest = await AllUserservice.getContest(
       filter,
       srt,
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
  async getSigle(req,res){
      try {
          const {id} =req.params;
          console.log("id",id);
          const contest = await AllUserservice.getById(
             id
           );
        console.log(contest);
        res.status(201).json(contest);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "Failed to fetch contest", error });
      }
  }
};
