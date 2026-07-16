import React, { useEffect, useState } from 'react';
import { differenceInDays, addDays, format, parseISO } from 'date-fns';

export default function GanttChart({ project, saveProject }) {
  const [editingPhases, setEditingPhases] = useState(null);

  const defaultPhases = [
    { id: 'm1', name: '1. Compatibilização', stages: ['stage-1'], weight: 0.1 },
    { id: 'm2', name: '2. Início e Fundação', stages: ['stage-2', 'stage-3', 'stage-4'], weight: 0.2 },
    { id: 'm3', name: '3. Estrutura', stages: ['stage-5'], weight: 0.3 },
    { id: 'm4', name: '4. Externo', stages: ['stage-6'], weight: 0.15 },
    { id: 'm5', name: '5. Instalações', stages: ['stage-7', 'stage-8'], weight: 0.15 },
    { id: 'm6', name: '6. Acabamento', stages: ['stage-9', 'stage-10', 'stage-11'], weight: 0.1 },
  ];

  useEffect(() => {
    // If macroPhases don't exist, calculate default ones based on project dates and save them.
    if (!project.macroPhases && project.startDate && project.endDate) {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      const totalDays = differenceInDays(end, start);
      
      if (totalDays > 0) {
        let currentDay = 0;
        const newPhases = defaultPhases.map(phase => {
          const phaseDays = Math.max(1, Math.floor(totalDays * phase.weight));
          const phaseStart = addDays(start, currentDay);
          const phaseEnd = addDays(start, currentDay + phaseDays);
          currentDay += phaseDays;
          
          return {
            ...phase,
            startDate: format(phaseStart, 'yyyy-MM-dd'),
            endDate: format(phaseEnd, 'yyyy-MM-dd')
          };
        });
        
        saveProject({ ...project, macroPhases: newPhases });
      }
    }
  }, [project, saveProject]);

  // Sync state for editing
  useEffect(() => {
    if (project.macroPhases) {
      setEditingPhases(JSON.parse(JSON.stringify(project.macroPhases)));
    }
  }, [project.macroPhases]);

  const handleDateChange = (id, field, value) => {
    setEditingPhases(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleSaveDates = () => {
    saveProject({ ...project, macroPhases: editingPhases });
    alert("Datas salvas com sucesso!");
  };

  if (!project.startDate || !project.endDate) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        <p>Defina a data de início e término na tela inicial (Painel) para visualizar o Gráfico de Gantt.</p>
      </div>
    );
  }

  if (!project.macroPhases || !editingPhases) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Calculando datas...</div>;
  }

  const projectStart = new Date(project.startDate);
  const projectEnd = new Date(project.endDate);
  const totalProjectDays = differenceInDays(projectEnd, projectStart) || 1;

  return (
    <div style={{ overflowX: 'auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Cronograma Editável</h3>
        <button onClick={handleSaveDates} className="btn-primary" style={{ backgroundColor: 'var(--ifmg-green-dark)', color: 'white', padding: '0.5rem 1rem' }}>
          Salvar Datas
        </button>
      </div>

      <div style={{ marginBottom: '2rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Fase Macro</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Início Estimado</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Fim Estimado</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Progresso Real</th>
            </tr>
          </thead>
          <tbody>
            {editingPhases.map((phase) => {
              const relevantStages = project.stages.filter(s => phase.stages.some(prefix => s.id === prefix || s.id.startsWith(prefix + '.')));
              let doneItems = 0;
              let totalItems = 0;
              relevantStages.forEach(stage => {
                totalItems += stage.items.length;
                doneItems += stage.items.filter(i => i.status === 'done').length;
              });
              const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;

              return (
                <tr key={phase.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{phase.name}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="date" 
                      value={phase.startDate} 
                      onChange={(e) => handleDateChange(phase.id, 'startDate', e.target.value)}
                      style={{ padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="date" 
                      value={phase.endDate} 
                      onChange={(e) => handleDateChange(phase.id, 'endDate', e.target.value)}
                      style={{ padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', color: progress === 100 ? 'var(--status-done)' : 'inherit' }}>
                    {progress.toFixed(0)}% concluída
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', marginTop: '2rem' }}>Gráfico de Gantt</h3>
      <div style={{ minWidth: '800px' }}>
        {/* Header timeline */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <div style={{ width: '250px', flexShrink: 0 }}>Etapa</div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
            <span>{format(projectStart, 'dd/MM/yy')}</span>
            <span>{format(projectEnd, 'dd/MM/yy')}</span>
          </div>
        </div>

        {/* Rows */}
        {project.macroPhases.map((phase) => {
          
          const relevantStages = project.stages.filter(s => phase.stages.some(prefix => s.id === prefix || s.id.startsWith(prefix + '.')));
          let doneItems = 0;
          let totalItems = 0;
          relevantStages.forEach(stage => {
            totalItems += stage.items.length;
            doneItems += stage.items.filter(i => i.status === 'done').length;
          });
          const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;

          const pStart = parseISO(phase.startDate);
          const pEnd = parseISO(phase.endDate);
          const phaseDays = differenceInDays(pEnd, pStart) || 1;
          const daysFromProjectStart = differenceInDays(pStart, projectStart);

          // Calculate CSS % for positioning
          const leftPercent = (daysFromProjectStart / totalProjectDays) * 100;
          const widthPercent = (phaseDays / totalProjectDays) * 100;

          return (
            <div key={phase.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '250px', flexShrink: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {phase.name}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  {format(pStart, 'dd/MM')} - {format(pEnd, 'dd/MM')} ({progress.toFixed(0)}%)
                </div>
              </div>
              
              <div style={{ flex: 1, position: 'relative', height: '24px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: `${Math.max(0, leftPercent)}%`, 
                  width: `${Math.min(100, widthPercent)}%`, 
                  height: '100%', 
                  backgroundColor: 'rgba(0, 135, 56, 0.2)', 
                  borderRadius: '4px',
                  border: '1px solid var(--ifmg-green)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: 'var(--ifmg-green)',
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
