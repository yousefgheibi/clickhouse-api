const { createClient } = require('@clickhouse/client');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(bodyParser.json());


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

app.get("/", async (req, res) => {
  const client = await initClickHouseClient();
  const row = await client.query({
    query: `SELECT * FROM table1`,
  });

  const jsonRow = await row.json();

  console.table(jsonRow);
  res.send(jsonRow);
});


app.listen(2000, () => {
  console.log(`[server]: Server is running at http://localhost:2000`);
});