import { dir2array } from "https://js.sabae.cc/dir2array.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

try {
  await Deno.mkdir("img");
} catch (e) {
}
const dst = "img/";

const list = await CSV.fetchJSON("creators.csv");
//console.log(list);

const base = "ツクリテ画像/";
const files = await dir2array(base);
const imgfns = {};
for (const fn of files) {
  const flg = fn.indexOf("パネル用") >= 0 || fn.indexOf("ル写真") >= 0 || fn.indexOf("パネル写真") >= 0 || fn.indexOf("パネル写真") >= 0 || fn.indexOf("メイン写真") >= 0;
  if (!(flg && fn.endsWith(".jpg"))) {
    continue;
  }
  //console.log(flg, fn);
  const path = fn.split("/");
  const name = path[path.length - 3];
  //console.log(name, fn);
  const imgfn = path[path.length - 1];

  // 下村エヴァ,しもむら エヴァ,29,フランス・パリ,株式会社下村漆器店,鯖江市片山町8-7,漆器製造,総務,自分を大切にしないと他の人も大切にできない,子供漆器,大学生,自分が一番できる仕事をする,役にたつように,環境に優しい食器,人が減らないで,すばらしい技術,,

  const searchByName = (name) => {
    name = name.replace(/ /g, "").replace(/　/g, "").replace(/様$/, "");
    const idx = list.findIndex(l => l["名前"].replace(/ /g, "") == name);
    //console.log(name, idx);
    return idx;
  };
  const idx = searchByName(name);
  if (idx == -1) {
    //throw new Error(name);
    console.log(name, fn);
    // just copy
    const dstfn = dst + imgfn;
    const bin = new Uint8Array(await Deno.readFile(base + fn));
    await Deno.writeFile(dstfn, bin);
    continue;
  }
  let imgfn2 = imgfn;
  if (!imgfns[imgfn]) {
    imgfns[imgfn] = 1;
  } else {
    imgfn2 = imgfn.substring(0, imgfn.length - 4) + (++imgfns[imgfn]) + ".jpg";
  }
  const dstfn = dst + imgfn2;
  list[idx]["メイン写真"] = dstfn;

  const bin = new Uint8Array(await Deno.readFile(base + fn));
  await Deno.writeFile(dstfn, bin);
}
await Deno.writeTextFile("creators2.csv", CSV.stringify(list));
