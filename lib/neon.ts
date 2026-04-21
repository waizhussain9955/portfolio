import { neon } from '@neondatabase/serverless';

let sqlClient: ReturnType<typeof neon> | null = null;

export const getNeonSql = () => {
  if (!sqlClient) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    sqlClient = neon(process.env.DATABASE_URL);
  }
  return sqlClient;
};

// For backward compatibility or single instance use
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  return getNeonSql()(strings, ...values);
};
