// @mui
import { Box, Button, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';

export default function PageErrors() {
  const { themeStretch } = useSettings();

  return (
    <>
      <Page title="История запросов">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="h3" component="h1" paragraph>
              История запросов
            </Typography>
            <Button size="large" variant="contained">
              Загрузить
            </Button>
          </Box>
        </Container>
      </Page>
    </>
  );
}
