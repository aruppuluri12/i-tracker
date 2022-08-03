import axios from 'axios';
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Table, Popconfirm, Tooltip, Input, Select, DatePicker, Form, Space } from 'antd';
import React, { useState } from 'react';

const EditableTable = ({ data, setData, intern }) => {

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const { TextArea } = Input;
  const dateFormat = "MM/DD/YYYY";
  const { Option } = Select;
  const isEditing = (record) => record.key === editingKey;

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
    const internInputNode = dataIndex === 'notes' ? <TextArea /> : (dataIndex === 'status' ? <Select>
      <Option value="New">New</Option>
      <Option value="Applied">Applied</Option>
      <Option value="Interviewed">Interviewed</Option>
      <Option value="Accepted">Accepted</Option>
      <Option value="Rejected">Rejected</Option>
    </Select> : (dataIndex === 'date' ? <DatePicker format={dateFormat} /> : <Input />));
    const networkInputNode = dataIndex === 'notes' ? <TextArea /> : <Input />;
    const inputNode = intern ? internInputNode : networkInputNode
    const req = dataIndex === 'notes' || 'email' || 'phone' ? false : true;
    return (
      <td {...restProps}>
        {editing ? (
          < Form.Item
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
        )
        }
      </td >
    );
  };

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      date: '',
      status: '',
      notes: '',
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
      if (intern) {
        axios.put("http://localhost:3001/updateIntern", newData[index]).then((response) => {
          console.log("success, updated");
        })
      } else {
        axios.put("http://localhost:3001/updateNetwork", newData[index]).then((response) => {
          console.log("success, updated");
        })
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

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

  const internColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => { if (a.name < b.name) return -1; if (a.name > b.name) return 1; return 0; },
      key: '1',
      editable: true
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: '2',
      sorter: (a, b) => { if (a.date < b.date) return -1; if (a.date > b.date) return 1; return 0; },
      render: (_, record) => { return new Date(record.date).toLocaleDateString('en-US') },
      filters: [
        { text: 'January', value: 'Jan' },
        { text: 'February', value: 'Feb' },
        { text: 'March', value: 'Mar' },
        { text: 'April', value: 'Apr' },
        { text: 'May', value: 'May' },
        { text: 'June', value: 'Jun' },
        { text: 'July', value: 'Jul' },
        { text: 'August', value: 'Aug' },
        { text: 'September', value: 'Sep' },
        { text: 'October', value: 'Oct' },
        { text: 'November', value: 'Nov' },
        { text: 'December', value: 'Dec' },
      ],
      onFilter: (value, record) => { return shortMonthName(new Date(record.date)) === value },
      editable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => { if (a.status < b.status) return -1; if (a.status > b.status) return 1; return 0; },
      filters: [
        { text: 'New', value: 'New' },
        { text: 'Applied', value: 'Applied' },
        { text: 'Interviewed', value: 'Interviewed' },
        { text: 'Accepted', value: 'Accepted' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      key: '3',
      editable: true
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: '4',
      ellipsis: true,
      editable: true,
      filters: [
        { text: 'Notes', value: 'Notes' },
        { text: 'No notes', value: 'No notes' },
      ],
      onFilter: (value, record) => { if (value === 'Notes') return record.notes !== null; return record.notes === null },
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

  const networkColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => { if (a.name < b.name) return -1; if (a.name > b.name) return 1; return 0; },
      key: '1',
      editable: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: '2',
      sorter: (a, b) => { if (a.email < b.email) return -1; if (a.email > b.email) return 1; return 0; },
      editable: true
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => { if (a.phone < b.phone) return -1; if (a.phone > b.phone) return 1; return 0; },
      key: '3',
      editable: true
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: '4',
      ellipsis: true,
      editable: true,
      filters: [
        { text: 'Notes', value: 'Notes' },
        { text: 'No notes', value: 'No notes' },
      ],
      onFilter: (value, record) => { if (value === 'Notes') return record.notes !== null; return record.notes === null },
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

  const columns = intern ? internColumns : networkColumns;

  const deleteInternship = (record) => {
    if (intern) {
      axios.delete(`http://localhost:3001/deleteIntern/${record.key}`).then(() => { console.log("success, deleted") });
    }
    else {
      axios.delete(`http://localhost:3001/deleteNetwork/${record.key}`).then(() => { console.log("success, deleted") });
    }
    setData(pre => {
      if (pre != null) {
        return (pre.filter((it) => it.key !== record.key))
      };
    })
  }

  const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format;

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'notes' ? <TextArea /> : (col.dataIndex === 'status' ? <Select>
          <Option value="New">New</Option>
          <Option value="Applied">Applied</Option>
          <Option value="Interviewed">Interviewed</Option>
          <Option value="Accepted">Accepted</Option>
          <Option value="Rejected">Rejected</Option>
        </Select> : (col.dataIndex === 'date' ? <DatePicker format={dateFormat} /> : <Input />)),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
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
  );

}

export default EditableTable;