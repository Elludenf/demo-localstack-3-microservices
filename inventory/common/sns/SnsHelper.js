'use strict'

const awsSnsAdapter = require('./SnsAdapter')

const INVENTORY_TOPIC_ARN = `${process.env.AWS_SNS_TOPIC_ARN_PREFIX}:demo-${process.env.LOCALSTACK_ENDPOINT ? 'local' : process.env.NODE_ENV}-inventory`

if (!process.env.AWS_SNS_TOPIC_ARN_PREFIX) {
  console.warn('AWS_SNS_TOPIC_ARN_PREFIX not set')
}

/**
 * @typedef {Object} SnsResponseObject
 * @property {String} SnsResponseObject.MessageId
 * @property {String} SnsResponseObject.SequenceNumber
 *
 * @param {String} subject - This is the subject of the message
 * @param {Object} message - This is a free-form object to send a the body of the message
 * @param {?String} topicArn - Topic ARN to publish on. Defaults to the inventory INVENTORY_TOPIC_ARN.
 * @returns {?Promise<SnsResponseObject>} - This returns
 */
function publish (subject, message, topicArn = INVENTORY_TOPIC_ARN) {
  console.info('SNS', subject, message)

  if (!process.env.AWS_SNS_TOPIC_ARN_PREFIX) {
    console.warn(`\u001b[31;1m${subject}\u001b[0m`, message)

    return null
  }

  return awsSnsAdapter.publish(topicArn, subject, JSON.stringify(message))
}

const SNS = {
  sendMissingProduct: (event) => {
    const topicArn =  `${process.env.AWS_SNS_TOPIC_ARN_PREFIX}:demo-${process.env.LOCALSTACK_ENDPOINT ? 'local' : process.env.NODE_ENV}-sales`
    return publish('Inventory:missingProduct', event, topicArn)
  },

  sendLowStockAlertForProvider: (event) => {
    const topicArn =  `${process.env.AWS_SNS_TOPIC_ARN_PREFIX}:demo-${process.env.LOCALSTACK_ENDPOINT ? 'local' : process.env.NODE_ENV}-notifications`
    return publish('Inventory:lowStock', event)
  }


}

module.exports = SNS
