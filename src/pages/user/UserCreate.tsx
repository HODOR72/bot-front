import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../sections/user/UserNewEditForm';
import { useDispatch } from '../../redux/store';
import { useEffect } from 'react';
import { getUserSuccess } from '../../redux/slices/user';
import { getUserThunk } from '../../redux/thunks/user';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  useEffect(() => {
    if(id) {
      dispatch(getUserThunk(Number(id)))
    }
    else {
      dispatch(getUserSuccess(null))
    }
  }, [id])

  return (
    <Page title="Пользователи">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Создание пользователя' : 'Редактирование пользователя'}
          links={[
            { name: 'Главная', href: PATH_DASHBOARD.root },
            { name: 'Пользователи', href: PATH_DASHBOARD.users.root },
            { name: !isEdit ? 'Новый пользователь' : `Редактирование пользователя (ID=${id})` },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
