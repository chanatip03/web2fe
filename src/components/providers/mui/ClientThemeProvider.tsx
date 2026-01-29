"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Theme } from "@/app/theme";


type Props = Readonly<{ children: React.ReactNode }>;


export default function ClientThemeProvider({ children }: Props) {
  return (

    <ThemeProvider theme={Theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>

  );
}
