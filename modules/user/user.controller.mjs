import { userservice} from "./user.service.mjs";

export const userController = {

  // List / Paginated 
  async list(req, res) {
    try {
      const user=req.user;  
      const {type,status,search, page, limit } = req.query;
      const filter={}
      const filter2={}
      filter.userMail=user?.email
      filter.userId=user?.uid
      if(status !='all'){
        filter.status=status
      }
      if (type !== 'all') {
        filter2["contest.type"] = type
      }

      if (search !== '') {
        filter2.$or = [
          { "contest.name": { $regex: search, $options: "i" } },
          { "contest.type": { $regex: search, $options: "i" } }
        ]
      }
      const contest = await userservice.getParticipation(
       filter,
       filter2,
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
        .json({ message: "Failed to fetch participation", error });
    }
  },
  async winninglist(req, res) {
    try {
      const user=req.user;  
      const {type,status,search, page, limit } = req.query;
      const filter={}
      const filter2={}
      filter.userMail=user?.email
      filter.userId=user?.uid
      if(status !='all'){
        filter.win=true
      }
      if (type !== 'all') {
        filter2["contest.type"] = type
      }

      if (search !== '') {
        filter2.$or = [
          { "contest.name": { $regex: search, $options: "i" } },
          { "contest.type": { $regex: search, $options: "i" } }
        ]
      }
      console.log("filter",filter,"filter2",filter2);
      
      const result = await userservice.winning(
       filter,
       filter2,
       {
        page,
        limit
       }
      );
      console.log("winning",result);
      
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to winning list", error });
    }
  },
  async submitTask(req,res){
    try {
      const user=req.user;
      const {contestId,taskUrl}=req.body;
      const response=await userservice.postTask(user,contestId,taskUrl);
      console.log("resss",response);
      
      if(!response.success){
        return res.status(400).json({error:response.error});
      }
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to submit task", error });
    }
  }
};
