import { useRef } from "react";
import { Button } from "../../../shared/components/Button";

interface CsvImportButtonProps {
    onFileSelected: (file: File) => void;
    isImporting?: boolean;
}

export function CsvImportButton({
    onFileSelected,
    isImporting = false,
}: CsvImportButtonProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelected(file);
        }
        e.target.value = "";
    };

    return (
        <div className="flex items-center gap-2">
            {/* hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleChange}
                className="hidden"
            />

            <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={isImporting}
                onClick={handleClick}
            >
                Import CSV
            </Button>

            {/* help tooltip */}
            <div className="relative group">
                <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-gray-600 bg-white"
                    aria-label="CSV format help"
                >
                    ?
                </button>
                <div className="absolute right-0 z-20 mt-2 hidden w-72 rounded-md bg-white p-3 text-xs text-gray-700 shadow-lg group-hover:block">
                    <div className="text-[11px] space-y-1 max-w-xs bg-gray-100 p-2 rounded">
                        <p className="font-semibold mb-1">Expected CSV format:</p>

                        <table className="w-full border-collapse text-[10px]">
                            <thead>
                                <tr>
                                    <th className="border px-1 py-0.5 text-left">Date</th>
                                    <th className="border px-1 py-0.5 text-left">Amount</th>
                                    <th className="border px-1 py-0.5 text-left">Description</th>
                                    <th className="border px-1 py-0.5 text-left">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-1 py-0.5">2024-02-01</td>
                                    <td className="border px-1 py-0.5">1000.50</td>
                                    <td className="border px-1 py-0.5">Salary</td>
                                    <td className="border px-1 py-0.5">Deposit</td>
                                </tr>
                                <tr>
                                    <td className="border px-1 py-0.5">2024-02-02</td>
                                    <td className="border px-1 py-0.5">-50.25</td>
                                    <td className="border px-1 py-0.5">Grocery</td>
                                    <td className="border px-1 py-0.5">Withdrawal</td>
                                </tr>
                            </tbody>
                        </table>

                        <p className="mt-1 text-[10px] text-gray-600">
                            Columns must be exactly:
                            <span className="font-mono"> Date,Amount,Description,Type</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}