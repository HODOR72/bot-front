import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import { USER_PERMISSIONS } from '../../../@types/user';

// ----------------------------------------------------------------------

const PERMISSION_OPTIONS = [{ name: '', title: 'Все' }, ...USER_PERMISSIONS];

const STATUS_OPTIONS = [
  { name: '', title: 'Все' },
  { name: 'true', title: 'Активен' },
  { name: 'false', title: 'Заблокирован' },
];

type Props = {
  filterName?: string;
  filterPermission?: string;
  filterStatus?: boolean | undefined;
  onFilterName: (value: string) => void;
  onFilterPermission: (value: string) => void;
  onFilterStatus: (value: boolean | undefined) => void;
};

export default function UserTableToolbar({
  filterName,
  filterPermission,
  filterStatus,
  onFilterName,
  onFilterPermission,
  onFilterStatus,
}: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2 }}>
      <TextField
        fullWidth
        select
        label="Права"
        value={filterPermission || PERMISSION_OPTIONS[0].name}
        onChange={(e) => onFilterPermission(e.target.value)}
        sx={{
          maxWidth: { sm: 240 },
        }}
      >
        {PERMISSION_OPTIONS.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Статус"
        value={filterStatus ? 'true' : filterStatus === false ? 'false' : ''}
        onChange={(e) =>
          onFilterStatus(
            e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined
          )
        }
        sx={{
          maxWidth: { sm: 240 },
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Поиск..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
