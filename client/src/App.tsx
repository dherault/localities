import { CssBaseline, ThemeProvider, mergeTheme } from 'honorable'
import defaultTheme from 'honorable-theme-default'

import Home from './scenes/Home'

import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={mergeTheme(defaultTheme, theme)}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  )
}

export default App
