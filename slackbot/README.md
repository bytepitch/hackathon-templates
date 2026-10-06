# slackbot

Depending on how deep you want to go, here are 2 options to create a slack bot using `@slack/bolt`. This package should make quick development faster, but you can also use other SDKs, like `web-api` (https://docs.slack.dev/tools/node-slack-sdk/)

Use this page for reference on how to use Bolt:

https://docs.slack.dev/tools/bolt-js/creating-an-app

## Install slack cli
Both approaches use slack cli to quickly create, deploy and update apps. 

These quick steps should work on a MacOS device:

```bash
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
slack login
```

Use your bytepitch slack to login

### Option 1: Use the template
```bash
cd bytepitch-template
npm i
slack install
```

create new app under bytepitch team and give it a name. Will be listed here:

https://api.slack.com/apps

Open the new app, select `Basic Information` from the side panel, and then in `App-Level Tokens` open the newly created `local` token and copy the token (xapp-1-xxxxxxxxxx)

in a command line type

```bash
export SLACK_APP_TOKEN=xapp-1-xxxxxxxxxx
slack run
```

Update the app.js accordingly

### Option 2: Create a new app

```bash
slack create
```

Select the type of app wanted (View more samples displays quite a few more verbose options)

You might also need to adjust some env variables, please refer to the README created for the next steps.