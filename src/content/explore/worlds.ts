// All explorable worlds. A world is a root node plus its missions. Node ids are
// unique across worlds (validate-content R12), so progress can be shared.
import { atlasMissions, atlasWorld } from "./atlas";
import { cloudMissions, cloudWorld } from "./cloud";
import { netMissions, netWorld } from "./net";
import { socMissions, socWorld } from "./soc";
import { webappMissions, webappWorld } from "./webapp";
import { flatten, missions as pipelineMissions, world as pipelineWorld, type Mission, type WorldNode } from "./world";

export interface World {
  /** Also the route segment: /explore/<id>. */
  id: string;
  root: WorldNode;
  missions: Mission[];
}

export const worlds: World[] = [
  { id: atlasWorld.id, root: atlasWorld, missions: atlasMissions },
  { id: pipelineWorld.id, root: pipelineWorld, missions: pipelineMissions },
  { id: cloudWorld.id, root: cloudWorld, missions: cloudMissions },
  { id: socWorld.id, root: socWorld, missions: socMissions },
  { id: webappWorld.id, root: webappWorld, missions: webappMissions },
  { id: netWorld.id, root: netWorld, missions: netMissions },
];

export const worldById = (id: string) => worlds.find((w) => w.id === id);

/** Every node of every world, flat. */
export const allNodes = () => Object.assign({}, ...worlds.map((w) => flatten(w.root))) as ReturnType<typeof flatten>;

/** For back-links: topic "<domain>/<slug>" -> the map nodes that point at it. */
export function nodesByTopic(): Record<string, { world: string; node: string }[]> {
  const out: Record<string, { world: string; node: string }[]> = {};
  for (const w of worlds) {
    for (const n of Object.values(flatten(w.root))) {
      for (const t of n.topics ?? []) (out[t] ??= []).push({ world: w.id, node: n.id });
    }
  }
  return out;
}
