import './App.css';
import React from 'react'
import { useState } from 'react';
import { Button, Dropdown, Space, Menu, Table, Modal, Form, Input, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

function App() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const { TextArea } = Input;
  const [key, setKey] = useState(0);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = dataIndex === 'notes' ? <TextArea /> : <Input />;
    const req = dataIndex === 'notes' ? false : true;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: req,
                message: `Please input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const onFinish = (values) => {
    handleOk();
    const newData = {
      key: key,
      name: values.name,
      date: values.date,
      status: values.status,
      notes: values.notes,
    }
    setKey(key + 1);
    setData(
      pre => { return [...pre, newData] }
    )
  };

  const internshipForm = (<Form
    name="basic"
    labelCol={{
      span: 4,
    }} s
    wrapperCol={{
      span: 16,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    autoComplete="off"
  >
    <Form.Item
      label="Name"
      name="name"
      rules={[
        {
          required: true,
          message: 'Please input a name!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Date"
      name="date"
      rules={[
        {
          required: true,
          message: 'Please input a date!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Status"
      name="status"
      value="status"
      rules={[
        {
          required: true,
          message: 'Please input a status!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Notes"
      name="notes"
    >
      <TextArea rows={4} />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 4,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>);

  const [modalText, setModalText] = useState(internshipForm);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setModalText('Submitted!');
    setTimeout(() => {
      setVisible(false);
    }, 500);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleNew = () => {
    setModalText(internshipForm);
    showModal();
  };
  const menu = (
    <Menu
      onClick={handleNew}
      items={[
        {
          label: 'new internship',
          key: '1',
          icon: <PlusOutlined />,
        },
      ]}
    />
  );
  const deleteInternship = (record) => {
    setData(pre => {
      if (pre != null) {
        return (pre.filter((it) => it.key !== record.key))
      };
    })
  }
  const operationsCol = (_, record) => {
    const editable = isEditing(record);
    return editable ? (
      <span>
        <CheckOutlined
          onClick={() => save(record.key)}
          style={{
            marginRight: 8,
            fontSize: '20px',
            color: 'green'
          }}
        />
        <Popconfirm title="Discard changes?" onConfirm={cancel}>
          <CloseOutlined style={{ fontSize: '20px', color: 'red' }} />
        </Popconfirm>
      </span>
    ) : (
      <div>
        <Space size="large">
          <EditOutlined disabled={editingKey !== ''} onClick={() => edit(record)} style={{ fontSize: '20px', color: '#08c' }} />
        </Space>
        <Popconfirm title="Are you sure?" okText="Yes" cancelText="No" onConfirm={() => deleteInternship(record)}>
          <DeleteOutlined style={{ fontSize: '20px', color: 'red', marginLeft: '12px' }} />
        </Popconfirm>
      </div>
    );
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: '1',
      editable: true
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: '2',
      editable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '3',
      editable: true
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: '4',
      ellipsis: true,
      editable: true,
      render: (address => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>)),
    },
    {
      title: '',
      key: '5',
      render: operationsCol,
    }
  ];


  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <div className="App-header">
        <div className="tabs">
          <div style={{ width: "50%", border: "solid #e0e0e0 0.5px" }}> Internship</div>
          <div style={{ flexGrow: 1, textAlign: "center", verticalAlign: "center", border: "solid #e0e0e0 0.5px" }}>Network</div>
        </div>
        <Dropdown overlay={menu}>
          <Button>
            <Space>
              <PlusOutlined />
            </Space>
          </Button>
        </Dropdown>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
        <Modal
          title="Add Internship"
          visible={visible}
          onCancel={handleCancel}
          footer={null}
        >
          {modalText}
        </Modal>
      </div>
    </div>
  );
}

export default App;


