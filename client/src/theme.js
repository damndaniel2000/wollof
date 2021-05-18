import { createMuiTheme } from "@material-ui/core";

const blue = "#061178";

export default createMuiTheme({
  palette: {
    common: {
      blue: blue,
    },
    primary: {
      main: blue,
      contrastText: "#fff",
    },
    secondary: {
      main: "#f5222d",
      contrastText: "#fff",
    },
    danger: {
      main: "#f5222d",
      contrastText: "#fff",
    },
  },

  typography: {
    fontFamily: [
      "Zilla Slab",
      "Roboto",
      '"Helvetica"',
      "Arial",
      "sans-serif",
    ].join(","),

    button: {
      fontFamily: "rajdhani",
      fontWeight: 600,
      textTransform: "capitalize",
    },
    span: {
      color: "#fff",
    },
  },
});
