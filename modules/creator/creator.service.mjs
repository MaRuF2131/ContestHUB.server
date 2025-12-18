import { ObjectId, ReturnDocument } from "mongodb";
import mongo from "../../MongoDB.mjs";

const creatorservice ={
    async createContest(contest){
        try{
            const db= await mongo();
            const result = await db.collection('contests').insertOne(contest);
            return result; 
        }catch(err){
            throw err;
        }    
    },
    async updateContest(contest) {
    try {
        const db = await mongo();
        const result = await db.collection("contests").findOneAndUpdate(
        { _id: new ObjectId(contest._id) },
        { $set: contest },
        {
            returnDocument: "after", //  updated document return করবে
        }
        );

        return result.value; // full updated contest data
    } catch (err) {
        throw err;
    }
    },
    async getContest(filter,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           const [data,total]=await Promise.all([
            await db.collection("contests").find(filter).skip(skip).limit(pagination?.limit).sort({createdAt:-1}).toArray(),
            await db.collection("contests").countDocuments(filter),
           ])

            return {
            success: true,
            data,
            pagination: {
                total,
                page: parseInt(pagination?.page),
                limit: parseInt(pagination?.limit),
                totalPages: Math.ceil(total / pagination?.limit),
            },
            }
        }catch(error){
            throw error
        }
    },

    async deleteContest(contest){
        try{
            const db= await mongo();
            const result = await db.collection('contests').deleteOne({
                _id:new ObjectId(contest._id)
            },{projection:{imageUrl:1},returnDocument:'before'});
            return result; 
        }catch(err){
            throw err;
        }    
    }
};

