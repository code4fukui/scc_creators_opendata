import { CSV } from "https://js.sabae.cc/CSV.js";

const list = await CSV.fetchJSON("creators3.csv");
list.forEach(l => l.メイン写真 = l.メイン写真 ? "https://code4fukui.github.io/scc_creators_opendata/img/" + l.メイン写真 : "");
await Deno.writeTextFile("creators.csv", CSV.stringify(list));
