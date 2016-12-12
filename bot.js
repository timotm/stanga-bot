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

controller.hears(['^!tenerife'], ['direct_message', 'direct_mention', 'mention', 'ambient'], function(bot, message) {
  weather.findAsync({search: 'Tenerife, Spain', degreeType: 'C'})
    .then(result => reply(result))
    .catch(() => reply())

  function reply(weatherResult) {
    var d = moment.preciseDiff(moment('2017-01-21 11:20'), moment())
    bot.reply(message, `Tenerife in ${d}!` + (weatherResult ? ` Current weather: ${weatherResult[0].current.temperature}?C, ${weatherResult[0].current.skytext}` : ''))
  }
})


controller.hears(['^!(nizza)|(nice)'], ['direct_message', 'direct_mention', 'mention', 'ambient'], function(bot, message) {
  weather.findAsync({search: 'Nice, France', degreeType: 'C'})
    .then(result => reply(result))
    .catch(() => reply())

  function reply(weatherResult) {
    var d = moment.preciseDiff(moment('2017-03-30 16:00'), moment())
    bot.reply(message, `Nice in ${d}!` + (weatherResult ? ` Current weather: ${weatherResult[0].current.temperature}?C, ${weatherResult[0].current.skytext}` : ''))
  }
})
