import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import ApiClients from 'src/utils/axios';
import { dispatch } from 'src/redux/store';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

type FormValuesProps = {
  login: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

const { axiosBase } = ApiClients;

export default function LoginForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    login: Yup.string().email('Некорректный email').required('Введите email'),
    password: Yup.string().required('Введите пароль'),
  });

  const defaultValues = {
    login: '',
    password: '',
    remember: true,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const login = async () => {
    const { login, password } = methods.getValues();
    console.log(login, password)
    try {
      const response = await axiosBase.get(`/login?login=${login}&password=${password}`);

      console.log(response);
      Cookies.set('logged', 'True');

      dispatch({ type: 'LOGIN' });

      navigate(PATH_DASHBOARD.index);
    } catch (error) {
      enqueueSnackbar('Неправильный логин или пароль', { variant: 'error' });
      console.error(error);
    }
  };
  return (
    <FormProvider methods={methods}>
      <Stack spacing={3}>
        <RHFTextField name="login" label="Логин" />

        <RHFTextField
          name="password"
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/*<RHFCheckbox name="remember" label="Запомнить" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Забыли пароль?
        </Link>*/}
      </Stack>

      <LoadingButton fullWidth size="large" variant="contained" onClick={() => login()}>
        Вход
      </LoadingButton>
    </FormProvider>
  );
}
