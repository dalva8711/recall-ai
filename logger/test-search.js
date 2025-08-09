// logger/test_search.js
const { search } = require('./search');
(async () => {
  try {
    console.log("Starting search...");
    const results = await search("What did I do with Gmail?");
    console.log(`Found ${results.length} results`);
    for (const r of results) {
      console.log(r.day, r.score.toFixed(3));
      console.log(r.text.slice(0, 200) + '...\n');
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
  process.exit(0);
})();
