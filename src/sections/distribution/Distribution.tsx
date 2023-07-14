import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  ListSubheader,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Pagination,
  Box,
  TextareaAutosize,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState, useMemo } from 'react';
import { User } from 'src/@types/user';
import Iconify from 'src/components/Iconify';
import { dispatch } from 'src/redux/store';
import { createMessagesThunk } from 'src/redux/thunks/messages';

type Option = User;

const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

interface IDistribution {
  userList: User[];
}

const Distribution = ({ userList }: IDistribution) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const displayedOptions = useMemo(
    () => userList.filter((user: User) => containsText(user.nickname, searchText)),
    [searchText]
  );

  const setSelectedAll = () => {
    setIsSelectedAll(!isSelectedAll);
    if (!isSelectedAll) {
      setSelectedOption(userList.map((user: User) => user.nickname));
    } else {
      setSelectedOption([]);
    }
  };

  const handleSetMessage = (val: any) => {
    if (String(val)?.length <= 4095) {
      setMessageText(val);
    }
  };

  const itemsPerPage: number = 8;
  const totalPages: number = Math.ceil(displayedOptions.length / itemsPerPage);
  const startIndex: number = (page - 1) * itemsPerPage;
  const endIndex: number = startIndex + itemsPerPage;
  let paginatedOptions: Option[];

  if (!searchText.trim()) {
    paginatedOptions = displayedOptions.slice(startIndex, endIndex);
  } else {
    const totalOptions: number = displayedOptions.length;
    const totalPages: number = Math.ceil(totalOptions / itemsPerPage);

    if (totalOptions === 0) {
      paginatedOptions = [];
    } else if (totalOptions <= itemsPerPage) {
      paginatedOptions = displayedOptions;
    } else {
      if (page === totalPages) {
        paginatedOptions = displayedOptions.slice(startIndex);
      } else {
        paginatedOptions = displayedOptions.slice(startIndex, endIndex);
      }
    }
  }

  const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSend = async () => {
    if (selectedOption.length === 0) {
      return enqueueSnackbar('Не выбран список пользователей', { variant: 'error' });
    }
    if (messageText.trim() === '') {
      return enqueueSnackbar('Не указано сообщение', { variant: 'error' });
    }

    const selectedUserIds = selectedOption.map((selectedNickname) => {
      const selectedUser = userList.find((user: User) => user.nickname === selectedNickname);
      return selectedUser ? selectedUser.userId : null;
    });

    const filteredUserIds = selectedUserIds.filter((userId) => userId !== null);

    setSelectedOption([]);
    setMessageText('');
    await dispatch(
      createMessagesThunk({
        users: filteredUserIds,
        message: messageText,
      })
    );
    return enqueueSnackbar('Сообщение успешно отправлено', { variant: 'success' });
  };
  return (
    <>
      <Typography variant="h3" component="h1" paragraph>
        Рассылка сообщений
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 4 }}>
        <FormControl fullWidth sx={{ maxWidth: 320, width: '100%' }}>
          <InputLabel id="search-select-label">Пользователи</InputLabel>
          <Select
            MenuProps={{ autoFocus: false }}
            labelId="search-select-label"
            id="search-select"
            value={selectedOption}
            label="Пользователи"
            multiple
            input={<OutlinedInput label="Пользователи" />}
            renderValue={(selected) => selected.join(', ')}
            onChange={(e) => setSelectedOption(e?.target?.value as string[])}
            onClose={() => setSearchText('')}
          >
            <ListSubheader sx={{ marginBottom: 2 }}>
              <Button
                size="large"
                variant="contained"
                sx={{ width: '100%' }}
                onClick={setSelectedAll}
              >
                {isSelectedAll ? 'Отменить выбор всех' : 'Выбрать всех'}
              </Button>
            </ListSubheader>

            <ListSubheader>
              <TextField
                size="small"
                autoFocus
                placeholder="Поиск..."
                fullWidth
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
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Escape') {
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
            {paginatedOptions.map((option: Option, i: number) => (
              <MenuItem key={i} value={option.nickname}>
                {option.nickname}
              </MenuItem>
            ))}
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Box>
          </Select>
        </FormControl>
        <TextareaAutosize
          id="outlined-basic"
          placeholder="Введите сообщение"
          minRows={3} // Можно настроить минимальное количество строк
          maxRows={10} // Можно настроить максимальное количество строк
          value={messageText}
          onChange={(e) => handleSetMessage(e.target.value)}
          style={{ maxWidth: 320, width: '100%' }}
          // @ts-ignore
          inputProps={{
            maxLength: 4096,
          }}
        />
        ;
        <Button size="large" variant="contained" onClick={handleSend}>
          Отправить
        </Button>
      </Box>
    </>
  );
};

export default Distribution;
