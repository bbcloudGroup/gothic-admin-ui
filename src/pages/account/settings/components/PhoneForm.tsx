import { Form, Input, Modal } from 'antd';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { Link, connect, history, FormattedMessage, formatMessage, Dispatch } from 'umi'
import styles from './style.less';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();

  const confirmDirty = false;
  const [visible, setvisible]: [boolean, any] = useState(false);
  const [popover, setpopover]: [boolean, any] = useState(false);
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    // form.resetFields();
    handleAdd(fieldsValue);
  };

  const cancelHandle = async () => {
    form.resetFields();
    onCancel()
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(formatMessage({ id: 'userandregister.password.twice' }));
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setvisible(!!value);
      return promise.reject(formatMessage({ id: 'userandregister.password.required' }));
    }
    // 有值的情况
    if (!visible) {
      setvisible(!!value);
    }
    setpopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };

  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      afterClose={cancelHandle}
    >
      <Form form={form}>
      <FormItem
          name="mail"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="邮箱"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'userandregister.email.required' }),
            },
            {
              type: 'email',
              message: formatMessage({ id: 'userandregister.email.wrong-format' }),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={formatMessage({ id: 'userandregister.email.placeholder' })}
          />
        </FormItem>
        <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="mobile"
            label="手机号"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.phone-number.required' }),
              },
              {
                pattern: /^\d{11}$/,
                message: formatMessage({ id: 'userandregister.phone-number.wrong-format' }),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={formatMessage({ id: 'userandregister.phone-number.placeholder' })}
            />
        </FormItem>
        <FormItem
            name="password"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="密码"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            rules={[
              {
                required: true,
                validator: checkPassword,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder={formatMessage({ id: 'userandregister.password.placeholder' })}
            />
          </FormItem>
          <FormItem
          name="confirm"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="确认密码"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'userandregister.confirm-password.required' }),
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input
            size="large"
            type="password"
            placeholder={formatMessage({ id: 'userandregister.confirm-password.placeholder' })}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
