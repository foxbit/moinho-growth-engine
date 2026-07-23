import { useState } from 'react'
import { X, Mail, Calendar, CircleCheck } from 'lucide-react'
import type { Company } from '../types'
import { Badge, badgePorte, badgeCrescimento } from './Badge'
import { Button } from './Button'
import { Input } from './Input'
import { Modal } from './Modal'
import { formatCep, formatCnpj } from '../utils/format'
import { MapView } from './MapView'

interface CompanyDrawerProps {
  company: Company | null
  isOpen: boolean
  onClose: () => void
}

type FormAcao = 'conectar' | 'reuniao' | null

export function CompanyDrawer({ company, isOpen, onClose }: CompanyDrawerProps) {
  const [acao, setAcao] = useState<FormAcao>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviado, setEnviado] = useState(false)

  if (!company || !isOpen) return null

  const handleSubmit = () => {
    setEnviado(true)
    setTimeout(() => {
      setEnviado(false)
      setAcao(null)
      setNome('')
      setEmail('')
      setMensagem('')
    }, 2000)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[var(--color-scrim)] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-[var(--color-bg-secondary)] shadow-xl animate-slide-in-right md:rounded-l-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] px-6 py-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{company.razaoSocial}</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {company.nomeFantasia !== company.razaoSocial && `${company.nomeFantasia} · `}
              {formatCnpj(company.cnpj)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-4">
          {/* Info Geral */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              Informações
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Endereço</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {company.endereco}, {company.numero} - {company.bairro}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Cidade</span>
                <span className="font-medium text-[var(--color-text-primary)]">{company.cidade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">CEP</span>
                <span className="font-medium text-[var(--color-text-primary)]">{formatCep(company.cep)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Setor</span>
                <span className="font-medium text-[var(--color-text-primary)]">{company.setor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Porte</span>
                <Badge label={company.porte} variant={badgePorte(company.porte)} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Crescimento</span>
                <Badge label={company.crescimentoCAGED} variant={badgeCrescimento(company.crescimentoCAGED)} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Score</span>
                <span className="font-medium tabular-nums text-[var(--color-text-primary)]">{company.scoreConversao.toFixed(1)}/10</span>
              </div>
            </div>
          </div>

          {/* Contatos */}
          {(company.emails.length > 0 || company.telefones.length > 0) && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                Contatos
              </h3>
              {company.emails.length > 0 && (
                <div className="text-sm">
                  <p className="mb-1 text-[var(--color-text-secondary)]">Emails</p>
                  <p className="font-medium text-[var(--color-text-primary)]">{company.emails.join(', ')}</p>
                </div>
              )}
              {company.telefones.length > 0 && (
                <div className="text-sm">
                  <p className="mb-1 text-[var(--color-text-secondary)]">Telefones</p>
                  <p className="font-medium text-[var(--color-text-primary)]">{company.telefones.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Mapa pequeno */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              Localização
            </h3>
            <MapView
              companies={[company]}
              height="h-[250px]"
              renderPopup={() => (
                <div className="text-sm">
                  <p className="font-semibold">{company.razaoSocial}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{company.cidade}</p>
                </div>
              )}
            />
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 border-t border-[var(--color-bg-tertiary)] pt-4">
            <Button
              onClick={() => setAcao('conectar')}
              className="w-full"
              size="md"
            >
              <Mail className="h-4 w-4" /> Conectar
            </Button>
            <Button
              onClick={() => setAcao('reuniao')}
              variant="secondary"
              className="w-full"
              size="md"
            >
              <Calendar className="h-4 w-4" /> Agendar Reunião
            </Button>
          </div>
        </div>
      </div>

      {/* Modal: Conectar */}
      <Modal
        isOpen={acao === 'conectar' && !enviado}
        title="Conectar com a empresa"
        onClose={() => setAcao(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAcao(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!nome || !email}>
              Enviar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Seu nome"
            placeholder="João Silva"
            value={nome}
            onChange={setNome}
            required
          />
          <Input
            label="Seu email"
            type="email"
            placeholder="joao@example.com"
            value={email}
            onChange={setEmail}
            required
          />
          <div>
            <label className="mb-2 block text-xs font-semibold text-[var(--color-text-primary)]">
              Mensagem (opcional)
            </label>
            <textarea
              rows={4}
              placeholder="Conte-nos um pouco sobre seu interesse..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="w-full rounded-md bg-[var(--color-bg-tertiary)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-[background-color,box-shadow] duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Agendar Reunião */}
      <Modal
        isOpen={acao === 'reuniao' && !enviado}
        title="Agendar Reunião"
        onClose={() => setAcao(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAcao(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!nome || !email}>
              Agendar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Seu nome"
            placeholder="João Silva"
            value={nome}
            onChange={setNome}
            required
          />
          <Input
            label="Seu email"
            type="email"
            placeholder="joao@example.com"
            value={email}
            onChange={setEmail}
            required
          />
        </div>
      </Modal>

      {/* Toast de sucesso — silencioso, não bloqueia a tela */}
      {enviado && (
        <div
          className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-lg bg-[var(--color-bg-secondary)] px-4 py-3 text-sm shadow-xl animate-slide-in-right"
          role="status"
        >
          <CircleCheck className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
          <span className="text-[var(--color-text-primary)]">Dados enviados. Entraremos em contato em breve.</span>
        </div>
      )}
    </>
  )
}
