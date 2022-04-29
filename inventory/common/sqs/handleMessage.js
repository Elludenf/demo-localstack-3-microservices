'use strict'

const saleCreated = require('./resolvers/saleCreated')

/**
 * @param {String} subject
 * @param {Object} content - This object's format depends on the subject
 * @param {Boolean} isDeadLetterQueue - Whether this message came from DLQ or not
 * @returns Promise<Object> - Response format depends on the subject
 */
async function handleMessage (subject, content, isDeadLetterQueue = false) {
  switch (subject) {
    case 'Sales:created':
      return saleCreated(content)
        default:
      if (isDeadLetterQueue) {
        throw new Error('This message does not belong to me')
      }
  }
}

module.exports = handleMessage
