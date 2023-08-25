import { expect, vi } from "vitest";
import { plugins } from "pretty-format";
import "../src/extend-expect";

expect.addSnapshotSerializer(plugins.ConvertAnsi as any);

// Fix `Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)`
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as any;
