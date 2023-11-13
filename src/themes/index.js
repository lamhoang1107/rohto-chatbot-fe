"use strict";

/* Package System */
import React from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";

/* Package Application */

class CustomTheme extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const theme = extendTheme({
      fontSize: "13px",
      fontFamily: {
        display: 'Inter var, var(--joy-fontFamily-fallback)',
        body: 'Inter, var(--joy-fontFamily-fallback)',
      },
      components: {
        JoyButton: {
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              padding: "0 15px",
              borderRadius: "4px",
              fontSize: "12px",
              height: "35px",
              '&:focus': {
                borderColor: theme.palette.primary.main,
              },
            }),
          },
        },
        JoySelect: {
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              padding: "0 15px",
              borderRadius: "4px",
              fontSize: "12px",
              height: "35px",
              fontFamily: theme.fontFamily.display,
            }),
          },
        },
        JoyTab: {
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              background: theme.palette.primary.main,
            }),
          },
        },
        JoyTextarea: {
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              background: "#e7e7e7",
              border: "#e7e7e7",
              '&:focus': {
                outlineWidth: '0px',
              },
              ":focus-visible": {
                outlineWidth: '0px'
              },
              ":focus-within": {
                outlineWidth: '0px'
              }
            }),
          },
        }
      },
    });
    return (
      <CssVarsProvider theme={theme}>{this.props.children}</CssVarsProvider>
    );
  }
}

export default CustomTheme;
