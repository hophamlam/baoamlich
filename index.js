const cron = require("node-cron");
const { sendDiscord, getTimestamp } = require("./notification");
const cronstrue = require("cronstrue");

const checkEvent = async () => {
  await sendDiscord();
};
// First ignite for test run
console.log(getTimestamp() + ": First run");
checkEvent();
console.log(
  getTimestamp() + ": Ignite cron " + cronstrue.toString(cronSchedule) + " "
);

const cronSchedule = "0 */3 * * *";
cron.schedule(cronSchedule, checkEvent);
