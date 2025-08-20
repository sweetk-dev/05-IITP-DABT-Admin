import DataTable, { type DataTableColumn } from './DataTable';

interface TableListBodyProps<Row> {
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  getRowId: (row: Row) => number | string;
  selectedIds?: Array<number | string>;
  onToggleRow?: (id: number | string) => void;
  onToggleAll?: (checked: boolean) => void;
}

export default function TableListBody<Row>({ columns, rows, getRowId, selectedIds, onToggleRow, onToggleAll }: TableListBodyProps<Row>) {
  return (
    <DataTable
      id="table-list-body"
      columns={columns as any}
      rows={rows as any}
      getRowId={getRowId as any}
      selectedIds={selectedIds as any}
      onToggleRow={onToggleRow as any}
      onToggleAll={onToggleAll as any}
    />
  );
}


