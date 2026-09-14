const fs = require('fs');
const path = require('path');

function decodeAsset(filePath) {
  let raw = fs.readFileSync(filePath);
  for (let i = 0; i < 3; i++) {
    if (raw.length >= 8 && raw[0] === 0x89 && raw[1] === 0x50 && raw[2] === 0x4e && raw[3] === 0x47) {
      return { buffer: raw, type: 'image/png' };
    }
    if (raw.length >= 12 && raw.toString('ascii', 0, 4) === 'RIFF' && raw.toString('ascii', 8, 12) === 'WEBP') {
      return { buffer: raw, type: 'image/webp' };
    }
    const text = raw.toString('utf8').replace(/\s+/g, '');
    if (!/^[A-Za-z0-9+/=]+$/.test(text)) break;
    raw = Buffer.from(text, 'base64');
  }
  throw new Error('Invalid brand asset');
}

module.exports = function handler(req, res) {
  try {
    const name = String(req.query.name || '');
    const files = {
      logo: path.join(process.cwd(), 'assets', 'fenix-logo-transparent.webp'),
      symbol: path.join(process.cwd(), 'assets', 'fenix-symbol.png')
    };
    if (!files[name]) return res.status(404).send('Not found');
    const asset = decodeAsset(files[name]);
    res.setHeader('Content-Type', asset.type);
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(asset.buffer);
  } catch (error) {
    console.error('brand-asset', error);
    return res.status(500).send('Brand asset unavailable');
  }
};
