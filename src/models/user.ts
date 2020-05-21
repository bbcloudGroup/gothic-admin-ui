import { Effect, Reducer } from 'umi';
import { queryCurrent, query as queryUsers } from '@/services/user';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { Button, Divider, Dropdown, Menu, message, Modal, Badge, Table, Tag } from 'antd';

export interface CurrentUser {
  id?: number;
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {

      if (action.payload.status == 'error') {

        console.log(action.payload.message)
        message.error(action.payload.message)
        const queryString = stringify({
          redirect: window.location.href,
        });
        window.location.href = `/user/login?${queryString}`;
        // return (<Redirect to={`/user/login?${queryString}`} />)
      }
      else {
        action.payload.userid = action.payload.id + ""
        return {
          ...state,
          currentUser: action.payload || {},
        };
      }


    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
