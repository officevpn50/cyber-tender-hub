import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export const FilterBar = ({ statusFilter, onStatusChange }: FilterBarProps) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px] h-12">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="sealed">Sealed</SelectItem>
          <SelectItem value="open">Open</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
