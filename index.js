const cron = require("node-cron");
const { sendDiscord } = require("./notification");
console.log("index.js online");

// const userData = require("./data/userData.sample.json");
// const cronSchedule = userData.cronSchedule;
// cron.schedule(cronSchedule, sendDiscord);

// test cron job every minutes
cron.schedule("* * * * *", sendDiscord);
console.log("test cron job every minutes");
