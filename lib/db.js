import mysql from "mysql2/promise";

let pool  = null;


 function getPool(){
    if(pool) return pool
    try{
        
        const host = "localhost"
        const user = "root"
        const password = "Godrkph@11"
        const database = "student_db"

        if(!host || !user ||!password ||!database){
            throw new Error("Missing host, user, password, database");
        }

        pool = mysql.createPool({
            host, 
            user, 
            password, 
            database,
            waitForConnections:true,
            connectionLimit: 5
        })

        return pool
    } catch(err){
        return null
    }
}

export async function getSchools(){
    const p =await getPool();
            
    const [rows] = await p.query("SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY id DESC",);
    return rows;
}

export async function insertSchool({name, address, city, state, contact, email_id, image}){
    const p = await getPool();
    const [result] = await p.query("INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?,?,?,?,?,?,?)", [name, address, city,state, String(contact || ""), image || "", email_id],)
    const id = result.insertId;
    return {id, name, address, city,state, contact: String(contact || ""), image: image||"", email_id}
}

 