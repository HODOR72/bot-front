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
import { User } from 'src/@types/user';
import { createMessagesThunk } from 'src/redux/thunks/messages';
import { getActionsListThunk } from 'src/redux/thunks/actions';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

type Option = User;

const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export default function PageIndex() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const { userList, userListParams } = useSelector((state: RootState) => state.user);

  const displayedOptions = useMemo(
    () =>
      userList &&
      userList.length &&
      userList.filter((user: User) => containsText(user.name, searchText)),
    [searchText, userList]
  );

  useEffect(() => {
    dispatch(getUserListThunk(userListParams));
  }, [dispatch, userListParams]);

  const { actionsList, actionsListParams } = useSelector((state: RootState) => state.actions);

  useEffect(() => {
    dispatch(getActionsListThunk(actionsListParams));
  }, [dispatch, actionsListParams]);

  if (!userList || !userList.length || !actionsList.length) {
    return null;
  }

  const setSelectedAll = () => {
    setIsSelectedAll(!isSelectedAll);
    if (!isSelectedAll) {
      setSelectedOption(userList.map((user: User) => user.nickname));
    } else {
      setSelectedOption([]);
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

  const convertArrayToWorkbook = (data: any) => {
    // Создаем новую книгу
    const workbook = XLSX.utils.book_new();

    // Преобразуем массив в формат данных, понятный для библиотеки XLSX
    const worksheetData = [
      ['Дата', 'ID', 'Заказ', 'Телефон', 'ID Пользователя'], // Названия колонок
      ...data.map((item: any) => [
        formatDate(item.date), // Форматируем дату в нормальный вид
        item.id,
        item.order,
        item.phone,
        item.userId,
      ]),
    ];

    // Создаем новый лист с данными
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    return workbook;
  };

  const convertArrayToWorkbookUsers = (data: any) => {
    // Создаем новую книгу
    const workbook = XLSX.utils.book_new();
    console.log(data);

    // Преобразуем массив в формат данных, понятный для библиотеки XLSX
    const worksheetData = [
      ['Имя', 'Фамилия', 'Никнейм', 'Телефон', 'ID Пользователя'], // Названия колонок
      ...data.map((item: any) => [item.name, item.surname, item.nickname, item.phone, item.userId]),
    ];

    // Создаем новый лист с данными
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    return workbook;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleExportExcel = (list: any, handleFunc: any) => {
    const workbook = handleFunc(list);

    // Преобразуем книгу в бинарные данные
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    // Создаем Blob для сохранения файла
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Сохраняем файл
    saveAs(excelBlob, 'data.xlsx');
  };

  return (
    <>
      <Page title="Главная">
        <Container maxWidth={themeStretch ? false : 'xl'}>
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
                renderValue={(selected) => (selected as any).join(', ')}
                onChange={(e) => setSelectedOption(e?.target?.value as any)}
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
            <TextField
              id="outlined-basic"
              label="Введите сообщение"
              variant="outlined"
              sx={{ maxWidth: 320, width: '100%' }}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <Button size="large" variant="contained" onClick={handleSend}>
              Отправить
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Typography variant="h3" component="h1" paragraph>
              История запросов
            </Typography>
            <Button
              size="large"
              variant="contained"
              onClick={() => handleExportExcel(actionsList, convertArrayToWorkbook)}
            >
              Загрузить
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Typography variant="h3" component="h1" paragraph>
              Пользователи
            </Typography>
            <Button
              size="large"
              variant="contained"
              onClick={() => handleExportExcel(userList, convertArrayToWorkbookUsers)}
            >
              Загрузить
            </Button>
          </Box>
        </Container>
      </Page>
    </>
  );
}
