import { createClient } from '@clickhouse/client';
import csvParser from 'csv-parser';
import fs from 'fs';


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

const csv_data = (async()=>{
    const client = await initClickHouseClient();
    const csvReadStream = fs.createReadStream('./large_data2.csv');
    const csvParserStream = csvParser();
  
    csvReadStream.pipe(csvParserStream);
  
    for await (const row of csvParserStream) {
      await client.insert({
        table: 'db1.table1',
        values: [
          {
            id: row.id,
            string_column: `${row.string_column}`,
          },
        ],
        clickhouse_settings: {
          date_time_input_format: 'best_effort',
        },
        format: 'JSONEachRow',
      })
      console.log(`Record ${row} was successfully added`)
    }

    client.close()

})

csv_data();