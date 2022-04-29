/**
 * @typedef {Object} AwsSqsMessage
 * @property {String} AwsSqsMessage.MessageId
 * @property {String} AwsSqsMessage.ReceiptHandle
 * @property {String} AwsSqsMessage.MD5OfBody
 * @property {String} AwsSqsMessage.Body
 * @property {String} AwsSqsMessage.Attributes.SentTimestamp
 * @property {?String} AwsSqsMessage.Attributes.ApproximateReceiveCount
 *
 * @typedef {Object} AwsSqsMessageBody
 * @property {String} AwsSqsMessageBody.Type
 * @property {String} AwsSqsMessageBody.MessageId
 * @property {String} AwsSqsMessageBody.TopicArn
 * @property {String} AwsSqsMessageBody.Subject
 * @property {String} AwsSqsMessageBody.Message
 * @property {String} AwsSqsMessageBody.Timestamp
 * @property {String} AwsSqsMessageBody.SignatureVersion
 * @property {String} AwsSqsMessageBody.Signature
 * @property {String} AwsSqsMessageBody.SigningCertURL
 */


 const awsSqsAdapter = require('../sqs/SqsAdapter')
 const handleMessage = require('./handleMessage')
 
 const queueName = process.env.AWS_SQS_NAME || 'sales'
 const queueUrl = `${process.env.AWS_SQS_QUEUE_DOMAIN}/demo-${process.env.LOCALSTACK_ENDPOINT ? 'local' : process.env.NODE_ENV}-${queueName}`
 const opts = {
   maxNumberOfMessage: 1,
   visibilityTimeout: 900, // 15 minutes
   waitTimeSeconds: 10,
   attributeNames: [
     'ApproximateReceiveCount',
     'SentTimestamp'
   ]
 }
 const isDeadLetterQueue = queueName.endsWith('dead-letter-queue')
 
 let stoppedListeningResolver = null
 const stoppedListeningPromise = new Promise((resolve) => {
   stoppedListeningResolver = resolve
 })
 
 let started = false
 let keepListening = true
 
 module.exports = {
   startListening: () => {
     if (started) {
       return
     }
     started = true
 
     if (!process.env.AWS_SQS_QUEUE_DOMAIN) {
       console.warn('AWS_SQS_QUEUE_DOMAIN not set')
       stoppedListeningResolver()
       return
     }
 
     console.warn(`SQS queue is ${queueUrl}`)
 
     awsSqsAdapter
       .on(`sqs:${queueUrl}:message`, /** @param {AwsSqsMessage} message */ async (message) => {
         /** @type {AwsSqsMessageBody} body */
         let body = null
         try {
           body = JSON.parse(message.Body)
           const parsedMessage = JSON.parse(body.Message)
 
           parsedMessage.sentTimestamp = message.Attributes.SentTimestamp
           const startTime = Date.now()
           await handleMessage(body.Subject, parsedMessage, isDeadLetterQueue)
           const elapsed = Date.now() - startTime
           if (elapsed > 2000) {
             console.warn(`[SQS] Event ${body.Subject} took ${elapsed}ms to complete`, String(body.Message).substr(0, 64) + (String(body.Message).length > 64 ? '...' : ''))
           }
           await awsSqsAdapter.deleteMessage(queueUrl, message)
         } catch (err) {
           const attempt = parseInt(message.Attributes.ApproximateReceiveCount || 1)
           if (attempt < 2) {
             console.error(`[SQS] Can not resolve message ${message ? message.MessageId : ''} ${body ? body.Subject : ''}`, message.Body)
             console.error(err)
           } else {
             if (!(attempt % 10)) {
               console.warn(`[SQS] Can not resolve message ${message ? message.MessageId : ''} ${body ? body.Subject : ''} (attempt ${attempt}). Message dump is in a previous log.`)
             }
           }
         }
       })
       .on(`sqs:${queueUrl}:error`, (errorObj) => {
         console.error(`[SQS] Cannot read from queue ${queueUrl}:`, errorObj)
         process.exit(1)
       })
       .on(`sqs:${queueUrl}:end`, () => {
         if (keepListening) {
           awsSqsAdapter.listenQueue(queueUrl, opts)
         } else {
           stoppedListeningResolver()
         }
       })
       .listenQueue(queueUrl, opts)
   },
 
   stopListening: () => {
     if (!started) {
       return Promise.resolve()
     }
     keepListening = false
     return stoppedListeningPromise
   }
 }
 