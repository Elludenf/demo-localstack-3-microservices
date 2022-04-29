
const AWS = require('aws-sdk')
const EventEmitter = require('events')
class AwsSqsAdapter extends EventEmitter {
  constructor (accessKeyId, secretAccessKey, region) {
    super()
    this._sqs = new AWS.SQS({ accessKeyId, secretAccessKey, region })
  }

  _emitOnEndForQueue (queueUrl, message, numFinishedMessages, data) {
    if (data.Messages.includes(message)) {
      if (++numFinishedMessages === data.Messages.length) {
        numFinishedMessages = 0
        this.emit(AwsSqsAdapter.Events.END(queueUrl), data)
      }
    }
    return numFinishedMessages
  }

  listenQueue (queueUrl, opts = {}) {
    const params = {
      AttributeNames: (Array.isArray(opts.attributeNames) && opts.attributeNames.length > 0) ? opts.attributeNames : ['SentTimestamp'],
      MaxNumberOfMessages: (!isNaN(opts.maxNumberOfMessages) && opts.maxNumberOfMessages > 0) ? opts.maxNumberOfMessages : 1,
      MessageAttributeNames: (Array.isArray(opts.messageAttributeNames) && opts.messageAttributeNames.length > 0) ? opts.messageAttributeNames : ['All'],
      QueueUrl: queueUrl,
      VisibilityTimeout: (!isNaN(opts.visibilityTimeout) && opts.visibilityTimeout > -1) ? opts.visibilityTimeout : 0,
      WaitTimeSeconds: (!isNaN(opts.waitTimeSeconds) && opts.waitTimeSeconds > -1) ? opts.waitTimeSeconds : 0
    }
    this._sqs.receiveMessage(params, (err, data) => {
      if (err) {
        this.emit(AwsSqsAdapter.Events.ERROR(queueUrl), err)
      } else if (Array.isArray(data.Messages) && data.Messages.length > 0) {
        let numFinishedMessages = 0
        data.Messages.forEach(message => {
          this.once(AwsSqsAdapter.Events.MESSAGE_END(message.MessageId), message => {
            numFinishedMessages = this._emitOnEndForQueue(queueUrl, message, numFinishedMessages, data)
          })
          this.emit(AwsSqsAdapter.Events.NEW_MESSAGE(queueUrl), message)
        })
      } else {
        this.emit(AwsSqsAdapter.Events.END(queueUrl), data)
      }
    })
    return this
  }

  on (eventName, listener) {
    if (!/^sqs:.*:message$/.test(eventName)) {
      return super.on(eventName, listener)
    }
    return super.on(eventName, message => {
      const result = listener(message)
      if (result && (result instanceof Promise || result.then)) {
        result
          .then(() => this.emit(AwsSqsAdapter.Events.MESSAGE_END(message.MessageId), message))
          .catch(_ => this.emit(AwsSqsAdapter.Events.MESSAGE_END(message.MessageId), message))
      } else {
        this.emit(AwsSqsAdapter.Events.MESSAGE_END(message.MessageId), message)
      }
    })
  }

  deleteMessage (queueUrl, message) {
    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }
    return new Promise((resolve, reject) => {
      this._sqs.deleteMessage(params, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  sendMessage (topicArn, messageGroupId, subject, message, opts = {}) {
    const params = {
      QueueUrl: topicArn,
      MessageBody: JSON.stringify({ Subject: subject, Message: message }),
      ...opts
    }
    if (messageGroupId !== null) {
      params.MessageGroupId = messageGroupId
    }

    return new Promise((resolve, reject) => {
      this._sqs.sendMessage(params, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}

AwsSqsAdapter.Events = Object.freeze({
  ERROR: queueUrl => `sqs:${queueUrl}:error`,
  END: queueUrl => `sqs:${queueUrl}:end`,
  NEW_MESSAGE: queueUrl => `sqs:${queueUrl}:message`,
  MESSAGE_END: messageId => `message:${messageId}:end`
})

module.exports = { AwsSqsAdapter }
