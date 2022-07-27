export type Config = {
  /**
   * サーバー設定
   */
  server: {
    /**
     * サーバーのポート番号
     */
    port: number,
    /**
     * チャットユーザーの設定
     */
    chatUser: {
      /**
       * 最終アクティブタイムからタイムアウトと認識される時間 (ms)
       * - pingで更新される
       */
      timeout: number,
    }
  },
  /**
   * クライアント設定
   */
  client: {
    /**
     * pingを送信する間隔 (ms)
     */
    pingInterval: number
  }
}
