import { useAuth } from '@/features/auth/contexts/AuthContext';
import { CreateReportDialogButton } from '../components/CreateReportDialogButton';
import { ReportCard } from '../components/ReportCard';
import { useMyReports } from '../hooks/useMyReports';
import { UserType } from '@/features/auth/types';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

export function MyReportsPage() {
  const { reports, loading, error, refetch } = useMyReports()
  const { user } = useAuth()
  const [filterValue, setFilterValue] = useState('');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Carregando minhas denúncias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-red-600">Erro: {error}</div>
      </div>
    );
  }

  const filteredReports = reports?.filter((report) => report.description.includes(filterValue))

  return (
    <div className="page-content">

      <h1>Minhas denúncias</h1>

      {/* Search + actions */}
      <form className='flex items-center justify-start gap-2'>
        <input
          type="text"
          className="input flex-1"
          placeholder="Pesquisar"
          aria-label="Pesquisar minhas denúncias"
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
        />
      </form>

      <div className="sectionLabel">Minhas denúncias registradas</div>
      {user?.type == UserType.USER && <CreateReportDialogButton fetchReports={refetch} />}

      {/* List */}
      <section className={`list mt-3  block  ${filteredReports && filteredReports.length > 0 ? "md:grid md:grid-cols-2" : ""}`} aria-label="Lista das minhas denúncias">
        {filteredReports && filteredReports.length > 0 ? filteredReports.map(item => <ReportCard key={item.id} report={item} fetchReports={refetch} />)
          : <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {user?.type == UserType.ONG ? 'Você ainda não assumiu nenhuma denúncia' : 'Você ainda não registrou nenhuma denúncia'}
            </p>
          </div>
        }
      </section>

    </div>
  );
}