const schedule = require('node-schedule')
const { PubSub } = require('@google-cloud/pubsub')
const { pubsub } = require('../config/config')
const labkesPelaporanSub = process.env.SUBSCRIPTION_NAME_LABKESPELAPORAN
const pubsubClient = new PubSub(pubsub)
const {setTimeOut} = require('../helpers/integration/timeout')

module.exports = (server) => {
  schedule.scheduleJob("*/1 * * * *", function() {
    console.log('Worker Labkes Pelaporan runs every 1 minutes')

    try {
      const subscriber = pubsubClient.subscription(labkesPelaporanSub)
      const msgHandler = async (message) => {
          try {
            const data = Buffer.from(message.data, 'base64').toString()
            const services = server.methods.services
            let payload = await server.methods.services.integration.createOrUpdateCase(data, services)

            message.ack();
          } catch (error) {console.log(error)}
      }

      subscriber.on('message', msgHandler)
      setTimeOut(labkesPelaporanSub, msgHandler)

    } catch (error) {
      console.log(`ERROR PUBSUB: ${error}`);
    }
  });
}