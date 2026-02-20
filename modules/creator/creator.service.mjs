import { ObjectId} from "mongodb";
import mongo from "../../MongoDB.mjs";

export const creatorservice ={
    async createContest(contest){
        try{
            const db= await mongo();
            const result = await db.collection('contests').insertOne(contest);
            return result; 
        }catch(err){
            throw err;
        }    
    },
    async updateContest(id,contest,sign) {
    try {
        const db = await mongo();
        if (sign){
            const result = await db.collection("contests").updateOne(
            { _id: new ObjectId(id) },
            { $set: contest },
            {
                projection:{imagePublicId:1},
                returnDocument: "before", //  updated document return করবে
            }
            );
            return result; 
       }else{
            const result = await db.collection("contests").updateOne(
            { _id: new ObjectId(id) },
            { $set: contest },
            );
            return result;

       }
    } catch (err) {
        throw err;
    }
    },
    async updatesubmission(id,prizeMoney) {
    try {
        const db = await mongo();
        const result = await db.collection("task").findOneAndUpdate(
        { _id: new ObjectId(id) },
        [{ $set: { win: {$not: "$win"}, prize: prizeMoney } }],
        );

        return result; // full updated contest data
    } catch (err) {
        throw err;
    }
    },
    async getsubmission(user,contestId,pagination){
        try {
        const page = parseInt(pagination?.page) || 1;
        const limit = parseInt(pagination?.limit) || 10;
        const skip = (page - 1) * limit;

        const db = await mongo();
        const creator= await db.collection("contests").findOne({
            _id:new ObjectId(contestId),      
        });
        
        if(!creator){
            throw new Error("Contest not found");
        }
        if(creator.creator!==user.username || creator.creatorEmail!==user.email){
            throw new Error("Unauthorized access");
        }
            const pipeline = [
                { $match: {contestId:contestId} },
                { $sort: { win: 1 } },
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
    },
    async getContest(filter,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           const [data,total]=await Promise.all([
            await db.collection("contests").find(filter).skip(skip).limit(parseInt(pagination?.limit)).sort({createdAt:-1}).toArray(),
            await db.collection("contests").countDocuments(filter),
           ])

            return {
            success: true,
            data,
            pagination: {
                total,
                page: parseInt(pagination?.page),
                limit: parseInt(pagination?.limit),
                totalPages: Math.ceil(total / parseInt(pagination?.limit)),
            },
            }
        }catch(error){
            throw error
        }
    },

    async deleteContest(id){
        try{
            const db= await mongo();
            const result = await db.collection('contests').findOneAndDelete({
                _id:new ObjectId(id)
            },{projection:{imagePublicId:1},returnDocument:'before'});
            return result; 
        }catch(err){
            throw err;
        }    
    }
};

