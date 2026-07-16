import localforage from 'localforage';

export const getProjects = async () => {
  try {
    let projects = await localforage.getItem('ifmg-projects-db');
    
    // Migration: If no data in localforage, check localStorage
    if (!projects) {
      const saved = localStorage.getItem('ifmg-projects-db');
      if (saved) {
        projects = JSON.parse(saved);
        // Migrate to localforage
        await localforage.setItem('ifmg-projects-db', projects);
      } else {
        projects = [];
      }
    }
    return projects || [];
  } catch (error) {
    console.error("Error reading from localforage", error);
    return [];
  }
};

export const saveProjectsToDB = async (projects) => {
  try {
    await localforage.setItem('ifmg-projects-db', projects);
    
    // Cleanup old localStorage if migration was successful to free space
    if (localStorage.getItem('ifmg-projects-db')) {
      localStorage.removeItem('ifmg-projects-db');
    }
  } catch (error) {
    console.error("Error writing to localforage", error);
    throw new Error("IndexedDB storage failed");
  }
};
