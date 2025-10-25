import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "@config/env"; // if you have one
import * as schema from "./schema"; // <-- add this

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL /* or env.DATABASE_URL */ });

// Pass { schema } to get typed db.query.<table>
export const db = drizzle(pool, { schema });
