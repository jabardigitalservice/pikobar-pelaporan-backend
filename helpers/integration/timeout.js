const {PubSub} = require('@google-cloud/pubsub')
const {pubsub} = require('../../config/config')
const pubsubClient = new PubSub(pubsub)
const timeout = 90//milidetik

const setTimeOut = (subscribe, msgHandler, errorHandler) => {
  const subscriber = pubsubClient.subscription(subscribe)

   setTimeout(() => {
        subscriber.removeListener('error', errorHandler);
        subscriber.removeListener('message', msgHandler);
    }, timeout * 1000);

    return null
}

module.exports = {
  setTimeOut
}