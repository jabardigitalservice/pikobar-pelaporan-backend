const { PubSub } = require('@google-cloud/pubsub')
const { pubsub } = require('../config/config')
const labkesPelaporanSub = process.env.SUBSCRIPTION_NAME_LABKESPELAPORAN
const pubsubClient = new PubSub(pubsub)
const {setTimeOut} = require('../helpers/integration/timeout')

module.exports = (server) => {
  console.log('Worker Labkes Pelaporan runs every 1 minutes')
  try {
    const subscriber = pubsubClient.subscription(labkesPelaporanSub)
    const msgHandler = async (message) => {
      const data = Buffer.from(message.data, 'base64').toString()
      const services = server.methods.services
      await server.methods.services.integration.createOrUpdateCase(data, services, (err, res)=>{console.log(`Data Labkes Received.. ID : ${message.id} ---- ERR: ${err}`)})
      message.ack();
    }

    const errorHandler = (error) => {
      console.error(`ERROR: ${error}`);
      throw error;
    }

    subscriber.on('error', errorHandler)
    subscriber.on('message', msgHandler)
    setTimeOut(labkesPelaporanSub, msgHandler, errorHandler)

  } catch (error) {
    console.log(`ERROR PUBSUB PELAPORAN LABKES: ${error}`);
  }
}