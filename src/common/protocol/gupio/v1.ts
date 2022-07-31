type Header = {[Key in string]: number | boolean}
type ByteN<T extends Header = Header> = {
  name: keyof T
  bit: number
}[]
type RequestHeaderByte3 = {
  encoding: keyof typeof V1._ENCODING
  protocolVersion: keyof typeof V1._PROTOCOL_VERSION
  reserved: 0
}
type ResoponseHeaderByte3 = {
  encoding: keyof typeof V1._ENCODING
  protocolVersion: keyof typeof V1._PROTOCOL_VERSION
  error: 0 | 1
  reserved: 0
}

/** req/res共通のヘッダー */
type HeaderBase = {
  /**
   * コマンドID (0-65535)
   */
  commandId: number
  /**
   * プロトコルバージョン
   * - 0: v1
   * - 1~: reserved
   */
  protocolVersion: keyof typeof V1._PROTOCOL_VERSION
  /**
   * データの符号化方式
   * - 0: json
   * - 1: protobuf
   * - 2: msgpack
   * - 3~: reserved
   * 
   */
  encoding: keyof typeof V1._ENCODING
}

/**
 * リクエストヘッダー
 */
export type RequestHeader = HeaderBase

/**
 * レスポンスヘッダー
 */
export type ResponseHeader = HeaderBase & {
  /**
   * errorフラグ
   * - false: 正常
   * - true: エラー
   */
  error: boolean
}

/**
 * gupio protocol version 1
 * 
 * ## request header
 * - commandId:        uint16
 * - protocol version: uint8
 * - encoding:         uint8
 * 
 * +-------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+
 * | bit   |        0        |        1        |        2        |        3        |        4        |        5        |        6        |        7        | 
 * +-------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+
 * | byte1 |                                                           command id ( 0 ~ 65535 )                                                            |
 * | byte2 |                                                                                                                                               |
 * +-------+-----------------------------------------------------+-----------------------------------------------------+-----------------+-----------------+
 * | byte3 |             protocol version ( 0 ~ 7 )              |                  encoding ( 0 ~ 7 )                 | reserved ( 0 )  | reserved ( 0 )  |
 * +-------+-----------------------------------------------------+-----------------------------------------------------+-----------------+-----------------+
 * 
 * ## response header
 * - commandId:        uint16
 * - protocol version: uint8
 * - encoding:         uint8
 * - error:            bool
 * +-------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+
 * | bit   |        0        |        1        |        2        |        3        |        4        |        5        |        6        |        7        |
 * +-------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+-----------------+
 * | byte1 |                                                           command id ( 0 ~ 65535 )                                                            |
 * | byte2 |                                                                                                                                               |
 * +-------+-----------------------------------------------------+-----------------------------------------------------+-----------------+-----------------+
 * | byte3 |             protocol version ( 0 ~ 7 )              |                  encoding ( 0 ~ 7 )                 | error ( 0 ~ 1 ) | reserved ( 0 )  |
 * +-------+-----------------------------------------------------+-----------------------------------------------------+-----------------+-----------------+
 */
class V1 {
  /**
   * プロトコルバージョン一覧
   *
   * @public
   * @static
   * @readonly
   */
  public static readonly _PROTOCOL_VERSION = {
    0: 'v1',
    1: 'reserved',
    2: 'reserved',
    3: 'reserved',
    4: 'reserved',
    5: 'reserved',
    6: 'reserved',
    7: 'reserved',
  }

  /**
   * プロトコルバージョンのチェック
   * - reservedの場合もfalseを返す
   * @param version プロトコルバージョン
   * @returns プロトコルバージョンかどうか
   */
  private _isProtocolVersion(version: number): version is keyof typeof V1._PROTOCOL_VERSION {
    if (!(version in V1._PROTOCOL_VERSION)) {
      return false
    }
    // @ts-expect-error versionは(keyof typeof V1._PROTOCOL_VERSION)になる
    if (V1._PROTOCOL_VERSION[version] === 'reserved') {
      return false
    }
    return true
  }

  /**
   * エンコーディングのチェック
   * @param encoding データの符号化方式
   * @returns エンコーディングかどうか
   */
  private _isEncoding(encoding: number): encoding is keyof typeof V1._ENCODING {
    if (!(encoding in V1._ENCODING)) {
      return false
    }
    // @ts-expect-error encodingは(keyof typeof V1._ENCODING)になる
    if (V1._ENCODING[encoding] === 'reserved') {
      return false
    }
    return true
  }

  /**
   * エンコーディング
   *
   * @public
   * @static
   * @readonly
   */
  public static readonly _ENCODING = {
    0: 'json',
    1: 'protobuf',
    2: 'msgpack',
    3: 'reserved',
    4: 'reserved',
    5: 'reserved',
    6: 'reserved',
    7: 'reserved',
  }

  /**
   * プロトコルバージョン
   *
   * @public
   * @static
   * @readonly
   */
  public static readonly VERSION = V1._PROTOCOL_VERSION[0]

  /**
   * リクエストヘッダの3バイト目の表現
   *
   * @public
   * @static
   * @readonly
   */
  public static readonly _REQUEST_BYTE3: ByteN<RequestHeaderByte3> = [
    {
      name: 'encoding',
      bit: 3,
    },
    {
      name: 'protocolVersion',
      bit: 3,
    },
    {
      name: 'reserved',
      bit: 2,
    }
  ]
  /**
   * レスポンスヘッダの3バイト目の表現
   *
   * @public
   * @static
   * @readonly
   */
  public static readonly _RESPONSE_BYTE3: ByteN<ResoponseHeaderByte3> = [
    {
      name: 'encoding',
      bit: 3,
    },
    {
      name: 'protocolVersion',
      bit: 3,
    },
    {
      name: 'error',
      bit: 1,
    },
    {
      name: 'reserved',
      bit: 1,
    }
  ]

  /**
   * Nバイト目の値を生成する
   * @private
   * @returns Nバイト目の値
   */
  private _generateByteN = <T extends Header>(byteN: ByteN<T>, target: {[Prop in keyof T]: number}): number => {
    // check sum of byteN bit length
    let bitLength = 0
    byteN.forEach(({bit}) => { bitLength += bit })
    if (bitLength !== 8) {
      throw new Error('byteN bit length is only 8 bit')
    }

    // generate byteN value
    let b = 0b00000000
    let remainingBits = 8
    for (const {name, bit} of byteN) {
      if (target[name] === undefined) {
        throw new Error(`${String(name)} is undefined`)
      }
      if (target[name] > (2 ** bit - 1)) {
        throw new Error(`${String(name)} is out of range`)
      }
      remainingBits -= bit
      b += target[name] << remainingBits
    }
    return b
  }

  /**
   * Nバイト目の値をパースする
   * @private
   * @param byteN 
   * @param b 値
   * @returns パース結果のオブジェクト
   */
  private _parseByteN = <T extends Header>(byteN: ByteN<T>, b: number): {[Prop in keyof T]: number} => {
    // parse byteN value
    let remainingBits = 8

    // @ts-expect-error 以下のforループで格納するため無視
    const target: {[Prop in keyof T]: number} = {}
    for (const {name, bit} of byteN) {
      remainingBits -= bit
      target[name] = (b >> remainingBits) & ((2 ** bit) - 1)
    }
    return target
  }

  /**
   * リクエストヘッダーのバイト列を生成
   * @param header リクエストヘッダー
   * @returns バイト列
   */
  public buildRequestHeader(header: RequestHeader): Buffer {
    // byte 1 ~ 2
    if (header.commandId < 0 || header.commandId > 65535) {
      throw new Error('commandId is out of range')
    }
    const byte_1_2_buffer = Buffer.alloc(2, 0)
    byte_1_2_buffer.writeUInt16BE(header.commandId)

    // byte 3
    const byte_3_buffer = Buffer.alloc(1, 0)
    const byte3Value = this._generateByteN(V1._REQUEST_BYTE3, Object.assign({}, header, {reserved: 0}))
    byte_3_buffer.writeUInt8(byte3Value)

    return Buffer.concat([byte_1_2_buffer, byte_3_buffer])
  }

  /**
   * リクエストヘッダーのパース
   * @param buffer バイト列
   * @returns リクエストヘッダー
   */
  public parseRequestHeader(buffer: Buffer): RequestHeader {
    // byte 1 ~ 2
    const commandId = buffer.readUInt16BE(0)

    // byte 3
    const byte3Value = buffer.readUInt8(2)
    const byte3 = this._parseByteN(V1._REQUEST_BYTE3, byte3Value)
    if (!this._isEncoding(byte3.encoding)) {
      throw new Error('encoding is invalid')
    }
    if (!this._isProtocolVersion(byte3.protocolVersion)) {
      throw new Error('protocolVersion is invalid')
    }

    return {
      commandId,
      protocolVersion: byte3.protocolVersion,
      encoding: byte3.encoding,
    }
  }

  /**
   * レスポンスヘッダーのバイト列を生成
   * @param header レスポンスヘッダー
   * @returns バイト列
   */
  public buildResponseHeader(header: ResponseHeader): Buffer {
    // byte 1 ~ 2
    if (header.commandId < 0 || header.commandId > 65535) {
      throw new Error('commandId is out of range')
    }
    const byte_1_2_buffer = Buffer.alloc(2, 0)
    byte_1_2_buffer.writeUInt16BE(header.commandId)

    // byte 3
    const byte_3_buffer = Buffer.alloc(1, 0)
    const byte3Value = this._generateByteN(V1._RESPONSE_BYTE3, {
      encoding: header.encoding,
      protocolVersion: header.protocolVersion,
      error: header.error ? 1 : 0,
      reserved: 0,
    })
    byte_3_buffer.writeUInt8(byte3Value)

    return Buffer.concat([byte_1_2_buffer, byte_3_buffer])
  }

  public parseResponseHeader(buffer: Buffer): ResponseHeader {
    // byte 1 ~ 2
    const commandId = buffer.readUInt16BE(0)

    // byte 3
    const byte3Value = buffer.readUInt8(2)
    const byte3 = this._parseByteN(V1._RESPONSE_BYTE3, byte3Value)
    if (!this._isEncoding(byte3.encoding)) {
      throw new Error('encoding is invalid')
    }
    if (!this._isProtocolVersion(byte3.protocolVersion)) {
      throw new Error('protocolVersion is invalid')
    }

    return {
      commandId,
      protocolVersion: byte3.protocolVersion,
      encoding: byte3.encoding,
      error: byte3.error ? true : false,
    }
  }
}

export const v1 = new V1()
