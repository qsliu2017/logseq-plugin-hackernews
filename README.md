# logseq-plugin-hackernews

Fetch hacker news top stories into logseq.

## Usage

```sh
git clone https://github.com/qsliu2017/logseq-plugin-hackernews.git
cd logseq-plugin-hackernews
npm install && npm run build
```

In Logseq, go to `More > Plugins > Load unpacked plugin`, and choose the directory `logseq-plugin-hackernews`.

## Settings

- `maxTopStories`: The maximum number of top stories to fetch. Default is 10.
- `template`: The template to render the top stories. Default is `[{{title}}]({{url}})`.

  Examples:
  1. `TODO [{{title}}]({{url}})`
  2. `[[{{title}}]]`
  3. `[{{title}}]({{url}}) #hackernews`

- `comments`: Get comments for each story.

## License

MIT License.
