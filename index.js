const cron = require("node-cron");
const { sendDiscord, getTimestamp } = require("./notification");

const checkEvent = async () => {
  console.log(getTimestamp() + ": First run");
  await sendDiscord();
};
// First ignite for test run
checkEvent();
cron.schedule("0 6 * * *", checkEvent);
