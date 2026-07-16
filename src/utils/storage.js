import localforage from 'localforage';

const API_URL = "https://script.google.com/macros/s/AKfycbzo59RLKLBp6h_j1nncrHsajshc_MEKRjIZoPOiGNSsUTaDn38PmZa0D-gY9eQ0nb90/exec";

// Configura o localforage para usar o IndexedDB primariamente
localforage.config({
  name: 'ifmg-projects',
  storeName: 'projects_store'
});

export const getProjects = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro na rede ao buscar projetos");
    }
    const data = await response.json();
    
    // Salva os dados baixados no localforage como backup offline
    if (Array.isArray(data) && data.length > 0) {
      await localforage.setItem('ifmg-projects-db', data);
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro ao ler do Google Sheets API, tentando backup local", error);
    // Tenta pegar do cache local se falhar a internet
    const local = await localforage.getItem('ifmg-projects-db');
    if (local) return local;
    return [];
  }
};

export const saveProjectsToDB = async (projects) => {
  try {
    // Salva localmente primeiro para resposta imediata da interface (cache)
    await localforage.setItem('ifmg-projects-db', projects);
    
    const response = await fetch(API_URL, {
      method: "POST",
      // Enviamos como texto (text/plain) para evitar erros de bloqueio de CORS (Preflight) do navegador
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(projects),
    });
    
    if (!response.ok) {
      throw new Error("Erro na rede ao salvar");
    }
  } catch (error) {
    console.error("Erro ao escrever no Google Sheets API", error);
    // Não lançamos o erro adiante para não quebrar a aplicação. 
    // Os dados já foram salvos no localforage como backup na linha acima.
  }
};

export const getLocalProjects = async () => {
  const local = await localforage.getItem('ifmg-projects-db');
  return local ? local : [];
};
