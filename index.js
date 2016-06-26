const config = require('./config/config');
var Slack = require('node-slack');
var APOD = require('node-apod');
var slack = new Slack(config.HOOK_URL);
var apod = new APOD(config.NASA_API_KEY);


function sendToSlack(payload) {
    const someText = [
        'Wow... :star_and_crescent:',
        'Amazing~:stars::stars::stars:',
        'Cool! :star:',
        'So beautful~ :star_of_david:'
    ];

    const icons = [
        ':star:',
        ':star2:',
        ':star_and_crescent:',
        ':star_of_david:',
        ':stars:'
    ];

    var msg = {
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
    };
    //   console.log(JSON.stringify(msg));

    if (payload.media_type === 'video' && ~payload.url.indexOf('www.youtube.com/embed/')) {
        msg.text = payload.url.replace(/embed\//, 'watch?v=').replace(/\?rel=0/, '');
    }

    slack.send(msg);
}

apod.get({
    LANG: process.argv[2] || '',
    DATE: process.argv[3] || ''
}, function (err, data) {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    sendToSlack(data);
    console.log(data);
    //   process.exit(0);
});