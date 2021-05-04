const {PubSub} = require('@google-cloud/pubsub')
const {pubsub} = require('../config/config')
const laporMandiriSub = process.env.SUBSCRIPTION_NAME_LAPORMANDIRI
const pubsubClient = new PubSub(pubsub)
const {setTimeOut} = require('../helpers/integration/timeout')

module.exports = (server) => {
  try {
    const subscriber = pubsubClient.subscription(laporMandiriSub)
    const msgHandler = async (message) => {
      const data = Buffer.from(message.data, 'base64').toString()
      const services = server.methods.services
      await server.methods.services.integration.createInfoClinics(data, services, (err, res)=>{console.log(`Data Pikobar Reveived.. ID : ${message.id} ---- ERR: ${err}`)})
      message.ack();
    }

    const errorHandler = (error) => {
      console.error(`ERROR: ${error}`);
      throw error;
    }

    subscriber.on('error', errorHandler)
    subscriber.on('message', msgHandler)
    setTimeOut(laporMandiriSub, msgHandler, errorHandler)

  } catch (error) {
    console.log(`ERROR PUBSUB PIKOBAR: ${error}`);
  }
}