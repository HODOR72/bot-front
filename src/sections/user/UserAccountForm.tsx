import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// utils
import { fData } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { UserManager } from '../../@types/user';
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import { CustomFile } from '../../components/upload';
import { useDispatch } from '../../redux/store';
import { getImageThunk, uploadFileThunk } from '../../redux/thunks/files';
import { ImageResize } from '../../@types/files';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<UserManager, 'avatar'> {
  avatar: CustomFile | string | null;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export default function UserAccountForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, update } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    password: Yup.string().test(
      'empty-or-8-characters-check',
      'Пароль должен быть минимум 8 символов',
      password => !password || password.length >= 8,
    ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Пароли не совпадают'),
  });

  const defaultValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      oldPassword: '',
      password: '',
      confirmPassword: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (user) {
      (async () => {
        if (user.avatar) {
          const file = await dispatch(getImageThunk(`user/avatar/${user.avatar}`, 126, 126, ImageResize.RESIZE_BOTH_CENTER));
          if (file) {
            defaultValues.avatar = {
              ...file,
              path: user.avatar,
              preview: URL.createObjectURL(file),
            };
          }
        }
        reset(defaultValues);
      })();
    }
  }, [user]);

  const onSubmit = async (data: FormValuesProps) => {
    // @ts-ignore
    const avatarPath = data.avatar && 'path' in data.avatar ? data.avatar.path : data.avatar;

    const changePassword = data.password && data.password.length > 0 && data.oldPassword && data.oldPassword.length > 0;
    const params = {
      avatar: avatarPath,
      oldPassword: changePassword ? data.oldPassword : undefined,
      password:changePassword ? data.password : undefined,
    };

    try {
      await update(params);
      enqueueSnackbar('Профиль обновлен');
      navigate(PATH_DASHBOARD.root);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        const loadedFileName = await dispatch(uploadFileThunk(file));
        if (loadedFileName) {
          setValue('avatar', {
            ...file,
            path: loadedFileName,
            preview: URL.createObjectURL(file),
          });
        } else {
          enqueueSnackbar('Ошибка загрузки файла', { variant: 'error' });
        }
      }
  },[setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatar"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Форматы *.jpeg, *.jpg, *.png, *.gif
                    <br /> максимальный размер {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RHFTextField disabled name="name" label="Имя" sx={{ mb: 3 }} />
                <RHFTextField disabled name="email" label="Email" sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField name="oldPassword" label="Старый пароль" type={'password'} sx={{ mb: 3 }} />
                <RHFTextField name="password" label="Новый пароль" type={'password'} sx={{ mb: 3 }} />
                <RHFTextField name="confirmPassword" label="Подтверждение пароля" type={'password'} sx={{ mb: 3 }} />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {'Сохранить'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
