import localforage from 'localforage';

const API_URL = "https://script.google.com/macros/s/AKfycbzo59RLKLBp6h_j1nncrHsajshc_MEKRjIZoPOiGNSsUTaDn38PmZa0D-gY9eQ0nb90/exec";

// Configura o localforage para usar o IndexedDB primariamente
localforage.config({
  name: 'ifmg-projects',
  storeName: 'projects_store'
});

let projectsCache = null;
let saveQueue = Promise.resolve();

export const getProjects = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro na rede ao buscar projetos");
    }
    const data = await response.json();
    
    // Salva os dados baixados no localforage como backup offline
    if (Array.isArray(data) && data.length > 0) {
      projectsCache = data;
      await localforage.setItem('ifmg-projects-db', data);
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro ao ler do Google Sheets API, tentando backup local", error);
    return await getLocalProjects();
  }
};

export const saveProjectsToDB = async (projects) => {
  // Enfileira as operações de escrita para evitar perda de dados por concorrência
  saveQueue = saveQueue.then(async () => {
    try {
      // Atualiza o cache em memória instantaneamente
      projectsCache = projects;
      // Salva localmente primeiro para resposta imediata da interface (cache)
      await localforage.setItem('ifmg-projects-db', projects);
      
      const response = await fetch(API_URL, {
        method: "POST",
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
      // Os dados já foram salvos no localforage como backup na linha acima.
    }
  });
  return saveQueue;
};

export const getLocalProjects = async () => {
  if (projectsCache) return projectsCache;
  const local = await localforage.getItem('ifmg-projects-db');
  projectsCache = local ? local : [];
  return projectsCache;
};
