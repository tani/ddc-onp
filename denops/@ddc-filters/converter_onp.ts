// Copyright 2021 TANIGUCHI Masaya. All rights reserved.
// This work is licensed under the MIT License. https://git.io/mit-license

import onp from "https://esm.sh/onp@2";
import { Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts";
import {
  BaseFilter,
  FilterArguments,
  OnInitArguments,
} from "https://lib.deno.dev/x/ddc_vim@v0/base/filter.ts";

type Params = {
  type: "abbr" | "kind" | "menu";
  hlGroupAddition: string;
  hlGroupDeletion: string;
  hlGroupKeep: string;
};

export class Filter extends BaseFilter<Params> {
  async onInit(args: OnInitArguments<Params>): Promise<void> {
    await args.denops.cmd(`highlight OnpDeletion ctermfg=Red guifg=Red`);
    await args.denops.cmd(`highlight OnpAddition ctermfg=Green guifg=Green`);
    await args.denops.cmd(`highlight link OnpKeep Pmenu`);
  }
  override filter(args: FilterArguments<Params>): Promise<Candidate[]> {
    return Promise.resolve(args.candidates.map((candidate) => {
      const diff = onp.diffText(args.completeStr, candidate.word);
      let preview = "";
      const highlights: typeof candidate.highlights = [];
      for (const result of diff.results) {
        switch (result.state) {
          case 1:
            highlights.push({
              col: preview.length,
              type: args.filterParams.type,
              name: "ddc_onp_addition",
              "hl_group": args.filterParams.hlGroupAddition,
              width: result.right.length,
            });
            break;
          case 0:
            highlights.push({
              col: preview.length,
              type: args.filterParams.type,
              name: "ddc_onp_keep",
              "hl_group": args.filterParams.hlGroupKeep,
              width: result.right.length,
            });
            break;
          case -1:
            highlights.push({
              col: preview.length,
              type: args.filterParams.type,
              name: "ddc_onp_deletion",
              "hl_group": args.filterParams.hlGroupDeletion,
              width: result.right.length,
            });
            break;
        }
        preview += result.right;
      }
      return { ...candidate, [args.filterParams.type]: preview, highlights };
    }));
  }
  override params(): Params {
    return {
      type: "abbr",
      hlGroupAddition: "OnpAddition",
      hlGroupDeletion: "OnpDeletion",
      hlGroupKeep: "OnpKeep",
    };
  }
}
