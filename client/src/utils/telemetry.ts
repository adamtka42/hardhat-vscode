import { env, workspace } from "vscode";

export function isGlobalTelemetryEnabled() {
  return env.isTelemetryEnabled;
}

export function isHardhatTelemetryEnabled() {
  return (
    workspace.getConfiguration("hyperion").get<boolean>("telemetry") ?? false
  );
}

export function isTelemetryEnabled() {
  return isGlobalTelemetryEnabled() && isHardhatTelemetryEnabled();
}
