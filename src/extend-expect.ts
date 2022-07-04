/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from "vitest";
import * as extensions from "./matchers";
import type { AxeMatchers } from "./matchers";

expect.extend(extensions);

declare global {
  namespace Vi {
    interface Assertion<T = any> extends AxeMatchers {}
    interface AsymmetricMatchersContaining extends AxeMatchers {}
  }
}
