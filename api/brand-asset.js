function decodeAssetText(text) {
  let raw = Buffer.from(String(text || '').replace(/\s+/g, ''), 'utf8');
  for (let i = 0; i < 3; i++) {
    if (raw.length >= 8 && raw[0] === 0x89 && raw[1] === 0x50 && raw[2] === 0x4e && raw[3] === 0x47) {
      return { buffer: raw, type: 'image/png' };
    }
    if (raw.length >= 12 && raw.toString('ascii', 0, 4) === 'RIFF' && raw.toString('ascii', 8, 12) === 'WEBP') {
      return { buffer: raw, type: 'image/webp' };
    }
    const s = raw.toString('utf8').replace(/\s+/g, '');
    if (!/^[A-Za-z0-9+/=]+$/.test(s)) break;
    raw = Buffer.from(s, 'base64');
  }
  throw new Error('Invalid brand asset');
}

module.exports = async function handler(req, res) {
  try {
    const name = String(req.query.name || '');
    const paths = {
      logo: 'assets/fenix-logo-transparent.webp',
      symbol: 'assets/fenix-symbol.png'
    };
    if (!paths[name]) return res.status(404).send('Not found');

    const rawUrl = `https://raw.githubusercontent.com/FENIXBPO/fenix-bpo-propostas/feat/proposta-v2-integracao-dados/${paths[name]}`;
    const r = await fetch(rawUrl, { cache: 'no-store' });
    if (!r.ok) throw new Error(`GitHub asset fetch failed: ${r.status}`);

    const text = await r.text();
    const asset = decodeAssetText(text);
    res.setHeader('Content-Type', asset.type);
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('Content-Disposition', 'inline');
    return res.status(200).end(asset.buffer);
  } catch (error) {
    console.error('brand-asset', error);
    return res.status(500).send('Brand asset unavailable');
  }
};
