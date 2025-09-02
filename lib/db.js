import mysql from "mysql2/promise";

let pool  = null;

function assertEnv(){
    const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME} = process.env
    if(!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME){
        throw new Error("Missing MySql environment variables. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.");
    }
}


 function getPool(){
    if(pool) return pool
    assertEnv();

    const port  = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port,
        waitForConnections:true,
        connectionLimit: 5
    })
    return pool
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

 