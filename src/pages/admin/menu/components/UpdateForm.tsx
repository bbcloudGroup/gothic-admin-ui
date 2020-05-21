import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps } from 'antd';
import MenuSelect from './MenuSelect'
import TableForm from './TableForm'

import { TableListItem } from '../data';

export interface FormValueType extends Partial<TableListItem> {
  auths?: TableListItem[];
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
  console.log(props.values)
  const [formVals, setFormVals] = useState<FormValueType>({
    id: props.values.id,
    name: props.values.name,
    tag: props.values.tag,
    parent_id: props.values.parent_id,
    children: props.values.children
  });

  // const [currentStep, setCurrentStep] = useState<number>(0);

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
    if (fieldsValue.parent_id == undefined) {
      fieldsValue.parent_id = formVals.parent_id
    }
    if (fieldsValue.children != undefined) {
      fieldsValue.children = fieldsValue.children.map((item) => ({
        id: item.key.startsWith("NEW_TEMP_ID_") ? 0 : parseInt(item.key),
        name: item.name,
        tag: item.tag,
        type: 3,
        parent_id: fieldsValue.id
      }))
    }
    handleUpdate(fieldsValue);
  };

  const renderContent = () => {

    return (
      <>
      <FormItem 
        name="name" 
        label="名称"
        rules={[
          {
            required: true,
            message: "请输入名称!",
          },
        ]}
        >
        <Input placeholder="名称" />
      </FormItem>
     
      <FormItem 
          name="tag"
          label="标识"
          rules={[
            {
              required: true,
              message: "请输入标识!",
            },
          ]}
          >
          <Input placeholder="标识" />
      </FormItem>
      {(props.values.type == 1 || props.values.type == 2) &&
      <FormItem 
          name="parent_id"
          label="分组"
          >
          <MenuSelect showType={[1]}></MenuSelect>
      </FormItem>}


      {(props.values.type == 2) &&
        <Form.Item name="children" label="权限">
            <TableForm />
        </Form.Item>}
    </>
      
    )

  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改菜单"
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
          tag: formVals.tag,
          parent_id: formVals.parent_id > 0 ? formVals.parent_id+"" : "",
          children: formVals.children != undefined ?  formVals.children.map((item) => ({
            key: item.id+"",
            name: item.name,
            tag: item.tag,
          })) : []
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
