import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  TableBody,
  Container,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  DataTable,
} from '../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/user/list';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { deleteUserThunk, getUserListThunk } from '../../redux/thunks/user';
import { setUserListParams } from '../../redux/slices/user';
import useOpen from '../../hooks/useOpen';
import ConfirmDialog from '../../components/ConfirmDialog';
import { User } from '../../@types/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Имя', align: 'left', sortable: true },
  { id: 'email', label: 'Email', align: 'left', sortable: true },
  { id: 'permissions', label: 'Права', align: 'left' },
  { id: 'status', label: 'Статус', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userList, userListParams } = useSelector((state: RootState) => state.user)

  const { open: openDeleteConfirm, object: openDeleteObject, onOpen: onOpenDeleteConfirm, onClose: onCloseDeleteConfirm } = useOpen<User>();

  useEffect(() => {
    dispatch(getUserListThunk(userListParams))
  }, [dispatch, userListParams])

  const handleDeleteRow = (id: number) => {
    onOpenDeleteConfirm(userList.data?.find(user => user.id === id))
  };

  const handleDeleteRowConfirmed = () => {
    if(openDeleteObject) {
      dispatch(deleteUserThunk(openDeleteObject.id));
    }
  };

  const handleEditRow = (id: number) => {
    navigate(PATH_DASHBOARD.users.edit(id));
  };

  const handleFilterName = (name: string) => {
    dispatch(setUserListParams({
      ...userListParams,
      name: name.trim().length > 0 ? name : undefined
    }))
  };

  const handleFilterPermission = (value: string) => {
    dispatch(setUserListParams({
      ...userListParams,
      permission: value.length > 0 ? value : undefined
    }))
  };

  const handleFilterStatus = (active: boolean | undefined) => {
    dispatch(setUserListParams({
      ...userListParams,
      active
    }))
  };

  const handlePageChange = (page: number) => {
    dispatch(setUserListParams({
      ...userListParams,
      page
    }))
  };

  const handleSortChange = (order_by: string) => {
    const isAsc = userListParams.order_by === order_by && userListParams.order === 'asc';
    dispatch(setUserListParams({
      ...userListParams,
      order: isAsc ? 'desc' : 'asc',
      order_by,
      page: 1
    }))
  };

  return (
    <Page title="Пользователи">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Пользователи"
          links={[
            { name: 'Главная', href: PATH_DASHBOARD.root },
            { name: 'Пользователи', href: PATH_DASHBOARD.users.root },
            { name: 'Список' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.users.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Пользователь
            </Button>
          }
        />

        <UserTableToolbar
          filterName={ userListParams.name }
          filterPermission={ userListParams.permission }
          filterStatus={ userListParams.active }
          onFilterName={ handleFilterName }
          onFilterPermission={ handleFilterPermission }
          onFilterStatus={ handleFilterStatus }
        />

        <DataTable
          headLabel={ TABLE_HEAD }
          pagination={ userList.meta }
          params={ userListParams }
          onSort={ handleSortChange }
          onPage={ handlePageChange }
        >
          <TableBody>
            {userList.data?.map((row) => (
                <UserTableRow
                  key={row.id}
                  row={row}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                  onEditRow={() => handleEditRow(row.id)}
                />
              ))}

            <TableNoData isNotFound={ userList.data?.length === 0 } />
          </TableBody>
        </DataTable>
        <ConfirmDialog
          open={openDeleteConfirm}
          text={`Вы действительно хотите удалить пользователя "${openDeleteObject?.name}"?`}
          onClose={onCloseDeleteConfirm}
          onConfirm={handleDeleteRowConfirmed}
        />
      </Container>
    </Page>
  );
}
