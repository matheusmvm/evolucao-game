# Upaon-Açu V11 — Grand Strategy Histórico

V11 preserva as correções e sistemas da V8.1 e amplia o jogo com uma camada histórica e geopolítica causal.

## Novidades
- 5 Pontos de Ação por ano preservados.
- Mapa/Atlas com novas regiões interativas e camadas estratégicas.
- Povos e tradições culturais preservados e usados para bônus de pesquisa.
- Árvore tecnológica causal com ano mínimo, pré-requisitos, custos de pesquisa e desbloqueios.
- Pesquisa tecnológica realmente executável com AP + Pontos de Pesquisa.
- Projetos dependentes de tecnologia: navios, geradores, aeronaves e computadores.
- Instituições: Conselho de Estado, Academia de Ciências, Corporações de Ofício, Casa de Navegação, Banco Público, Estado-Maior e Serviço de Comunicações.
- Diplomacia com índice relacional derivado de atitude, confiança, comércio, influência e tensão.
- Rotas comerciais persistentes com nível, capacidade, lucro, produto e risco.
- Rotas interrompidas por guerra e sujeitas a eventos logísticos.
- Migração de saves V8.1 para V11.
- Identidade visual vintage/indie de tabuleiro preservada e refinada.
- Responsividade para notebook, tablet e celular.

## Publicação
Envie `index.html`, `style.css` e `script.js` para um repositório público com GitHub Pages. Não há backend nem dependências externas.


## V11 — Atlas cartográfico e economia interna

A V11 adiciona um mapa de fundo ilustrado em pixel-art vintage, com contornos continentais mais próximos da geografia, zoom preservado e camadas interativas sobre o mapa.

A economia passou a simular produção, consumo, estoques, manutenção, preços relativos, escassez/excedente e fluxo anual do tesouro a partir da força de trabalho e da capacidade produtiva. Saves V10/V9/V8.1 podem ser carregados e recebem os novos campos automaticamente.

A árvore tecnológica ganhou uma camada ancestral/neolítica com tecnologias como domínio do fogo, ferramentas de pedra, pesca, fibras, canoas, manejo de plantas, domesticação, aldeias sedentárias, cerâmica, tecelagem, irrigação e metalurgias iniciais. As datas são tratadas como aproximações históricas e as trajetórias podem variar por região e povo.


## V11 — auditoria e melhorias
- Migração automática de saves V10/V9/V8.1.
- Normalização da força de trabalho para manter 100% de alocação e evitar deriva anual.
- Guerras agora podem continuar após uma ofensiva repelida e entram em trégua após vitória; evita guerras permanentemente travadas e ataques repetidos imediatos.
- Diplomacia registra tratados e mostra estados de comércio, ciência, não agressão, guerra e trégua.
- Rotas comerciais passam a reagir dinamicamente a confiança, comércio, tensão e economia; uma rota não pode ser duplicada.
- A ação de rota do mapa usa o mesmo sistema da aba Diplomacia, evitando dois sistemas conflitantes.
- Árvore ancestral recebeu Orientação celeste e ambiental para não exigir astronomia matemática formal antes da navegação.
- Validação de sintaxe JavaScript executada com `node --check script.js`.
