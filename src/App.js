import logo from "./logo.svg";
import "./App.css";
import { Login } from "./Login";
import { Home } from "./Home";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { display } from "@material-ui/system";
import {
  AppBar,
  Collapse,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ThemeProvider,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import { Registration } from "./Registration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo1 from "./images.png";
import { RoutePaths } from "./utils/enum";
import { useMemo } from "react";
import shared from "./utils/shared";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer";
import { MainNavigation } from "./components/MainNavigation";
import { createContext } from "react";
import { useState } from "react";
import { AuthWrapper } from "./Context/auth";
import { CartWrapper } from "./Context/cart";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#d32a2f",
      },
      green: {
        main: "#008000",
      },
    },
  });
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthWrapper>
            <CartWrapper>
              <div className="App">
                <Header />
                <br />
                <ToastContainer />
                <Container>
                  <MainNavigation />
                </Container>
                <Footer />
              </div>
            </CartWrapper>
          </AuthWrapper>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
