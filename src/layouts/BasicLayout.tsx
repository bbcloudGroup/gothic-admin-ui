/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
  SettingDrawer,
} from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link, useIntl, connect, Dispatch } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import { queryMenu } from '@/services/menu';
import MenuLayout from './MenuLayout'
import { CURRENT } from '@/components/Authorized/renderAuthorize';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */


const menuDataRender = (menuList: MenuDataItem[]) : MenuDataItem[] => {
  return menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
}


const defaultFooterDom = (
  <DefaultFooter
    copyright="2020 宝宝云团队出品"
    links={[
      {
        key: 'bbcloud',
        title: '宝宝云',
        href: 'http://bbcloud.babybus.com',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/bbcloudGroup',
        blankTarget: true,
      },
      {
        key: 'babybus',
        title: '宝宝巴士',
        href: 'https://www.babybus.com',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */
  const [menuData, setMenuData] = useState([]);



  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    queryMenu().then(data => {
      setMenuData(data || []);
    });


  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority


  
  const setMenu = (path, auth, menuList: MenuDataItem[]) => {
    for(var i=0; i< menuList.length; i++) {
      if (path == menuList[i].path) {
        menuList[i].authority = auth
        return
      }
      else {
        if (path.startsWith(menuList[i].path)) {
          if (menuList[i].children != undefined) {
            menuList[i].authority = auth
            setMenu(path, auth, menuList[i].children)
          }
        }
      }

    }     
  }


  const authMenuRender = (menuList: MenuDataItem[]) : MenuDataItem[] => {
    
    // 菜单显示权限
    if (menuData != undefined && menuData.status == 'ok') {
      for (let key of Object.keys(menuData.data)) {
        setMenu(key, menuData.data[key], menuList)
      }
    }
    return menuDataRender(menuList)
  }

  const getAuthRouter = () => {
    
    const _authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/', ) || {
      authority: undefined,
    };
    if (menuData != undefined && menuData.status == 'ok') {
      for (let key of Object.keys(menuData.data)) {
        if (key.startsWith(_authorized.path)) {
          setMenu(key, menuData.data[key], [_authorized])
        }
      }
    }
    return _authorized
  }

  const authorized = getAuthRouter();

  const { formatMessage } = useIntl();
  return (
    <>
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={authMenuRender}
        // menuDataRender={() => menuData}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
        {/* {(CURRENT.includes("admin")) && (<MenuLayout></MenuLayout>)}  */}
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
