import { useEffect, useMemo, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, IconButton, TableCell, TableRow, Typography } from '@mui/material';
// @types
import { User, USER_PERMISSIONS } from '../../../@types/user';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import { getImageThunk } from '../../../redux/thunks/files';
import { useDispatch } from '../../../redux/store';
import { ImageResize } from '../../../@types/files';

// ----------------------------------------------------------------------

type Props = {
  row: User;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  onEditRow,
  onDeleteRow,
}: Props) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { name, email, avatar, active, permissions } = row;

  const [avaratUrl, setAvatarUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if(avatar) {
        (async () => {
          const file = await dispatch(getImageThunk(`user/avatar/${avatar}`, 40, 40, ImageResize.RESIZE_BOTH_CENTER))
          if (file) {
            setAvatarUrl(URL.createObjectURL(file))
          }
        })();
    }
  }, [avatar])

  const permissionString = useMemo(() => {
    return permissions?.map(p => USER_PERMISSIONS.find(up => p.name === up.name)?.title).join(', ')
  }, [permissions])

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={avaratUrl} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left">{email}</TableCell>

      <TableCell align="left">
        {permissionString}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={active ? 'success' : undefined}
        >
          {active ? 'активен' : 'заблокирован'}
        </Label>
      </TableCell>

      <TableCell align="right">
        <IconButton
          size="small"
          onClick={ () => onEditRow() }
        >
          <Iconify icon={'eva:edit-fill'} />
        </IconButton>
        <IconButton
          size="small"
          onClick={ () => onDeleteRow() }
        >
          <Iconify icon={'eva:trash-2-outline'} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
