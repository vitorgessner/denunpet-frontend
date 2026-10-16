import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import type { Report } from "../types/report.types";
import { EditReportDialog } from "./EditReportDialog";
import { useState } from "react";

export function EditReportDialogButton({ report, fetchReports }: { report: Report, fetchReports?: () => Promise<void> }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Pencil size={14} /></Button>
            </DialogTrigger>

            <EditReportDialog report={report} setIsOpen={setIsOpen} fetchReports={fetchReports}/>
        </Dialog>
    )
}