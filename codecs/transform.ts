import { Codec, createCodec, metadata } from "../common/mod.ts";

export function transform<T, U>($base: Codec<T>, encode: (value: U) => T, decode: (value: T) => U): Codec<U> {
  return createCodec({
    _metadata: metadata("$.transform", transform, $base, encode, decode),
    _staticSize: $base._staticSize,
    _encode(buffer, value) {
      $base._encode(buffer, encode(value));
    },
    _decode(buffer) {
      return decode($base._decode(buffer));
    },
  });
}
