import React from 'react';
import { Activity, ArrowDown } from 'lucide-react';

export default function Flowchart({ stages }) {

  const getGroupStatus = (stagePrefixes) => {
    const relevantStages = stages.filter(s => stagePrefixes.some(prefix => s.id === prefix || s.id.startsWith(prefix + '.')));
    if (relevantStages.length === 0) return 'not-started';

    let totalItems = 0;
    let doneItems = 0;
    let progressItems = 0;

    relevantStages.forEach(stage => {
      totalItems += stage.items.length;
      doneItems += stage.items.filter(i => i.status === 'done').length;
      progressItems += stage.items.filter(i => i.status === 'progress').length;
    });

    if (totalItems === 0) return 'not-started';
    if (doneItems === totalItems) return 'done';
    if (doneItems > 0 || progressItems > 0) return 'progress';
    return 'not-started';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'var(--status-done)';
      case 'progress': return 'var(--status-progress)';
      default: return 'var(--border-color)';
    }
  };

  const getBgColor = (status) => {
    switch (status) {
      case 'done': return '#e8f5e9';
      case 'progress': return '#fff8e1';
      default: return '#f5f5f5';
    }
  };

  const flowchartNodes = [
    { id: 'start', type: 'rounded', title: 'Início', status: 'done' },

    { id: 'fase1', type: 'rectangle', title: 'Etapa 1: Compatibilização', status: getGroupStatus(['stage-1']) },
    { id: 'decisao1', type: 'diamond', title: 'Etapa 1 OK?', status: getGroupStatus(['stage-1']) },

    { id: 'fase2', type: 'rectangle', title: 'Etapas 2, 3, 4: Início e Fund.', status: getGroupStatus(['stage-2', 'stage-3', 'stage-4']) },

    { id: 'fase3', type: 'rectangle', title: 'Etapa 5: Estrutura', status: getGroupStatus(['stage-5']) },
    { id: 'decisao2', type: 'diamond', title: 'Etapa 5 OK?', status: getGroupStatus(['stage-5']) },

    { id: 'fase4', type: 'rectangle', title: 'Etapa 6: Externo', status: getGroupStatus(['stage-6']) },

    { id: 'fase5', type: 'rectangle', title: 'Etapas 7 e 8: Instalações', status: getGroupStatus(['stage-7', 'stage-8']) },
    { id: 'decisao3', type: 'diamond', title: 'Instal. OK?', status: getGroupStatus(['stage-7', 'stage-8']) },

    { id: 'fase6', type: 'rectangle', title: 'Etapas 9, 10, 11: Acabamento', status: getGroupStatus(['stage-9', 'stage-10', 'stage-11']) },

    { id: 'end', type: 'rounded', title: 'Entrega Final', status: getGroupStatus(['stage-9', 'stage-10', 'stage-11']) === 'done' ? 'done' : 'not-started' },
  ];

  const renderNodes = (nodes) => (
    nodes.map((node, index, arr) => {
      let shapeStyle = {
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        color: node.status === 'done' ? 'var(--status-done)' : (node.status === 'progress' ? '#b07300' : 'var(--text-muted)'),
        fontWeight: 700, fontSize: '0.85rem', padding: '0.5rem', position: 'relative'
      };

      if (node.type === 'rectangle') {
        shapeStyle = { ...shapeStyle, backgroundColor: getBgColor(node.status), border: `2px solid ${getStatusColor(node.status)}`, borderRadius: '8px', minWidth: '180px', minHeight: '45px' };
      } else if (node.type === 'rounded') {
        shapeStyle = { ...shapeStyle, backgroundColor: getBgColor(node.status), border: `2px solid ${getStatusColor(node.status)}`, borderRadius: '9999px', minWidth: '120px', minHeight: '35px' };
      } else if (node.type === 'diamond') {
        shapeStyle = { ...shapeStyle, backgroundColor: getBgColor(node.status), clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', width: '100px', height: '100px', padding: '1rem' };
      }

      return (
        <React.Fragment key={node.id}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {node.type === 'diamond' ? (
              <div style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', backgroundColor: getStatusColor(node.status), width: '104px', height: '104px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ ...shapeStyle, width: '100px', height: '100px', margin: 0 }}>
                  <span style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>{node.title}</span>
                </div>
              </div>
            ) : (
              <div style={shapeStyle}>{node.title}</div>
            )}
          </div>
          {index < arr.length - 1 && (
            <div style={{ color: getStatusColor(node.status), margin: '0' }}><ArrowDown size={20} /></div>
          )}
        </React.Fragment>
      );
    })
  );

  return (
    <div className="card w-full" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ backgroundColor: '#f0f4f8', padding: '0.5rem', borderRadius: '8px', color: 'var(--text-muted)' }}>
          <Activity size={24} />
        </div>
        <h3 style={{ textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.05em', color: 'var(--text-main)', fontWeight: 800 }}>
          Fluxograma Macro das Etapas
        </h3>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4rem',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '1rem',
      }}>

        {/* Coluna Esquerda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          {renderNodes(flowchartNodes.slice(0, 6))}
        </div>

        {/* Coluna Direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          {renderNodes(flowchartNodes.slice(6))}
        </div>

      </div>
    </div>
  );
}
