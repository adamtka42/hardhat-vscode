// eslint-disable-next-line @typescript-eslint/naming-convention
import HardhatTaskCommand from "./HardhatTaskCommand";

export default class CleanCommand extends HardhatTaskCommand {
  public name(): string {
    return "hyperion.hardhat.clean";
  }

  public hardhatArgs(): string[] {
    return ["clean"];
  }

  public progressLabel(): string {
    return "Cleaning artifacts and cache";
  }
}
