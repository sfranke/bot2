const stdin = process.stdin
const logger = require('./logger.js')
const util = require('util')

exports.ready = function(client) {
  // without this, we would only get streams once enter is pressed
  // stdin.setRawMode( true );

  // resume stdin in the parent process (node app won't quit all by itself
  // unless an error or process.exit() happens)
  stdin.resume()

  // i don't want binary, do you?
  stdin.setEncoding( 'utf8' )

  // on any data into stdin
  stdin.on( 'data', function( key ){
    // ctrl-c ( end of text )
    if ( key === '\u0003' ) {
      process.exit()
    }
    logger.log('debug', 'Console input after hitting ENTER was: ' + key)
    // write the key to stdout all normal like
    // process.stdout.write( key )
    let consoleInput = key.split(' ')
    // First argument should be the actual command, in this case 'say'.
    if(consoleInput[0] == 'say') {
      logger.log('debug', 'Want me to say something? ' + consoleInput[0])
      consoleInput.shift()
      // Second argument should be the channel name.
      let channelName = '#' + consoleInput[0]
      consoleInput.shift()
      let text = consoleInput.toString().replace(/,/g, ' ')
      if(client.channels.includes(channelName)) {
        logger.log('info', 'Sending ' + channelName + ': ' + text)
        logger.log('debug', 'ClientObject\n' + util.inspect(client))
        logger.log('debug', 'ClientObject -> channels currently connected to\n' + client.channels)
        // Actually sending the text into the specified channel.
        client.say(channelName, text).then(function(data) {
          logger.log('debug', 'Callback data after say:\n' + data)
        }).catch(function(err) {
          logger.log('error', 'Error callback after say:\n' + err)
        })
      } else {
        logger.log('debug', 'Not connected to this channel! ' + channelName)
        logger.log('info', 'Not connected to this channel! ' + channelName)
      }
    }
    if(consoleInput[0] == 'join') {
      consoleInput.shift()
      let channelName = '#' + consoleInput[0]
      client.join(channelName).then(function(data) {
        logger.log('debug', 'data on channel join\n' + data)
      }).catch(function(err) {
        logger.log('debug', 'error on channel join\n' + err)
      })
    }
    if(consoleInput[0] == 'leave') {
      consoleInput.shift()
      let channelName = '#' + consoleInput[0]
      client.part(channelName).then(function(data) {
        logger.log('debug', 'data on channel part\n' + data)
      }).catch(function(err) {
        logger.log('debug', 'error on channel part\n' + err)
      })
    }
  })
}
