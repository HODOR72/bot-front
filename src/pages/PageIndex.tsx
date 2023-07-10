// @mui
import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  TextField,
  Typography,
} from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import { useEffect, useMemo, useState } from 'react';
import Iconify from 'src/components/Iconify';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from 'src/redux/store';
import { getUserListThunk } from 'src/redux/thunks/user';
import Cookies from 'js-cookie';
import axios from 'axios';

type Option = string;

const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const allOptions: Option[] = [
  'Option One2',
  'Option One2',
  'Option One2',
  'Option One2',
  'Option One2',
  'Option One2',
  'Option One2',
  'Option One2',
  'Option One2',
  'Option One2',
  'Option Two',
  'Option Three',
  'Option Four',
  'Option One',
  'Option Two',
  'Option One3',
  'Option Three',
  'Option Four',
];

export default function PageIndex() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  // Cookies.set('logged', 'True');

  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');

  const { userList, userListParams } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getUserListThunk(userListParams));
  }, [dispatch, userListParams]);

  console.log(userList);
  // useEffect(() => {
  //   const send = async () => {
  //     try {
  //       const response = await fetch('https://c9f0-176-40-245-92.ngrok-free.app/getUsers');
  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error('Произошла ошибка:', error);
  //     }
  //   };

  //   send();
  // }, []);

  const displayedOptions = useMemo(
    () => allOptions.filter((option) => containsText(option, searchText)),
    [searchText]
  );

  const setSelectedAll = () => {
    setIsSelectedAll(!isSelectedAll);
    if (!isSelectedAll) {
      setSelectedOption(allOptions);
    } else {
      setSelectedOption([]);
    }
  };

  const [page, setPage] = useState<number>(1);
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

  const handleSend = () => {
    if (selectedOption?.length == 0) {
      return enqueueSnackbar('Не выбран список пользователей', { variant: 'error' });
    }
    if (messageText.trim() == '') {
      return enqueueSnackbar('Не указано сообщение', { variant: 'error' });
    }
    console.log('Selected Options:', selectedOption);
    console.log('Message Text:', messageText);

    setSelectedOption([]);
    setMessageText('');
  };

  return (
    <>
      <Page title="Главная">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Typography variant="h3" component="h1" paragraph>
            Рассылка сообщений
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
                renderValue={(selected) => (selected as Option[]).join(', ')}
                onChange={(e) => setSelectedOption(e?.target?.value as Option[])}
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
                  <MenuItem key={i} value={option}>
                    {option}
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
            <TextField
              id="outlined-basic"
              label="Введите сообщение"
              variant="outlined"
              sx={{ maxWidth: 320, width: '100%' }}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <Button size="large" variant="contained" onClick={handleSend}>
              Отправить
            </Button>
          </Box>
        </Container>
      </Page>
    </>
  );
}
