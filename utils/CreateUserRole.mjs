

const CreateUserRole =  async (email,name,role,db) => {
   try{
     // Your logic to create a user role
     const userRole = {
         email: email,
         name: name,
         role: role || 'user',
         createdAt: new Date()
        };
        // Check if the user already exists
        const existingUser = await db.collection('user_roles').findOne({ email: userRole.email });
        // If the user does not exist, create a new user role
        if (!existingUser || !existingUser.name) {  
            const result = await db.collection('user_roles').insertOne(userRole);
            console.log("user",result);       
            return { ok: true, status: 201, message: 'User role created successfully', user: { ...result, role: 'user' } };
        }
        console.log("exuser",existingUser);
        
        // Update the existing user role
        return { ok: true, status: 200, message: 'User role updated successfully', user: existingUser };
   } catch (error) {
      return { ok: false, status: 500, message: 'Failed to create user role' };
   }
}

export default CreateUserRole
