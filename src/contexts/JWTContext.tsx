import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import ApiClients from '../utils/axios';
import { isValidToken, setSession, handleTokenExpired } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { ITokens } from '../@types/auth';

// ----------------------------------------------------------------------

const { axiosBase } = ApiClients;

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: undefined;
  [Types.Logout]: undefined;
  [Types.Register]: undefined;
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  const setAvatarPath = async (user: AuthUser) => {
    if (user!.avatar && user !== null) {
      const response = await axiosBase.get(`api/v1/files/image/user/avatar/${user.avatar}/40/40/7`, {
        responseType: 'blob',
      });
      if (response.data) {
        user.avatarPath = URL.createObjectURL(response.data);
      }
      return user;
    } else return user;
  };

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const tokens = localStorage.getItem('tokens');
      if (tokens) {
        let validTokens = JSON.parse(tokens);
        if (!isValidToken(validTokens.access_token)) {
          const response = await axiosBase.post('api/v1/auth/refresh', {
            refresh_token: validTokens.refresh_token,
          });
          validTokens = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          };
        }
        setSession(validTokens);
        const response = await axiosBase.get('api/v1/auth/me');
        const user = response.data.data;
        const newUser = await setAvatarPath(user);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: true,
            user: newUser,
          },
        });
      }
      else {
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      handleTokenExpired(1);
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  const login = async (email: string, password: string) => {
    const response = await axiosBase.post('api/v1/auth/login', {
      email,
      password,
    });

    const responseTokens: ITokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };

    setSession(responseTokens);
    dispatch({ type: Types.Login });
    await initialize();
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axiosBase.post('api/v1/auth/register', {
      name,
      email,
      password,
    });

    const responseTokens: ITokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };

    setSession(responseTokens);

    dispatch({ type: Types.Register });
    await initialize();
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  const update = async (params: any) => {
    const response = await axiosBase.put('api/v1/auth/me', params);
    const user = response.data.data;
    const newUser = await setAvatarPath(user);
    dispatch({
      type: Types.Initial,
      payload: {
        isAuthenticated: true,
        user: newUser,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        update,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
