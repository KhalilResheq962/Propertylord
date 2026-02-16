import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ff6b00',
    accent: '#0f172a',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    placeholder: '#94a3b8',
    backdrop: 'rgba(15, 23, 42, 0.5)',
  },
};