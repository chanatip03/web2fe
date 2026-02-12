import { createTheme } from "@mui/material/styles";

export const Theme = createTheme({
    palette: {
        primary: {
            main: "#0D47A1",
        },
        secondary: {
            main: "#1E88E5",
        },
        error: {
            main: "#CA2424",
        },
        background: {
            default: "#FAFAFA;",
            paper: "#FAFAFA",
        },
        text: {
            primary: "#212121",
        },
    },

    typography: {
        fontFamily: "var(--font-sans)",
        h1: { fontSize: "var(--text-h1)" },
        h2: { fontSize: "var(--text-h2)" },
        h3: { fontSize: "var(--text-h3)" },
        h4: { fontSize: "var(--text-h4)" },
        h5: { fontSize: "var(--text-h5)" },
        h6: { fontSize: "var(--text-h6)" },
        body1: { fontSize: "var(--text-p1)" },
        body2: { fontSize: "var(--text-p2)" },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiButton: {
            defaultProps: {
                size: "large",
            },
            styleOverrides: {
                root: {
                    height: 46,
                    borderRadius: 6,
                    fontWeight: 600,
                    textTransform: "none",
                },

                containedPrimary: {
                    backgroundColor: "var(--color-primary03)",
                    color: "var(--color-neutral01)",

                    "&:hover": {
                        backgroundColor: "var(--color-primary04)",
                    },

                    "&:active": {
                        backgroundColor: "var(--color-primary04)",
                    },

                    "&.Mui-disabled": {
                        backgroundColor: "var(--color-neutral02)",
                        borderColor: "var(--color-neutral03)",
                        color: "var(--color-neutral03)",
                    },
                },

                outlinedPrimary: {
                    backgroundColor: "var(--color-neutral01)",
                    color: "var(--color-primary03)",
                    border: "1px solid var(--color-primary03)",

                    "&:hover": {
                        backgroundColor: "var(--color-primary01)",
                        borderColor: "var(--color-primary03)",
                    },

                    "&:active": {
                        backgroundColor: "var(--color-primary01)",
                    },

                    "&.Mui-disabled": {
                        backgroundColor: "var(--color-neutral01)",
                        borderColor: "var(--color-neutral03)",
                        color: "var(--color-neutral03)",
                    },
                },
            },
        },

        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "var(--color-foreground)",
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    marginBottom: "16px",
                },
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    minHeight: 46,
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",

                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-neutral03)",
                        borderWidth: 1,
                    },

                    "&:hover:not(.Mui-focused):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-primary03)",
                        borderWidth: 1,
                    },

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-primary03)",
                        borderWidth: 2,
                    },

                    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-accent04)",
                        borderWidth: 1,
                    },

                    "&.Mui-disabled": {
                        backgroundColor: "var(--color-neutral02)",
                    },
                },
            },
        },

        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 500,
                },

                outlined: {
                    border: "none",
                },

                page: {
                    "&.Mui-selected": {
                        backgroundColor: "var(--color-primary03)",
                        color: "#FAFAFA",

                        "&:hover": {
                            backgroundColor: "var(--color-primary04)",
                        },
                    },
                },
            },
        },

        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 44,
                    height: 24,
                    padding: 0,
                },

                switchBase: {
                    padding: 2,

                    "&:hover + .MuiSwitch-track": {
                        backgroundColor: "var(--color-neutral04)",
                    },

                    "&.Mui-checked": {
                        transform: "translateX(20px)",
                        color: "#FAFAFA",

                        "& + .MuiSwitch-track": {
                            backgroundColor: "var(--color-primary03)",
                            opacity: 1,
                        },

                        "&:hover + .MuiSwitch-track": {
                            backgroundColor: "var(--color-primary04)",
                        },
                    },

                    "&.Mui-disabled": {
                        color: "var(--color-neutral03)",
                    },

                    "&.Mui-disabled + .MuiSwitch-track": {
                        opacity: 0.4,
                    },

                    "&.Mui-focusVisible + .MuiSwitch-track": {
                        backgroundColor: "var(--color-primary03)",
                    },
                },

                thumb: {
                    width: 20,
                    height: 20,
                },

                track: {
                    borderRadius: 12,
                    backgroundColor: "var(--color-neutral03)",
                    opacity: 1,
                    transition: "background-color 200ms ease",
                },
            },
        },
        MuiBreadcrumbs: {
            styleOverrides: {
                root: {
                    fontSize: "16px",
                    color: "var(--color-neutral04)",

                    "& .MuiLink-root": {
                        color: "var(--color-neutral04)",
                        textDecoration: "none",

                        "&:hover": {
                            textDecoration: "underline",
                        },
                    },
                },

                separator: {
                    marginLeft: 4,
                    marginRight: 4,
                    color: "var(--color-neutral04)",
                },
            },
        },
    },
});
