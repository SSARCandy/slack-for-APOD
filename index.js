const config = require('./config/config');
var Slack = require('node-slack');
var slack = new Slack(config.HOOK_URL);
var apod = require('node-apod');


function sendToSlack(payload) {
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
  ];

  slack.send({
    icon_emoji: icons[Math.floor(Math.random() * icons.length)],
    username: 'APOD',
    text: someText[Math.floor(Math.random() * someText.length)],
    attachments: [
      {
        "fallback": "Astronomy Picture of today~!",
        "title": payload.title,
        "color": "#36a64f",
        "image_url": payload.url,
        "fields": [
          {
            "title": payload.date,
            "value": payload.explanation,
            "short": false
          }
        ]
      }
    ]
  });
}

apod(config.NASA_API_KEY, process.argv[2], function (err, data) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  sendToSlack(data);
  console.log(data);
});