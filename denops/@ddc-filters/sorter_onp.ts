// Copyright 2021 TANIGUCHI Masaya. All rights reserved.
// This work is licensed under the MIT License. https://git.io/mit-license

import onp from "https://esm.sh/onp@2";
import { Item } from "https://lib.deno.dev/x/ddc_vim@v3/types.ts";
import {
  BaseFilter,
  FilterArguments,
} from "https://lib.deno.dev/x/ddc_vim@v3/base/filter.ts";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override filter(args: FilterArguments<Params>): Promise<Item[]> {
    const matches = new Map<Item, number>(
      args.items.map((item) => [
        item,
        onp.diffText(args.completeStr, item.word).distance
      ])
    )
    return Promise.resolve(args.items.sort((a, b) => {
      return (matches.get(a) ?? 0) - (matches.get(b) ?? 0)
    }));
  }
  override params(): Params {
    return {};
  }
}
