import React from "react";
import TopBar from "./TopBar";
import Topbar from "./Navbar";
import Footer from "./Footer";
import { Divider } from '@material-ui/core';
import CssBaseline from "@material-ui/core/CssBaseline";

function Layout(props) {
  return (
    <React.Fragment>
      <CssBaseline />
      <TopBar {...props} />
      <div>{props.children}</div>
      <Footer />
    </React.Fragment>
  );
}

export default Layout;
