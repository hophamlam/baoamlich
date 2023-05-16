const messageTitle = () => {
  const { getNewTodayString } = require("./amlich-hnd.js");
  return "📆📆 Báo lịch âm " + getNewTodayString();
};

const filterTodayEventFromNotif = () => {
  const { todayLunarDate, todayLunarMonth } = require("./checkAmLich.js");
  var matchingDates = [];

  // Import the JSON data using require
  const data = require("./data/userData.sample.json");

  // Access the userData and eventList properties from the imported data
  const eventList = data.eventList;

  // Loop through the eventList array
  for (var i = 0; i < eventList.length; i++) {
    var event = eventList[i];

    // Check if the event has a notificationList
    if (event.notificationList) {
      // Iterate through the notificationList
      for (var j = 0; j < event.notificationList.length; j++) {
        var notification = event.notificationList[j];

        // Check if the notification matches the provided lunar date and month
        if (
          event.lunarDate + notification.notificationHourBefore / 24 ===
            todayLunarDate() &&
          event.lunarMonth === todayLunarMonth()
        ) {
          matchingDates.push({
            eventType: event.eventType,
            eventTitle: event.eventTitle,
            lunarDate: event.lunarDate,
            lunarMonth: event.lunarMonth,
            notificationHourBefore: notification.notificationHourBefore,
          });
          break; // Stop checking further notifications for this event
        }
      }
    }
  }

  return matchingDates;
};

const eventContent = () => {
  const filterTodayEventFromNotifArray = filterTodayEventFromNotif();
  const concatenateValues = (events) => {
    return events
      .map(
        (event) =>
          `Có sự kiện: ${event.eventType} ${event.eventTitle} vào ${
            event.notificationHourBefore / 24
          } ngày nữa (${event.lunarDate}/${event.lunarMonth} ÂL)\n`
      )
      .join("");
  };
  return concatenateValues(filterTodayEventFromNotifArray);
};

const sendDiscord = () => {
  const axios = require("axios");
  const data = require("./data/userData.sample.json");
  require("dotenv").config();
  const url = process.env.DISCORDWEBHOOKURL;

  const webhookUrl = url;

  const content = {
    embeds: [
      {
        fields: [
          {
            name: messageTitle(),
            value: eventContent(),
            // inline: true,
          },
        ],
      },
    ],
  };

  const sendMessage = async (message) => {
    try {
      await axios.post(webhookUrl, content);
      console.log("Message sent to Discord channel!");
    } catch (error) {
      console.error(
        "Error while sending message to Discord channel:",
        JSON.stringify(error)
      );
    }
  };

  sendMessage();
};

const sendTelegram = () => {};

const sendEmail = () => {};

module.exports = {
  sendDiscord,
};
