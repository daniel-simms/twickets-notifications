const debug = false;

require('dotenv').config();

module.exports = {
    searches: [
        // Use lower case
        // Tier needs to be 'seated' or 'standing' as tier
        // Venue needs to match selector text  of '#searchBlockResult_venueName_0' on twickets
        {artist: '1975', venue: 'the o2 arena', tier: 'standing', found: false},
        {artist: 'lewis capaldi', venue: 'the sse wembley arena', tier: 'standing', found: false},
        {artist: 'the killers', venue: 'emirates stadium', tier: 'standing', found: false},
        {artist: 'bastille', venue: 'london palladium', tier: 'seated', found: false},
        // A test ticket that is up for sale
        {artist: '1975', venue: 'motorpoint arena, nottingham', tier: 'seated', found: debug ? false : true}
    ],
    contacts: debug // First contact will only be for debug purposes
        ?[ { name: 'Danny', number: '+447984298585' } ]
        :[ // Live contacts
            { name: 'Danny', number: '+447984298585' },
            { name: 'Olivia', number: '+447774055530' },
            { name: 'Natalie', number: '+447506201588' }
        ],
    accountSid: process.env.ACCOUNT_SID,
    authToken: process.env.AUTH_TOKEN,
    debug
}

