import { expect, vi } from "vitest";
import { plugins } from "pretty-format";
import * as matchers from "../src/matchers";
import "../src/extend-expect";

expect.extend(matchers);
expect.addSnapshotSerializer(plugins.ConvertAnsi as any);

// Fix `Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)`
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as any;
