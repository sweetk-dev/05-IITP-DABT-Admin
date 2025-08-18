import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Box, Typography } from '@mui/material';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
}

interface DataTableProps<T> {
  id?: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  selectedIds: Array<string | number>;
  onToggleRow: (id: string | number) => void;
  onToggleAll: (checked: boolean) => void;
  emptyText?: string;
}

export default function DataTable<T>({ id, columns, rows, getRowId, selectedIds, onToggleRow, onToggleAll, emptyText = '표시할 데이터가 없습니다.' }: DataTableProps<T>) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < rows.length;

  return (
    <Box id={id}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox indeterminate={someSelected} checked={allSelected} onChange={(e) => onToggleAll(e.target.checked)} />
            </TableCell>
            {columns.map(col => (
              <TableCell key={col.key} style={{ width: col.width }}>{col.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <Typography variant="body2" color="text.secondary">{emptyText}</Typography>
              </TableCell>
            </TableRow>
          ) : rows.map(row => {
            const idVal = getRowId(row);
            const checked = selectedIds.includes(idVal);
            return (
              <TableRow key={String(idVal)} hover>
                <TableCell padding="checkbox"><Checkbox checked={checked} onChange={() => onToggleRow(idVal)} /></TableCell>
                {columns.map(col => (
                  <TableCell key={col.key}>{col.render ? col.render(row) : (row as any)[col.key]}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}


