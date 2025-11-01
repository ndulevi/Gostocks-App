import { getDB } from "../database/db"



export const  loginUser = async (email: string, password: string) =>{
    const db = getDB();
    const result = await db.execute(
        `SELECT * FROM users WHERE email = ? AND password = ?`,
        [email, password]
    );

    if (result.rows.length > 0) {
    return { success: true, user: result.rows[0] };
    } else {
        return { success: false, message: 'Invalid credentials' };
    }
}