import {Apartment} from "../entity";
import {WebClient} from "@slack/web-api";
import Config from "../types/config";

const googleMapsLink = (address: string) => `https://www.google.com/maps/search/${encodeURIComponent(address)}`

export const postAll = ({apartments, adapter}: { apartments: Apartment[], adapter: Config }) => {
    const slackClient = new WebClient(process.env.SLACK_TOKEN)
    return Promise.all(apartments.map((apartment) => slackClient.chat.postMessage({
        username: adapter.name,
        icon_url: adapter.slackIcon,
        text: `New apartment found on ${adapter.name}!`,
        channel: process.env.SLACK_CHANNEL || '',
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*<${apartment.url}|${apartment.title}>*\n\n£${apartment.prices.monthly} per month\n£${apartment.prices.weekly} per week\n\n${apartment.description}. `
                },
                "accessory": {
                    "type": "image",
                    "image_url": apartment.image === undefined || apartment.image === null || apartment.image.trim().length === 0 ? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' : apartment.image,
                    "alt_text": apartment.title
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "image",
                        "image_url": "https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png",
                        "alt_text": "Location Pin Icon"
                    },
                    {
                        "type": "plain_text",
                        "emoji": true,
                        "text": `Location: ${apartment.address}.`
                    }
                ]
            },
            {
                "type": "actions",
                "elements": [{
                    "type": "button",
                    "action_id": "1",
                    "url": apartment.url,
                    "style": "primary",
                    "text": {
                        "type": "plain_text",
                        "text": `View on ${adapter.name}`
                    }
                }, {
                    "type": "button",
                    "action_id": "2",
                    "url": googleMapsLink(apartment.address),
                    "style": "primary",
                    "text": {
                        "type": "plain_text",
                        "text": ":round_pushpin: Google Maps"
                    }
                }, {
                    "type": "button",
                    "action_id": "3",
                    "url": apartment.messageUrl,
                    "style": "primary",
                    "text": {
                        "type": "plain_text",
                        "text": ":envelope_with_arrow: Contact"
                    }
                }]
            },
            {
                "type": "divider"
            }
        ]
    })))
}
