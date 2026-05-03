export default function ColorChip({
    color,
}: { color: string }) {
    return (
        <span
            style={{ backgroundColor: color }}
            className="w-4 h-4 rounded-full inline-block flex-shrink-0"
        />
    )
}