import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, FileText, MapPinCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ReportStatusBadge } from './ReportStatusBadge';
import type { Report } from '../types/report.types';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { UserType } from '@/features/auth/types';

export function ViewReportDetailsDialog({ report, fetchReports }: { report: Report, fetchReports?: () => Promise<void> }) {
  const [statusComment, setStatusComment] = useState('');
  const [statusCommentError, setStatusCommentError] = useState(false);
  const [display] = useState(false);
  const { user } = useAuth();
  if (!report) return null;

  const handleProgress = async (type: 'progress' | 'resolved' | 'unresolved') => {
    if (!statusComment) {
      setStatusCommentError(true);
      return;
    }
    try {
      const statusTypes = {
        progress: 'IN_PROGRESS',
        resolved: 'RESOLVED',
        unresolved: 'UNRESOLVED',
      }
      await api.put(`/api/report/${report.id}/status`, { statusComment, status: statusTypes[type] })
      setStatusCommentError(false);
      if (fetchReports) {
        await fetchReports()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [lat, long] = report.location.split(', ');

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <ReportStatusBadge status={report.status} />
              <span className="text-sm text-gray-500">
                #{report.id.toString().padStart(4, '0')}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(report.createdAt)}
            </div>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {/* Informações principais */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className='-ml-1'>
              <p className="font-medium text-gray-900"></p>
              {(<MapContainer center={[Number(lat), Number(long)]} zoom={13} scrollWheelZoom={true} style={{ height: 300, width: 400 }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[Number(lat), Number(long)]}>
                </Marker>
              </MapContainer>)}

            </div>
          </div>

          {report.address && <div className="flex items-start gap-3">
            <MapPinCheck size={35} className='text-gray-500 mt-0.5' />
            {report.address && <p className='flex'> Endereço: {report.address}</p>}
          </div>}

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Data da ocorrência</p>
              <p className="text-gray-600">{formatDate(report.ocurrenceDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Denunciante</p>
              <p className="text-gray-600 text-sm">{!report.user ? "Anônimo" : report.user?.name || "Carregando..."}</p>
            </div>
          </div>
        </div>

        {/* Descrição detalhada */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Descrição detalhada
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {report.details}
            </p>
          </div>
        </div>

        <div>
          {!display && <h3 className='text-sm'>Mídias da denúncia</h3>}
          <div className='flex gap-2 flex-wrap'>
            {!display && report?.midia && report?.midia.map(item => item.type === "image" ?


              <img key={item.id} src={`${import.meta.env.VITE_API_URL}${item.url}`} className='h-40 object-cover rounded col-span-1' /> :
              <video controls={true} key={item.id} src={`${import.meta.env.VITE_API_URL}${item.url}`} className='h-30 object-cover rounded col-span-1' ></video>

            )}
          </div>

        </div>

        {/* Andamento da denúncia */}
        {report.statusComment && <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Andamento da denúncia
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {report.statusComment}
            </p>
          </div>
        </div>}

        {/* Motivo da rejeição */}
        {report.rejectReason && <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Motivo da rejeição
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {report.rejectReason}
            </p>
          </div>
        </div>}
      </div>

      {user?.type === UserType.ONG && <div>
        <label htmlFor="" className='mb-2'>
          Comentário: <input type="text" name="statusComment" value={statusComment} className="border-2 w-full rounded-sm py-1" onChange={(e) => setStatusComment(e.target.value)} />
        </label>
        {statusCommentError && <p className="text-red-600 text-xs text-right">Um comentário é necessário para avançar no status ou concluir a denúncia</p>}
        <div className='flex gap-2 mt-2'>
          <Button variant={'secondary'} onClick={() => handleProgress('progress')}>Avançar progresso</Button>
          <Button variant={'destructive'} onClick={() => handleProgress('unresolved')}>Concluir sem resolução</Button>
          <Button variant={'secondary'} onClick={() => handleProgress('resolved')} className='bg-green-500 grow'>Concluir</Button>
        </div>
      </div >}
    </DialogContent>
  );
}