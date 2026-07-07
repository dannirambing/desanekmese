import * as fs from "fs";

const map: Record<string, string> = {
  "profil": `"MANAGE_PROFIL"`,
  "budaya": `"MANAGE_BUDAYA"`,
  "umkm": `"MANAGE_UMKM"`,
  "titik-air": `"MANAGE_AIR"`,
  "anggaran": `"MANAGE_BUDGET"`,
  "berita": `"MANAGE_BERITA"`,
  "pengumuman": `"MANAGE_PENGUMUMAN"`,
  "hero": `"MANAGE_HERO"`,
  "wisata": `"MANAGE_WISATA"`,
  "galeri": `"MANAGE_GALERI"`,
};

const files = [
  "src/app/(admin)/admin/profil/actions.ts",
  "src/app/(admin)/admin/profil/page.tsx",
  "src/app/(admin)/admin/budaya/actions.ts",
  "src/app/(admin)/admin/umkm/actions.ts",
  "src/app/(admin)/admin/titik-air/actions.ts",
  "src/app/(admin)/admin/anggaran/actions.ts",
  "src/app/(admin)/admin/berita/actions.ts",
  "src/app/(admin)/admin/pengumuman/actions.ts",
  "src/app/(admin)/admin/hero/actions.ts",
  "src/app/(admin)/admin/hero/page.tsx",
  "src/app/(admin)/admin/wisata/actions.ts",
  "src/app/(admin)/admin/galeri/actions.ts",
  "src/app/(admin)/admin/galeri/page.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  for (const [key, perm] of Object.entries(map)) {
    if (file.includes("/" + key + "/")) {
      content = content.replace(/requireAdminSession\([^)]*\)/g, `requireAdminSession([${perm}])`);
    }
  }
  fs.writeFileSync(file, content);
  console.log("Updated", file);
}
