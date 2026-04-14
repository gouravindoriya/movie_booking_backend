import db from '../db/index.js'
import { usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import ApiError from '../comman/utils/api.errors.js';
import {generateAccessToken} from '../comman/utils/jwt.utils.js'
import bcrypt from 'bcryptjs';

// export const registerservice=async(name:string,email:string,password:string)=>{
//     const isuserExits = await db
//             .select()
//             .from(usersTable)
//             .where(eq(usersTable.email, email))
//             .limit(1);

//         if (isuserExits.length > 0) {
//             throw ApiError.conflict("user already exits")
//         }

//         const hashedPassword = await bcrypt.hash(password, 4)

//         const user:typeof usersTable.$inferInsert={
//                name,email,password: hashedPassword
//         }

//         const result = await db
//             .insert(usersTable)
//             .values(user)
//             .returning({
//                 id:usersTable.id,
//                 name: usersTable.name,
//                 email: usersTable.email,
//             });

//         const createdUser = result[0]

//         if (!createdUser) {
//             throw ApiError.internal('failed to create user')
//         }

//         const { id, ...safeUser } = createdUser

//         return {user:safeUser} 
        

// }

export const loginservice=async(email:string,password:string)=>{
    const users = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        if (0===users.length) {
            throw ApiError.conflict("user doesn't exits")
        }

        const user = users[0]

        if (!user) {
            throw ApiError.conflict("user doesn't exits")
        }

        const isMatched = await bcrypt.compare(password, user.password)

        if (!isMatched) {
            throw ApiError.unauthorized('invalid password')
        }

        const { password: _password, ...safeUser } = user
        const accessToken = generateAccessToken(safeUser)

        return { token: accessToken }



}


export const registerservice = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });

    const createdUser = result[0];

    if (!createdUser) {
      throw ApiError.internal('Failed to create user');
    }

    const { id: _id, ...safeUser } = createdUser;
    return { user: safeUser };

  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error?.code === '23505' || error?.cause?.code === '23505') {
      throw ApiError.conflict('User already exists'); 
    }

    throw ApiError.internal('Registration failed');
  }
};