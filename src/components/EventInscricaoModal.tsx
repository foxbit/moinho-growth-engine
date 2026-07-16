import { useState } from 'react'
import type { Event } from '../types'
import { useAppStore } from '../store/useAppStore'
import { Button } from './Button'
import { Input } from './Input'
import { Modal } from './Modal'
import { formatDateTime } from '../utils/format'

interface EventInscricaoModalProps {
  event: Event | null
  onClose: () => void
}

export function EventInscricaoModal({ event, onClose }: EventInscricaoModalProps) {
  const inscreverEvento = useAppStore((s) => s.inscreverEvento)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [setor, setSetor] = useState('')
  const [lgpd, setLgpd] = useState(false)
  const [coworking, setCoworking] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [sucesso, setSucesso] = useState(false)

  const fechar = () => {
    setNome(''); setEmail(''); setTelefone(''); setEmpresa(''); setSetor('')
    setLgpd(false); setCoworking(false); setErros({}); setSucesso(false)
    onClose()
  }

  const enviar = () => {
    const novosErros: Record<string, string> = {}
    if (!nome.trim()) novosErros.nome = 'Informe seu nome completo'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novosErros.email = 'Informe um email válido'
    if (telefone.replace(/\D/g, '').length < 10) novosErros.telefone = 'Informe um telefone com DDD'
    if (!lgpd) novosErros.lgpd = 'É necessário aceitar o termo de consentimento'
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0 || !event) return
    inscreverEvento(event.id)
    setSucesso(true)
  }

  if (!event) return null

  return (
    <Modal
      isOpen={!!event}
      title={sucesso ? 'Inscrição Confirmada!' : `Inscrever-se: ${event.titulo}`}
      onClose={fechar}
      footer={
        sucesso ? (
          <Button onClick={fechar}>Fechar</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={fechar}>Cancelar</Button>
            <Button onClick={enviar} disabled={event.inscritos >= event.vagas}>
              Confirmar Inscrição
            </Button>
          </>
        )
      }
    >
      {sucesso ? (
        <div className="space-y-2 text-sm">
          <p>
            🎉 Pronto, <strong>{nome.split(' ')[0]}</strong>! Sua vaga no evento{' '}
            <strong>{event.titulo}</strong> está garantida.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Um email de confirmação foi enviado para {email} (simulado). Nos vemos em{' '}
            {formatDateTime(event.data)} no {event.local}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDateTime(event.data)} · {event.local} · {event.vagas - event.inscritos} vaga(s) restante(s)
          </p>
          <Input label="Nome completo" value={nome} onChange={setNome} required error={erros.nome} />
          <Input label="Email" type="email" value={email} onChange={setEmail} required error={erros.email} />
          <Input label="Telefone" type="tel" value={telefone} onChange={setTelefone} required error={erros.telefone} placeholder="(32) 99999-9999" />
          <Input label="Empresa" value={empresa} onChange={setEmpresa} />
          <Input label="Setor" value={setor} onChange={setSetor} />
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input type="checkbox" checked={lgpd} onChange={(e) => setLgpd(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0052CC]" />
            <span>
              Autorizo o tratamento dos meus dados pessoais para fins de inscrição neste evento, conforme a LGPD.{' '}
              <span className="text-critical">*</span>
              {erros.lgpd && <span className="block text-xs text-critical">{erros.lgpd}</span>}
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input type="checkbox" checked={coworking} onChange={(e) => setCoworking(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0052CC]" />
            Desejo receber informações sobre os planos de coworking do Moinho.
          </label>
        </div>
      )}
    </Modal>
  )
}
