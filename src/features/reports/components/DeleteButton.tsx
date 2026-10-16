import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { Trash } from "lucide-react"
import { useState } from "react"



export const DeleteButton = ({ id, fetchReports }: { id: number, fetchReports?: () => Promise<void> }) => {
    const [open, setOpen] = useState(false)


    const handleSubmit = async () => {

        try {
            await api.delete(`/api/report/${id}`)
            setOpen(false)
            if (fetchReports) {
                await fetchReports();
            }
        } catch (error) {
            console.error(error)
        }
    }


    return (<Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} variant="destructive"><Trash size={14} /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">

            <DialogHeader>
                <DialogTitle>Excluir denúncia</DialogTitle>
                <DialogDescription>
                    Tem certeza que deseja excluir a <span className="font-bold">Denúncia {id}</span>?
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-row items-center justify-center">
                <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleSubmit} type="submit">Sim, excluir</Button>
            </DialogFooter>

        </DialogContent>

    </Dialog>
    )
}