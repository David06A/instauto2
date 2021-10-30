instauto is an Instagram automation/bot library written in modern, clean javascript using Google's Puppeteer. Goal is to be very easy to set up, use, and extend, and obey instagram's limits. Heavily inspired by [InstaPy](https://github.com/timgrossmann/InstaPy), but I thought it was way too heavy and hard to setup.

## Setup

- First install [Node.js](https://nodejs.org/en/).

- Create a new directory with a file like [example.js](https://github.com/mifi/instauto/blob/master/example.js)

- Adjust your `example.js` to your needs. If you want to see how it would work without doing any invasive actions, use the `dryRun: true` option. Toggle `headless` to see it in action.

- Open a terminal in the directory

- Run `npm i`

- Run `npm i puppeteer instauto2`

- Run `node example`

You can run this code for example once every day using cron or pm2 or similar

See [index.js](https://github.com/mifi/instauto/blob/master/index.js) for available options.

## Supported functionality

- Follow the followers of some particular users. (e.g. celebrities.) Parameters like max/min ratio for followers/following can be set.

- Unfollow users that don't follow us back. Will not unfollow any users that we recently followed.

- Unfollow auto followed users (also those following us back) after a certain number of days.

- The code automatically prevents breaching 100 follow/unfollows per hour or 700 per 24hr, to prevent bans. This can be configured.

See [example.js](https://github.com/mifi/instauto/blob/master/example.js) for example of features

## Data management

The data are stored in json files by default using the `file-db.adapter` internally.
If you need to override the default behavior you can either choose to use the other adapter provided which is using 
[lokijs](https://github.com/techfort/LokiJS) or you could create your own adapter to pass to `instauto`.

### Creating your own adapter

To create your own adapter you can have a look to [loki-db.adapter.ts](https://github.com/mifi/instauto/tree/master/src/db_adapters/loki-db.adapter.ts).
Basically you need to create a class that extend the [AbstractDbAdapter](https://github.com/mifi/instauto/tree/master/src/db_adapters/abstract-db.adapter.ts) 
such as :

```typescript
export class MyAdapter extends AbstractDbAdapter {
  constructor(private readonly instance: YourInstanceType, private readonly logger: Logger) {
    super();
  }

  addLikedPhoto({ username, href, time }: LikedPhoto): Promise<void> {
    // ... You code goes here ...
  }

  addPrevFollowedUser(follower: Follower): Promise<void> {
    // ... You code goes here ...  
  }

  addPrevUnfollowedUser(unfollower: UnFollower): Promise<void> {
    // ... You code goes here ...
  }

  getFollowedLastTimeUnit(timeUnit: number): Promise<Follower[]> {
    // ... You code goes here ...
  }

  getLikedPhotosLastTimeUnit(timeUnit: number): Promise<LikedPhoto[]> {
    // ... You code goes here ...
  }

  getPrevFollowedUser(username: string): Promise<Follower> {
    // ... You code goes here ...
  }

  getUnfollowedLastTimeUnit(timeUnit: number): Promise<UnFollower[]> {
    // ... You code goes here ...
  }
}
```

To see how to use you own adapter you can have a look to the [example-loki.js](https://github.com/mifi/instauto/blob/master/example-loki.js)

## Tips

- Run this on a machine with a non-cloud IP to avoid being banned

## Troubleshooting

- If it doesn't work, make sure your instagram language is set to english

See also:
- https://github.com/GoogleChrome/puppeteer/issues/550
- https://github.com/GoogleChrome/puppeteer/issues/3774

Also you might want to install the more lightweight package `puppeteer-core` instead of `puppeteer`.

Made with ❤️ in 🇫🇷