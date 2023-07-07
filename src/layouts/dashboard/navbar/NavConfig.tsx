// components
import SvgIconStyle from '../../../components/SvgIconStyle';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  dashboard: getIcon('ic_dashboard'),
  invoice: getIcon('ic_cart'),
  items: getIcon('ic_menu_item'),
  video: getIcon('ic_kanban'),
};

const navConfig = [
  {
    subheader: 'Администрирование',
    items: [
      { title: 'Рассылка', path: PATH_DASHBOARD.index, icon: ICONS.dashboard },
      { title: 'Сведения об ошибках', path: PATH_DASHBOARD.errors, icon: ICONS.items},
    ],
  },
  // {
  //   subheader: 'Администрирование',
  //   items: [
  //     {
  //       title: 'Пользователи',
  //       path: PATH_DASHBOARD.users.root,
  //       icon: ICONS.user,
  //     },
  //   ],
  // },
];

export default navConfig;
