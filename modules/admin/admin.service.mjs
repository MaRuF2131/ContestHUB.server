import { ObjectId} from "mongodb";
import mongo from "../../MongoDB.mjs";

export const adminservice ={
    async updateUserRole(id,role) {
    try {
        const db = await mongo();
        const result = await db.collection("user_roles").updateOne(
        { _id: new ObjectId(id) },
        { $set:{role: role} }
        );

        return result; // full updated contest data
    } catch (err) {
        throw err;
    }
    },
    async getUser(filter,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           const [data,total]=await Promise.all([
            await db.collection("user_roles").find(filter).skip(skip).limit(parseInt(pagination?.limit)).sort({createdAt:-1}).toArray(),
            await db.collection("user_roles").countDocuments(filter),
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
            console.log("rrrr");
            
            throw error
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

  async updateContestStatus(id,status) {
    try {
        const db = await mongo();
        const result = await db.collection("contests").updateOne(
        { _id: new ObjectId(id) },
        { $set:{ status:status} }
        );

        return result; // full updated contest data
    } catch (err) {
        throw err;
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

