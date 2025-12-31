import { ObjectId } from "mongodb";
import mongo from "../../MongoDB.mjs";

export const AllUserservice ={
    async getContest(filter,srt,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           filter.status='Confirmed'
           const [data,total]=await Promise.all([
            await db.collection("contests").find(filter).skip(skip).limit(parseInt(pagination?.limit)).sort({...srt,createdAt:-1}).toArray(),
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
    async getById(id){
        try {
            const db=await mongo();
            const result= await db.collection("contests").findOne({_id:new ObjectId(id)}); 
            return {
                success: true,
                data:result,
                } 
        } catch (error) {
            throw error
        }
    }
};

