import { XLSX } from "https://taisukef.github.io/sheetjs-es/es/XLSX.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { dir2array } from "https://js.sabae.cc/dir2array.js";

/*
ヒロセ 大石　恵子　/　おおいし　えいこ さん、Q15がない
ヤマト工芸 高野利明さん、アンケートがない（高野美由紀さんのファイルになっている）
プラスジャック 久保葉月様　アンケートない
*/

const CSV_indexOf = (csv, key) => {
  for (let i = 0; i < csv.length; i++) {
    for (let j = 0; j < csv[i].length; j++) {
      if (csv[i][j] == key) {
        return { row: i, col: j };
      }
    }
  }
  return null;
};

const decodeQ = (csv) => {
  const res = {};
  const { row, col } = CSV_indexOf(csv, "Q.1");
  //console.log(row, col);
  for (let i = 0; i < 15; i++) {
    if (!csv[i + row]) {
      break;
    }
    const key = csv[i + row][col + 1].replace("　", " ").split(" ")[0];
    const val = csv[i + row][col + 3].trim();
    if (i == 0) {
      const val2 = val.indexOf("/") >= 0 ? val.split("/") : val.split("／");
      res["名前"] = (val2[0].trim()).replace(/　/, " ");
      res["名前よみ"] = (val2.length > 1 ? val2[1].trim() : "").replace(/　/, " ");
    } else {
      if (key == "年齢") {
        res[key] = val.replace("歳", "").trim();
      } else {
        res[key] = val;
      }
    }
  }
  //console.log(res);
  return res;
};

const list = [];

const base = "ツクリテ画像/";
const files = await dir2array(base);
for (const fn of files) {
  const flg = fn.endsWith(".xlsx"); // fn.endsWith("アンケート.xlsx") || fn.startsWith("ツクリテ顔辞典アンケート_");
  if (fn.indexOf("~$") >= 0 || !flg) {
    continue;
  }
  const bin = new Uint8Array(await Deno.readFile(base + fn));
  const ws = XLSX.decode(bin);
  try {
    const csv = XLSX.toCSV(ws);
    const json = decodeQ(csv, fn);
    list.push(json);
  } catch (e) {
    console.log(e);
    console.log(fn);
  }
}
await Deno.writeTextFile("creators1.csv", CSV.stringify(list));
