import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Modal, Badge, Table } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data';
import { queryRule, updateRule, addRule, removeRule, optionRule, batchRule } from './service';




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


const resetPassword = async (item: TableListItem) => {
  const hide = message.loading('正在重置');
  const response = await optionRule('resetPassword', {
    id: item.id,
  });
  hide()
  return responseHandle(response, '密码已被重置为123456')
} 

const statusChange = async (item: TableListItem) => {
  const s = item.status ? '禁用' : '启用'
  const hide = message.loading('正在' + s);
  const response = await optionRule('statusChange', {
    id: item.id,
  });
  hide()
  return responseHandle(response, s + '成功')
}

const approval = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在审批');
  const response = await batchRule('approval', {
    ids: selectedRows.map((row) => row.id),
  });
  hide()
  return responseHandle(response, '密码已被重置为123456')
}


/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: FormValueType) => {

  const hide = message.loading('正在添加');
    const response = await addRule({
      tag: fields.tag,
      name: fields.name,
    });
    hide();
    return responseHandle(response, '添加成功')
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  const response = await updateRule({
    id: fields.id,
    name: fields.name,
    menus: fields.menus
  });
  hide();
  return responseHandle(response, '更新成功')
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  const response = await removeRule({
    ids: selectedRows.map((row) => row.id),
  });
  hide();
  return responseHandle(response, '删除成功，即将刷新')
};


const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色标签',
      dataIndex: 'tag',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <MoreBtn key="more" item={record} />
        </>
      ),
    },
  ];

  const handleOption = async (currentItem: TableListItem, name: string, func: any) => {
    Modal.confirm({
      title: name,
      content: '确定' + name + '吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => func(currentItem),
    });
  }

  const handleMore = async (key: string, item: TableListItem) => {

    if (key == 'status') {
      const success = statusChange(item)
      if (success) {
        handleModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } else if (key == 'delete') {
      const success = handleRemove([item])
      if (success) {
        handleModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    }
  }

  const handleBatch = async (key: string, selectedRows: TableListItem[]) => {
    
    if (key === 'remove') {
      const success = handleRemove(selectedRows);
      if (success) {
        handleModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    }
    else if (key === 'approval') {
      const success = approval(selectedRows);
      if (success) {
        handleModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    }


  }


  const MoreBtn: React.FC<{
    item: TableListItem;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => handleMore(key, item)}>
          {item.id != 1 && (<Menu.Item key="delete">删除</Menu.Item>)}
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
            新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    handleBatch(e.key, selectedRows)                
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            {/* <span>
              服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.id, 0)} 万
            </span> */}
          </div>
        )}
        request={(params) => queryRule(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
