module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });

  const raw = String(req.query?.cnpj || '');
  const cnpj = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
    return res.status(400).json({ error: 'Informe um CNPJ válido com 14 caracteres.' });
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Fenix-BPO-Propostas/1.0 (+https://fenixbpo.com.br)'
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.message || (response.status === 404 ? 'CNPJ não encontrado.' : 'Não foi possível consultar o CNPJ.');
      return res.status(response.status === 404 ? 404 : 502).json({ error: message });
    }

    const endereco = [data.descricao_tipo_de_logradouro, data.logradouro, data.numero]
      .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

    return res.status(200).json({
      cnpj: data.cnpj || cnpj,
      razao_social: data.razao_social || '',
      nome_fantasia: data.nome_fantasia || '',
      situacao_cadastral: data.descricao_situacao_cadastral || '',
      cnae_principal: data.cnae_fiscal ? String(data.cnae_fiscal) : '',
      atividade_principal: data.cnae_fiscal_descricao || '',
      endereco,
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.municipio || '',
      uf: data.uf || '',
      cep: data.cep ? String(data.cep) : ''
    });
  } catch (err) {
    console.error('CNPJ lookup error:', err);
    return res.status(502).json({ error: 'Consulta de CNPJ indisponível no momento. Tente novamente.' });
  }
};
