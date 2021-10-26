// Copyright 2021 TANIGUCHI Masaya. All rights reserved.
// This work is licensed under the MIT License. https://git.io/mit-license

import onp from "https://esm.sh/onp@2";
import { Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts";
import {
  BaseFilter,
  FilterArguments,
} from "https://lib.deno.dev/x/ddc_vim@v0/base/filter.ts";

type Params = {
  maximumDistance: number
};

export class Filter extends BaseFilter<Params> {
  override filter(args: FilterArguments<Params>): Promise<Candidate[]> {
    return Promise.resolve(args.candidates.filter((candidate) => {
      const diff = onp.diffText(args.completeStr, candidate.word);
      return diff.distance < args.filterParams.maximumDistance;
    }));
  }
  override params(): Params {
    return {
      maximumDistance: 4
    };
  }
}
