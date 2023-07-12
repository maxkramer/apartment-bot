# London Apartment Bot

This project is a command-line app containing a cron-job that will frequently crawl *R**htM*ve* & *Z**pla to find new
apartments for you and post them to
Slack, given a specific set of search criteria.

NB: It can be somewhat temperamental since a lot of checks are in place to prevent crawlers on these websites. Changes
will be inevitable.

## Installation

1. Clone this repository
2. Select the correct node version (e.g. with nvm)
3. Install dependencies
4. Copy and populate the environment variables
5. Update the config files with your search parameters
6. Start the command-line app

```bash
$ git clone git@github.com:maxkramer/london-apartment-bot.git && cd london-apartment-bot
$ nvm use
$ npm install
$ mv .env.example .env
$ npm start
```

## Running the app

### In the background

There's a convenience Make task for this; simply run `make` to start it up.

#### Logs

Logs are written to `/var/log/london-apartment-bot/cron-job.log` with pino. Simply `tail` this file.

### In the foreground

```bash
$ npm start
```

## Environment Variables

To run this project, you will need to populate the following environment variables in your .env file:

| Name        | Description                                                                                    | Value |
|-------------|------------------------------------------------------------------------------------------------|-------|
| SLACK_TOKEN | A Slack API user-token that you can get from: https://api.slack.com/authentication/token-types |       |

## Configuration

### Enabling / Disabling Adapters

Simply toggle the `enabled` flag in [adapters.ts](/src/config/adapters.ts) on the adapter you'd like to modify.

### Modifying Search Parameters

Currently the only available search parameters to modify are the min and max prices, min number of bedrooms and whether
its (part) furnished. These can be adjusted in
the [relevant adapter file](/src/config).

### Modifying the Slack Message

Simply change the relevant sections in [this file](/src/slack/index.ts).

## License

[Creative Commons Attribution-NonCommercial 4.0 International Public License](https://creativecommons.org/licenses/by-nc/4.0/)

