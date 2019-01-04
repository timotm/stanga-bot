const BPromise = require('bluebird')
const weather = BPromise.promisifyAll(require('weather-js'))
const moment = require('moment')
const preciseDiff = require('moment-precise-range')(moment)

if (!process.env.token) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

const Botkit = require('botkit')

const controller = Botkit.slackbot({
  debug: true
})

controller.spawn({
  token: process.env.token
}).startRTM()


controller.on('rtm_close', () => {
  console.log('rtm_close')
  process.exit(1)
})

controller.on('tick', () => {})


controller.hears(['^!(nizza|nice)'], ['direct_message', 'direct_mention', 'mention', 'ambient'], (bot, message) => {
  weather.findAsync({search: 'Nice, France', degreeType: 'C'})
    .then(result => reply(result))
    .catch(() => reply())

  function reply(weatherResult) {
    var d = preciseDiff(moment('2019-03-28 12:30'), moment())
    bot.reply(message, `Nice in ${d}!` + (weatherResult ? ` Current weather: ${weatherResult[0].current.temperature}˚C, ${weatherResult[0].current.skytext}` : ''))
  }
})
