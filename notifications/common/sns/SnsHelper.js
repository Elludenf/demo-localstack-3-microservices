'use strict'

const awsSnsAdapter = require('./SnsAdapter')

const NOTIFICATIONS_TOPIC_ARN = `${process.env.AWS_SNS_TOPIC_ARN_PREFIX}:demo-${process.env.LOCALSTACK_ENDPOINT ? 'local' : process.env.NODE_ENV}-notifications`

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
 * @param {?String} topicArn - Topic ARN to publish on. Defaults to the notifications NOTIFICATIONS_TOPIC_ARN.
 * @returns {?Promise<SnsResponseObject>} - This returns
 */
function publish (subject, message, topicArn = NOTIFICATIONS_TOPIC_ARN) {
  console.info('SNS', subject, message)

  if (!process.env.AWS_SNS_TOPIC_ARN_PREFIX) {
    console.warn(`\u001b[31;1m${subject}\u001b[0m`, message)

    return null
  }

  return awsSnsAdapter.publish(topicArn, subject, JSON.stringify(message))
}

const SNS = {
  invoiceCreated: (event) => {
    return publish('Notifications:InvoiceCreated', event)
  }


}

module.exports = SNS
