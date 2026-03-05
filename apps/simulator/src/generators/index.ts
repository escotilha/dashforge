import * as johnDeere from "./john-deere";
import * as volvo from "./volvo";
import * as caterpillar from "./caterpillar";
import * as siemens from "./siemens";
import * as abb from "./abb";
import type { DemoClient } from "../config";

export type ClientGenerator = typeof johnDeere;

const generators: Record<DemoClient, ClientGenerator> = {
  "john-deere": johnDeere,
  volvo,
  caterpillar,
  siemens,
  abb,
};

export function getGenerator(client: DemoClient): ClientGenerator {
  return generators[client];
}

export function getAllGenerators(): [DemoClient, ClientGenerator][] {
  return Object.entries(generators) as [DemoClient, ClientGenerator][];
}
