import { expect, vi } from "vitest";
import ansiEscapesSerializer from "jest-serializer-ansi-escapes";
import "../src/extend-expect";

expect.addSnapshotSerializer(ansiEscapesSerializer);

HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
