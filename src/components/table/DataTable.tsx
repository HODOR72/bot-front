// @mui
import { TableContainer, Table, TablePagination, Card } from '@mui/material';
import { TableHeadCustom } from './index';
import { ListParams, Pagination } from '../../@types/common';
import { ReactNode } from 'react';
//

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  headLabel: any[];
  pagination?: Pagination | undefined;
  params?: ListParams;
  onSort?: (id: string) => void;
  onPage?: (id: number) => void;
};

export default function DataTable({ children, headLabel, pagination, params, onSort, onPage }: Props) {
  return (
    <Card>
      <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
        <Table size={'medium'}>
          <TableHeadCustom
            order={ params ? (params.order === 'asc' ? 'desc' : 'asc') : undefined }
            orderBy={ params ? params.order_by : undefined }
            headLabel={ headLabel }
            onSort={ onSort }
          />
          { children }
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={ [pagination.per_page] }
          component="div"
          count={ pagination.total }
          rowsPerPage={ pagination.per_page }
          page={ pagination.current_page - 1 }
          onPageChange={ ((_event: any, page: number) => onPage && onPage(page + 1)) }
        />
      )}
    </Card>
  );
}
