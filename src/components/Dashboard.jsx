import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const COLORS = {
  done: '#008738',
  progress: '#f0a500',
  notStarted: '#d32f2f'
};

export default function Dashboard({ items }) {
  let done = 0;
  let progress = 0;
  let notStarted = 0;
  
  items.forEach(stage => {
    stage.items.forEach(item => {
      if (item.status === 'done') done++;
      else if (item.status === 'progress') progress++;
      else notStarted++;
    });
  });

  const total = done + progress + notStarted;
  
  const data = [
    { name: 'Concluído', value: done, color: COLORS.done },
    { name: 'Em Andamento', value: progress, color: COLORS.progress },
    { name: 'Não Iniciado', value: notStarted, color: COLORS.notStarted }
  ].filter(item => item.value > 0);

  return (
    <div className="card h-full" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ backgroundColor: '#f0f4f8', padding: '0.5rem', borderRadius: '8px', color: 'var(--text-muted)' }}>
          <CheckCircle size={20} />
        </div>
        <h3 style={{ textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          Visão Geral (Painel)
        </h3>
      </div>
      
      <div className="flex" style={{ flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        
        {/* Pie Chart */}
        <div style={{ width: '320px', height: '320px', display: 'flex', justifyContent: 'center' }}>
          {total === 0 ? (
             <div className="flex items-center justify-center" style={{height: '100%', color: 'var(--text-muted)'}}>Sem dados</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4" style={{ minWidth: '200px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', borderLeft: `6px solid ${COLORS.done}` }}>
            <div style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 600 }}>Concluído</div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: COLORS.done }}>{done}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', borderLeft: `6px solid ${COLORS.progress}` }}>
            <div style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 600 }}>Em Andamento</div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: COLORS.progress }}>{progress}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', borderLeft: `6px solid ${COLORS.notStarted}` }}>
            <div style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 600 }}>Não Iniciado</div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: COLORS.notStarted }}>{notStarted}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
