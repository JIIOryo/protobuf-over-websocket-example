/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "room";

export interface JoinReq {
  roomId: string;
  userId: string;
}

export interface JoinRes {
  roomId: string;
  userId: string;
  success: boolean;
}

export interface LeaveReq {
  roomId: string;
  userId: string;
}

export interface LeaveRes {
  roomId: string;
  userId: string;
  success: boolean;
}

export interface MessageReq {
  roomId: string;
  userId: string;
  message: string;
}

export interface MessageRes {
  roomId: string;
  userId: string;
  message: string;
}

function createBaseJoinReq(): JoinReq {
  return { roomId: "", userId: "" };
}

export const JoinReq = {
  encode(
    message: JoinReq,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): JoinReq {
    return {
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: JoinReq): unknown {
    const obj: any = {};
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<JoinReq>, I>>(object: I): JoinReq {
    const message = createBaseJoinReq();
    message.roomId = object.roomId ?? "";
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseJoinRes(): JoinRes {
  return { roomId: "", userId: "", success: false };
}

export const JoinRes = {
  encode(
    message: JoinRes,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.success === true) {
      writer.uint32(24).bool(message.success);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): JoinRes {
    return {
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      success: isSet(object.success) ? Boolean(object.success) : false,
    };
  },

  toJSON(message: JoinRes): unknown {
    const obj: any = {};
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.success !== undefined && (obj.success = message.success);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<JoinRes>, I>>(object: I): JoinRes {
    const message = createBaseJoinRes();
    message.roomId = object.roomId ?? "";
    message.userId = object.userId ?? "";
    message.success = object.success ?? false;
    return message;
  },
};

function createBaseLeaveReq(): LeaveReq {
  return { roomId: "", userId: "" };
}

export const LeaveReq = {
  encode(
    message: LeaveReq,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaveReq {
    return {
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: LeaveReq): unknown {
    const obj: any = {};
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaveReq>, I>>(object: I): LeaveReq {
    const message = createBaseLeaveReq();
    message.roomId = object.roomId ?? "";
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseLeaveRes(): LeaveRes {
  return { roomId: "", userId: "", success: false };
}

export const LeaveRes = {
  encode(
    message: LeaveRes,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.success === true) {
      writer.uint32(24).bool(message.success);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaveRes {
    return {
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      success: isSet(object.success) ? Boolean(object.success) : false,
    };
  },

  toJSON(message: LeaveRes): unknown {
    const obj: any = {};
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.success !== undefined && (obj.success = message.success);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaveRes>, I>>(object: I): LeaveRes {
    const message = createBaseLeaveRes();
    message.roomId = object.roomId ?? "";
    message.userId = object.userId ?? "";
    message.success = object.success ?? false;
    return message;
  },
};

function createBaseMessageReq(): MessageReq {
  return { roomId: "", userId: "", message: "" };
}

export const MessageReq = {
  encode(
    message: MessageReq,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MessageReq {
    return {
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      message: isSet(object.message) ? String(object.message) : "",
    };
  },

  toJSON(message: MessageReq): unknown {
    const obj: any = {};
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MessageReq>, I>>(
    object: I
  ): MessageReq {
    const message = createBaseMessageReq();
    message.roomId = object.roomId ?? "";
    message.userId = object.userId ?? "";
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseMessageRes(): MessageRes {
  return { roomId: "", userId: "", message: "" };
}

export const MessageRes = {
  encode(
    message: MessageRes,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MessageRes {
    return {
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      message: isSet(object.message) ? String(object.message) : "",
    };
  },

  toJSON(message: MessageRes): unknown {
    const obj: any = {};
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MessageRes>, I>>(
    object: I
  ): MessageRes {
    const message = createBaseMessageRes();
    message.roomId = object.roomId ?? "";
    message.userId = object.userId ?? "";
    message.message = object.message ?? "";
    return message;
  },
};

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
