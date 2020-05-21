import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps } from 'antd';

import { TableListItem } from '../data';
import RoleSelect from '@/pages/admin/role/components/RoleSelect'
import { Item } from 'gg-editor';
// import { queryRule as queryRole } from '@/pages/admin/roles/service'
// import { TableListItem as Role } from '@/pages/admin/roles/data'

export interface FormValueType extends Partial<TableListItem> {
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}


const FormItem = Form.Item;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    id: props.values.id,
    name: props.values.name,
    roles: props.values.roles,

    // roles: props.values.roles.map((item) => {
    //   return {key: item.id, label: item.name}
    // }),
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;


  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.id = formVals.id
    handleUpdate(fieldsValue);
  };

  const renderContent = () => {
    return (
      <>
      <FormItem 
        name="name" 
        label="用户名称"
        rules={[
          {
            required: true,
            message: "请输入用户名称!",
          },
        ]}
        >
        <Input placeholder="用户名称" />
      </FormItem>
      { props.values.id != 1 && (
        <FormItem name="roles" label="角色" rules={[
            {
              required: true,
              message: "请至少选择一个权限!",
            },
          ]}>
          <RoleSelect valueMap={(item) => ({id: parseInt(item)})}>

          </RoleSelect>
          
        </FormItem>
      )}
      </>
    )

  };


  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改用户信息"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible(false, values)}
      afterClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: formVals.name,
          roles: formVals.roles.map((item) => {console.log(item.id); return item.id+""}),
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
