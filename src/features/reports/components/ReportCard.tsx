import { useEffect, useState } from "react";
import { ReportStatus, type Report } from "../types/report.types"
import { EditReportDialogButton } from "./EditReportDialogButton";
import { DeleteButton } from "./DeleteButton";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { UserType } from "@/features/auth/types";
import { SendReportToReviewDialogButton } from "./SendReportToReviewDialogButton";
import { ViewReportButton } from "./ViewReportButton";


export const ReportCard = ({ report, fetchReports }: { report: Report, fetchReports?: () => Promise<void> }) => {
    const { user } = useAuth();

    const [count, setCount] = useState<number>(0)
    const [statusMessage, setStatusMessage] = useState<string>("")
    useEffect(() => {
        const statusMessage = () => {
            switch (report.status) {
                case ReportStatus.PENDING:
                    setStatusMessage("Pendente");
                    break
                case ReportStatus.UNDER_REVIEW:
                    setCount(1)
                    setStatusMessage("Em Triagem");
                    break
                case ReportStatus.REJECTED:
                    setStatusMessage("Rejeitado");
                    break
                case ReportStatus.IN_PROGRESS:
                    setCount(2)
                    setStatusMessage("Em progresso");
                    break
                case ReportStatus.RESOLVED:
                    setCount(3)
                    setStatusMessage("Resolvido");
                    break
                case ReportStatus.UNRESOLVED:
                    setCount(3)
                    setStatusMessage("Não resolvido")
                    break
                default:
                    setStatusMessage("Desconhecido");
            }
        }
        statusMessage()
    })



    return (<div className="report-card">
        <div className="report-card-header">
            <div className="report-card-heading">
                <h3>Denúncia nº <span>{report.id}</span></h3>
                <p className="report-card-description">{report.description}</p>
            </div>


            <div className="report-card-actions">
                <ViewReportButton report={report} fetchReports={fetchReports} />
                {count < 1 && <>
                    {
                        user?.type == UserType.USER
                            ? <>
                                <EditReportDialogButton report={report} fetchReports={fetchReports} />
                                <DeleteButton id={report.id} fetchReports={fetchReports} />
                            </>
                            : <>
                                {report.status === ReportStatus.PENDING && <SendReportToReviewDialogButton id={report.id} fetchReports={fetchReports} />}
                            </>
                    }</>
                }
            </div>
        </div>


        <p className="report-status-line">Status: <strong>{statusMessage}</strong></p>

        <div className="report-progress" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, index) => <span key={index} className={`report-progress-segment ${index + 1 <= count && count != 0 ? "is-active" : ""}`} />)}
        </div>
        <p className="report-media">{report.midia.length} {report.midia.length > 1 ? "mídias" : "mídia"}</p>

    </div>)
}