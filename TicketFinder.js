// Config
const { debug, accountSid, authToken } = require('./config');
// Web scraper
const puppeteer = require('puppeteer');
// Pretty console
const chalk = require('chalk');
// Twillio
const client = require('twilio')(accountSid, authToken);
// Init
let browser = null;
let page = null;

module.exports =  {
    open: async function() {

        // Launch browser
        console.log('Launching...');
        browser = await puppeteer.launch(debug && {headless: false});
        // Open new page
        console.log('Initialising...')
        page = await browser.newPage();
        // Go to twickets
        console.log('Connecting to Twickets...')
        await page.goto('https://www.twickets.live/catalog/search', {waitUntil: 'networkidle2'});
    },
    close: async function() {
        //Close browser
        await browser.close(); 
    },
    search: async function(search) {
        if (!search.found){
            // Check for debug
            debug && console.log(chalk.underline(`Looking for ${search.artist}...`));
            if(!debug) {
                process.stdout.write("\r\x1b[K")
                setTimeout(()=>{process.stdout.write(`Searching for ${search.artist}...`)},1)
            }
                    
            // Clear search bar
            await page.evaluate( () => document.querySelector('#searchQuery').value = '');
            // Find search bar
            await page.focus('#searchQuery');
            // Search for artist
            await page.keyboard.type(search.artist);
            await page.click('#SearchButton');
            // Wait for page to load
            await page.waitFor(100);
            // Return Location and Ticket type if there is any ticket is available
            const ticket = await page.evaluate(() => {
                const venue = document.querySelector('#searchBlockResult_venueName_0');
                const tier = document.querySelector('#searchBlockResult_priceTier_0');
                const link = document.querySelector('#searchBlockResult_buyButton_0');
                // If there is a venue return it if not return false
                if (venue !== null) {
                    return {
                        venue: venue.textContent.toLowerCase(),
                        tier: tier.textContent.trim().toLowerCase(),
                        link: link.href
                    };
                }
                return false;
            });

            // If a ticket has been posted then check for a match
            if (ticket) {
                // Check for debug
                if (debug) {
                    // Log Venue
                    ticket.venue === search.venue
                    ? console.log('Venue:', chalk.green(ticket.venue))
                    : console.log('Venue:', chalk.red(ticket.venue));
                    // Log Tier
                    ticket.tier === search.tier
                    ? console.log('Tier:', chalk.green(ticket.tier))
                    : console.log('Tier:', chalk.red(ticket.tier));
                }
                
                //  Check for match
                if (ticket.venue === search.venue && ticket.tier === search.tier){
                    // Log success
                    console.log(chalk.inverse.green(`!!! ${search.artist} TICKET FOUND!!!`))

                    // Stop while loop
                    search.found = true;
                    // SMS Contacts
                    const CONTACTS = debug 
                    ?[ { name: 'Danny', number: '+447984298585' } ]
                    :[
                        { name: 'Danny', number: '+447984298585' },
                        { name: 'Olivia', number: '+447774055530' },
                        { name: 'Natalie', number: '+447506201588' }
                    ];
                    
                    // Send SMS
                    CONTACTS.forEach((contact) => {
                        client.messages
                        .create({
                            body: `${search.artist} Ticket Found: ${ticket.link} `,
                            from: '+447723473707',
                            to: contact.number
                        })
                        .then(console.log(chalk.inverse(`SMS Sent to ${contact.name}`)))
                        .catch(err => console.error(err));
                    });
                }
            } else {
                // No ticket posted
                debug && console.log(chalk.red('No tickets posted'));
            }
        }
    }
}