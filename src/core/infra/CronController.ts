export abstract class CronController {
  protected abstract executeImpl(): Promise<void | any>;

  public async execute(): Promise<any> {
    console.log('Start Cron');
    try {
      return await this.executeImpl();
    } catch (err) {
      this.fail(err);
    }
  }

  public fail(error: Error | string) {
    return CronController.error(error.toString());
  }

  public static success(message) {
    console.log('Cron ran with success', message);
  }

  public static error(message: string) {
    throw Error(message);
  }
}
