# Moinho — Growth Engine

Plataforma Inteligente de Localização e Ativação Comercial de Empresas da região de Juiz de Fora (MG).

Projeto acadêmico (FIAP) construído conforme o PRD v1.0. **Frontend only**: todos os dados são mockados em JSON — não há backend.

## Stack

- **Vite + React 19 + TypeScript**
- **TailwindCSS** (com modo escuro por classe)
- **React Router** (SPA)
- **Leaflet / react-leaflet** (mapas com OpenStreetMap)
- **Zustand** (estado global: dados, autenticação e tema)
- **date-fns** e **lucide-react**

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
```

## Credenciais de demonstração (login simulado)

| Perfil   | Email                  | Senha    | Acesso                 |
| -------- | ---------------------- | -------- | ---------------------- |
| Vendedor | carlos@moinho.com.br   | senha123 | /dashboard             |
| Vendedor | marina@moinho.com.br   | senha123 | /dashboard             |
| Gerente  | roberto@moinho.com.br  | senha123 | /dashboard e /metricas |

## Funcionalidades

**Portal público** (sem login):
- `/` — home com busca, estatísticas do ecossistema e próximos eventos
- `/empresas` — cards de empresas com filtros de cidade, setor e busca
- `/empresas/:id` — perfil público com mapa, contatos, conectar/agendar reunião
- `/mapa` — mapa interativo com filtro por setor e cores por setor
- `/eventos` — eventos e bootcamps com inscrição (validação + LGPD)

**Área interna** (autenticada):
- `/dashboard` — inteligência comercial: filtros dinâmicos (cidade, setor, porte,
  crescimento CAGED, busca com debounce), mapa com popups de ação, tabela com
  ordenação/paginação/seleção em massa/exportação CSV e painel de detalhes com
  histórico de interações e ações (email, demonstração, nota, visita, contrato)
- `/metricas` — KPIs, funil de conversão, performance por vendedor, ocupação (somente GERENTE)

Extras: modo escuro persistido em localStorage, layout responsivo, lazy loading das páginas com mapa.

## Dados

`src/data/mock_data.json` contém **199 empresas reais da região** (CNPJ, endereço,
coordenadas, CNAE, contatos), extraídas do dataset bruto `regiao juiz de fora.csv`
(6.160 registros) pelo script:

```bash
python3 scripts/generate_mock_data.py "../regiao juiz de fora.csv"
```

O script filtra empresas ativas com coordenadas válidas, equilibra a distribuição
por setor/cidade/porte, limpa nomes mascarados, padroniza datas e **simula** os
campos de inteligência (crescimento CAGED, score de conversão e interações).

## Deploy (Netlify)

O `netlify.toml` já define build (`npm run build`), diretório de publicação (`dist`)
e o redirect de SPA. Basta conectar o repositório no painel da Netlify — cada push
na branch principal dispara o deploy.
