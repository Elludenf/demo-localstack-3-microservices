'use strict'

const invoiceCreated = require('./resolvers/invoiceCreated')

/**
 * @param {String} subject
 * @param {Object} content - This object's format depends on the subject
 * @param {Boolean} isDeadLetterQueue - Whether this message came from DLQ or not
 * @returns Promise<Object> - Response format depends on the subject
 */
async function handleMessage (subject, content, isDeadLetterQueue = false) {
  console.log(subject)
  switch ('subject', subject) {
    case 'Notifications:InvoiceCreated':
      return invoiceCreated(content)
        default:
      if (isDeadLetterQueue) {
        throw new Error('This message does not belong to me')
      }
  }
}

module.exports = handleMessage
