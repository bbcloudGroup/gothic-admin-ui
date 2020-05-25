import { FormattedMessage, formatMessage } from 'umi';
import React, { Component, useState } from 'react';

import { List, message } from 'antd';
import PasswordForm from './PasswordForm'
import { updatePassword } from '../service'

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: (
    <span className="strong">
      <FormattedMessage id="accountandsettings.security.strong" defaultMessage="Strong" />
    </span>
  ),
  medium: (
    <span className="medium">
      <FormattedMessage id="accountandsettings.security.medium" defaultMessage="Medium" />
    </span>
  ),
  weak: (
    <span className="weak">
      <FormattedMessage id="accountandsettings.security.weak" defaultMessage="Weak" />
      Weak
    </span>
  ),
};

const responseHandle = async (response: any, default_message: string) => {
  let msg = response['message'] != undefined && response['message'] != ""
  if (response['status'] == 'ok') {
    message.success(msg ? response['message'] : default_message);
    return true;
  } else {
    message.error('操作失败: ' + (msg ? response['message'] : '请求失败'));
    return false;
  }
}

const handlePassword = async (fields) => {

  console.log(fields)

  const hide = message.loading('正在提交');
    const response = await updatePassword({
      old: fields.old,
      password: fields.password,
    });
    hide();
    return responseHandle(response, '修改成功')
};

const SecurityView: React.FC<{}> = (props) => {
// class SecurityView extends Component {
  const { currentUser } = props;

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const getData = () => [
    {
      title: formatMessage({ id: 'accountandsettings.security.password' }, {}),
      description: (
        <>
          {formatMessage({ id: 'accountandsettings.security.password-description' })}：
          {passwordStrength.strong}
        </>
      ),
      actions: [
        <a key="Modify" onClick={() => handleModalVisible(true)}>
          <FormattedMessage id="accountandsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    // {
    //   title: formatMessage({ id: 'accountandsettings.security.phone' }, {}),
    //   description: `${formatMessage(
    //     { id: 'accountandsettings.security.phone-description' },
    //     {},
    //   )}：138****8293`,
    //   actions: [
    //     <a key="Modify">
    //       <FormattedMessage id="accountandsettings.security.modify" defaultMessage="Modify" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'accountandsettings.security.question' }, {}),
    //   description: formatMessage({ id: 'accountandsettings.security.question-description' }, {}),
    //   actions: [
    //     <a key="Set">
    //       <FormattedMessage id="accountandsettings.security.set" defaultMessage="Set" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'accountandsettings.security.email' }, {}),
    //   description: `${formatMessage(
    //     { id: 'accountandsettings.security.email-description' },
    //     {},
    //   )}：ant***sign.com`,
    //   actions: [
    //     <a key="Modify">
    //       <FormattedMessage id="accountandsettings.security.modify" defaultMessage="Modify" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'accountandsettings.security.mfa' }, {}),
    //   description: formatMessage({ id: 'accountandsettings.security.mfa-description' }, {}),
    //   actions: [
    //     <a key="bind">
    //       <FormattedMessage id="accountandsettings.security.bind" defaultMessage="Bind" />
    //     </a>,
    //   ],
    // },
  ];

  // render() {
  //   const {createModalVisible} = state
  //   const data = this.getData();
    return (
      <>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={getData()}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <PasswordForm
          onSubmit={async (value) => {
            const success = await handlePassword(value);
            if (success) {
              handleModalVisible(false);
              // if (actionRef.current) {
              //   actionRef.current.reload();
              // }
            }
          }}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
      />
      </>
    );
  // }
}

export default SecurityView;
