import React from 'react';

export default function Manual() {
  return (
    <div style={{ lineHeight: '1.7', color: 'var(--text-main)' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--ifmg-green-dark)', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem' }}>Manual de Instruções</h2>
      
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>1. Visão Geral</h3>
        <p style={{ color: 'var(--text-muted)' }}>O Sistema de Gestão de Obras IFMG foi desenvolvido para acompanhamento físico de projetos de engenharia. Ele permite o cadastro de múltiplas obras, acompanhamento de cronograma via Checklist, visualização de progresso via Gráfico de Pizza, acompanhamento visual por Fluxograma Macro e análise de prazo via Gráfico de Gantt.</p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>2. Painel Inicial e Cadastro</h3>
        <p style={{ color: 'var(--text-muted)' }}>Ao entrar no sistema, você visualizará todas as obras cadastradas. Para iniciar um novo acompanhamento, clique em <strong>"Nova Obra"</strong>. É obrigatório informar o nome da obra, a data de início e a data de término estimadas. Essas datas alimentarão automaticamente o Gráfico de Gantt.</p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>3. Atualização do Checklist</h3>
        <p style={{ color: 'var(--text-muted)' }}>Na aba <strong>Checklist</strong>, expanda as categorias clicando sobre elas. Para cada item da obra, altere o status clicando nos botões correspondentes:</p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>Não Iniciado</strong>: A tarefa ainda não começou.</li>
          <li><strong>Em Andamento</strong>: A tarefa está sendo executada.</li>
          <li><strong>Concluído</strong>: A tarefa foi totalmente finalizada.</li>
        </ul>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>O progresso de cada etapa e do projeto geral é calculado automaticamente à medida que você altera os status.</p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>4. Geração de Relatórios (Memorial PDF)</h3>
        <p style={{ color: 'var(--text-muted)' }}>A qualquer momento, clique no botão <strong>"Exportar Relatório"</strong> no topo da página. O sistema irá compilar todas as informações (incluindo tarefas ocultas no painel) e gerar um documento formal PDF. Isso é ideal para prestação de contas e relatórios periódicos.</p>
      </section>

      <section>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>5. Armazenamento e Segurança</h3>
        <p style={{ color: 'var(--text-muted)' }}>Atualmente, todos os dados e imagens são salvos no armazenamento local do seu navegador (IndexedDB). Certifique-se de não limpar os dados de navegação do site para não perder o acompanhamento das suas obras e o histórico de fotos.</p>
      </section>
    </div>
  );
}
