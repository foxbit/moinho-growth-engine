import { CORES_SETOR, setorCurto } from '../utils/colors'

export function MapLegend({ setores }: { setores: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
      {setores.map((setor) => (
        <span key={setor} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: CORES_SETOR[setor] ?? '#6B7280' }}
          />
          {setorCurto(setor)}
        </span>
      ))}
    </div>
  )
}
