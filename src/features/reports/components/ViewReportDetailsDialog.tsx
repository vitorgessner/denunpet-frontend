import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, FileText, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ReportStatusBadge } from './ReportStatusBadge';
import type { Report } from '../types/report.types';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';

export function ViewReportDetailsDialog({ report }: { report: Report }) {
  if (!report) return null;

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              {(<MapContainer center={[...report.location.split(', ')]} zoom={13} scrollWheelZoom={true} style={{ height: 400, width: 400 }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[...report.location.split(', ')]}>
                </Marker>
              </MapContainer>)}
            </div>
          </div>

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
              <p className="text-gray-600 text-sm">{report.user?.name || "Carregando..."}</p>
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

        {/* Mídias */}
        {report.midia && report.midia.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Mídias</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {report.midia.map((media, index) => (
                <div key={media.id} className="relative group">
                  {media.type === 'image' ? (
                    <img
                      src={import.meta.env.VITE_API_URL + media.url}
                      alt={`Mídia ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🎥</div>
                        <p className="text-xs text-gray-500">Vídeo</p>
                      </div>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDownload(media.url, `media-${index + 1}.${media.extension}`)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}