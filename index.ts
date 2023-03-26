import "@logseq/libs";
import { HackerNewsAPI } from "./api";

function main() {
  logseq.Editor.registerSlashCommand(
    'hackernews-topstories',
    async () => {
      const { uuid } = (await logseq.Editor.getCurrentBlock())!;
      const api = new HackerNewsAPI();
      const itemIds = (await api.getTopStories()).slice(0, 10);
      itemIds.forEach(
        async (id) => {
          const item = await api.getItem(id);
          const { title, url } = item;
          logseq.Editor.insertBlock(
            uuid,
            `[${title}](${url})`,
          );
        }
      )
    },
  );
}

logseq
  .ready(main)
  .catch(console.error);
