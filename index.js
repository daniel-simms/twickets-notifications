const TicketFinder = require('./TicketFinder');
const { searches } = require('./config');

let allTicketsFound = false;

(async function() {

    // Open TicketFinder
    await TicketFinder.open();

    // Loop the searches untill all tickets have been found
    while (!allTicketsFound) {
        // Check to see if all tickets have been found
        const ticketsFound = searches.filter(search => search.found === true);
        // Turn loop off
        if (ticketsFound.length === searches.length ) { allTicketsFound = true };
        // Start searches
        for (const search of searches){
            await TicketFinder.search(search);
        }
    }
    
    // Close TicketFinder
    await TicketFinder.close();
})();



