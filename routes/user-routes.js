const router = require('express').Router();
const keys = require('../config/keys');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const Base64 = require('js-base64').Base64;


router.get('/:access/:refresh/:search', (req, res) => {
    //res.send('you are logged in, this is your profile ' + req.user.username);
    const oauth2Client = new OAuth2(
        keys.google.clientID,
        keys.google.clientSecret,
        keys.google.callbackURL
    );

    oauth2Client.credentials = {
        access_token: Base64.decode(req.params.access),
        refresh_token: Base64.decode(req.params.refresh)
    };

    const natural_language_understanding = new NaturalLanguageUnderstandingV1({
        'username': keys.watson.username,
        'password': keys.watson.password,
        'version': '2018-03-16'
    });

    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    });

    
    youtube.search.list({
        part: 'id,snippet',
        q: req.params.search, //this will become the query at the top
        type: 'video'
    }, async (err, data, response) => {
        if (err) {
            console.error(err);
            res.json({
                status: 'error'
            });
        } else if (data) {
            const channelArrays = Promise.all(data.data.items.map(async x => { //make array of desired data

                const parameters = {
                    'text': x.snippet.title,
                    'features': {
                        'keywords': {
                            'emotion': true,
                            'limit': 1
                        }
                    },
                    'language': 'en'
                }

                let childPromise = new Promise((resolve, reject) => { //run emotion analysis
                    natural_language_understanding.analyze(parameters, (err, response) => {
                        if (err) {
                            console.log('error:', err);
                            reject();
                        } else {
                            if (response.keywords[0]) {
                                
                                resolve(response.keywords[0].emotion); 
                            }
                        }
                    });
                });

                let emotions = await childPromise; //wait for analysis
                
                let result = {
                    title: x.snippet.title,
                    videoURL: "https://www.youtube.com/watch?v=" + x.id.videoId,
                    channel: x.snippet.channelTitle, 
                    emotions: emotions
                };
                //console.log(result);
                return result;
                
            }));

            channelArrays.then((value) => {
                console.log(value);
                res.json({
                status: 'ok',
                data: value
                });
            });
        }
        if(response){
            console.log(response.statusCode);
        }
    }); 
});

module.exports = router;