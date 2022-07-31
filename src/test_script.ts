import * as ws from 'ws';
import {JsonSerializer, ProtobufSerializer} from '@common/serializer/impl'

import { TransportSchema, Schema, Util } from '@common/types'

const serializer = new ProtobufSerializer<TransportSchema.NameSchemaMap>([
  __dirname + '/../proto/common.proto',
  __dirname + '/../proto/room.proto',
])

const isEncoding = (encode: number): encode is keyof Encoding => {
  return -0 <= encode && encode < 8
}
const isProtocolVersion = (version: number): version is keyof ProtocolVersion => {
  return -0 <= version && version < 8
}

/**
 * encoding
 */
type Encoding = {
  0: 'JSON'
  1: 'Protobuf'
  2: 'msgpack'
  3: 'hogehoge'
  4: 'gupio'
  5: 'hogehoge2'
  6: 'gupio2'
  7: 'reserved'
}
/**
 * プロトコルバージョン
 */
type ProtocolVersion = {
  0: 'v0'
  1: 'v1'
  2: 'v2'
  3: 'reserved'
  4: 'reserved'
  5: 'reserved'
  6: 'reserved'
  7: 'reserved'
}
/** req/res共通のヘッダー */
type HeaderBase = {
  /**
   * コマンドID (0-65535)
   * - 2byte
   */
  commandId: number
  /**
   * リクエストID (0-256)
   * - 3bit
   */
  protocolVersion: keyof ProtocolVersion
  /**
   * データの符号化方式
   * - 3bit
   */
  encoding: keyof Encoding
}
type RequestHeader = HeaderBase
type ResponseHeader = HeaderBase & {
  /**
   * errorフラグ
   * - 1ビット
   * - エラーがある場合はtrue
   */
  error: boolean
}

class HeaderSerializer {

  requestSerialize(header: RequestHeader): Buffer {
    const buffer = Buffer.alloc(3)
    buffer.writeUInt16BE(header.commandId, 0)

    // 3bit
    const protocolVersion = header.protocolVersion
    // 3bit
    const encoding = header.encoding
    const byte3 = (protocolVersion << 5) | encoding
    buffer.writeUInt8(byte3, 2)
    return buffer
  }

  requestDeserialize(buffer: Buffer): RequestHeader {
    const commandId = buffer.readUInt16BE(0)
    const byte3 = buffer.readUInt8(2)
    const protocolVersion = byte3 >> 5
    const encoding = byte3 & 0b00011111
    if (!isEncoding(encoding)) {
      throw new Error('invalid encoding')
    }
    if (!isProtocolVersion(protocolVersion)) {
      throw new Error('invalid protocolVersion')
    }
    return {
      commandId,
      protocolVersion,
      encoding,
    }
  }

  responseSerialize(header: ResponseHeader): Buffer {
    const buffer = Buffer.alloc(3)
    buffer.writeUInt16BE(header.commandId, 0)

    // 3bit
    const protocolVersion = header.protocolVersion
    // 3bit
    const encoding = header.encoding
    // 1bit
    const error = header.error ? 1 : 0
    let byte3 = (protocolVersion << 5) | encoding
    byte3 |= error << 7
    buffer.writeUInt8(byte3, 2)

    return buffer
  }

  responseDeserialize(buffer: Buffer): ResponseHeader {
    const commandId = buffer.readUInt16BE(0)

    const byte3 = buffer.readUInt8(2)
    const protocolVersion = byte3 >> 5
    const encoding = byte3 & 0b00011111
    const error = ((byte3 >> 7) & 1) === 1
    
    if (!isEncoding(encoding)) {
      throw new Error('invalid encoding')
    }
    if (!isProtocolVersion(protocolVersion)) {
      throw new Error('invalid protocolVersion')
    }
    return {
      commandId,
      protocolVersion,
      encoding,
      error,
    }
  }
  // serialize(header: Header): Buffer {
  //   const commandId = header.commandId
  //   const error = header.error ? 1 : 0
  //   const hogehoge = header.hogehoge ? 1 : 0
  //   const encoding = header.encoding
  //   const buffer = Buffer.alloc(6)
  //   buffer.writeUInt16BE(commandId, 0)
  //   buffer.writeUInt8(error, 2)
  //   buffer.writeUInt8(hogehoge, 3)
  //   buffer.writeUInt8(encoding, 4)
  //   return buffer
  // }

  // deserialize(buffer: Buffer): Header {
  //   const commandId = buffer.readUInt16BE(0)
  //   const error = buffer.readUInt8(2) === 1
  //   const hogehoge = buffer.readUInt8(3) === 1
  //   const encoding = buffer.readUInt8(4)
  //   if (!isEncoding(encoding)) {
  //     throw new Error('invalid encoding')
  //   }
  //   return {
  //     commandId,
  //     error,
  //     hogehoge,
  //     encoding,
  //   }
  // }
}



// class HeaderSerializer {
//   serialize(header: Header): Buffer {
//     const buffer = Buffer.alloc(8)
//     buffer.writeUInt8(header.commandId, 0)
//     buffer.writeUInt8(header.gupio ? 1 : 0, 1)
//     buffer.writeUInt8(header.hogehoge ? 1 : 0, 2)
//     buffer.writeUInt8(header.encoding, 3)
//     return buffer
//   }
//   deserialize(buffer: Buffer): Header {
//     return {
//       commandId: buffer.readUInt8(0),
//       gupio: buffer.readUInt8(1) === 1,
//       hogehoge: buffer.readUInt8(2) === 1,
//       encoding: buffer.readUInt8(3) as Encoding,
//     }
//   }
// }

const headerSerializer = new HeaderSerializer()

const server = new ws.Server({ port: 8080 });
server.on('connection', (socket) => {
  socket.on('message', (message: Buffer) => {
    console.log('------- on message ----------');
    console.log(message)

    const _data = new Uint8Array(message)

    const _header = _data.slice(0, 3)
    const header = headerSerializer.requestDeserialize(Buffer.from(_header))
    const body = _data.slice(3)

    console.log('header', header)
    console.log('---------------------------')
    const desializedJoinReq = serializer.deserialize('room.JoinReq', body)
    console.log(desializedJoinReq)
    console.log('---------------------------')
    socket.close()
    server.close();

    after()

    after2()
    after3()
    process.exit(0)
  })
})

const client = new ws('ws://localhost:8080');
client.on('open', () => {
  console.log('-----  start ------------')
  const joinReq: Schema.Room.JoinReq = {
    userId: 'pinsir',
    roomId: 'room-asdlfkjasdkfjasdkfljl',
  }
  console.log(joinReq)
  console.log('---------------------------')
  const serializedJoinReq = serializer.serialize('room.JoinReq', joinReq)
  console.log(serializedJoinReq)

  // 先頭はヘッダー
  const header: RequestHeader = {
    commandId: 62019,
    protocolVersion: 3,
    encoding: 7,
  }
  const headerBuffer = headerSerializer.requestSerialize(header)
  console.log('---------------------------')
  // const buf = new ArrayBuffer(serializedJoinReq.length)
  // const dataView = new DataView(buf)
  // dataView.setInt32(0, serializedJoinReq.length, true)

  // const buffer = Buffer.from(serializedJoinReq)
  const buffer = Buffer.concat([headerBuffer, serializedJoinReq])
  client.send(buffer)

  console.log('client send')
})


// // ------------------------------

// console.log('===========================')
// console.log('===========================')
// console.log(buf)
// console.log('===========================')
// console.log('===========================')

// // ------------------------------


const after = () => {
  console.log('\n\n\n\n')
  console.log('-- after script ----')

  // console.log('hogehoge')
  // const data = [12, 23, 256]
  // const uint8array = new Uint8Array(data)
  // const data2 = [4]
  // const uint8array2 = new Uint8Array(data2)

  // const bufferunit8array = Buffer.concat([uint8array, uint8array2])
  // // const bufferunit8array = Buffer.from(uint8array)
  // console.log(bufferunit8array)

  // const uint8arrayAfter = new Uint8Array(bufferunit8array)
  // console.log(uint8arrayAfter)

  /**
   * Header
   * - element:
   *   - encoding: 3bit
   *   - protocolVersion: 3bit
   *   - error: 1bit
   *   - reserved: 1bit
   * - total: 1byte
   * - BigEndian
   */
  const before = {
    encoding: 7,
    protocolVersion: 4,
    error: 1,
    reserved: 0,
  }

  console.log(before)

  const BYTE_LENGTH = 8
  const ENCODING_BITS = 3
  const PROTOCOL_VERSION_BITS = 3
  const ERROR_BITS = 1
  const RESERVED_BITS = 1

  const buffer = Buffer.alloc(1)

  let pointer = 0
  // encoding
  pointer = BYTE_LENGTH - ENCODING_BITS
  const $encoding = before.encoding << pointer
  // protocolVersion
  pointer = pointer - PROTOCOL_VERSION_BITS
  const $protocolVersion = before.protocolVersion << pointer
  // error
  pointer = pointer - ERROR_BITS
  const $error = before.error << pointer
  // reserved
  pointer = pointer - RESERVED_BITS
  const $reserved = before.reserved << pointer

  buffer.writeUInt8($encoding | $protocolVersion | $error | $reserved)

  // --------------

  const byte = buffer.readUInt8(0)
  console.log('byte', byte.toString(2).padStart(8, '0'))

  // let pointer2 = 0
  // reserved
  console.log(byte.toString(2).padStart(8, '0'))

  const $reserved2 = (byte & 0b00000001) === 1 ? 1 : 0
  // console.log('$reserved2', $reserved2)

  const $error2 = ((byte & 0b00000010) >> 1) === 1 ? 1 : 0
  // console.log('$error2', $error2)

  const $protocolVersion2 = ((byte & 0b00011100) >> 2)
  // console.log('$protocolVersion2', $protocolVersion2)

  const $encoding2 = ((byte & 0b11100000) >> 5)
  // console.log('$encoding2', $encoding2)


  const after = {
    encoding: $encoding2,
    protocolVersion: $protocolVersion2,
    error: $error2,
    reserved: $reserved2,
  }

  console.log('after', after)







  // const buffer = Buffer.alloc(1)
  // let byte = 0b10110010
  // buffer.writeUInt8(byte, 0)
  // console.log(buffer)

  // const byte2 = buffer.readUInt8(0)
  // console.log(byte2.toString(2))

  // const encoding = byte2 & 0b111
  // const protocolVersion = (byte2 >> 3) & 0b111
  // const error = (byte2 >> 6) & 0b1
  // const reserved = (byte2 >> 7) & 0b1

  // console.log(
  //   encoding.toString(2),
  //   protocolVersion.toString(2),
  //   error.toString(2),
  //   reserved.toString(2),
  // )
}

const after2 = () => {
  console.log('\n\n\n\n')
  console.log('-- after script2 ----')

  /**
   * Header
   * - element:
   *   - encoding: 3bit
   *   - protocolVersion: 3bit
   *   - error: 1bit
   *   - reserved: 1bit
   * - total: 1byte
   * - BigEndian
   */
  const before = {
    encoding: 6,
    protocolVersion: 0,
    error: 1,
    reserved: 1,
  }
  console.log(before)

  const BYTE_LENGTH = 8
  const ENCODING_BITS = 3
  const PROTOCOL_VERSION_BITS = 3
  const ERROR_BITS = 1
  const RESERVED_BITS = 1

  const buffer = Buffer.alloc(1)

  let b = 0b00000000
  let p = BYTE_LENGTH

  // encoding
  console.log('-encoding-')
  p -= ENCODING_BITS
  b += before.encoding << p
  console.log(b.toString(2).padStart(8, '0'))
  
  // protocolVersion
  console.log('-protocolVersion-')
  p -= PROTOCOL_VERSION_BITS
  b += before.protocolVersion << p
  console.log(b.toString(2).padStart(8, '0'))

  // error
  console.log('-error-')
  p -= ERROR_BITS
  b += before.error << p
  console.log(b.toString(2).padStart(8, '0'))

  // reserved
  console.log('-reserved-')
  p -= RESERVED_BITS
  b += before.reserved << p
  console.log(b.toString(2).padStart(8, '0'))

  buffer.writeUInt8(b)

  console.log(buffer)
  console.log('========')

  let b2 = buffer.readUInt8(0)
  console.log(b2.toString(2).padStart(8, '0'))

  // reserved
  const $reserved2 = b2 & (2 ** RESERVED_BITS - 1)
  b2 >>= RESERVED_BITS
  console.log('$reserved2', $reserved2)
  console.log(b2.toString(2).padStart(8, '0'))

  // error
  const $error2 = b2 & (2 ** ERROR_BITS - 1)
  b2 >>= ERROR_BITS
  console.log('$error2', $error2)
  console.log(b2.toString(2).padStart(8, '0'))

  // protocolVersion
  const $protocolVersion2 = b2 & (2 ** PROTOCOL_VERSION_BITS - 1)
  b2 >>= PROTOCOL_VERSION_BITS
  console.log('$protocolVersion2', $protocolVersion2)
  console.log(b2.toString(2).padStart(8, '0'))

  // encoding
  const $encoding2 = b2 & (2 ** ENCODING_BITS -1 )
  console.log('b2', b2.toString(2).padStart(8, '0'))
  console.log('$encoding2', $encoding2.toString(2).padStart(8, '0'))
  b2 >>= ENCODING_BITS

  const after = {
    encoding: $encoding2,
    protocolVersion: $protocolVersion2,
    error: $error2,
    reserved: $reserved2,
  }

  console.log('before', before)
  console.log('after', after)

}

type ByteN<T> = {
  name: keyof T
  bit: number
}[]
type Byte3 = {
  encoding: keyof Encoding
  protocolVersion: number
  error: 0 | 1
  reserved: 0
}
const BYTE_LENGTH = 8

const after3 = () => {
  console.log('\n\n\n\n')
  console.log('-- after script3 ----')

  // 3バイト目の仕様
  const byte3: ByteN<Byte3> = [
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
    },
  ]

  const before: Byte3 = {
    encoding: 2,
    protocolVersion: 7,
    error: 1,
    reserved: 0,
  }
  console.log(before)

  const buildByteN = (byteN: ByteN<Byte3>, target: {[key: string]: number}) => {
    // check sum of byteN bit length
    let sum = 0
    byteN.forEach(({bit}) => {
      sum += bit
    })
    if (sum !== BYTE_LENGTH) {
      throw new Error('byteN bit length is only 8 bit')
    }

    let b = 0b00000000
    let remainingBits = BYTE_LENGTH
    for (const {name, bit} of byteN) {
      if (target[name] === undefined) {
        throw new Error(`${name} is undefined`)
      }
      if (target[name] > (2 ** bit - 1)) {
        throw new Error(`${name} is out of range`)
      }
      remainingBits -= bit
      b += target[name] << remainingBits
    }
    return b
  }

  const buffer = Buffer.alloc(1)
  buffer.writeUInt8(buildByteN(byte3, before))

  console.log(buffer)
  console.log(buildByteN(byte3, before).toString(2).padStart(8, '0'))

  const parseByteN = (byteN: ByteN<Byte3>, b: number) => {
    let remainingBits = BYTE_LENGTH
    const target: {[key: string]: number} = {}
    for (const {name, bit} of byteN) {
      remainingBits -= bit
      target[name] = (b >> remainingBits) & (2 ** bit - 1)
    }
    return target
  }

  const b2 = buffer.readUInt8(0)
  const after = parseByteN(byte3, b2)
  console.log(after)
}

