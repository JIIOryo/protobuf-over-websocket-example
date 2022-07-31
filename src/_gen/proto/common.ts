/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "common";

export interface PingReq {}

export interface PingRes {
  success: boolean;
}

function createBasePingReq(): PingReq {
  return {};
}

export const PingReq = {
  encode(_: PingReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PingReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePingReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): PingReq {
    return {};
  },

  toJSON(_: PingReq): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PingReq>, I>>(_: I): PingReq {
    const message = createBasePingReq();
    return message;
  },
};

function createBasePingRes(): PingRes {
  return { success: false };
}

export const PingRes = {
  encode(
    message: PingRes,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PingRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePingRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PingRes {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
    };
  },

  toJSON(message: PingRes): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PingRes>, I>>(object: I): PingRes {
    const message = createBasePingRes();
    message.success = object.success ?? false;
    return message;
  },
};

export interface CommonService {
  Ping(request: PingReq): Promise<PingRes>;
}

export class CommonServiceClientImpl implements CommonService {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Ping = this.Ping.bind(this);
  }
  Ping(request: PingReq): Promise<PingRes> {
    const data = PingReq.encode(request).finish();
    const promise = this.rpc.request("common.CommonService", "Ping", data);
    return promise.then((data) => PingRes.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
