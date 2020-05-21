import { Form, Input, Modal, Radio, TreeSelect } from 'antd';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { Link, connect, history, FormattedMessage, formatMessage, Dispatch } from 'umi'
import MenuSelect from './MenuSelect';

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
    handleAdd(fieldsValue);
  };

  const cancelHandle = async () => {
    form.resetFields();
    onCancel()
  };

  return (
    <Modal
      destroyOnClose
      title="新建菜单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      afterClose={cancelHandle}
    >
      <Form form={form}>
      <FormItem            
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="type"
            label="类型"
            rules={[
              {
                required: true,
                message: "请选择类型!",
              }
            ]}>
          <Radio.Group defaultValue="0" buttonStyle="solid">
            <Radio.Button value="1">组</Radio.Button>
            <Radio.Button value="2">菜单</Radio.Button>
            <Radio.Button value="3">权限</Radio.Button>
          </Radio.Group>
        </FormItem>
      <FormItem 
        name="parent_id"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="分组">
        <MenuSelect showType={[1, 2]}></MenuSelect>
      </FormItem>
      <FormItem
          name="tag"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="标识"
          rules={[
            {
              required: true,
              message: "请输入标识!",
            },
          ]}
        >
          <Input
            size="large"
            placeholder={"标识"}
          />
        </FormItem>
        <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="name"
            label="名称"
            rules={[
              {
                required: true,
                message: "请输入名称!",
              }
            ]}
          >
            <Input
              size="large"
              placeholder={"名称"}
            />
        </FormItem>
        
      </Form>
    </Modal>
  );
};

export default CreateForm;
