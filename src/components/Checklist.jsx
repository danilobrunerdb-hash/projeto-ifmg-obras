import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Check, Clock, X, ListTodo, Camera, Upload } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

export default function Checklist({ stages, onUpdateItem, onAddPhoto }) {
  const [openStages, setOpenStages] = useState(
    stages.reduce((acc, stage, index) => {
      acc[stage.id] = index === 0;
      return acc;
    }, {})
  );

  // Inline Photo Upload State
  const [activePhotoStageId, setActivePhotoStageId] = useState(null);
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const fileInputRef = useRef(null);

  const toggleStage = (stageId) => {
    setOpenStages(prev => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const togglePhotoForm = (e, stageId) => {
    e.stopPropagation();
    if (activePhotoStageId === stageId) {
      closePhotoForm();
    } else {
      setActivePhotoStageId(stageId);
      setPhotoDescription('');
      setPhotoFile(null);
      setPhotoPreview(null);
      // Automatically open the stage items when opening the photo form
      setOpenStages(prev => ({ ...prev, [stageId]: true }));
    }
  };

  const closePhotoForm = () => {
    setActivePhotoStageId(null);
    setPhotoDescription('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsCompressing(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => setPhotoPreview(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (stage) => {
    if (!photoFile || !stage) return;
    setIsCompressing(true);

    compressImage(photoFile, (dataUrl, error) => {
      if (error) {
        alert("Erro ao processar a imagem: " + error);
        setIsCompressing(false);
        return;
      }
      
      try {
        onAddPhoto({
          id: Date.now().toString(),
          url: dataUrl,
          date: new Date().toISOString(),
          stageId: stage.id,
          stageTitle: stage.title,
          itemText: photoDescription
        });
        closePhotoForm();
      } catch (e) {
        alert("Erro ao salvar no armazenamento. O limite de espaço pode ter sido atingido.");
        setIsCompressing(false);
      }
    });
  };

  return (
    <div className="card w-full" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ backgroundColor: '#f0f4f8', padding: '0.5rem', borderRadius: '8px', color: 'var(--text-muted)' }}>
          <ListTodo size={24} />
        </div>
        <h3 style={{ textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.05em', color: 'var(--text-main)', fontWeight: 800 }}>
          Listagem de Tarefas
        </h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {stages.map(stage => {
          const isOpen = openStages[stage.id];
          const isPhotoFormOpen = activePhotoStageId === stage.id;
          
          const totalItems = stage.items.length;
          const doneItems = stage.items.filter(item => item.status === 'done').length;
          const progressItems = stage.items.filter(item => item.status === 'progress').length;
          
          const donePct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
          const progPct = totalItems > 0 ? Math.round((progressItems / totalItems) * 100) : 0;
          const notPct = totalItems > 0 ? 100 - donePct - progPct : 0;

          const cardStatus = donePct === 100 ? 'done' : (progPct > 0 || donePct > 0 ? 'progress' : 'not-started');
          const borderColor = cardStatus === 'done' ? 'var(--status-done)' : (cardStatus === 'progress' ? '#b07300' : 'var(--border-color)');

          return (
            <div key={stage.id} style={{ 
              border: '1px solid var(--border-color)', 
              borderLeft: `8px solid ${borderColor}`,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
              backgroundColor: isOpen ? '#f0f4f8' : 'white',
              marginBottom: '1rem',
              transition: 'all 0.2s ease'
            }}>
              {/* Stage Header */}
              <div 
                className="flex justify-between items-center stage-header-row" 
                style={{ padding: '1rem 1.5rem', cursor: 'pointer', backgroundColor: isOpen ? 'transparent' : 'white' }}
                onClick={() => toggleStage(stage.id)}
              >
                <div className="flex items-center gap-4">
                  <div style={{ 
                    width: '50px', height: '50px', 
                    borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'var(--text-main)',
                    background: `conic-gradient(var(--status-done) 0% ${donePct}%, var(--status-progress) ${donePct}% ${donePct + progPct}%, var(--status-not-started) ${donePct + progPct}% 100%)`
                  }}>
                    <div style={{ backgroundColor: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                      {donePct}%
                    </div>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-main)' }}>{stage.title}</h3>
                    <div className="stage-header-stats" style={{ marginTop: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{color: 'var(--status-done)'}}>Concluído: {donePct}%</span>
                      <span style={{color: '#b07300'}}>Andamento: {progPct}%</span>
                      <span style={{color: 'var(--status-not-started)'}}>Não iniciado: {notPct}%</span>
                    </div>
                  </div>
                </div>
                <div className="stage-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    onClick={(e) => togglePhotoForm(e, stage.id)}
                    style={{ 
                      background: isPhotoFormOpen ? 'var(--ifmg-green-dark)' : 'white', 
                      border: '1px solid var(--border-color)', borderRadius: '8px',
                      padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      color: isPhotoFormOpen ? 'white' : 'var(--ifmg-green-dark)', 
                      fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease'
                    }}
                    title="Adicionar foto para esta etapa"
                  >
                    <Camera size={16} /> Foto
                  </button>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Inline Photo Form */}
              {isPhotoFormOpen && (
                <div style={{ 
                  padding: '1.5rem', 
                  backgroundColor: '#ffffff', 
                  borderTop: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)'
                }}>
                  <h4 style={{ color: 'var(--ifmg-green-dark)', marginBottom: '1rem', fontSize: '1rem' }}>Anexar Foto à Etapa</h4>
                  <div className="flex flex-col gap-4">
                    <div 
                      style={{ 
                        border: '2px dashed var(--border-color)', borderRadius: '12px', 
                        padding: photoPreview ? '0' : '2rem', textAlign: 'center', cursor: 'pointer',
                        overflow: 'hidden', position: 'relative', minHeight: '150px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#f8fafc'
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ color: 'var(--text-muted)' }}>
                          <Upload size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                          <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Clique para selecionar a foto</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>Descrição (Opcional)</label>
                      <textarea 
                        value={photoDescription}
                        onChange={(e) => setPhotoDescription(e.target.value)}
                        placeholder="Ex: Concretagem das sapatas finalizada..."
                        style={{ 
                          width: '100%', padding: '0.75rem', borderRadius: '8px', 
                          border: '1px solid var(--border-color)', outline: 'none',
                          resize: 'vertical', minHeight: '80px', fontFamily: 'inherit',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button type="button" onClick={closePhotoForm} className="btn-primary" style={{ flex: 1, backgroundColor: '#f1f5f9', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleSavePhoto(stage)} 
                        disabled={!photoFile || isCompressing} 
                        className="btn-primary" 
                        style={{ flex: 1 }}
                      >
                        {isCompressing ? 'Salvando...' : 'Salvar Foto'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Items List */}
              {isOpen && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                  {stage.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-3 checklist-item-row" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 500, flex: 1 }}>
                        {item.text}
                      </span>
                      
                      <div className="checklist-item-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => onUpdateItem(stage.id, item.id, 'done')}
                          style={{ 
                            background: item.status === 'done' ? 'var(--status-done)' : 'transparent',
                            color: item.status === 'done' ? 'white' : 'var(--text-muted)',
                            border: `1px solid ${item.status === 'done' ? 'var(--status-done)' : 'var(--border-color)'}`,
                            padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          <Check size={14} /> Concluído
                        </button>
                        <button 
                          onClick={() => onUpdateItem(stage.id, item.id, 'progress')}
                          style={{ 
                            background: item.status === 'progress' ? '#b07300' : 'transparent',
                            color: item.status === 'progress' ? 'white' : 'var(--text-muted)',
                            border: `1px solid ${item.status === 'progress' ? '#b07300' : 'var(--border-color)'}`,
                            padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          <Clock size={14} /> Em Andamento
                        </button>
                        <button 
                          onClick={() => onUpdateItem(stage.id, item.id, 'not-started')}
                          style={{ 
                            background: item.status === 'not-started' ? 'var(--status-not-started)' : 'transparent',
                            color: item.status === 'not-started' ? 'white' : 'var(--text-muted)',
                            border: `1px solid ${item.status === 'not-started' ? 'var(--status-not-started)' : 'var(--border-color)'}`,
                            padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          <X size={14} /> Não Iniciado
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
