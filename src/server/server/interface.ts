
export interface IServer {
  /**
   * Setup the server.
   * @returns {Promise<void>}
   */
  setup(): Promise<void>
  /**
   * Start the server.
   * @returns {Promise<void>}
   */
  start(): Promise<void>
  /**
   * Stop the server.
   * @returns {Promise<void>}
   */
  stop(): Promise<void>
}
