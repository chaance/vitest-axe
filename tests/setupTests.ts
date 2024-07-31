import { plugins } from "pretty-format"
import "../src/extend-expect"

expect.addSnapshotSerializer(plugins.ConvertAnsi as any)

HTMLCanvasElement.prototype.getContext = vi.fn(() => null)
