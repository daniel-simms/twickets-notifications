const debug = true;

require('dotenv').config();

module.exports = {
    searches: [
        {artist: '1975', venue: 'o2 arena', tier: 'standing', found: false},
        {artist: 'lewis capaldi', venue: 'the sse wembley arena', tier: 'standing', found: false},
        {artist: 'the killers', venue: 'emirates stadium', tier: 'standing', found: false},
        {artist: 'bastille', venue: 'london palladium', tier: 'seats', found: false},
        // A test ticket that is up for sale
        {artist: '1975', venue: 'arena birmingham', tier: 'standing', found: debug ? false : true}
    ],
    accountSid: process.env.ACCOUNT_SID,
    authToken: process.env.AUTH_TOKEN,
    debug
}

