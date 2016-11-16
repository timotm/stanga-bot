var moment = require('moment-precise-range')
var BPromise = require('bluebird')
var weather = BPromise.promisifyAll(require('weather-js'))

if (!process.env.token) {
    console.log('Error: Specify token in environment')
    process.exit(1)
}

var Botkit = require('botkit')
var os = require('os')

var controller = Botkit.slackbot({
  debug: true
})

var bot = controller.spawn({
    token: process.env.token
}).startRTM()


controller.on('rtm_close', function() {
  console.log('rtm_close')
  process.exit(1)
})

controller.on('tick', function() {
})

controller.hears(['^!calpe$'], ['direct_message', 'direct_mention', 'mention', 'ambient'], function(bot, message) {
  weather.findAsync({search: 'Calpe, Spain', degreeType: 'C'})
    .then(result => reply(result))
    .catch(() => reply())

  function reply(weatherResult) {
    var d = moment.preciseDiff(moment('2016-03-21 21:00'), moment())
    bot.reply(message, `Calpe in ${d}!` + (weatherResult ? ` Current weather: ${weatherResult[0].current.temperature}?C, ${weatherResult[0].current.skytext}` : ''))
  }
})

