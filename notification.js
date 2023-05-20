const getTimestamp = () => {
  const dayjs = require("dayjs");
  const utc = require("dayjs/plugin/utc");
  const timezone = require("dayjs/plugin/timezone");
  // Load the plugins
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return dayjs().tz("Asia/Ho_Chi_Minh").format("ddd, DD/MM/YYYY HH:mm:ss");
};

// Check today's date, month, year in lunar calendar
const getTodayLunarInfo = () => {
  const dayjs = require("dayjs");
  const { getLunarDate } = require("./amlich-hnd.js");
  const today = dayjs();
  const todaySolarDate = parseInt(today.format("DD"));
  const todaySolarMonth = parseInt(today.format("MM"));
  const todaySolarYear = parseInt(today.format("YYYY"));
  const lunarDate = getLunarDate(
    todaySolarDate,
    todaySolarMonth,
    todaySolarYear
  );
  return {
    date: lunarDate.day, // Today's date in Lunar calendar
    month: lunarDate.month, // Today's month in Lunar calendar
    year: lunarDate.year, // Today's year in Lunar calendar
  };
};
// query eventId, eventType, eventTitle, notificationId, notificationHourBefore from database
const queryEventByNotif = async () => {
  const sqlite3 = require("sqlite3").verbose();
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM events INNER JOIN notifications ON events.eventId = notifications.eventId";
    const db = new sqlite3.Database(
      "./data/database.db",
      sqlite3.OPEN_READONLY,
      (err) => {
        if (err) {
          reject(err);
        } else {
          db.all(query, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        }
      }
    );
  });
};
// Get items into array and convert into string
// "Có sự kiện ${item.eventType} ${item.eventTitle} trong ${item.notificationHourBefore / 24} ngày nữa"
const getEventToString = async () => {
  const data = await queryEventByNotif();
  const filteredData = data
    .filter(
      (item) =>
        getTodayLunarInfo().date ===
          item.lunarDate - item.notificationHourBefore / 24 &&
        getTodayLunarInfo().month === item.lunarMonth
    )
    .map(
      (item) =>
        `Có sự kiện ${item.eventType} ${item.eventTitle} trong ${
          item.notificationHourBefore / 24
        } ngày nữa`
    )
    .join("\n");
  //   (item) => getTodayLunarMonth() === item.lunarMonth
  // );
  return filteredData;
};
// Get Discord Webhook URL from database
const queryDiscordWebhookUrl = async () => {
  const sqlite3 = require("sqlite3").verbose();
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./data/database.db", (error) => {
      if (error) {
        reject(error);
      } else {
        const query = "SELECT discordWebhookUrl FROM user";
        db.get(query, (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve((data = row.discordWebhookUrl));
          }
        });
      }
    });
  });
};
// Send Message via Discord
const sendDiscord = async () => {
  const axios = require("axios");
  // async function sending Discord message
  try {
    const webhookUrl = await queryDiscordWebhookUrl();
    const eventString = await getEventToString();
    // Get tittle message for Notification system (Discord, Telegram, Email)
    const messageTitle = () => {
      const { getNewTodayString } = require("./amlich-hnd.js");
      return "📆📆 Báo lịch âm " + getNewTodayString();
    };
    // Get message content
    const content = {
      embeds: [
        {
          fields: [
            {
              name: messageTitle(),
              value: eventString,
              // inline: true,
            },
          ],
        },
      ],
    };
    await axios.post(webhookUrl, content);
    console.log(getTimestamp() + ": Message sent to Discord channel!");
  } catch (error) {
    console.error(
      "Error while sending message to Discord channel:",
      JSON.stringify(error)
    );
  }
};

module.exports = {
  sendDiscord,
  getTimestamp,
};
