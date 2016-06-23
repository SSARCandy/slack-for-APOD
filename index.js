const config = require('./config/config');
var Slack = require('node-slack');
var slack = new Slack(config.HOOK_URL);
var request = require('request');


request(`${config.APOD_BASE_URL}?api_key=${config.NASA_API_KEY}`, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    body = JSON.parse(body);
    // console.log(body.title)
    slack.send({
      icon_emoji: ':star2:',
      username: 'APOD',
      // unfurl_links: true,
      text: 'Wow..',
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
  }
});

