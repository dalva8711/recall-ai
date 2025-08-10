const calendarSync = require('./calendarSync');

console.log('Testing calendar sync...');
calendarSync.testCalendarSync()
    .then(result => {
        console.log('Success! Check your calendar for the new event.');
        console.log('Event URL:', result.htmlLink);
        process.exit(0);
    })
    .catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    });
