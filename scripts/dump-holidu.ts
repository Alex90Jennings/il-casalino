// Emits Holidu widget URLs so the test suite can verify the real builder output
// at runtime (not just source patterns). Not a test file.
import { buildHoliduWidgetUrl } from "../src/lib/holidu";

process.stdout.write(
  JSON.stringify({
    en: buildHoliduWidgetUrl("en"),
    it: buildHoliduWidgetUrl("it"),
    enStandalone: buildHoliduWidgetUrl("en", { standalone: true }),
    itStandalone: buildHoliduWidgetUrl("it", { standalone: true }),
    // Runtime injection attempt with an unsupported locale.
    injected: buildHoliduWidgetUrl("it-IT'/><script>" as never),
  }),
);
