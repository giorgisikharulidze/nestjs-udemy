export class MessageformatterService {
  public format(message: string): string {
    const formattedDate = new Date().toISOString();

    return `[${formattedDate}] ${message}`;
  }
}
