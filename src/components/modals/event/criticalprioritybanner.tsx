import { Priority } from "@/app/types"

export default function CriticalPriorityBanner({
    priority
}: {
    priority: Priority
}) {

    return (
        <div>
            {
                priority.critical() && (
                    <div className="bg-status-red text-surface-light p-2 mb-2 rounded">
                        ⚠️ PRIORITY CALL: Life threat to patient/ provider
                    </div>
                )
            }
        </div>
    )
}