import { creatorservice } from "./creator.service.mjs";

export const creatorController = {
  // Create contest
  async create(req, res) {
    try {
      const info={price,prizeMoney,type,description,taskInstruction,deadline,name} = req.body;
      const Contest = await creatorservice.createContest({
       info
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

      const contest = await creatorservice.getContest(
        {
          status,
          type,
          search
        },
       {
        page,
        limit
       }
      );

      res.json(contest);
    } catch (error) {
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
      const del=  await creatorservice.deleteContest(id);
      res.json({ message: "contest deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete contest", error });
    }
  },
};
