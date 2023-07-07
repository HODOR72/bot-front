// @mui
import { TableRow, TableCell } from '@mui/material';
import EmptyContent from '../EmptyContent';
//

// ----------------------------------------------------------------------

type Props = {
  isNotFound: boolean;
};

export default function TableNoData({ isNotFound }: Props) {
  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            title="Список пуст"
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
