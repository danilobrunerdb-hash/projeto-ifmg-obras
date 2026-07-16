import React from 'react';

export default function Manual() {
  return (
    <div style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--ifmg-green-dark)' }}>Manual de Instruções</h2>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--ifmg-green)' }}>1. Visão Geral</h3>
        <p>O Sistema de Gestão de Obras IFMG foi desenvolvido para acompanhamento físico de projetos de engenharia. Ele permite o cadastro de múltiplas obras, acompanhamento de cronograma via Checklist, visualização de progresso via Gráfico de Pizza, acompanhamento visual por Fluxograma Macro e análise de prazo via Gráfico de Gantt.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--ifmg-green)' }}>2. Painel Inicial e Cadastro</h3>
        <p>Ao entrar no sistema, você visualizará todas as obras cadastradas. Para iniciar um novo acompanhamento, clique em <strong>"Nova Obra"</strong>. É obrigatório informar o nome da obra, a data de início e a data de término estimadas. Essas datas alimentarão automaticamente o Gráfico de Gantt.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--ifmg-green)' }}>3. Atualização do Checklist</h3>
        <p>Na aba <strong>Checklist</strong>, expanda as categorias clicando sobre elas. Para cada item da obra, altere o status clicando nos botões:</p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li><span style={{ color: 'var(--status-not-started)', fontWeight: 600 }}>X (Não Iniciado)</span>: A tarefa ainda não começou.</li>
          <li><span style={{ color: 'var(--status-progress)', fontWeight: 600 }}>Relógio (Em Andamento)</span>: A tarefa está sendo executada.</li>
          <li><span style={{ color: 'var(--status-done)', fontWeight: 600 }}>Check (Concluído)</span>: A tarefa foi finalizada.</li>
        </ul>
        <p style={{ marginTop: '0.5rem' }}>O progresso de cada etapa e do projeto geral é calculado automaticamente à medida que você altera os status.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--ifmg-green)' }}>4. Geração de Relatórios (Memorial PDF)</h3>
        <p>A qualquer momento, clique no botão <strong>"Memorial PDF"</strong> no topo da página. O sistema irá compilar todas as informações (incluindo tarefas ocultas no painel) e gerar um documento formal PDF. Isso é ideal para prestação de contas e relatórios periódicos.</p>
      </section>

      <section>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--ifmg-green)' }}>5. Segurança dos Dados</h3>
        <p>Atualmente, todos os dados são salvos no armazenamento local do seu navegador (Local Storage). Certifique-se de não limpar o cache/dados do site no navegador para não perder o acompanhamento das suas obras.</p>
      </section>
    </div>
  );
}
