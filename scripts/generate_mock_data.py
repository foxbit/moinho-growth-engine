#!/usr/bin/env python3
"""
Gera src/data/mock_data.json a partir do CSV bruto "regiao juiz de fora.csv".

Seleciona ~200 empresas com coordenadas válidas, distribuição equilibrada de
setores/cidades/portes, limpa nomes mascarados, padroniza datas e simula
crescimento CAGED, score de conversão e histórico de interações.

Uso:
    python3 scripts/generate_mock_data.py "../regiao juiz de fora.csv"
"""
import csv
import json
import random
import re
import sys
import unicodedata
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

CSV_PATH = Path(sys.argv[1] if len(sys.argv) > 1 else "../regiao juiz de fora.csv")
OUT_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "mock_data.json"

TARGET_TOTAL = 200
REF_DATE = datetime(2026, 7, 15)

# Limites geográficos aproximados da Zona da Mata / Campo das Vertentes (MG)
LAT_MIN, LAT_MAX = -22.3, -20.4
LNG_MIN, LNG_MAX = -44.6, -41.9

SETOR_CORES = {
    "INFORMAÇÃO E COMUNICAÇÃO": "#3B82F6",
    "ATIVIDADES PROFISSIONAIS, CIENTÍFICAS E TÉCNICAS": "#10B981",
    "EDUCAÇÃO": "#F59E0B",
    "ATIVIDADES FINANCEIRAS, DE SEGUROS E SERVIÇOS RELACIONADOS": "#EF4444",
    "ATIVIDADES ADMINISTRATIVAS E SERVIÇOS COMPLEMENTARES": "#8B5CF6",
}

# Cotas por setor (soma = TARGET_TOTAL). Educação domina o CSV; equilibramos.
SETOR_COTAS = {
    "INFORMAÇÃO E COMUNICAÇÃO": 60,
    "ATIVIDADES PROFISSIONAIS, CIENTÍFICAS E TÉCNICAS": 60,
    "EDUCAÇÃO": 55,
    "ATIVIDADES FINANCEIRAS, DE SEGUROS E SERVIÇOS RELACIONADOS": 24,
    "ATIVIDADES ADMINISTRATIVAS E SERVIÇOS COMPLEMENTARES": 1,
}

PORTE_MAP = {"MEI": "MICRO", "MICRO": "MICRO", "PEQUENA": "PEQUENA", "MEDIA": "MÉDIA", "GRANDE": "GRANDE"}

CIDADE_NOMES = {
    "JUIZ DE FORA": "Juiz de Fora",
    "VICOSA": "Viçosa",
    "MURIAE": "Muriaé",
    "BARBACENA": "Barbacena",
    "SAO JOAO DEL REI": "São João del Rei",
    "UBA": "Ubá",
}

USUARIOS = [
    {"id": "USR001", "nome": "Carlos Silva", "email": "carlos@moinho.com.br", "role": "VENDEDOR",
     "departamento": "Comercial", "leadsAbordados": 45, "demonstracoesAgendadas": 8, "contratosAssinados": 2},
    {"id": "USR002", "nome": "Marina Costa", "email": "marina@moinho.com.br", "role": "VENDEDOR",
     "departamento": "Comercial", "leadsAbordados": 38, "demonstracoesAgendadas": 11, "contratosAssinados": 3},
    {"id": "USR003", "nome": "Roberto Oliveira", "email": "roberto@moinho.com.br", "role": "GERENTE",
     "departamento": "Comercial", "leadsAbordados": 12, "demonstracoesAgendadas": 4, "contratosAssinados": 3},
]

INTERACAO_TIPOS = [
    ("EMAIL_ENVIADO", "Email de prospecção enviado com apresentação do Moinho"),
    ("EMAIL_ENVIADO", "Follow-up enviado após primeiro contato"),
    ("NOTA_INTERNA", "Empresa em expansão, boa oportunidade de abordagem"),
    ("NOTA_INTERNA", "Decisor identificado via LinkedIn, aguardando retorno"),
    ("DEMONSTRAÇÃO_AGENDADA", "Demonstração da plataforma agendada"),
    ("VISITA_PRESENCIAL", "Visita presencial realizada no escritório da empresa"),
]


def titlecase_pt(nome: str) -> str:
    minusculas = {"de", "da", "do", "das", "dos", "e", "em", "a", "o"}
    palavras = nome.lower().split()
    out = []
    for i, p in enumerate(palavras):
        out.append(p if p in minusculas and i > 0 else p.capitalize())
    return " ".join(out)


def limpar_nome(razao: str, fantasia: str) -> tuple[str, str]:
    razao = razao.strip()
    # Remove CPF colado no fim de razões sociais de MEI (ex.: "FULANO 08370574696")
    razao_limpa = re.sub(r"\s+\d{11}$", "", razao)
    fantasia = (fantasia or "").strip()
    if not fantasia or set(fantasia) <= {"*"}:
        fantasia = razao_limpa
    fantasia = re.sub(r"\s+\d{11}$", "", fantasia)
    return titlecase_pt(razao_limpa), titlecase_pt(fantasia)


def formatar_telefone(tel: str) -> str:
    d = re.sub(r"\D", "", tel or "")
    if len(d) == 11:
        return f"({d[:2]}) {d[2:7]}-{d[7:]}"
    if len(d) == 10:
        return f"({d[:2]}) {d[2:6]}-{d[6:]}"
    return tel.strip()


def parse_data(data_br: str) -> str | None:
    try:
        return datetime.strptime(data_br.strip(), "%d/%m/%Y").strftime("%Y-%m-%d")
    except (ValueError, AttributeError):
        return None


def slug(texto: str) -> str:
    s = unicodedata.normalize("NFD", texto.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "", s)


def crescimento_caged(row: dict) -> str:
    """Simula classificação CAGED a partir de funcionários e idade da empresa."""
    faixa = (row.get("Funcionarios_Faixa") or "").upper()
    idade = int(row.get("Idade") or 0)
    pontos = 0
    if "NENHUM" in faixa:
        pontos += 0
    elif "1 À 2" in faixa or "1 à 2" in faixa.lower():
        pontos += 1
    else:
        pontos += 2
    if idade <= 3:
        pontos += 1
    elif idade >= 15:
        pontos -= 1
    pontos += random.choice([0, 0, 1, -1])
    if pontos >= 2:
        return "ALTO"
    if pontos >= 1:
        return "MÉDIO"
    return "BAIXO"


def score_conversao(cresc: str, tem_email: bool, tem_tel: bool, porte: str) -> float:
    base = {"ALTO": 7.0, "MÉDIO": 5.5, "BAIXO": 4.0}[cresc]
    base += 0.8 if tem_email else 0
    base += 0.5 if tem_tel else 0
    base += {"MICRO": 0.0, "PEQUENA": 0.5, "MÉDIA": 0.8, "GRANDE": 1.0}.get(porte, 0)
    base += random.uniform(-1.0, 1.2)
    return round(min(9.9, max(1.5, base)), 1)


def gerar_interacoes(company_idx: int, contador: list[int]) -> list[dict]:
    n = random.randint(1, 4)
    interacoes = []
    dia = REF_DATE - timedelta(days=random.randint(1, 60))
    # Ordem realista de funil: email -> nota -> demonstração -> visita
    pool = sorted(random.sample(range(len(INTERACAO_TIPOS)), n))
    for idx in pool:
        tipo, desc = INTERACAO_TIPOS[idx]
        contador[0] += 1
        interacoes.append({
            "id": f"INT{contador[0]:04d}",
            "tipo": tipo,
            "data": dia.strftime("%Y-%m-%dT%H:%M:00"),
            "descricao": desc,
            "usuario": random.choice(USUARIOS[:2])["nome"],
        })
        dia += timedelta(days=random.randint(2, 10), hours=random.randint(-4, 4))
        if dia > REF_DATE:
            dia = REF_DATE - timedelta(hours=random.randint(1, 48))
    interacoes.sort(key=lambda i: i["data"])
    return interacoes


def main() -> None:
    with open(CSV_PATH, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    # Filtra empresas ativas com coordenadas válidas na região
    candidatas = []
    for row in rows:
        try:
            lat, lng = float(row["Latitude"]), float(row["Longitude"])
        except (ValueError, KeyError):
            continue
        if not (LAT_MIN <= lat <= LAT_MAX and LNG_MIN <= lng <= LNG_MAX):
            continue
        if row.get("SituacaoCadastral") != "ATIVA" or not row.get("RazaoSocial", "").strip():
            continue
        if row.get("Cidade") not in CIDADE_NOMES:
            continue
        row["_lat"], row["_lng"] = lat, lng
        candidatas.append(row)

    # Estratifica por setor (cota) e, dentro do setor, espalha entre cidades.
    # Portes maiores são raros: entram com prioridade para dar variedade.
    por_setor = defaultdict(list)
    for row in candidatas:
        por_setor[row["Setor"]].append(row)

    selecionadas = []
    for setor, cota in SETOR_COTAS.items():
        grupo = por_setor.get(setor, [])
        prioritarias = [r for r in grupo if PORTE_MAP.get(r["PorteEmpresaIBPT"]) in ("MÉDIA", "GRANDE", "PEQUENA")]
        random.shuffle(prioritarias)
        escolhidas = prioritarias[: cota // 3]
        restantes = [r for r in grupo if r not in escolhidas]
        por_cidade = defaultdict(list)
        for r in restantes:
            por_cidade[r["Cidade"]].append(r)
        for lista in por_cidade.values():
            random.shuffle(lista)
        # Round-robin entre cidades para não concentrar tudo em Juiz de Fora
        cidades = sorted(por_cidade, key=lambda c: -len(por_cidade[c]))
        i = 0
        while len(escolhidas) < min(cota, len(grupo)):
            cidade = cidades[i % len(cidades)]
            if por_cidade[cidade]:
                escolhidas.append(por_cidade[cidade].pop())
            i += 1
            if all(not v for v in por_cidade.values()):
                break
        selecionadas.extend(escolhidas[:cota])

    contador_int = [0]
    companies = []
    for n, row in enumerate(selecionadas, start=1):
        razao, fantasia = limpar_nome(row["RazaoSocial"], row["NomeFantasia"])
        porte = PORTE_MAP.get(row["PorteEmpresaIBPT"], "MICRO")
        emails = [e.strip().lower() for e in (row.get("EmpresaEmail1"), row.get("EmpresaEmail2")) if e and e.strip()]
        telefones = [formatar_telefone(t) for t in (row.get("EmpresaTelefone1"), row.get("EmpresaTelefone2")) if t and t.strip()]
        cresc = crescimento_caged(row)
        score = score_conversao(cresc, bool(emails), bool(telefones), porte)
        cnae = titlecase_pt(row["CNAE"].split(" - ", 1)[-1])
        cnae_cod = row["CNAE"].split(" - ", 1)[0]
        companies.append({
            "id": f"COMP{n:05d}",
            "cnpj": row["CNPJ"].zfill(14),
            "razaoSocial": razao,
            "nomeFantasia": fantasia,
            "endereco": titlecase_pt(row.get("Endereco", "").strip()),
            "numero": row.get("Numero", "").strip() or "S/N",
            "bairro": titlecase_pt(row.get("Bairro", "").strip()),
            "cidade": CIDADE_NOMES[row["Cidade"]],
            "cep": re.sub(r"\D", "", row.get("CEP", "")).zfill(8),
            "latitude": row["_lat"],
            "longitude": row["_lng"],
            "cnae": f"{cnae_cod} - {cnae}",
            "setor": titlecase_pt(row["Setor"]),
            "porte": porte,
            "dataAbertura": parse_data(row.get("DataAbertura", "")) or "2020-01-01",
            "situacao": "ATIVA",
            "emails": emails,
            "telefones": telefones,
            "crescimentoCAGED": cresc,
            "scoreConversao": score,
            "interacoes": [],
        })

    # Interações simuladas para as 45 empresas de maior score
    top = sorted(companies, key=lambda c: -c["scoreConversao"])[:45]
    for i, comp in enumerate(top):
        comp["interacoes"] = gerar_interacoes(i, contador_int)

    setores_count = defaultdict(int)
    cidades_geo = defaultdict(lambda: {"lats": [], "lngs": [], "n": 0})
    for c in companies:
        setores_count[c["setor"]] += 1
        g = cidades_geo[c["cidade"]]
        g["lats"].append(c["latitude"])
        g["lngs"].append(c["longitude"])
        g["n"] += 1

    setores = [
        {"id": f"SET{i:03d}", "nome": titlecase_pt(nome), "empresas": setores_count[titlecase_pt(nome)], "cor": cor}
        for i, (nome, cor) in enumerate(SETOR_CORES.items(), start=1)
        if setores_count.get(titlecase_pt(nome))
    ]
    cidades = [
        {"id": f"CID{i:03d}", "nome": nome, "empresas": g["n"],
         "lat": round(sum(g["lats"]) / g["n"], 6), "lng": round(sum(g["lngs"]) / g["n"], 6)}
        for i, (nome, g) in enumerate(sorted(cidades_geo.items(), key=lambda kv: -kv[1]["n"]), start=1)
    ]

    events = [
        {"id": "EVT001", "titulo": "Bootcamp de Tecnologia e Inovação",
         "descricao": "Workshop intensivo de 2 dias sobre desenvolvimento de produtos digitais, com mentorias do ecossistema do Moinho.",
         "data": "2026-07-31T09:00:00", "horario": "09:00", "local": "Moinho - Sala de Eventos",
         "vagas": 30, "inscritos": 18, "categoria": "BOOTCAMP"},
        {"id": "EVT002", "titulo": "Networking de Empresas de TI",
         "descricao": "Encontro mensal para conectar empresas de tecnologia da região com investidores e parceiros.",
         "data": "2026-08-07T18:30:00", "horario": "18:30", "local": "Moinho - Rooftop",
         "vagas": 50, "inscritos": 32, "categoria": "NETWORKING"},
        {"id": "EVT003", "titulo": "Workshop de Gestão Empresarial",
         "descricao": "Capacitação prática em finanças, marketing digital e gestão de pessoas para micro e pequenas empresas.",
         "data": "2026-08-15T14:00:00", "horario": "14:00", "local": "Moinho - Auditório",
         "vagas": 40, "inscritos": 12, "categoria": "WORKSHOP"},
    ]

    metricas = {
        "leadsQualificados": 247, "demonstracoesAgendadas": 38, "visitasPresenciais": 28,
        "contratosAssinados": 8, "taxaConversaoOutbound": 15.4, "taxaConversaoEventos": 22.8,
        "cicloVendasMedio": 24, "ocupacaoMoinho": 68, "receita": 125000,
    }

    data = {"companies": companies, "events": events, "setores": setores, "cidades": cidades,
            "metricas": metricas, "usuarios": USUARIOS, "timestamp": REF_DATE.isoformat()}

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"OK: {len(companies)} empresas -> {OUT_PATH}")
    print("Setores:", {s['nome']: s['empresas'] for s in setores})
    print("Cidades:", {c['nome']: c['empresas'] for c in cidades})
    portes = defaultdict(int)
    for c in companies:
        portes[c["porte"]] += 1
    print("Portes:", dict(portes))
    print("Com interações:", sum(1 for c in companies if c["interacoes"]))


if __name__ == "__main__":
    main()
