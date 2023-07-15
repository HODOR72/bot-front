// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from 'src/redux/store';
import { getUserListThunk } from 'src/redux/thunks/user';
import History from 'src/sections/history/History';
import UsersList from 'src/sections/usersLIst/UsersList';
import Distribution from 'src/sections/distribution/Distribution';
import { getActionsListThunk } from 'src/redux/thunks/actions';

export default function PageIndex() {
  // const { themeStretch } = useSettings();
  // const [userListLoaded, setUserListLoaded] = useState(false);

  // const { userList, userListParams } = useSelector((state: RootState) => state.user);

  // const { actionsList, actionsListParams } = useSelector((state: RootState) => state.actions);

  // useEffect(() => {
  //   dispatch(getUserListThunk(userListParams)).then(() => {
  //     setUserListLoaded(true);
  //   });
  // }, [dispatch, userListParams]);

  // useEffect(() => {
  //   dispatch(getActionsListThunk(actionsListParams));
  // }, [dispatch, actionsListParams]);
  let tg = window.Telegram.WebApp;
  const { first_name, last_name, username }: any = window.Telegram.WebApp.initDataUnsafe.user;
  tg.expand();

  console.log(window.Telegram.WebApp.initDataUnsafe);
  return (
    <>
      <Page title="Главная">
        <p>{first_name}</p>
        <p>{last_name}</p>
        <p>{username}</p>
        {/* <Container maxWidth={themeStretch ? false : 'xl'}>
          {userListLoaded && (
            <>
              <Distribution userList={userList || []} />
              <UsersList userList={userList || []} />
            </>
          )}
          <History actionsList={actionsList || []} />
        </Container> */}
      </Page>
    </>
  );
}
