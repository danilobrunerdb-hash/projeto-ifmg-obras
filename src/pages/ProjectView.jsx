import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/Dashboard';
import Checklist from '../components/Checklist';
import Flowchart from '../components/Flowchart';
import GanttChart from '../components/GanttChart';
import Manual from '../components/Manual';
import PhotoGallery from '../components/PhotoGallery';
import { Download, ArrowLeft, LayoutDashboard, ListTodo, BarChart, BookOpen, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { initialChecklist } from '../data/initialData';
import { getProjects, saveProjectsToDB } from '../utils/storage';

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, checklist, gantt, manual
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      const projects = await getProjects();
      const found = projects.find(p => p.id === id);
      if (found) {
        // Merge missing stages if necessary
        if (found.stages.length < initialChecklist.length) {
           const merged = initialChecklist.map(baseStage => {
             const existing = found.stages.find(s => s.id === baseStage.id);
             return existing ? existing : baseStage;
           });
           found.stages = merged;
        }
        // Initialize photos array if it doesn't exist
        if (!found.photos) found.photos = [];
        setProject(found);
      } else {
        navigate('/');
      }
    };
    loadProject();
  }, [id, navigate]);

  const saveProject = async (updatedProject) => {
    try {
      const projects = await getProjects();
      const updatedList = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
      await saveProjectsToDB(updatedList);
      setProject(updatedProject);
    } catch (err) {
      console.error("Storage error:", err);
      throw new Error("Local storage quota exceeded");
    }
  };

  const handleUpdateItem = (stageId, itemId, newStatus) => {
    if (!project) return;
    const updatedProject = {
      ...project,
      stages: project.stages.map(stage => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          items: stage.items.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, status: newStatus };
          })
        };
      })
    };
    saveProject(updatedProject);
  };

  const handleAddPhoto = (photoData) => {
    if (!project) return;
    const updatedProject = {
      ...project,
      photos: [photoData, ...(project.photos || [])]
    };
    saveProject(updatedProject);
  };

  const handleDeletePhoto = (photoId) => {
    if (!project) return;
    const updatedProject = {
      ...project,
      photos: (project.photos || []).filter(p => p.id !== photoId)
    };
    saveProject(updatedProject);
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    // Give react time to render the hidden PDF component
    setTimeout(async () => {
      const element = document.getElementById('pdf-report-content');
      if (!element) {
        setIsGeneratingPDF(false);
        return;
      }
      try {
        const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft >= 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save(`relatorio_${project.name.replace(/\s+/g, '_')}.pdf`);
      } catch (error) {
        console.error("Error generating PDF", error);
        alert("Erro ao gerar PDF.");
      } finally {
        setIsGeneratingPDF(false);
      }
    }, 500);
  };

  if (!project) return <div>Carregando...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Header Premium */}
      <header className="app-header" style={{ alignItems: 'center' }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} style={{ background: 'transparent', color: 'var(--text-main)', padding: '0.2rem', paddingRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', fontWeight: 800, textTransform: 'uppercase' }}>{project.name}</h1>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '3rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
            <span>Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="flex gap-4 items-center project-header-actions">
          <button 
            onClick={generatePDF}
            className="btn-primary"
            style={{ background: 'white', color: 'var(--ifmg-green-dark)', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', padding: '0.5rem 1rem' }}
            disabled={isGeneratingPDF}
          >
            <Download size={18} /> {isGeneratingPDF ? 'Gerando...' : 'Exportar Relatório'}
          </button>
        </div>
      </header>
      
      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: '80px', zIndex: 40, boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <nav className="tabs-container" style={{ paddingTop: '0.5rem' }}>
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={18} /> Visão Geral
            </button>
            <button className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => setActiveTab('checklist')}>
              <ListTodo size={18} /> Checklist
            </button>
            <button className={`tab-btn ${activeTab === 'gantt' ? 'active' : ''}`} onClick={() => setActiveTab('gantt')}>
              <BarChart size={18} /> Gráfico de Gantt
            </button>
            <button className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')}>
              <BookOpen size={18} /> Manual
            </button>
            <button className={`tab-btn ${activeTab === 'galeria' ? 'active' : ''}`} onClick={() => setActiveTab('galeria')}>
              <ImageIcon size={18} /> Galeria de Fotos
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, width: '100%', marginTop: '0.5rem', paddingTop: '1rem' }}>
        {activeTab === 'overview' && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
            <Dashboard items={project.stages} />
            <Flowchart stages={project.stages} />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="card">
            <Checklist stages={project.stages} onUpdateItem={handleUpdateItem} onAddPhoto={handleAddPhoto} />
          </div>
        )}

        {activeTab === 'gantt' && (
          <div className="card">
            <GanttChart project={project} saveProject={saveProject} />
          </div>
        )}

        {activeTab === 'galeria' && (
          <div className="card">
            <PhotoGallery
              photos={project.photos || []}
              onAddPhoto={(photoData) => {
                const updatedProject = {
                  ...project,
                  photos: [photoData, ...(project.photos || [])]
                };
                saveProject(updatedProject);
              }}
              onDeletePhoto={(photoId) => {
                const updatedProject = {
                  ...project,
                  photos: (project.photos || []).filter(p => p.id !== photoId)
                };
                saveProject(updatedProject);
              }}
            />
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="card">
            <Manual />
          </div>
        )}
      </main>

      {/* Hidden PDF Report Layout */}
      {isGeneratingPDF && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div id="pdf-report-content" style={{ width: '800px', backgroundColor: 'white', padding: '40px', color: 'black' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '2px solid #008738', paddingBottom: '20px', marginBottom: '30px' }}>
              <img src="/logo-ifmg.png" alt="IFMG" style={{ height: '60px' }} />
              <div>
                <h1 style={{ margin: 0, color: '#005a25' }}>Relatório de Acompanhamento de Obra</h1>
                <h2 style={{ margin: 0, color: '#333' }}>{project.name}</h2>
                <p style={{ margin: '5px 0 0', color: '#666' }}>Período: {new Date(project.startDate).toLocaleDateString('pt-BR')} a {new Date(project.endDate).toLocaleDateString('pt-BR')}</p>
                <p style={{ margin: 0, color: '#666' }}>Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', color: '#005a25' }}>Fluxograma Macro</h3>
            <div style={{ marginBottom: '40px' }}>
              <Flowchart stages={project.stages} />
            </div>

            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', color: '#005a25' }}>Detalhamento das Etapas</h3>
            {project.stages.map(stage => (
              <div key={stage.id} style={{ marginBottom: '20px' }}>
                <h4 style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', margin: '0 0 10px 0' }}>{stage.title}</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <tbody>
                    {stage.items.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', width: '70%' }}>{item.text}</td>
                        <td style={{ padding: '8px', width: '30%', textAlign: 'right' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: 'white',
                            backgroundColor: item.status === 'done' ? '#008738' : item.status === 'progress' ? '#f0a500' : '#d32f2f'
                          }}>
                            {item.status === 'done' ? 'CONCLUÍDO' : item.status === 'progress' ? 'EM ANDAMENTO' : 'NÃO INICIADO'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
