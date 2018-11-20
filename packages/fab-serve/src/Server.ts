export default class Server {
  private file: string;
  private port: string;

  constructor(file: string, port: string) {
    this.file = file;
    this.port = port;
  }

  async start() {
    console.log("Nice.")
  }

  static async start(file: string, port: string) {
    const server = new Server(file, port)
    return await server.start()
  }
}
