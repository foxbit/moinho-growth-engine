# Moinho Growth Engine

**Plataforma inteligente de inteligência comercial para prospecção e ativação de empresas.**

Uma solução SPA (Single Page Application) desenvolvida com React 19, TypeScript e Vite, com design premium inspirado no sistema Red Broadcast. O Moinho conecta o ecossistema de inovação de Juiz de Fora com empresas locais, facilitando prospecção, relacionamento e conversão comercial.

**Repositório**: [github.com/foxbit/moinho-growth-engine](https://github.com/foxbit/moinho-growth-engine)

---

## 🚀 Visão Geral

### Públicos
- **Visitantes**: Exploram empresas cadastradas em dashboard operacional unificado com filtros dinâmicos, mapa interativo
- **Vendedores/Gerentes**: CRM interno com registro de interações, filtros avançados, tabela de prospecção, CSV export
- **Gerentes+**: Relatórios analíticos (funil de vendas, performance por vendedor, ocupação)

### Dados
- **199 empresas** estratificadas por setor, tamanho, cidade
- **6 cidades** de cobertura regional
- **Múltiplos setores** econômicos com crescimento CAGED simulado
- **Registro de interações**: emails, demonstrações, visitas, contratos

---

## 🎨 Design System: Red Broadcast

Redesenho premium com tokens e componentes inspirados em **Red Broadcast** (estética moderna, flat):

### Paleta
- **Primary**: `#FF0000` (Vermelho vivo) — CTAs, badges ativas
- **Secondary**: `#065FD4` (Azul) — Links, texto secundário  
- **Backgrounds**: Branco (#FFFFFF) light mode, near-black (#0F0F0F) dark
- **Shadows**: 4-nível elevation system (flat → Level 3: modals)

### Tipografia
- **Font**: Roboto (Google Fonts)
- **Scale**: 12px–32px com base 8px
- **Weights**: 300–700

### Componentes
- **Buttons**: Pill-shaped (border-radius: 9999px)
- **Cards**: Flat, sem borders, shadow sutil
- **FilterBar**: Chip-based horizontal scroll pattern
- **Drawers**: Side panel com slide-up animation
- **Inputs**: Background tertiary, ring focus vermelho

### Dark Mode
- Automático via `@media (prefers-color-scheme)` ou toggle manual
- Shadows border-based em dark (Red Broadcast pattern)
- Persistido em localStorage (`moinho-theme`)

---

## 📄 Rotas & Funcionalidades

### Público (sem login)
| Rota | Nome | Descrição |
|------|------|-----------|
| `/` | Dashboard Operacional | **NOVO**: Página unificada com mapa + filtros dinâmicos + lista de empresas + side drawer para detalhe |
| `/login` | Login | Autenticação simples (frontend) |

### CRM Interno (autenticado)
| Rota | Papel | Descrição |
|------|-------|-----------|
| `/dashboard` | VENDEDOR+ | Inteligência comercial: mapa, tabela sortável/paginada, filtros (cidade/setor/porte/crescimento), CSV export, painel de interações (email/demo/nota/visita/contrato) |
| `/metricas` | GERENTE+ | KPIs, funil de conversão, performance por vendedor, ocupação do Moinho |

---

## 🎬 Dashboard Operacional (`/`) — NOVO

Página unificada que consolida busca, exploração e mapa:

### Layout Responsivo
- **Desktop** (>1024px): Grid 3-col (mapa 1, lista 2)
- **Tablet** (640–1024px): 2-col (mapa 50%, lista 50%)
- **Mobile** (<640px): Stack (mapa acima, lista abaixo)

### Componentes
1. **Header Stats**: 199 empresas | 6 cidades | N setores
2. **FilterBar** (chip-based):
   - Busca em tempo real (300ms debounce)
   - Chips "Todas"/"Todos" + cada opção
   - Botão "Limpar filtros"
3. **Mapa**: Leaflet com CircleMarkers coloridos por setor
4. **Company List**: Cards clicáveis com score, porte, crescimento
5. **CompanyDrawer**: Side panel (desktop) / full-width (mobile)
   - Info geral + contatos
   - Mini-mapa
   - Lead-gen form (Conectar / Agendar)

### Filtros em Tempo Real
- Busca: razão social, fantasia, bairro, CNPJ
- Cidades/Setores: múltipla seleção (OR logic)
- Atualiza map + lista instantaneamente
- Resultados ordenados por score (descending)

---

## 🛠️ CRM Dashboard (`/dashboard`) — Protegido

Interface completa para prospecção:

### Filtros Avançados
- Busca (CNPJ, razão social, bairro)
- Cidade (dropdown)
- Setores, Portes, Crescimento CAGED (checkboxes)
- Botão limpar

### Visualizações
- **Mapa** (380px) com legenda
- **Tabela** sortável:
  - Colunas: Razão Social | Cidade | Setor | Porte | Crescimento | Score
  - Paginação (10 por página)
  - Seleção de linhas + CSV export

### CRM Actions (CompanyDetail panel)
1. **Enviar Email**: Template pré-preenchido
2. **Agendar Demonstração**: Date/time picker
3. **Adicionar Nota**: Observação livre
4. **Registrar Visita**: Descrição presencial
5. **Fechar Contrato**: Conversão (funil)

Cada ação → registro de interação (timestamp, usuário, tipo)

---

## 📈 Métricas (`/metricas`) — Protegido GERENTE+

### KPIs
- Leads Qualificados, Demos Agendadas, Visitas, Contratos
- Trend MoM (%)

### Relatórios
- Funil de Conversão (%, drop-off)
- Performance por Vendedor (abordados, demos, contratos)
- Ocupação Moinho (gauge vs meta)
- Receita, Ciclo de Vendas, Taxas de Conversão

---

## 🔐 Autenticação

**Frontend-only** (localStorage persist):

| Email | Senha | Papel | Acesso |
|-------|-------|-------|--------|
| `carlos@moinho.com.br` | `senha123` | VENDEDOR | `/dashboard` |
| `marina@moinho.com.br` | `senha123` | VENDEDOR | `/dashboard` |
| `roberto@moinho.com.br` | `senha123` | GERENTE | `/dashboard`, `/metricas` |

Session persisted em `localStorage` (key: `moinho-auth`)

---

## 🔧 Stack Técnico

```
Frontend:
  - React 19.2 + TypeScript 6
  - Vite 8 (dev, build, HMR)
  - TailwindCSS 3.4
  - Zustand 5 (state: companies, auth, theme)
  - react-router-dom 7 (SPA routing)
  - react-leaflet 5 + Leaflet 1.9 (maps)
  - lucide-react 1.24 (icons)
  - date-fns 4.4 (formatting, pt-BR)

Build:
  - PostCSS + Autoprefixer
  - Oxlint (linting)
```

---

## 📁 Estrutura do Projeto

```
src/
├── pages/
│   ├── OperationalDashboard.tsx    # Dashboard público unificado [NOVO]
│   ├── Dashboard.tsx               # CRM interno
│   ├── Metricas.tsx                # Analytics
│   └── Login.tsx                   # Auth
├── components/
│   ├── FilterBar.tsx               # Chip filters [NOVO]
│   ├── CompanyDrawer.tsx           # Detail side panel [NOVO]
│   ├── Button.tsx                  # Red pill buttons
│   ├── Card.tsx                    # Flat cards
│   ├── Badge.tsx                   # Semantic badges
│   ├── Input.tsx, Select.tsx, ...  # Form controls
│   ├── MapView.tsx, MapLegend.tsx  # Map components
│   ├── CompanyTable.tsx            # CRM table
│   ├── CompanyDetail.tsx           # CRM detail panel
│   └── ...
├── hooks/
│   ├── useDebounce.ts              # 300ms debounce
│   └── useFilter.ts                # Filter state
├── store/
│   ├── useAppStore.ts              # Companies, events, metrics
│   ├── useAuthStore.ts             # Auth + persist
│   └── useThemeStore.ts            # Dark/light mode
├── utils/
│   ├── format.ts                   # CNPJ, date, currency
│   ├── colors.ts                   # Setor/porte/growth color maps
│   └── csv.ts                      # CSV export
├── data/
│   └── mock_data.json              # 199 companies (gerado)
├── App.tsx                         # Router
├── index.css                       # Design tokens + animations
└── main.tsx                        # Entry
```

---

## 🚀 Setup & Rodagem

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
# http://localhost:5173 (ou próxima porta)
# HMR automático em mudanças
```

### Build Produção
```bash
npm run build
# Output: dist/
```

### Preview Produção
```bash
npm run preview
# Simula build local
```

---

## 🎨 Customização

### Cores (Red Broadcast → Custom)
Edite `src/index.css` (`:root` tokens):
```css
--color-primary: #FF0000;        /* Red accent */
--color-secondary: #065FD4;      /* Blue */
--color-bg-primary: #FFFFFF;     /* Light bg */
/* ... */
```

### Tipografia
Em `tailwind.config.js`:
```js
fontFamily: {
  sans: ['Roboto', 'system-ui', 'sans-serif'],
}
```

### Dark Mode
Toggle no header (moon/sun) ↔ classe `dark` + `data-theme` attribute em `<html>`

---

## 📊 Dados

`src/data/mock_data.json`: **199 empresas reais** (extraídas de 6.160 registros)

Geração:
```bash
python3 scripts/generate_mock_data.py "../regiao juiz de fora.csv"
```

Script:
- Filtra ativas, válidas geograficamente
- Stratifica por setor, balanceia por cidade
- Simula CAGED growth, scores de conversão
- Limpa nomes, padroniza datas

---

## ✅ Checklist de Funcionalidades

- [x] Dashboard operacional unificado (mapa + filtros + lista)
- [x] Filtros dinâmicos em tempo real
- [x] Side drawer detalhe empresa + lead-gen
- [x] CRM com tabela sortável/paginada
- [x] Registro de interações (5 tipos)
- [x] CSV export
- [x] Relatório de métricas
- [x] Auth frontend
- [x] Role-based access
- [x] Dark mode
- [x] Design premium (Red Broadcast)
- [x] Responsivo
- [x] TypeScript
- [x] Lazy code-splitting

---

## 🌐 Deploy

Com `netlify.toml` configurado. Conecte repo → auto-deploy a cada push.

---

## 📝 Licença

MIT

---

## 👤 Autor

Angelo Rosa — Projeto FIAP: Moinho Growth Engine

**GitHub**: [foxbit/moinho-growth-engine](https://github.com/foxbit/moinho-growth-engine)
