//add this file to .gitignore

module.exports = {
    google: {
        clientID: '106420590065-bu91bhhq542iotgt6m67c6f42gplbuug.apps.googleusercontent.com',
        clientSecret: 'eZzdUAueTPVTnbWCCE_WB7Sx',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    mongo: {
        dbroute: "mongodb://127.0.0.1:27017/final",
        options: {
            auth: {authdb: 'admin'},
            user: 'Craig',
            pass: 'watermelon29'
        }
    },
    session: {
        cookieKey: "18NakedCowboysInTheShowersAtRamRanch"
    },
    watson: {
        "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
        "username": "9cb0aa2e-99a6-418b-a155-d654bf164cca",
        "password": "NzZqrD0sDwZQ"
    }
}