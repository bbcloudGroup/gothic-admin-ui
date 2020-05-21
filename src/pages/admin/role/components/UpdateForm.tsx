import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps } from 'antd';

import { TableListItem } from '../data';
import MenuSelect from '../../menu/components/MenuSelect';

export interface FormValueType extends Partial<TableListItem> {
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
// const { Step } = Steps;
// const { TextArea } = Input;
// const { Option } = Select;
// const RadioGroup = Radio.Group;

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
    menus: props.values.menus
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
        label="角色名称"
        rules={[
          {
            required: true,
            message: "请输入用户名称!",
          },
        ]}
        >
        <Input placeholder="角色名称" />
      </FormItem>
      <FormItem
        name="menus" 
        label="菜单权限"
        >
        <MenuSelect multiple={true} ></MenuSelect>
      </FormItem>
      </>
    )

  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改角色信息"
      visible={updateModalVisible}
      // footer={renderFooter()}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible(false, values)}
      afterClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: formVals.name,
          menus: formVals.menus?.map((item) => (item.id+""))
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
