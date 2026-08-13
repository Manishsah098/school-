import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulators to access localhost of host machine,
// or fallback to localhost for Expo Go Web.
const backendHost = Platform.OS === 'android' ? '10.0.2.2:8080' : 'localhost:8080';

export const APP_CONFIG = {
  appName: "Smart School Portal",
  apiBaseUrl: `http://${backendHost}`,
  themeColor: "#0076a8"
};
