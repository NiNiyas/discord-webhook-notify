# Github Actions Discord Webhook Notify
Sends a notification to discord using a webhook URL. Forked from https://github.com/rjstone/discord-webhook-notify

## Inputs

`webhookUrl` : Discord Webhook URL. Required \
`severity` : The severity level of the notification, either `info`, `warn`, or `error`. Default is `error`. Optional \
`description`: Embed notification message. Optional \
`details`: Additional text after the notification message. Optional \
`footer`: Footer of embed. Defaults to `severity`. Optional \
`text`: Text above the embed. Optional \
`username` : Discord webhook username. Optional \
`color` : Embed color. Optional \
`avatarUrl` : Webhook logo. Use PNG or JPEG link. Optional \
`author`: Discord embed message author. Defaults to Github Actions. Optional \
`author_icon`: Discord embed message author logo. Defaults to Github Actions logo. Optional \
`authorUrl`: Discord embed message author link. Defaults to Github website. Optional \
`title` : Discord embed message title. Optional

### Usage Example

```
- name: Test Success
    uses: niniyas/discord-webhook-notify@master
    if: success()
    with:
        severity: info
        details: Test Succeeded!
        webhookUrl: ${{ secrets.DISCORD_WEBHOOK }}
- name: Test Failure
    uses: niniyas/discord-webhook-notify@master
    if: failure()
    with:
        severity: error
        details: Test Failed!
        webhookUrl: ${{ secrets.DISCORD_WEBHOOK }}
- name: Test Cancelled
    uses: niniyas/discord-webhook-notify@master
    if: cancelled()
    with:
        severity: warn
        details: Test Cancelled!
        webhookUrl: ${{ secrets.DISCORD_WEBHOOK }}
```

![PUSH](https://user-images.githubusercontent.com/54862871/126899463-5fe8c751-edbb-47ff-90f9-5bf6abc728fa.jpg) \
![Release](https://user-images.githubusercontent.com/54862871/126899479-3ed58732-c861-4206-8eaa-e9a4ede0b1b2.jpg) \
![Workflow](https://user-images.githubusercontent.com/54862871/126899484-310f6c1c-b70d-459d-ac6b-bbfd4250bf3a.jpg)

