import dotenv from "dotenv"

dotenv.config()

export const dbConfig = {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
}