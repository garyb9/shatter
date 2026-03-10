import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  width?: string;
}

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ $width?: string }>`
  text-align: left;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${theme.colors.border};
  white-space: nowrap;
  width: ${(p) => p.$width ?? 'auto'};
`;

const Td = styled.td`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  vertical-align: middle;

  tr:last-child & {
    border-bottom: none;
  }
`;

const Tr = styled.tr`
  transition: background 0.1s ease;

  &:hover {
    background: ${theme.colors.codeBackground};
  }
`;

const Empty = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`;

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

function DataTable<T>({
  columns,
  data,
  emptyMessage = 'No data',
  keyExtractor,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <Empty>{emptyMessage}</Empty>;
  }

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            {columns.map((col) => (
              <Th key={col.key} $width={col.width}>
                {col.header}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Tr key={keyExtractor(row)}>
              {columns.map((col) => (
                <Td key={col.key}>{col.render(row)}</Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

export default DataTable;
