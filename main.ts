import { createClient } from '@clickhouse/client';
import bodyParser from 'body-parser';
import express, { Request, Response } from "express";

const app = express();
const port = 3001;

app.use(bodyParser());

const initClickHouseClient = async () => {
  const client = createClient({
    host: 'http://localhost:8123/',
    database: 'db1',
  });
  if (!(await client.ping())) {
    throw new Error('failed to clickhouse!');
  }
  console.log('successfully db connection!');
  return client;
};

app.get("/", async (req: Request, res: Response) => {
  const client = await initClickHouseClient();
  const row = await client.query({
    query: `SELECT * FROM table1`,
  });

  const jsonRow = await row.json();
  res.send(jsonRow);
});


app.get("/search", async (req: Request, res: Response) => {
  const searchTerm = req.query.q;
  const client = await initClickHouseClient();
  const row = await client.query({
    query:  `SELECT * FROM table1 WHERE string_column LIKE '%${searchTerm}%'`,
  });

  const jsonRow = await row.json();
  res.send(jsonRow);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});