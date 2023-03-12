import Property from "../types/property";
import {WebClient} from "@slack/web-api";
import Config from "../types/config";

const googleMapsLink = (address: string) => `https://www.google.com/maps/search/${encodeURIComponent(address)}`

export const postProperties = (adapterResults: { newProperties: Property[], adapter: Config }[]) => {
    const slackClient = new WebClient(process.env.SLACK_TOKEN)
    return Promise.all(adapterResults.map(({adapter, newProperties}) => newProperties.map((property) =>
        slackClient.chat.postMessage({
            username: adapter.name,
            icon_url: adapter.slackIcon,
            text: `New apartment found on ${adapter.name}!`,
            channel: 'C04T5JD0VFC',
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*<${property.url}|${property.title}>*\n\n${property.prices.monthly} per month\n${property.prices.weekly} per week\n\n${property.description}. `
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": property.image ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
                        "alt_text": property.title
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
                            "text": `Location: ${property.address}.`
                        }
                    ]
                },
                {
                    "type": "actions",
                    "elements": [{
                        "type": "button",
                        "action_id": "1",
                        "url": property.url,
                        "style": "primary",
                        "text": {
                            "type": "plain_text",
                            "text": `View on ${adapter.name}`
                        }
                    }, {
                        "type": "button",
                        "action_id": "2",
                        "url": googleMapsLink(property.address),
                        "style": "primary",
                        "text": {
                            "type": "plain_text",
                            "text": ":round_pushpin: Google Maps"
                        }
                    }, {
                        "type": "button",
                        "action_id": "3",
                        "url": property.messageLink,
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
        }))))
}
