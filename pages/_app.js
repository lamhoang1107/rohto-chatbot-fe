"use strict";

/* Package System */
import App from "next/app";
import { withRouter } from "next/router";
import Dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { LicenseInfo } from "@mui/x-license-pro";
LicenseInfo.setLicenseKey(
  "155cfd687615f41af0c0f002a8eb0e4aT1JERVI6MzM3NjEsRVhQSVJZPTE2NzAxMzExOTEwMDAsS0VZVkVSU0lPTj0x"
);

/* Package Application */
import store from "@libs/Store";
import Meta from "@config/Meta";
// const Layout = Dynamic(()=>import(/*webpackChunkName:"layout"*/'@views/Admin/Layout'));
import Layout from "../src/views/Admin/Layout";

/* Package Style */
import "@public/scss/core/utilities/fontawesome.scss";
import "@public/scss/core/utilities/animate_v4.scss";
import "@public/scss/admin/vendor.scss";

class CoreApp extends App {
  constructor(props) {
    super(props);
  }

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <Provider store={store}>
        <Layout meta={Meta} router={router}>
          <Component store={store} router={router} {...pageProps} />
        </Layout>
      </Provider>
    );
  }
}

export default withRouter(CoreApp);
