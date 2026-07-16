import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, Calendar, Mail, MapPin, Phone, Share2, UserPlus } from 'lucide-react'
import { MapContainer, CircleMarker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useAppStore } from '../store/useAppStore'
import { Badge, badgePorte } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { corDoSetor, setorCurto } from '../utils/colors'
import { formatCep, formatCnpj, formatDate } from '../utils/format'

type AcaoPublica = 'conectar' | 'reuniao' | null

export function EmpresaDetalhes() {
  const { id } = useParams()
  const company = useAppStore((s) => s.companies.find((c) => c.id === id))
  const [acao, setAcao] = useState<AcaoPublica>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [copiado, setCopiado] = useState(false)

  if (!company) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Empresa não encontrada</h1>
        <Link to="/empresas" className="mt-3 inline-block text-primary hover:underline dark:text-blue-400">
          Voltar para a listagem
        </Link>
      </div>
    )
  }

  const compartilhar = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    } catch {
      /* clipboard indisponível */
    }
  }

  const fecharModal = () => {
    setAcao(null)
    setEnviado(false)
    setNome('')
    setEmail('')
    setMensagem('')
  }

  return (
    <div className="space-y-6">
      <Link
        to="/empresas"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para empresas
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${corDoSetor(company.setor)}20` }}
          >
            <Building2 className="h-7 w-7" style={{ color: corDoSetor(company.setor) }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{company.razaoSocial}</h1>
            {company.nomeFantasia !== company.razaoSocial && (
              <p className="text-gray-500 dark:text-gray-400">{company.nomeFantasia}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge label={setorCurto(company.setor)} variant="info" size="md" />
              <Badge label={company.porte} variant={badgePorte(company.porte)} size="md" />
              <Badge label={company.situacao} variant="success" size="md" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setAcao('conectar')}>
            <UserPlus className="h-4 w-4" /> Conectar
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setAcao('reuniao')}>
            <Calendar className="h-4 w-4" /> Agendar Reunião
          </Button>
          <Button size="sm" variant="ghost" onClick={compartilhar}>
            <Share2 className="h-4 w-4" /> {copiado ? 'Link copiado!' : 'Compartilhar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card title="Sobre a Empresa">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Empresa do setor de {company.setor.toLowerCase()}, atuando em {company.cidade} desde{' '}
              {formatDate(company.dataAbertura)}. Faz parte do ecossistema mapeado pelo Moinho na região da Zona da
              Mata mineira.
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-gray-500 dark:text-gray-400">CNPJ</dt>
                <dd className="font-medium">{formatCnpj(company.cnpj)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-gray-500 dark:text-gray-400">CNAE</dt>
                <dd className="font-medium">{company.cnae}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Fundação</dt>
                <dd className="font-medium">{formatDate(company.dataAbertura)}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Contato e Localização">
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                {company.endereco}, {company.numero} - {company.bairro}, {company.cidade} - CEP{' '}
                {formatCep(company.cep)}
              </li>
              {company.emails.map((e) => (
                <li key={e} className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  <a href={`mailto:${e}`} className="text-primary hover:underline dark:text-blue-400">
                    {e}
                  </a>
                </li>
              ))}
              {company.telefones.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" /> {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card title="Localização no Mapa" className="h-fit">
          <div className="h-[320px] overflow-hidden rounded-lg">
            <MapContainer center={[company.latitude, company.longitude]} zoom={15} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleMarker
                center={[company.latitude, company.longitude]}
                radius={10}
                pathOptions={{
                  color: '#fff',
                  weight: 2,
                  fillColor: corDoSetor(company.setor),
                  fillOpacity: 0.9,
                }}
              />
            </MapContainer>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={acao !== null}
        title={
          enviado ? 'Mensagem Enviada!' : acao === 'conectar' ? `Conectar com ${company.nomeFantasia}` : 'Agendar Reunião'
        }
        onClose={fecharModal}
        footer={
          enviado ? (
            <Button onClick={fecharModal}>Fechar</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
              <Button
                disabled={!nome.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                onClick={() => setEnviado(true)}
              >
                Enviar
              </Button>
            </>
          )
        }
      >
        {enviado ? (
          <p className="text-sm">
            Sua solicitação foi encaminhada (simulada). A equipe do Moinho fará a ponte com a{' '}
            <strong>{company.nomeFantasia}</strong> e você receberá retorno em {email}.
          </p>
        ) : (
          <div className="space-y-3">
            <Input label="Seu nome" value={nome} onChange={setNome} required />
            <Input label="Seu email" type="email" value={email} onChange={setEmail} required />
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Mensagem {acao === 'reuniao' && '(inclua dias e horários de preferência)'}
              </label>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
