"use strict";

/* Package System */
import React from "react";
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { handleFailure, handleSuccess,handleErrors,setFormLayout,setAsideMinimize } from "@features/Status";
import { logout } from "@features/Account";
import { deleteApi } from "@utils/Helper";
/* Package Application */
import {
  ListSubheader,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Button,
  IconButton,
  Typography,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Icon } from "@iconify/react";

// import LanguageIcon from '@mui/icons-material/Language';

/* Package style */
import styles from "@public/scss/admin/layouts/Aside.module.scss";

class Aside extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubMenu: "",
      animating: false,
      isLoadedData: false
    };
  }

  handleSubMenu = (e) => {
    let _curMenu = e.currentTarget.dataset.submenu;

    if (_curMenu == this.state.isSubMenu) this.setState({ isSubMenu: "" });
    else this.setState({ isSubMenu: _curMenu });
  };

  handleAsideMinimize = () => {
    let _value = !this.props.stateStatus.asideMinimize;
    this.props.setAsideMinimize(_value);
    this.setState({ animating: true });
    setTimeout(() => this.setState({ animating: false }), 300);
  };

  componentDidMount() {
		this._isMounted = true;
		if (this.props.stateAccount?.access_token) this.getData(this.props.stateAccount.permissions);
	}
	componentDidUpdate(prevProps,prevState){
    if(this.props.stateAccount?.permissions !== prevProps?.stateAccount?.permissions && this.state.isLoadedData == false) this.getData(this.props.stateAccount.permissions);
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

  getData = async (permissions,limit = 10) => {
		try {
			this._isMounted && this.setState({ menu: JSON.parse(permissions) });
			this._isMounted && this.setState({ isLoadedData:true });
		} catch (e) {
			console.log(e);
			this.props.handleFailure('Server Error, Please try again later');
		}
	}

  handleFormLayout=async(e)=>{
		this.setState({dropdown:false});
		let _status = !this.props.stateStatus.formLayout.status;
		let _title = e.currentTarget.dataset.title;
		let _width = e.currentTarget.dataset.width;
		let _type  = e.currentTarget?.dataset?.type??'';
		this.props.setFormLayout({status:_status,title:_title,width:_width,type:_type});
	}

  handleLogout=()=>{
		this.props.logout();
		Router.push('/login');
		deleteApi(process.env.BASE_URL+'/cookie');
	}

  render() {
    const { dropdown, switcher, animating, menu } = this.state;
    let _page = this.props.router?.query?.pages ?? "";
    let _type = this.props.router?.query?.type ?? "";
    if (_page != "") _page = _page[0];
    return (
      <>
        <div id={styles.aside} className={animating ? styles.animating : ""} >
          <div id={styles.asideBrand}>
            <Link href="/prompts">
              <a
                className={styles.brandLogo}
                title="logo"
                style={{ lineHeight: 0 }}
              >
              <Image
                  src="/images/logo-login.svg"
                  className="img-fluid"
                  width={80}
                  height={40}
                  alt="images"
                />
              </a>
            </Link>
            <Button
              variant="contained"
              className="btn-reset"
              onClick={this.handleAsideMinimize}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                version="1.1"
              >
                <g stroke="none" strokeWidth={0} fill="none" fillRule="evenodd">
                  <polygon points="0 0 24 0 24 24 0 24" />
                  <path
                    d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z"
                    fill="#000000"
                    fillRule="nonzero"
                    transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999)"
                  />
                  <path
                    d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z"
                    fill="#000000"
                    fillRule="nonzero"
                    opacity="0.3"
                    transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999)"
                  />
                </g>
              </svg>
            </Button>
          </div>
          <div id={styles.asideMenu} >
          {this.props.stateAccount?.email && (
              <div
                className="profile-block"
                data-type="Profile"
                data-title="Thông tin tài khoản"
                data-width="lg"
                onClick={this.handleFormLayout}
              >
                <Avatar>{this.props.stateAccount?.email?.charAt(0).toUpperCase()}</Avatar>
                <span>{this.props.stateAccount?.email}</span>
              </div>
            )}
						<div className={styles.asideScroll}>
							<PerfectScrollbar >
								{typeof menu !== 'undefined' && Object.keys(menu).length>0&&
								Object.entries(menu).map(([k0,v0])=><>
                {!v0?.is_function&&<>
								<List key={k0} subheader={
									<ListSubheader className={styles.menuSection}>
										{v0.title}
									</ListSubheader>
								} className={styles.menuNav}>
									{typeof v0.items !== 'undefined' && Object.keys(v0.items).length>0&&
										Object.entries(v0.items).map(([k1,v1])=><React.Fragment key={k1}>
											{!v1?.module ? (<>
												<ListItem button onClick={this.handleSubMenu} data-submenu={`${k1}`} className={styles.menuItem+((this.state.isSubMenu==k1||_page in v1.modules.split(','))?` ${styles.menuItemActive} ${styles.showSubMenu}`:'')}>
												<div className={styles.menuIcon}>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none">
														<g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
															<path d="M17.5 11H6.5C4 11 2 9 2 6.5C2 4 4 2 6.5 2H17.5C20 2 22 4 22 6.5C22 9 20 11 17.5 11ZM15 6.5C15 7.9 16.1 9 17.5 9C18.9 9 20 7.9 20 6.5C20 5.1 18.9 4 17.5 4C16.1 4 15 5.1 15 6.5Z" fill="black"></path>
															<path opacity="0.3" d="M17.5 22H6.5C4 22 2 20 2 17.5C2 15 4 13 6.5 13H17.5C20 13 22 15 22 17.5C22 20 20 22 17.5 22ZM4 17.5C4 18.9 5.1 20 6.5 20C7.9 20 9 18.9 9 17.5C9 16.1 7.9 15 6.5 15C5.1 15 4 16.1 4 17.5Z" fill="black"></path>
														</g>
													</svg>
												</div>
												<ListItemText primary={`${(v1.title)}`} />
												<i className="far fa-chevron-right"></i>
												</ListItem>
												<Collapse in={(this.state.isSubMenu==k1||_page in v1.modules.split(','))?true:false} timeout="auto" unmountOnExit>
													<List component="div" disablePadding className={styles.menuItemSub}>
														{typeof v1.items !== 'undefined' && Object.keys(v1.items).length>0&&
														Object.entries(v1.items).map(([k2,v2])=>
															<Link key={k2} href={`/${(v2.module)}`}>
																<ListItem button className={styles.menuItem +' '+(((_page==v2.module)? styles.menuItemActive:''))}>
																	<span className={styles.menuBulletDot}></span>
																	<ListItemText primary={`${(v2.title)}`} />
																</ListItem>
															</Link>
														)}
													</List>
												</Collapse>
											</>
											):(
											<Link href={`/${(v1.module)}`}>
												<ListItem button onClick={this.handleSubMenu} data-submenu="" className={styles.menuItem +' '+((_page==v1.module? styles.menuItemActive:''))}>
													<div className={styles.menuIcon}>
														<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none">
															<g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
																<path d="M17.5 11H6.5C4 11 2 9 2 6.5C2 4 4 2 6.5 2H17.5C20 2 22 4 22 6.5C22 9 20 11 17.5 11ZM15 6.5C15 7.9 16.1 9 17.5 9C18.9 9 20 7.9 20 6.5C20 5.1 18.9 4 17.5 4C16.1 4 15 5.1 15 6.5Z" fill="black"></path>
																<path opacity="0.3" d="M17.5 22H6.5C4 22 2 20 2 17.5C2 15 4 13 6.5 13H17.5C20 13 22 15 22 17.5C22 20 20 22 17.5 22ZM4 17.5C4 18.9 5.1 20 6.5 20C7.9 20 9 18.9 9 17.5C9 16.1 7.9 15 6.5 15C5.1 15 4 16.1 4 17.5Z" fill="black"></path>
															</g>
														</svg>
													</div>
													<ListItemText primary={`${(v1.title)}`} />
												</ListItem>
											</Link>
											)}
										</React.Fragment>
										)
									}
								</List>
                </>}
                </>)
								}
							</PerfectScrollbar>
						</div>
            <List className={styles.logoutBlock}>
                  <ListItem onClick={this.handleLogout}>
                    <ListItemIcon>
                      <Icon icon="ri:login-box-line" width="24" height="24" />
                    </ListItemIcon>
                    <ListItemText primary="Log out" />
                  </ListItem>
                </List>
					</div>
        </div>
      </>
    );
  }
}

const mapStateToProps=state=>{
	return {
		stateStatus:state.status,
		stateAccount:state.account
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAsideMinimize:val=>{dispatch(setAsideMinimize(val))},
    login: (params) => {
      dispatch(login(params));
    },
    handleSuccess: (msg) => {
      dispatch(handleSuccess(msg));
    },
    handleFailure: (msg) => {
      dispatch(handleFailure(msg));
    },
    handleErrors: (msg) => {
      dispatch(handleErrors(msg));
    },
    setFormLayout:val=>{dispatch(setFormLayout(val))},
    logout:()=>{dispatch(logout())}
    };
    
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Aside));
