import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { HackerNewsAPI } from "./api";

const settings: SettingSchemaDesc[] = [
  {
    title: "Max Top Stories",
    key: "maxTopStories",
    description: "Max number of top stories to fetch",
    type: "number",
    default: 10,
  },
  {
    title: "Template",
    key: "template",
    description: "Template for each item",
    type: "string",
    default: "[{{title}}]({{url}})",
  },
];

function main() {
  logseq.Editor.registerSlashCommand(
    'hackernews-topstories',
    async () => {
      const { uuid } = (await logseq.Editor.getCurrentBlock())!;
      const maxTopStories: number = logseq.settings!["maxTopStories"];
      const template: string = logseq.settings!["template"];

      const api = new HackerNewsAPI();
      const itemIds = (await api.getTopStories()).slice(0, maxTopStories);
      itemIds.forEach(
        async (id) => {
          const item = await api.getItem(id);
          const { title, url } = item;
          logseq.Editor.insertBlock(
            uuid,
            template.replace("{{title}}", title!).replace("{{url}}", url!),
          );
        }
      )
    },
  );
}

logseq
  .useSettingsSchema(settings)
  .ready(main)
  .catch(console.error);
