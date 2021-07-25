const core = require('@actions/core');
const github = require('@actions/github');

const webhook = require("webhook-discord");

const default_avatarUrl = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
const default_username = "Github";
const default_author = "Github Actions";
const default_author_url = "https://github.com"
const default_author_icon = "https://gitlab.com/uploads/-/system/project/avatar/20742498/external-content.duckduckgo.com.png"
const default_colors = {
    info: '#00ff00',
    warn: '#ff9900',
    error: '#ff0000'
}
const long_severity = {
    info: "Informational",
    warn: "Warning",
    error: "Error"
}


async function getDefaultDescription() {
    const context = github.context;
    const payload = context.payload;

    switch(github.context.eventName) {
    case 'push':
        return `**${payload.head_commit.committer.name}** has pushed \`${context.sha.slice(-7)}\` to  **${payload.repository.full_name}**.\n\n`
             + `- **Repo**: [${payload.repository.full_name}](${payload.repository.html_url})\n`
             + `- **Compare**: [View Here](${payload.compare})\n`
             + `- **Author**: ${payload.head_commit.author.username}\n`
             + `- **Committer**: ${payload.head_commit.committer.name}\n`
             + `- **Pusher**: ${payload.pusher.name}\n`
             + `- **Commit URL**: [${context.sha.slice(-7)}](${payload.head_commit.url})\n\n`
             + `- **Commit Message**:\n \`\`\`${payload.head_commit.message}\`\`\``;
    case 'release':
        return `**${payload.release.author.login}** has ${payload.action} \`${payload.release.tag_name}\`.\n\n`
             + `- **Repo**: [${payload.repository.full_name}](${payload.repository.html_url})\n`
             + `- **Name**: ${payload.release.name}\n`
             + `- **Author**: ${payload.release.author.login}\n`
             + `- **Release URL**: [${payload.release.tag_name}](${payload.release.html_url})\n`
             + `- **Download Tar**: [Here](${payload.release.tarball_url})\n`
             + `- **Download Zip:**: [Here](${payload.release.zipball_url})\n`
             + `- **PreRelease:**: ${payload.release.prerelease}\n\n`
             + `- **Release Message**:\n \`\`\`${payload.release.body}\`\`\``;
    default:
        return `\`${context.workflow}\` has been run in [${payload.repository.full_name}](${payload.repository.html_url}).\n\n`
             + `- **Workflow Job Name:** ${context.job}\n`
             + `- **Workflow Name:** ${context.workflow}\n`
             + `- **Repo**: [${payload.repository.full_name}](${payload.repository.html_url})`
    }
}

async function run() {
    try {
        const webhookUrl = core.getInput('webhookUrl').replace("/github", "");
        if (!webhookUrl) {
            core.setFailed("The webhookUrl was not provided. For security reasons the secret URL must be provided "
                           + "in the action yaml using a context expression and can not be read as a default.");
            return;
        }
        const severity = core.getInput('severity');
        const description = core.getInput('description');
        const details = core.getInput('details');
        const footer = core.getInput('footer');
        const text = core.getInput('text');
        const title = core.getInput('title');
        const username = core.getInput('username');
        const color = core.getInput('color');
        const avatarUrl = core.getInput('avatarUrl');
        const authorUrl = core.getInput('authorUrl');
        const author = core.getInput('author');
        const author_icon = core.getInput('author_icon');

        const context = github.context;
        const obstr = JSON.stringify(context, undefined, 2)
        core.debug(`The event github.context: ${obstr}`);

        const hook = new webhook.Webhook(webhookUrl);

        core.info(`${username} ${avatarUrl} ${color} ${description} ${details} ${footer} ${text} ${authorUrl} ${author} ${author_icon}`)

        const msg = new webhook.MessageBuilder()
                        .setName(username || default_username)
                        .setAvatar(avatarUrl || default_avatarUrl)
                        .setColor(color || default_colors[severity])
                        .setDescription((description || await getDefaultDescription()) + "\n\n" + details)
                        .setFooter(footer || ("Severity: " + long_severity[severity]))
                        .setAuthor(author || default_author, author_icon || default_author_icon, authorUrl || default_author_url)
                        .setText(text)
                        .setTitle(title)
                        .setTime();

        hook.send(msg);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();