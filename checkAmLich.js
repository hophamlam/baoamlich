const {
  getTodayString,
  getLunarDate,
  getCurrentTime,
  currentLunarDate,
} = require("./amlich-hnd.js");

const dayjs = require("dayjs");
const today = dayjs();
const todaySolarDate = parseInt(today.format("DD"));
const todaySolarMonth = parseInt(today.format("MM"));
const todaySolarYear = parseInt(today.format("YYYY"));
const todayLunarDate = () => {
  return getLunarDate(todaySolarDate, todaySolarMonth, todaySolarYear).day;
}; // Today's date in Lunar calendar
const todayLunarMonth = () => {
  return getLunarDate(todaySolarDate, todaySolarMonth, todaySolarYear).month;
}; // Today's month in Lunar calendar
const todayLunarYear = () => {
  getLunarDate(todaySolarDate, todaySolarMonth, todaySolarYear).year;
};

module.exports = {
  todayLunarDate,
  todayLunarMonth,
  todayLunarYear,
};
