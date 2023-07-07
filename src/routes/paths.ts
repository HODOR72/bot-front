
function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  index: path(ROOTS_DASHBOARD, '/index'),
  errors: path(ROOTS_DASHBOARD, '/errors'),
  users: {
    root: path(ROOTS_DASHBOARD, '/users'),
    account: path(ROOTS_DASHBOARD, '/users/account'),
    new: path(ROOTS_DASHBOARD, '/users/new'),
    edit: (id: number) => path(ROOTS_DASHBOARD, `/users/${id}/edit`),
  },
};
