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
          name="name"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="角色名称"
          rules={[
            {
              required: true,
              message: "请输入角色名称!",
            },
          ]}
        >
          <Input
            size="large"
            placeholder={"角色名称"}
          />
        </FormItem>
        <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="tag"
            label="角色标签"
            rules={[
              {
                required: true,
                message: "请输入角色标签!",
              }
            ]}
          >
            <Input
              size="large"
              placeholder={"角色标签"}
            />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
