import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder, LogOut, Calendar, Trash2, Edit2 } from 'lucide-react';
import { initialChecklist } from '../data/initialData';
import { getProjects, saveProjectsToDB } from '../utils/storage';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', startDate: '', endDate: '' });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);

  const saveProjects = async (updatedProjects) => {
    setProjects(updatedProjects);
    await saveProjectsToDB(updatedProjects);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const project = {
      id: Date.now().toString(),
      name: newProject.name,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      stages: initialChecklist
    };
    await saveProjects([...projects, project]);
    setIsModalOpen(false);
    setNewProject({ name: '', startDate: '', endDate: '' });
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente excluir esta obra?")) {
      await saveProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleEdit = (project, e) => {
    e.stopPropagation();
    setEditingProject({ ...project });
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const updated = projects.map(p => p.id === editingProject.id ? editingProject : p);
    saveProjects(updated);
    setIsEditModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header">
        <div className="flex items-center gap-6">
          <div className="logo-box">
            <img src="/logo-ifmg.png" alt="IFMG" style={{ height: '40px' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem' }}>Painel Administrativo</h1>
            <p style={{ fontSize: '0.75rem' }}>Gestão de Múltiplas Obras</p>
          </div>
        </div>
        <button onClick={logout} className="btn-danger" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={16} /> Sair
        </button>
      </header>

      <main className="container" style={{ flex: 1, width: '100%' }}>
        <div className="flex justify-between items-center mb-8">
          <h2 style={{ color: 'var(--ifmg-green-dark)' }}>Minhas Obras</h2>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ backgroundColor: 'var(--ifmg-green-dark)', color: 'white' }}>
            <Plus size={18} /> Nova Obra
          </button>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {projects.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Folder size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p>Nenhuma obra cadastrada no sistema.</p>
            </div>
          ) : (
            projects.map(project => (
              <div 
                key={project.id} 
                className="card" 
                style={{ cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }}
                onClick={() => navigate(`/obra/${project.id}`)}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div className="flex justify-between items-start mb-4">
                  <div style={{ backgroundColor: '#e8f5e9', padding: '0.75rem', borderRadius: '12px', color: 'var(--ifmg-green-dark)' }}>
                    <Folder size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleEdit(project, e)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0.5rem', cursor: 'pointer' }}
                      title="Editar Obra"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(project.id, e)}
                      style={{ background: 'none', border: 'none', color: 'var(--status-not-started)', padding: '0.5rem', cursor: 'pointer', opacity: 0.7 }}
                      title="Excluir Obra"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>{project.name}</h3>
                <div className="flex flex-col gap-2 text-muted" style={{ fontSize: '0.875rem' }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> Início: {project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : 'Não definido'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> Fim: {project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : 'Não definido'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal Nova Obra */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--ifmg-green-dark)' }}>Cadastrar Nova Obra</h3>
            <form onSubmit={handleAddProject} className="flex flex-col gap-4">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Nome da Obra</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Data de Início Prevista</label>
                <input 
                  type="date" 
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Data de Término Prevista</label>
                <input 
                  type="date" 
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-primary" style={{ flex: 1, backgroundColor: '#f1f5f9', color: 'var(--text-main)' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--ifmg-green-dark)', color: 'white' }}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Obra */}
      {isEditModalOpen && editingProject && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--ifmg-green-dark)' }}>Editar Obra</h3>
            <form onSubmit={handleUpdateProject} className="flex flex-col gap-4">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Nome da Obra</label>
                <input 
                  type="text" 
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Data de Início Prevista</label>
                <input 
                  type="date" 
                  value={editingProject.startDate}
                  onChange={(e) => setEditingProject({...editingProject, startDate: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Data de Término Prevista</label>
                <input 
                  type="date" 
                  value={editingProject.endDate}
                  onChange={(e) => setEditingProject({...editingProject, endDate: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingProject(null); }} className="btn-primary" style={{ flex: 1, backgroundColor: '#f1f5f9', color: 'var(--text-main)' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--ifmg-green-dark)', color: 'white' }}>
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
