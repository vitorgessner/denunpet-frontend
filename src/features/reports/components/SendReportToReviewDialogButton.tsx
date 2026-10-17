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
import { ClipboardPlus } from "lucide-react"
import { useState } from "react"

export function SendReportToReviewDialogButton({ id, fetchReports }: { id: number, fetchReports?: () => Promise<void> }) {
    const [open, setOpen] = useState(false);
    const [isReasonFieldOpen, setIsReasonFieldOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [reasonError, setReasonError] = useState(false);

    const handleSubmit = async () => {
        try {
            await api.put(`/api/report/${id}/send-to-review`)
            setOpen(false)
            if (fetchReports)
                await fetchReports()
        } catch (error) {
            console.error(error)
        }
    }

    const handleReject = async () => {
        if (!reason) {
            setReasonError(true);
            return;
        }
        try {
            await api.put(`/api/report/${id}/reject`, { reason })
            setOpen(false);
            setReasonError(false);
            if (fetchReports)
                await fetchReports()
        } catch (error) {
            console.error(error)
        }
    }

    return (<Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} variant="outline"><ClipboardPlus size={14} /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] pl-4">

            <DialogHeader>
                <DialogTitle>Assumir denúncia para triagem</DialogTitle>
                <DialogDescription className="py-5">
                    Ao assumir esta denúncia, sua ONG será a responsável por acompanhar e gerenciar o caso.
                    <br />
                    A denúncia será movida para o status <b>Em triagem</b> e não poderá ser triada por outras ONGs.
                </DialogDescription>
                {isReasonFieldOpen && <label htmlFor="">
                    Razão: <input type="text" name="reason" value={reason} className="border-2 w-full rounded-sm" onChange={(e) => setReason(e.target.value)}/>
                </label>}
                {reasonError && <p className="text-red-600 text-sm text-right">Uma razão é obrigatória para rejeitar a denúncia</p>}
            </DialogHeader>

            <DialogFooter className="flex flex-row items-center justify-center">
                <DialogClose asChild>
                    <Button variant="outline" onClick={() => {
                        setIsReasonFieldOpen(false);
                        setReasonError(false);
                    }}>Cancelar</Button>
                </DialogClose>
                {!isReasonFieldOpen && <Button variant="destructive" onClick={() => setIsReasonFieldOpen(!isReasonFieldOpen)}>Rejeitar denúncia</Button>}
                {isReasonFieldOpen && <Button variant="destructive" onClick={handleReject}>Confirmar rejeição</Button>}
                {!isReasonFieldOpen && <Button variant="secondary" onClick={handleSubmit} type="submit">Assumir Denúncia</Button>}
            </DialogFooter>
        </DialogContent>

    </Dialog>
    )
}