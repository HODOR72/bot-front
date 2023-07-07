// scroll bar
import 'simplebar/src/simplebar.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import { AuthProvider } from './contexts/JWTContext';

import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider} from '@mui/x-date-pickers';
import { ru } from 'date-fns/locale';

// redux
import { store, persistor } from './redux/store';
//
import App from './App';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <AuthProvider>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ru}>
          <PersistGate loading={null} persistor={persistor}>
            <SettingsProvider>
              <CollapseDrawerProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </CollapseDrawerProvider>
            </SettingsProvider>
          </PersistGate>
        </LocalizationProvider>
      </ReduxProvider>
    </HelmetProvider>
  </AuthProvider>
);
