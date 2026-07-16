import { useState } from 'react'
import { CalendarPlus, FileSignature, Mail, MapPin, StickyNote, X } from 'lucide-react'
import type { Company, TipoInteracao } from '../types'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import { Badge, badgeCrescimento, badgePorte } from './Badge'
import { Button } from './Button'
import { Modal } from './Modal'
import { Input } from './Input'
import { InteractionTimeline } from './InteractionTimeline'
import { formatCep, formatCnpj, formatDate } from '../utils/format'

type Acao = 'email' | 'demonstracao' | 'nota' | 'visita' | 'contrato' | null

interface CompanyDetailProps {
  company: Company
  onClose: () => void
  acaoInicial?: Acao
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        {titulo}
      </h3>
      <div className="px-4 py-3">{children}</div>
    </section>
  )
}

function LinhaInfo({ rotulo, valor }: { rotulo: string; valor: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-1 text-sm sm:flex-row sm:gap-2">
      <span className="w-44 shrink-0 text-gray-500 dark:text-gray-400">{rotulo}</span>
      <span className="min-w-0 font-medium">{valor}</span>
    </div>
  )
}

export function CompanyDetail({ company, onClose, acaoInicial = null }: CompanyDetailProps) {
  const addInteraction = useAppStore((s) => s.addInteraction)
  const user = useAuthStore((s) => s.user)
  const [acao, setAcao] = useState<Acao>(acaoInicial)
  const [texto, setTexto] = useState('')
  const [dataAgenda, setDataAgenda] = useState('')
  const [horaAgenda, setHoraAgenda] = useState('10:00')
  const [feedback, setFeedback] = useState('')

  const usuario = user?.nome ?? 'Sistema'

  const registrar = (tipo: TipoInteracao, descricao: string, msg: string) => {
    addInteraction(company.id, tipo, descricao, usuario)
    setAcao(null)
    setTexto('')
    setDataAgenda('')
    setFeedback(msg)
    setTimeout(() => setFeedback(''), 4000)
  }

  const templateEmail = `Olá, equipe da ${company.nomeFantasia}!\n\nSomos do Moinho, o hub de inovação de Juiz de Fora. Identificamos que a ${company.razaoSocial} atua em ${company.setor} e acreditamos que nosso ecossistema pode acelerar o crescimento de vocês.\n\nQue tal agendarmos uma conversa de 20 minutos?\n\nAbraços,\n${usuario}`

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#111827] animate-slide-up">
      <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-bold leading-tight">{company.razaoSocial}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {company.nomeFantasia !== company.razaoSocial && `${company.nomeFantasia} · `}
            CNPJ {formatCnpj(company.cnpj)}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Fechar detalhes"
          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {feedback && (
          <p className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 animate-fade-in dark:bg-green-900/30 dark:text-green-300">
            {feedback}
          </p>
        )}

        <Secao titulo="Informações Gerais">
          <LinhaInfo
            rotulo="Endereço"
            valor={`${company.endereco}, ${company.numero} - ${company.bairro} - ${company.cidade}`}
          />
          <LinhaInfo rotulo="CEP" valor={formatCep(company.cep)} />
          <LinhaInfo rotulo="Setor" valor={company.setor} />
          <LinhaInfo rotulo="CNAE" valor={company.cnae} />
          <LinhaInfo rotulo="Porte" valor={<Badge label={company.porte} variant={badgePorte(company.porte)} />} />
          <LinhaInfo rotulo="Data de Abertura" valor={formatDate(company.dataAbertura)} />
          <LinhaInfo rotulo="Situação" valor={<Badge label={company.situacao} variant="success" />} />
          <LinhaInfo
            rotulo="Crescimento CAGED"
            valor={<Badge label={company.crescimentoCAGED} variant={badgeCrescimento(company.crescimentoCAGED)} />}
          />
          <LinhaInfo rotulo="Score de Conversão" valor={`${company.scoreConversao.toFixed(1)}/10`} />
        </Secao>

        <Secao titulo="Contatos">
          <LinhaInfo rotulo="Emails" valor={company.emails.length ? company.emails.join(', ') : '—'} />
          <LinhaInfo rotulo="Telefones" valor={company.telefones.length ? company.telefones.join(', ') : '—'} />
        </Secao>

        <Secao titulo="Histórico de Interações">
          <InteractionTimeline interacoes={company.interacoes} />
        </Secao>

        <Secao titulo="Ações">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setAcao('email')}>
              <Mail className="h-4 w-4" /> Enviar Email
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setAcao('demonstracao')}>
              <CalendarPlus className="h-4 w-4" /> Agendar Demonstração
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setAcao('nota')}>
              <StickyNote className="h-4 w-4" /> Adicionar Nota
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setAcao('visita')}>
              <MapPin className="h-4 w-4" /> Registrar Visita
            </Button>
            <Button size="sm" variant="danger" onClick={() => setAcao('contrato')}>
              <FileSignature className="h-4 w-4" /> Fechar Contrato
            </Button>
          </div>
        </Secao>
      </div>

      {/* Modal: Enviar Email */}
      <Modal
        isOpen={acao === 'email'}
        title="Enviar Email de Prospecção"
        onClose={() => setAcao(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAcao(null)}>Cancelar</Button>
            <Button
              onClick={() =>
                registrar('EMAIL_ENVIADO', 'Email de prospecção enviado', 'Email enviado com sucesso (simulado)!')
              }
            >
              Enviar
            </Button>
          </>
        }
      >
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          Para: {company.emails[0] ?? 'contato@empresa.com.br'}
        </p>
        <textarea
          defaultValue={templateEmail}
          rows={9}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800"
        />
      </Modal>

      {/* Modal: Agendar Demonstração */}
      <Modal
        isOpen={acao === 'demonstracao'}
        title="Agendar Demonstração"
        onClose={() => setAcao(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAcao(null)}>Cancelar</Button>
            <Button
              disabled={!dataAgenda}
              onClick={() =>
                registrar(
                  'DEMONSTRAÇÃO_AGENDADA',
                  `Demonstração agendada para ${dataAgenda.split('-').reverse().join('/')} às ${horaAgenda}`,
                  'Demonstração agendada com sucesso!',
                )
              }
            >
              Confirmar Agendamento
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input type="date" label="Data" value={dataAgenda} onChange={setDataAgenda} required />
          <Input type="time" label="Horário" value={horaAgenda} onChange={setHoraAgenda} required />
        </div>
      </Modal>

      {/* Modal: Nota / Visita */}
      <Modal
        isOpen={acao === 'nota' || acao === 'visita'}
        title={acao === 'nota' ? 'Adicionar Nota Interna' : 'Registrar Visita Presencial'}
        onClose={() => setAcao(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAcao(null)}>Cancelar</Button>
            <Button
              disabled={!texto.trim()}
              onClick={() =>
                acao === 'nota'
                  ? registrar('NOTA_INTERNA', texto.trim(), 'Nota adicionada!')
                  : registrar('VISITA_PRESENCIAL', texto.trim(), 'Visita registrada!')
              }
            >
              Salvar
            </Button>
          </>
        }
      >
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          placeholder={acao === 'nota' ? 'Escreva a observação sobre a empresa...' : 'Descreva como foi a visita...'}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800"
        />
      </Modal>

      {/* Modal: Fechar Contrato */}
      <Modal
        isOpen={acao === 'contrato'}
        title="Fechar Contrato"
        onClose={() => setAcao(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAcao(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() =>
                registrar('CONTRATO_ASSINADO', 'Contrato de coworking/serviços assinado', 'Contrato registrado! 🎉')
              }
            >
              Confirmar Fechamento
            </Button>
          </>
        }
      >
        <p className="text-sm">
          Confirma o fechamento de contrato com <strong>{company.razaoSocial}</strong>? Essa ação registrará a
          conversão no histórico da empresa.
        </p>
      </Modal>
    </div>
  )
}
