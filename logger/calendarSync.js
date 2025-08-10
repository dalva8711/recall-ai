const { google } = require('googleapis');
const schedule = require('node-schedule');
const path = require('path');
const fs = require('fs').promises;
const { getSummariesForDate } = require('./query');

// These constants should be moved to a config file later
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

class CalendarSync {
    constructor() {
        this.auth = null;
    }

    async initialize() {
        try {
            const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH));
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id,
                client_secret,
                redirect_uris[0]
            );

            try {
                const token = JSON.parse(await fs.readFile(TOKEN_PATH));
                oAuth2Client.setCredentials(token);
                this.auth = oAuth2Client;
            } catch (error) {
                await this.getNewToken(oAuth2Client);
            }
        } catch (error) {
            console.error('Error loading credentials:', error);
            throw error;
        }
    }

    async getNewToken(oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        // Note: In a real application, you'd want to handle this more gracefully
        // For now, you'll need to manually input the code
        throw new Error('Please visit the URL above to authorize the application');
    }

    async createDailySummaryEvent(date = new Date()) {
        if (!this.auth) {
            throw new Error('Calendar sync not initialized');
        }

        const calendar = google.calendar({ version: 'v3', auth: this.auth });
        const summaries = await getSummariesForDate(date);
        
        if (!summaries || summaries.length === 0) {
            console.log('No activities found for the day');
            return;
        }

        const eventSummary = this.formatSummariesForCalendar(summaries);
        const dateStr = date.toISOString().split('T')[0];

        const event = {
            summary: `Daily Activity Summary - ${dateStr}`,
            description: eventSummary,
            start: {
                date: dateStr,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                date: dateStr,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
        };

        try {
            const response = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });
            console.log('Event created:', response.data.htmlLink);
            return response.data;
        } catch (error) {
            console.error('Error creating calendar event:', error);
            throw error;
        }
    }

    formatSummariesForCalendar(summaries) {
        return summaries
            .map(summary => {
                const time = new Date(summary.timestamp).toLocaleTimeString();
                return `${time}: ${summary.summary}`;
            })
            .join('\n\n');
    }

    scheduleSync(time = '23:59') {
        // Schedule daily sync at specified time
        const [hours, minutes] = time.split(':').map(Number);
        schedule.scheduleJob({ hour: hours, minute: minutes }, async () => {
            try {
                await this.createDailySummaryEvent();
                console.log('Daily summary synced to calendar successfully');
            } catch (error) {
                console.error('Failed to sync daily summary:', error);
            }
        });
        console.log(`Scheduled daily sync for ${time}`);
    }
    // Test function to create an event immediately
    async testCalendarSync() {
        try {
            if (!this.auth) {
                await this.initialize();
            }
            const testDate = new Date();
            const result = await this.createDailySummaryEvent(testDate);
            console.log('Test event created successfully:', result.htmlLink);
            return result;
        } catch (error) {
            console.error('Test sync failed:', error);
            throw error;
        }
    }
}

module.exports = new CalendarSync();
