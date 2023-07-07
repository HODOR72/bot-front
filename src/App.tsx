// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import NotistackProvider from './components/NotistackProvider';
import { AbilityContext } from './components/can';
import ability from './ability/ability';
import useAuth from './hooks/useAuth';

// ----------------------------------------------------------------------

export default function App() {
  const { user } = useAuth();
  return (
    <MotionLazyContainer>
      <AbilityContext.Provider value={ability(user)}>
        <ThemeProvider>
          <ThemeSettings>
            <NotistackProvider>
              <ProgressBarStyle />
              <ScrollToTop />
              <Router />
            </NotistackProvider>
          </ThemeSettings>
        </ThemeProvider>
      </AbilityContext.Provider>
    </MotionLazyContainer>
  );
}
