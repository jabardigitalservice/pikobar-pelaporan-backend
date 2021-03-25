const schedule = require('node-schedule')
const { PubSub } = require('@google-cloud/pubsub')
const { pubsub } = require('../config/config')
const labkesPelaporanSub = process.env.SUBSCRIPTION_NAME2
const pubsubClient = new PubSub(pubsub)
const timeout = 60
let msgCount = 0

module.exports = (server) => {
  schedule.scheduleJob("*/1 * * * *", function() {
    console.log('Worker Labkes Pelaporan runs every 1 minutes')

    try {
      const subscriber = pubsubClient.subscription(labkesPelaporanSub)
      const msgHandler = async (message) => {
          msgCount += 1;
          try {
            const data = Buffer.from(message.data, 'base64').toString()
            console.log(data);

            message.ack();
          } catch (error) {console.log(error)}
      }

      subscriber.on('message', msgHandler)
      setTimeout(() => {
            subscriber.removeListener('message', msgHandler);
            console.log(`${msgCount} message(s) received.`);
      }, timeout * 1000);

    } catch (error) {
      console.log(`ERROR PUBSUB: ${error}`);
    }
  });
}