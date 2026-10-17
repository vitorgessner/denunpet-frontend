import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react'
import { api } from '@/lib/api';

import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/features/auth/contexts/AuthContext';
import type { User } from '@/features/auth/types';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

type reportSchemaProps = {
    description: string,
    details: string,
    ocurrenceDate: Date
    location: string,
    midia: FileList,
    anonymous: string,
    user?: User
}

export function CreateReportDialog({ setIsOpen, fetchReports }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, fetchReports: () => Promise<void> }) {
    const { register, handleSubmit, setValue } = useForm<reportSchemaProps>()
    const [loading, setLoading] = useState(false)
    const [, setDisplay] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [hasVideo, setHasVideo] = useState(false);
    const [hasLoc, setHasLoc] = useState(true);
    const [coords, setCoords] = useState<null | number[]>(null);
    const [address, setAddress] = useState('');
    const { user } = useAuth()

    useEffect(() => {
        function getLocation() {
            navigator.geolocation.getCurrentPosition(position => {
                setCoords([position.coords.latitude, position.coords.longitude]);
            })

        }

        getLocation();
    }, [])

    useEffect(() => {
        async function getAddress() {
            if (coords) {
                const address = await api.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}&layer=address`);
                setAddress(address.data.display_name);
                console.log(address.data)
            }
        }

        getAddress();
    }, [coords])

    async function handleCreateReport(data: reportSchemaProps) {
        const formData = new FormData()
        formData.append("description", data.description)
        formData.append("details", data.details)
        formData.append("ocurrenceDate", new Date(data.ocurrenceDate).toISOString())
        formData.append("anonymous", data.anonymous)
        console.log(data.anonymous);
        if (coords) {
            formData.append("location", coords.join(', '));
            formData.append("address", address);
            setHasLoc(true);
        } else {
            setHasLoc(false);
        }

        if (data.midia) {
            for (let i = 0; i < data.midia.length; i++) {
                const file = data.midia[i];
                formData.append("midia", file)
            }
        } else {
            setHasImage(false);
            setHasVideo(false);
        }

        if (user) formData.append("user", JSON.stringify(user))

        if (hasImage && hasVideo && coords) {
            try {
                setLoading(true)
                await api.post("/api/report/register", formData)
                setLoading(false)
                setDisplay(true);
                setIsOpen(false);
                await fetchReports();
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <DialogContent>
            <DialogHeader className="text-left">
                <DialogTitle>Nova denúncia</DialogTitle>
                <DialogDescription>Registre uma nova denúncia</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleCreateReport)} className="space y-6">
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
                    <input className="col-span-3" type="date" id="ocurrenceDate" {...register("ocurrenceDate", { valueAsDate: true })} />
                </div>

                <div className='pt-4 grid grid-cols-1'>
                    {coords && (<MapContainer center={[coords[0], coords[1]]} zoom={13} scrollWheelZoom={true} style={{ height: 300 }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[coords[0], coords[1]]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>)}
                    {address && <p>Endereço: {address}</p>}
                </div>

                {!hasLoc && <p className='text-right text-l mt-1 text-red-600'>Localização é obrigatória</p>}

                <div className="pt-4 grid grid-cols-4">
                    <Label htmlFor="midia">Fotos/vídeos</Label>
                    <Input className="col-span-3" id="midia" multiple type="file" onChange={(e) => {
                        setValue("midia", e.target.files as FileList, { shouldValidate: false })
                        if (e.target.files) {
                            setHasImage(false);
                            setHasVideo(false);
                            for (let i = 0; i < e.target.files.length; i++) {
                                const file = e.target.files[i];
                                if (file.type === 'video/mp4') {
                                    setHasVideo(true);
                                }
                                if (file.type === 'image/jpeg' || file.type === 'image/png') {
                                    setHasImage(true);
                                }
                            }
                        } else {
                            setHasImage(false);
                            setHasVideo(false);
                        }
                    }} />
                </div>

                {!hasImage && <p className='text-right text-l mt-1 text-red-600'>Precisa de pelo menos uma foto</p>}
                {!hasVideo && <p className='text-right text-l mt-1 text-red-600'>Precisa de pelo menos um vídeo</p>}
                {loading && <p className='text-right text-xl my-3 text-blue-500'>Carregando...</p>}

                <label htmlFor="anonymous" className='flex items-center gap-2 justify-end'>
                    <input type='checkbox' id="anonymous" value={'true'} {...register("anonymous")} /> Denúncia anônima?
                </label>

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