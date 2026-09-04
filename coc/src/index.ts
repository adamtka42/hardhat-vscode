import { ExtensionContext, LanguageClient, services } from "coc.nvim";
import * as coc from "coc.nvim";
import * as packageJson from "../package.json";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { machineId } = require("./vendor/machineId");

export async function activate(context: ExtensionContext): Promise<void> {
  // Fire-and-forget: awaiting the menu picker would hang activation past
  // coc's 5s budget whenever the user doesn't answer immediately.
  void showTelemetryPrompt(context);

  const telemetryEnabled =
    getExtensionConfig().get<boolean>("telemetry") ?? false;

  const languageClient = new LanguageClient(
    "hyperion",
    "Hyperion Language Server",
    {
      module: require.resolve("@theqrl/hyperion-language-server"),
      transport: coc.TransportKind.ipc,
    },
    {
      documentSelector: ["hyperion"],
      synchronize: {
        configurationSection: "hyperion",
        fileEvents: [
          coc.workspace.createFileSystemWatcher("**/hardhat.config.{ts,js}"),
          coc.workspace.createFileSystemWatcher("**/*.hyp"),
        ],
      },
      initializationOptions: {
        extensionName: "@theqrl/coc-hyperion",
        extensionVersion: packageJson.version,
        env: "production",
        telemetryEnabled,
        machineId: await machineId(),
        extensionConfig: getExtensionConfig(),
      },
    }
  );
  context.subscriptions.push(services.registLanguageClient(languageClient));
}

async function showTelemetryPrompt(context: ExtensionContext) {
  const shownTelemetryPrompt = context.globalState.get("shownTelemetryPrompt");

  if (!shownTelemetryPrompt) {
    const pick = await coc.window.showMenuPicker(
      ["Accept", "Decline"],
      "Support coc-hyperion with crash reports?"
    );

    switch (pick) {
      case 0:
        getExtensionConfig().update("telemetry", true, true);
        return context.globalState.update("shownTelemetryPrompt", true);
      case 1:
        getExtensionConfig().update("telemetry", false, true);
        return context.globalState.update("shownTelemetryPrompt", true);
      default:
        break;
    }
  }
}

function getExtensionConfig() {
  return coc.workspace.getConfiguration("@theqrl/coc-hyperion");
}
