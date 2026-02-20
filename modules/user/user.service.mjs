import { ObjectId } from "mongodb";
import mongo from "../../MongoDB.mjs";

export const userservice = {
  async getParticipation(filter, filter2, pagination) {
    try {
      const page = parseInt(pagination?.page) || 1;
      const limit = parseInt(pagination?.limit) || 10;
      const skip = (page - 1) * limit;

      const db = await mongo();

      const pipeline = [

        { $match: filter },

        {
          $addFields: {
            contestObjectId: { $toObjectId: "$contestId" }
          }
        },

        {
          $lookup: {
            from: "contests",
            localField: "contestObjectId",
            foreignField: "_id",
            as: "contest"
          }
        },

        { $unwind: "$contest" },

          ...(filter2 && Object.keys(filter2).length
            ? [{ $match: filter2 }]
            : []),
        { $sort: { "contest.deadline":1 } },

        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  _id: 1,
                  status: 1,
                  amount: 1,
                  createdAt: 1,

                  contestId: "$contest._id",
                  contestName: "$contest.name",
                  contestDeadline: "$contest.deadline",
                  contestType: "$contest.type",
                  contestPrize: "$contest.prizeMoney",
                  contestImage: "$contest.imageUrl"
                }
              }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        }
      ];

      const result = await db
        .collection("payments")
        .aggregate(pipeline)
        .toArray();

      const data = result[0]?.data || [];
      const total = result[0]?.totalCount[0]?.count || 0;

      return {
        success: true,
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };

    } catch (error) {
      throw error;
    }
  },
  async postTask(user,contestId,taskUrl){
    try {
      const db=await mongo(); 
      const filter={
        userId:user?.uid,
        userMail:user?.email,
        contestId:contestId,
      };
      const updateDoc={
        $set:{
          taskUrl:taskUrl,
          submittedAt:new Date()
        }
      };
      const result=await db.collection("task").updateOne(filter,updateDoc);    
      if(result.modifiedCount===0){
        const resultInsert=await db.collection("task").insertOne({
          userId:user?.uid,
          userMail:user?.email,
          username:user?.username,
          contestId:contestId,
          taskUrl:taskUrl,
          win:false,
          prize:null,
          submittedAt:new Date()
        });
        if(resultInsert.insertedCount===0){
          return {
            success:false,
            message:"Task submission failed"
          };
        }
        return{
          success:true,
          message:"Task submitted successfully"
        }
      }
      return {
        success:true,
        message:"Task updated successfully"
      };
    } catch (error) {
      throw error;
    }
  },
  async winning(filter,filter2,pagination){
    try {
      const page = parseInt(pagination?.page) || 1;
      const limit = parseInt(pagination?.limit) || 10;
      const skip = (page - 1) * limit;

      const db = await mongo();

      const pipeline = [

        { $match: filter },

        {
          $addFields: {
            contestObjectId: { $toObjectId: "$contestId" }
          }
        },

        {
          $lookup: {
            from: "contests",
            localField: "contestObjectId",
            foreignField: "_id",
            as: "contest"
          }
        },

        { $unwind: "$contest" },

          ...(filter2 && Object.keys(filter2).length
            ? [{ $match: filter2 }]
            : []),
        { $sort: { "contest.deadline":1 } },

        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                    _id: 1,
                    userId:1,
                    userMail:1,
                    username:1,
                    contestId:1,
                    taskUrl:1,
                    win:1,
                    prize:1,
                    contestName: "$contest.name",
                    contestId: "$contest._id",
                    contestDeadline: "$contest.deadline",
                    contestType: "$contest.type",
                    contestPrize: "$contest.prizeMoney",
                    contestEntryFee: "$contest.price",
                    contestImage: "$contest.imageUrl"
                }
              }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        }
      ];

      const result = await db
        .collection("task")
        .aggregate(pipeline)
        .toArray();
       console.log("result",result);
      const data = result[0]?.data || [];
      const total = result[0]?.totalCount[0]?.count || 0;

      return {
        success: true,
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    }catch (error) {
      throw error;
    }
  }
};