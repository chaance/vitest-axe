import { expect } from "vitest";
import { plugins } from "pretty-format";
import * as matchers from "../src/matchers";
import "../src/extend-expect";

expect.extend(matchers);
expect.addSnapshotSerializer(plugins.ConvertAnsi as any);
