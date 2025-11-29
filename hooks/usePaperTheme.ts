// hooks/usePaperTheme.ts
import { MD3LightTheme as LightTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useColorScheme as _useColorScheme } from 'react-native';

export function usePaperTheme() {
  const colorScheme = _useColorScheme(); // "light" ili "dark"
  const scheme = colorScheme ?? 'light';

  const theme = scheme === 'light'
    ? { ...LightTheme, colors: { ...LightTheme.colors, ...Colors.light } }
    : { ...DarkTheme, colors: { ...DarkTheme.colors, ...Colors.dark } };

  return theme; 
}