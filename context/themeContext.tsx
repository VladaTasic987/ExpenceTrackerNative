import React, { createContext, useContext, useState, ReactNode } from "react";
import { MD3LightTheme as LightTheme, MD3DarkTheme as DarkTheme } from "react-native-paper";

type ThemeType = "light" | "dark";

interface ThemeContextProps {
  themeName: ThemeType;
  theme: typeof LightTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeType>("light");

  const toggleTheme = () => setThemeName(prev => (prev === "light" ? "dark" : "light"));

  const theme = themeName === "light" ? { ...LightTheme } : { ...DarkTheme };

  return (
    <ThemeContext.Provider value={{ themeName, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
