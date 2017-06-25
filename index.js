const tmi = require("tmi.js")
const logger = require('./logger.js')
const config = JSON.parse(require('fs').readFileSync('config.json'))
const util = require('util')
const colors = require('colors/safe')
const terminal = require('./terminal.js')

let options = config.options
options.identity.password = process.env.TOKEN
let client = new tmi.client(options)

// Connect the client to the server..
client.connect()

terminal.ready(client)

client.on('action', function(channel, userstate, message, self) {
  logger.log('debug', 'channel ' + channel)
  logger.log('debug', 'userstate ' + userstate)
  logger.log('debug', 'message ' + message)
  logger.log('debug', 'self ' + self)
})

client.on('chat', function(channel, userstate, message, self) {
  logger.log('debug', 'channel ' + channel)
  logger.log('debug', 'userstate ' + util.inspect(userstate))
  logger.log('debug', 'message ' + message)
  logger.log('debug', 'self ' + self)

  // See if there is a '!' (exclamation mark) at the beginning.
  if (message != undefined && message.charAt(0) == '!') {
    // Output all strings here once for debug.
    logger.log('debug', 'Recognized a chat command!')
    let command = message.split('!')
    logger.log('debug', 'Test command: ' + command[1])
    logger.log('debug', 'channelName: ' + channel)

    // Checking for specific command string, here: 'help'.
    if (command[1] == 'help' && userstate.username == 'webeplaying') {
      logger.log('debug', 'This is where the help command should be handled.')
      logger.log('info', 'Sending response to chat.. ' + '~~~ Gotcha !help command ~~~')
      client.say(channel, '~~~ Gotcha !help command ~~~').then(function(data) {
        logger.log('debug', 'Callback data after say:\n' + data)
      }).catch(function(err) {
        logger.log('error', 'Error callback after say:\n' + err)
      })
    }

    // Chat command '!dc' for disconnecting from the server.
    if (command[1] == 'dc' && userstate.username == 'webeplaying') {
      logger.log('debug', 'This is where the dc command should be handled.')
      client.disconnect().then(function(data) {
        // data returns [server, port]
        logger.log('debug', 'Callback data after disconnect:\n' + data)
      }).catch(function(err) {
        logger.log('error', 'Error callback after disconnect:\n' + err)
      })
    }
  }

  // See if we can find a http link in the message sent.
  if (message != undefined && message.match(/\s?https?:\s?/g)) {
    logger.log('debug', 'client.on(\'chat\') -> Found link!\n' + message)

    // Iterating the text and check for a valid link in there.
    let sentence = message.split(' ')
    for (word in sentence) {
      logger.log('debug', 'Checking each word in the sentence: ' + sentence[word])
      if (sentence[word].match(/^https?:/g)) {
        logger.log('debug', 'Extracted link: ' + sentence[word])
        logger.log('info', 'Extracted link: ' + colors.green(sentence[word]))
        // Now here check the link.
      }
    }
  }

})
