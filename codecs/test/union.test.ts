import * as $ from "../../mod.ts";
import { metadata } from "../../mod.ts";
import { testCodec, testInvalid } from "../../test-util.ts";

const $abc = $.withMetadata(
  metadata("$abc"),
  $.taggedUnion("_tag", [
    ["A"],
    ["B", ["B", $.str]],
    ["C", ["C", $.tuple($.u32, $.u64)]],
    ["D", ["a", $.u32], ["b", $.u64]],
  ]),
);

const interestingU8s = {
  0: "Min",
  1: "Unit",
  2: "EvenPrime",
  28: "LargestPerfect",
  129: "FirstUninteresting",
  225: "LargestSquare",
  255: "Max",
} as const;

const $interestingU8s = $.withMetadata(metadata("$.stringUnion(interestingU8s)"), $.stringUnion(interestingU8s));

const names = [
  "Ross",
  "Alisa",
  "Stefan",
  "Raoul",
  "James",
  "David",
  "Pierre",
] as const;

const $names = $.withMetadata(metadata("$.stringUnion(names)"), $.stringUnion(names));

testCodec($abc, [
  { _tag: "A" },
  { _tag: "B", B: "HELLO" },
  { _tag: "C", C: [255, 101010101n] },
  { _tag: "D", a: 101, b: 999n },
]);

testCodec($names, [...names]);

testCodec($interestingU8s, Object.values(interestingU8s));

testInvalid($abc, [
  null,
  { _tag: null },
  { _tag: "" },
  { _tag: "B" },
  { _tag: "B", B: null },
  { _tag: "D", a: 1 },
  { _tag: "D", b: 1n },
  { _tag: "D", a: -1, b: 1n },
  { _tag: "D", a: 1, b: -1n },
]);
