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
    if (userListParams) {
      dispatch(getUserListThunk(userListParams));
    }
  }, [dispatch, userListParams]);

  const { actionsList, actionsListParams } = useSelector((state: RootState) => state.actions);

  useEffect(() => {
    if (actionsListParams) {
      dispatch(getActionsListThunk(actionsListParams));
    }
  }, [dispatch, actionsListParams]);

  return (
    <>
      <Page title="Главная">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          {userList && userList.length > 0 && <Distribution userList={userList} />}
          {userList && userList.length > 0 && <UsersList userList={userList} />}
          {actionsList && actionsList.length > 0 && <History actionsList={actionsList} />}
        </Container>
      </Page>
    </>
  );
}
