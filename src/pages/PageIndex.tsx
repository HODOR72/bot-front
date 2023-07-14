// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from 'src/redux/store';
import { getUserListThunk } from 'src/redux/thunks/user';
import History from 'src/sections/history/History';
import UsersList from 'src/sections/usersLIst/UsersList';
import Distribution from 'src/sections/distribution/Distribution';
import { getActionsListThunk } from 'src/redux/thunks/actions';

export default function PageIndex() {
  const { themeStretch } = useSettings();

  const { userList, userListParams } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getUserListThunk(userListParams));
  }, [dispatch, userListParams]);

  const { actionsList, actionsListParams } = useSelector((state: RootState) => state.actions);

  useEffect(() => {
    dispatch(getActionsListThunk(actionsListParams));
  }, [dispatch, actionsListParams]);

  useEffect(() => {
    console.log('update data', userList, actionsList);
  }, [userList, actionsList]);

  return (
    <>
      <Page title="Главная">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Distribution userList={userList || []} />
          <UsersList userList={userList || []} />
          <History actionsList={actionsList || []} />
        </Container>
      </Page>
    </>
  );
}
