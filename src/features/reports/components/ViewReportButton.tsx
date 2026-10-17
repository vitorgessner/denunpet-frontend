import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { useState } from "react"
import type { Report } from "../types/report.types"
import { ViewReportDetailsDialog } from "./ViewReportDetailsDialog"


export const ViewReportButton = ({ report, fetchReports }: { report: Report, fetchReports?: () => Promise<void> }) => {
    const [open, setOpen] = useState(false)

    return (<Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setOpen(true)}><Eye size={14} /></Button>
        </DialogTrigger>
        <ViewReportDetailsDialog report={report} fetchReports={fetchReports}/>

    </Dialog>
    )
}