import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import { Actions } from 'src/@types/actions';
import * as XLSX from 'xlsx';

interface IHistory {
  actionsList: Actions[];
}

const History: React.FC<IHistory> = ({ actionsList }) => {
  const convertArrayToWorkbook = (data: Actions[]) => {
    const workbook = XLSX.utils.book_new();

    const worksheetData = [
      ['Дата', 'ID', 'Заказ', 'Телефон', 'ID Пользователя'],
      ...data.map((item) => [formatDate(item.date), item.id, item.order, item.phone, item.userId]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    return workbook;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleExportExcel = (list: Actions[], handleFunc: (data: Actions[]) => XLSX.WorkBook) => {
    const workbook = handleFunc(list);

    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, 'historyActions.xlsx');
  };

  return (
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
  );
};

export default History;
