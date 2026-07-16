export const compressImage = (file, callback) => {
  if (!file) {
    callback(null, 'Nenhum arquivo selecionado');
    return;
  }

  const reader = new FileReader();
  reader.onerror = (e) => {
    callback(null, 'Erro ao ler arquivo');
  };
  
  reader.onload = (event) => {
    const img = new Image();
    img.onerror = () => {
      callback(null, 'Erro ao carregar imagem');
    };
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; // Reduzido drasticamente
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height *= MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width *= MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG with 40% quality (very lightweight)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.4);
        
        callback(dataUrl, null);
      } catch (err) {
        callback(null, 'Erro ao processar imagem no Canvas');
      }
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};
