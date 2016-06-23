const config = require('./config/config');
var Slack = require('node-slack');
var slack = new Slack(config.HOOK_URL);
var request = require('request');
var cheerio = require('cheerio');



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

request(`${config.APOD_BASE_URL}?api_key=${config.NASA_API_KEY}`, function (error, response, body) {
  if (error) {
    console.error(error);
  }

  if (response.statusCode !== 200) {
    console.error('response code not 200', response);
  }

  body = JSON.parse(body);

  if (process.argv[2] == 'zh_tw') {
    request(config.APOD_TW_BASE_URL, function (error, response, html) {
      var $ = cheerio.load(html);
      var title = $('body').children('center').eq(1).text().trim().split(/\r?\n/)[0];
      var explanation = $('body').children('p').eq(0).text().trim();
      body.title = title;
      body.explanation = explanation;

      sendToSlack(body);
      console.log(body);
    });
  } else {
    sendToSlack(body);
    console.log(body);
  }
});

