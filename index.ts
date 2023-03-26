import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { Configuration, OpenAIApi } from "openai";
import { HackerNewsAPI } from "./api";
import htmlToText from "html2text";

const openaiSettings: SettingSchemaDesc[] = [
  {
    title: "OpenAI API Key",
    key: "apiKey",
    description: "OpenAI API Key",
    type: "string",
    default: "",
  },
  {
    title: "OpenAI Model",
    key: "model",
    description: "OpenAI Model",
    type: "string",
    default: "gpt-3.5-turbo",
  },
];

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
  {
    title: "Summarize",
    key: "summarize",
    description: "Summarize the top stories",
    type: "boolean",
    default: false,
  },
  ...openaiSettings,
];

function main() {
  logseq.Editor.registerSlashCommand(
    'hackernews-topstories',
    async () => {
      const { uuid } = (await logseq.Editor.getCurrentBlock())!;
      const maxTopStories: number = logseq.settings!["maxTopStories"];
      const template: string = logseq.settings!["template"];
      const summarize: boolean = logseq.settings!["summarize"];
      const apiKey: string = logseq.settings!["apiKey"];
      const model: string = logseq.settings!["model"];
      const openai = new OpenAIApi(new Configuration({ apiKey }));

      const api = new HackerNewsAPI();
      const itemIds = (await api.getTopStories()).slice(0, maxTopStories);
      itemIds.forEach(
        async (id) => {
          const item = await api.getItem(id);
          const { title, url } = item;
          const uuid_ = (await logseq.Editor.insertBlock(
            uuid,
            template.replace("{{title}}", title!).replace("{{url}}", url!),
          ))!.uuid;
          if (summarize) {
            const html = await (await fetch(url!)).text();
            const text = htmlToText.fromString(html);
            // logseq.Editor.insertBlock(
            //   uuid_,
            //   text,
            // )
            const resp = await openai.createChatCompletion({
              messages: [{ "role": "user", "content": text + `\n---\nSummarize` }],
              model: model,
            })
            const summary = resp.data.choices[0].message;
            if (summary) {
              logseq.Editor.insertBlock(
                uuid_,
                summary.content,
              )
            }
          }
        }
      )
    },
  );
}

logseq
  .useSettingsSchema(settings)
  .ready(main)
  .catch(logseq.UI.showMsg);
