import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react'
import { api } from '@/lib/api';

import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/features/auth/contexts/AuthContext';
import type { User } from '@/features/auth/types';
import type { Report } from '../types/report.types';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';



type reportSchemaProps = {
    description: string,
    details: string,
    ocurrenceDate: string
    location: string,
    midia: FileList
    user?: User
}

export function EditReportDialog({ report, setIsOpen, fetchReports }: { report: Report, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, fetchReports?: () => Promise<void> }) {



    const { register, control, handleSubmit, setValue } = useForm<reportSchemaProps>({
        defaultValues: {
            description: report.description,
            details: report.details,
            ocurrenceDate: new Date(report.ocurrenceDate).toISOString().split("T")[0],
            location: report.location,

        }
    })
    const [loading, setLoading] = useState(false)
    const [display, setDisplay] = useState(false);
    const [, setHasImage] = useState(true);
    const { user } = useAuth()


    async function handleEditReport(data: reportSchemaProps) {
        const formData = new FormData()
        formData.append("description", data.description)
        formData.append("details", data.details)
        formData.append("ocurrenceDate", new Date(data.ocurrenceDate).toISOString())
        formData.append("location", report.location)

        if (data.midia) {
            for (let i = 0; i < data.midia.length; i++) {
                formData.append("midia", data.midia[i])
            }
            setHasImage(true);
        } else {
            setHasImage(false);
        }


        if (user) formData.append("user", JSON.stringify(user))


        try {
            setLoading(true);
            await api.put(`/api/report/${report.id}`, formData)
            setLoading(false)
            setDisplay(true);
            setIsOpen(false);
            if (fetchReports) {
                await fetchReports();
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <DialogContent>
            <DialogHeader className="text-left">
                <DialogTitle>Editar denúncia {report.id}</DialogTitle>
                <DialogDescription>Editar denúncia</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleEditReport)} className="space y-6">
                <div className="grid grid-cols-4">
                    <Label htmlFor="descriptioon">Descrição</Label>
                    <Input className="col-span-3" {...register('description')} id='description' placeholder='Descreve o acontecimento' />
                </div>

                <div className="pt-4 grid grid-cols-4">
                    <Label htmlFor="details">Detalhes</Label>
                    <Input className="col-span-3" id="details" {...register('details')} placeholder='Foque nos detalhes específicos' />
                </div>

                <div className="pt-4 grid grid-cols-4">
                    <Label htmlFor="ocurrenceDate">Data de ocorrência</Label>
                    <Controller
                        name="ocurrenceDate"
                        control={control}
                        defaultValue={new Date(report.ocurrenceDate).toISOString().split("T")[0]}
                        render={({ field }) => (
                            <input
                                type="date"
                                id="occurrenceDate"
                                className="col-span-3"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                            />
                        )}
                    />

                </div>

                <div className="pt-4 grid grid-cols-1">
                    {(<MapContainer center={[...report.location.split(', ')]} zoom={13} scrollWheelZoom={true} style={{ height: 400 }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[...report.location.split(', ')]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>)}
                </div>

                <div className="pt-4 grid grid-cols-4">
                    <Label htmlFor="midia">Fotos/vídeos</Label>
                    <Input className="col-span-3" id="midia" multiple type="file" onChange={(e) => setValue("midia", e.target.files as FileList, { shouldValidate: false, })} />
                </div>

                <div>
                    {!display && <h3 className='text-sm'>Imagens atuais</h3>}
                    {!display && report?.midia && report?.midia.map(item => item.type === "image" ?

                        <img key={item.id} src={`${import.meta.env.VITE_API_URL}${item.url}`} className='h-18 object-cover rounded col-span-1' /> :
                        <video key={item.id} src={`${import.meta.env.VITE_API_URL}${item.url}`} className='h-18 object-cover rounded col-span-1' ></video>
                    )}

                </div>

                {loading && <p className='text-right text-xl my-3 text-blue-500'>Carregando...</p>}

                <DialogFooter className="flex-row justify-end mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="destructive" className="px-6">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" variant="default" className="px-8">Enviar</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}