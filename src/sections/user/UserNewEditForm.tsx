import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
// utils
import { fData } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { USER_PERMISSIONS, UserManager } from '../../@types/user';
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import { CustomFile } from '../../components/upload';
import { createUserThunk, editUserThunk } from '../../redux/thunks/user';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getImageThunk, uploadFileThunk } from '../../redux/thunks/files';
import { resetError } from '../../redux/slices/user';
import { ImageResize } from '../../@types/files';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<UserManager, 'avatar'> {
  avatar: CustomFile | string | null;
  password: string;
  confirmPassword: string;
  permissionNames: string[];
}

type Props = {
  isEdit: boolean;
};

export default function UserNewEditForm({ isEdit }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error } = useSelector((state: RootState) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Имя обязательно к заполнению'),
    email: Yup.string().required('Email обязателен к заполнению').email(),
    password: Yup.string().test(
      'empty-or-8-characters-check',
      'Пароль должен быть минимум 8 символов',
      (password) => !password || password.length >= 8
    ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Пароли не совпадают'),
  });

  const defaultValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      active: user ? user.active : true,
      password: '',
      confirmPassword: '',
      permissionNames: user?.permissions.map((p) => p.name) || [],
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
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && user) {
      (async () => {
        if (user.avatar) {
          const file = await dispatch(
            getImageThunk(`user/avatar/${user.avatar}`, 126, 126, ImageResize.RESIZE_BOTH_CENTER)
          );
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
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, user]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error?.message, { variant: 'error' });
      dispatch(resetError());
    }
  }, [error]);

  const onSubmit = async (data: FormValuesProps) => {
    // @ts-ignore
    const avatarPath = data.avatar && 'path' in data.avatar ? data.avatar.path : data.avatar;

    const params = {
      ...data,
      avatar: avatarPath,
      password: data.password && data.password.length > 0 ? data.password : undefined,
      confirmPassword: undefined,
      permissions: data.permissionNames,
    };

    const result = isEdit
      ? await dispatch(editUserThunk(user?.id || 0, params))
      : await dispatch(createUserThunk(params));

    if (result) {
      reset();
      enqueueSnackbar(!isEdit ? 'Пользователь создан' : 'Пользователь обновлен');
      navigate(PATH_DASHBOARD.users.root);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
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
    },
    [setValue]
  );

  const handleCheckPermission = useCallback(
    (oldPermissions: string[], permission: string, checked: boolean) => {
      const newPermissions = checked
        ? [...oldPermissions, permission]
        : oldPermissions.filter((p) => p != permission);
      setValue('permissionNames', newPermissions);
    },
    [setValue]
  );

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
                <RHFTextField name="name" label="Имя" sx={{ mb: 3 }} />
                <RHFTextField name="email" label="Email" sx={{ mb: 3 }} />
                <RHFTextField name="password" label="Пароль" type={'password'} sx={{ mb: 3 }} />
                <RHFTextField
                  name="confirmPassword"
                  label="Подтверждение пароля"
                  type={'password'}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="active"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Active
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                />

                <Typography variant="body1" sx={{ mb: 1 }}>
                  Права пользователя
                </Typography>
                <FormGroup>
                  {USER_PERMISSIONS.map((p) => (
                    <FormControlLabel
                      key={p.name}
                      control={
                        <Checkbox
                          checked={values.permissionNames.filter((up) => up === p.name).length > 0}
                          onChange={(e) =>
                            handleCheckPermission(values.permissionNames, p.name, e.target.checked)
                          }
                        />
                      }
                      label={p.title}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Создать пользователя' : 'Сохранить изменения'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
