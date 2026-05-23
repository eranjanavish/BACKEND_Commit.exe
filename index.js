import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import PG from "pg";
import 'dotenv/config';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = new PG.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const getData = async (type) => {
  try {
    let response;
    if (type === "Any")
      response = await db.query(`SELECT * FROM public.commits`);
    else
      response = await db.query(`SELECT * FROM public.commits WHERE extype=$1`, [type]);

    if (response.rows.length === 0) return "No commit msg found";
    return response.rows[Math.floor(Math.random() * response.rows.length)].text;
  } catch (err) {
    console.log("Error when connecting to database ||", err);
    return "Database error";
  }
};

app.get("/", async (req, res) => {
  const joke = await getData(req.query.extype);
  res.send(joke);
});

// Export the app for Vercel
export default app;
