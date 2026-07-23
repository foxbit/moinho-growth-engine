import { useEffect, useMemo, type ReactNode } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { latLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Company } from '../types'
import { corDoSetor } from '../utils/colors'

interface MapViewProps {
  companies: Company[]
  height?: string
  renderPopup: (company: Company) => ReactNode
}

/** Ajusta o zoom para enquadrar todos os marcadores sempre que o filtro muda */
function FitBounds({ companies }: { companies: Company[] }) {
  const map = useMap()
  useEffect(() => {
    if (companies.length === 0) return
    const bounds = latLngBounds(companies.map((c) => [c.latitude, c.longitude]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [companies, map])
  return null
}

export function MapView({ companies, height = 'h-[480px]', renderPopup }: MapViewProps) {
  const center = useMemo<[number, number]>(() => [-21.7629, -43.3561], [])

  return (
    <div className={`${height} w-full overflow-hidden rounded-lg border border-[var(--color-border)]`}>
      <MapContainer center={center} zoom={9} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds companies={companies} />
        {companies.map((company) => (
          <CircleMarker
            key={company.id}
            center={[company.latitude, company.longitude]}
            radius={7}
            pathOptions={{
              color: '#ffffff',
              weight: 1.5,
              fillColor: corDoSetor(company.setor),
              fillOpacity: 0.85,
            }}
          >
            <Popup>{renderPopup(company)}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
