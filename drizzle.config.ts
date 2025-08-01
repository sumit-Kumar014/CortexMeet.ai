import "dotenv/config"
import { defineConfig } from "drizzle-kit";
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    //! :  ! is the non-null assertion operator in TypeScript. This is used when TypeScript can't guarantee that a value is present, but you (as the developer) know it will be.
  },
});
