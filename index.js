const config = require('./config/config');
var Slack = require('node-slack');
var slack = new Slack(config.HOOK_URL);
var request = require('request');

const someText = [
  'Wow... :star_and_crescent:',
  'Amazing~:stars::stars::stars:',
  'Cool! :star:',
  'Show you some beautful picture. :star_of_david:'
];

const icons = [
  ':star:',
  ':star2:',
  ':star_and_crescent:',
  ':star_of_david:',
  ':stars:'
]
request(`${config.APOD_BASE_URL}?api_key=${config.NASA_API_KEY}`, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    body = JSON.parse(body);
    slack.send({
      icon_emoji: icons[Math.floor(Math.random() * icons.length)],
      username: 'APOD',
      text: someText[Math.floor(Math.random() * someText.length)],
      attachments: [
        {
          "fallback": "Astronomy Picture of today~!",
          "title": body.title,
          "color": "#36a64f",
          "image_url": body.url,
          "fields": [
            {
              "title": body.date,
              "value": body.explanation,
              "short": false
            }
          ]
        }
      ]
    });

    console.log(body);
  }
});

