/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');
const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'collaborators');

// Ensure directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const images = [
  { name: 'solar-chapter.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-1/Solar%20Chapter.png' },
  { name: 'kemendesa.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-1/Kementerian%20Desa%20dan%20Pembangunan%20Daerah%20Tertinggal.png' },
  { name: 'ogi.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-1/Open%20Goverment%20Indonesia.png' },
  { name: 'bapperida.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-2/Bapperida.png' },
  { name: 'wvi.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-1/Wahana%20Visi%20Indonesia.png' },
  { name: 'kab-kupang.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-1/Kab.%20Kupang.png' },
  { name: 'kab-malaka.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-2/Kab.%20Malaka.png' },
  { name: 'kab-sumba-barat-daya.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-2/Kab.%20Sumba%20Barat%20Daya.png' },
  { name: 'kab-sumba-barat.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-2/Kab.%20Sumba%20Barat.png' },
  { name: 'kab-timor-tengah-utara.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-2/Kab.%20Timor%20Tengah%20Utara.png' },
  { name: 'cis-timor.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-3/CIS%20Timor.png' },
  { name: 'plan-international.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-3/PLAN%20International.png' },
  { name: 'skala.jpg', url: 'https://mengalir.co/assets/images/collaborators_2/row-3/SKALA.jpg' },
  { name: 'unwira.png', url: 'https://mengalir.co/assets/images/collaborators_2/row-3/Universitas%20Katolik%20Widya%20Mandira.png' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  for (const img of images) {
    const filePath = path.join(destDir, img.name);
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, filePath);
      console.log(`Saved ${img.name}`);
    } catch (e) {
      console.error(`Error downloading ${img.name}:`, e.message);
    }
  }
  console.log('All downloads complete!');
}

run();
