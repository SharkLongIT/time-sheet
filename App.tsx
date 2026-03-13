
// import React, { useEffect, useState } from 'react';
// import { StatusBar, useColorScheme } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { Provider } from 'react-redux';
// import store from '~/redux/store';
// import AppContent from '~/navigation/AppContent';
// import Toast from 'react-native-toast-message';
// import { toastConfig } from '~/utils/toast/toastConfig';
// import { initLanguage } from './src/i18n/initLanguage';
// function App() {
//   const isDarkMode = useColorScheme() === 'dark';
//   const [ready, setReady] = useState(false);
//   useEffect(() => {
//     const bootstrap = async () => {
//       await initLanguage();
//       setReady(true);
//     };

//     bootstrap();
//   }, []);

//   if (!ready) return null;
//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <NavigationContainer>
//           <StatusBar
//             barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//           />
//           <AppContent />
//           <Toast config={toastConfig} />
//         </NavigationContainer>
//       </SafeAreaProvider>
//     </Provider>
//   );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from '~/redux/store';
import AppContent from '~/navigation/AppContent';
import Toast from 'react-native-toast-message';
import { toastConfig } from '~/utils/toast/toastConfig';
import { initLanguage } from './src/i18n/initLanguage';
import { ThemeProvider, useTheme } from '~/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function RootApp() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <AppContent />
      <Toast config={toastConfig} />
    </>
  );
}

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      await initLanguage();
      setReady(true);
    };
    bootstrap();
  }, []);
  //   useEffect(() => {
  //   AsyncStorage.setItem('SECURITY_2FA', JSON.stringify(twoFA));
  // }, [twoFA]);

  // useEffect(() => {
  //   AsyncStorage.setItem('SECURITY_BIOMETRIC', JSON.stringify(biometric));
  // }, [biometric]);

  const queryClient = new QueryClient();
  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SafeAreaProvider>

          <ThemeProvider>
            <NavigationContainer>
              <RootApp />
            </NavigationContainer>
          </ThemeProvider>

        </SafeAreaProvider>
      </Provider>
    </QueryClientProvider>

  );
}

export default App;
