// const { MongoClient } = require("mongodb");

// async function test() {
//   const uri = "<your fixed uri>";
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("✅ Connected successfully");
//   } catch (err) {
//     console.error("❌ Failed to connect", err);
//   } finally {
//     await client.close();
//   }
// }

// test();
