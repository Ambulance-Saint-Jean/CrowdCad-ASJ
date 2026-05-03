import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { MoreVertical } from "lucide-react";

export default function OptionEllipsis({
    children,
    show,
    showLogFn,
    deleteFn

}: {
    children?: React.ReactNode;
    show: boolean;
    showLogFn: () => void;
    deleteFn: () => Promise<void> | void;
}) {

    return (
        <Dropdown placement="bottom-end" offset={6}>
            <DropdownTrigger>
                <button
                    className="p-0 m-0 border-0 bg-transparent text-surface-light hover:text-status-blue transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Call actions"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Call actions">
                <DropdownItem
                    key="showLog"
                    onPress={() => showLogFn()}
                >
                    {show ? 'Hide Log' : 'Show Log'}
                </DropdownItem>

                <>
                    {children}
                </>

                <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={async () => {
                        if (confirm('Are you sure you want to delete this call? This action cannot be undone.')) {
                            await deleteFn()
                        }
                    }}
                >
                    Delete Call
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}