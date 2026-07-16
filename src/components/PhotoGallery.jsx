import React from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';

export default function PhotoGallery({ photos = [], onDeletePhoto }) {
  // Group photos by stageTitle
  const groupedPhotos = photos.reduce((acc, photo) => {
    const groupName = photo.stageTitle || 'Fotos Gerais da Obra';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(photo);
    return acc;
  }, {});

  const groupKeys = Object.keys(groupedPhotos);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--ifmg-green-dark)' }}>Galeria de Fotos</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Acompanhamento visual dividido por etapas (Adicione fotos via Checklist)</p>
        </div>
      </div>

      {photos.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ backgroundColor: '#f8fafc', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ImageIcon size={40} style={{ opacity: 0.3 }} />
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Nenhuma foto adicionada</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Use as câmeras no Checklist para vincular fotos às tarefas da obra.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groupKeys.map(groupName => (
            <div key={groupName}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                color: 'var(--text-main)', 
                marginBottom: '1rem', 
                paddingBottom: '0.5rem', 
                borderBottom: '1px solid var(--border-color)' 
              }}>
                {groupName}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {groupedPhotos[groupName].map(photo => (
                  <div key={photo.id} style={{ 
                    position: 'relative', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                    aspectRatio: '1'
                  }}>
                    <img 
                      src={photo.url} 
                      alt={photo.itemText || "Progresso da obra"} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 0, left: 0, right: 0, 
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {photo.itemText && (
                        <span style={{ color: 'white', fontSize: '0.75rem', lineHeight: '1.2' }}>
                          {photo.itemText}
                        </span>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span style={{ color: '#cbd5e1', fontSize: '0.7rem', fontWeight: 600 }}>
                          {new Date(photo.date).toLocaleDateString('pt-BR')}
                        </span>
                        <button 
                          onClick={() => {
                            if (window.confirm("Deseja apagar esta foto?")) {
                              onDeletePhoto(photo.id);
                            }
                          }}
                          style={{ background: 'rgba(239, 68, 68, 0.9)', padding: '0.4rem', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer' }}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
