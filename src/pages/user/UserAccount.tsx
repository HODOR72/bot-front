// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserAccountForm from '../../sections/user/UserAccountForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Мой профиль">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Редактирование профиля'}
          links={[
            { name: 'Главная', href: PATH_DASHBOARD.root },
            { name: 'Редактирование профиля' },
          ]}
        />

        <UserAccountForm />
      </Container>
    </Page>
  );
}
