import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { saveAs } from 'file-saver';
import { User } from 'src/@types/user';
import * as XLSX from 'xlsx';

interface IUsersList {
  userList: User[];
}

const UsersList: React.FC<IUsersList> = ({ userList }) => {
  const convertArrayToWorkbookUsers = (data: User[]) => {
    const workbook = XLSX.utils.book_new();
    console.log(data);

    const worksheetData = [
      ['Имя', 'Фамилия', 'Никнейм', 'Телефон', 'ID Пользователя'],
      ...data.map((item) => [item.name, item.surname, item.nickname, item.phone, item.userId]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    return workbook;
  };

  const handleExportExcel = (list: User[], handleFunc: (data: User[]) => XLSX.WorkBook) => {
    const workbook = handleFunc(list);

    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, 'usersList.xlsx');
  };

  return (
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
  );
};

export default UsersList;
