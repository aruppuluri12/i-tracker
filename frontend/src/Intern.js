// import './App.css';
// import React, { useEffect } from 'react';
// import { useState } from 'react';
// import { Button, Space, Table, Modal, Form, Input, Popconfirm, Tooltip, DatePicker, Select } from 'antd';
// import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
// import Axios from 'axios';

// const Intern = () => {
//   const [internData, setInternData] = useState([]);
//   const [visible, setVisible] = useState(false);
//   const { TextArea } = Input;
//   const [form] = Form.useForm();
//   const [editingKey, setEditingKey] = useState('');
//   const dateFormat = "MM/DD/YYYY";
//   const { Option } = Select;

//   const EditableCell = ({
//     editing,
//     dataIndex,
//     title,
//     inputType,
//     record,
//     index,
//     children,
//     ...restProps
//   }) => {
//     const inputNode = dataIndex === 'notes' ? <TextArea /> : (dataIndex === 'status' ? <Select>
//       <Option value="New">Yet to Apply</Option>
//       <Option value="Applied">Applied</Option>
//       <Option value="Interviewed">Interviewed</Option>
//       <Option value="Accepted">Accepted</Option>
//       <Option value="Rejected">Rejected</Option>
//     </Select> : (dataIndex === 'date' ? <DatePicker format={dateFormat} /> : <Input />));
//     const req = dataIndex === 'notes' ? false : true;
//     return (
//       <td {...restProps}>
//         {editing ? (
//           < Form.Item
//             name={dataIndex}
//             style={{
//               margin: 0,
//             }}
//             rules={[
//               {
//                 required: req,
//                 message: `Please input ${title}!`,
//               },
//             ]}
//           >
//             {inputNode}
//           </Form.Item>
//         ) : (
//           children
//         )
//         }
//       </td >
//     );
//   };

//   const isEditing = (record) => record.key === editingKey;

//   const edit = (record) => {
//     form.setFieldsValue({
//       name: '',
//       date: '',
//       status: '',
//       notes: '',
//       ...record,
//     });
//     setEditingKey(record.key);
//   };

//   const cancel = () => {
//     setEditingKey('');
//   };

//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...internData];
//       const index = newData.findIndex((item) => key === item.key);

//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, { ...item, ...row });
//         setInternData(newData);
//         setEditingKey('');
//       } else {
//         newData.push(row);
//         setInternData(newData);
//         setEditingKey('');
//       }
//     } catch (errInfo) {
//       console.log('Validate Failed:', errInfo);
//     }
//   };

//   const [add, setAdd] = useState(true);

//   useEffect(() => {
//     if (add) {
//       Axios.get("http://localhost:3001/internships").then((response) => { setInternData(response.data) });
//       setAdd(false);
//     }

//   }, [internData, setInternData])

//   const onFinish = (values) => {
//     handleOk();
//     const newData = {
//       name: values.name,
//       date: values.date,
//       status: values.status,
//       notes: values.notes,
//     }
//     Axios.post("http://localhost:3001/create", newData).then(() => { console.log("success") });
//     Axios.get("http://localhost:3001/internships").then((response) => { console.log(response.data); setAdd(true); setInternData(response.data) });
//   };

//   const internshipForm = (<Form
//     name="basic"
//     labelCol={{
//       span: 4,
//     }}
//     wrapperCol={{
//       span: 16,
//     }}
//     initialValues={{
//       remember: true,
//     }}
//     onFinish={onFinish}
//     autoComplete="off"
//   >
//     <Form.Item
//       label="Name"
//       name="name"
//       rules={[
//         {
//           required: true,
//           message: 'Please input a name!',
//         },
//       ]}
//     >
//       <Input />
//     </Form.Item>

//     <Form.Item
//       label="Date"
//       name="date"
//       rules={[
//         {
//           required: true,
//           message: 'Please select a date!',
//         },
//       ]}
//     >
//       <DatePicker format={dateFormat} />
//     </Form.Item>

//     <Form.Item
//       label="Status"
//       name="status"
//       value="status"
//       rules={[
//         {
//           required: true,
//           message: 'Please select a status!',
//         },
//       ]}
//     >
//       <Select >
//         <Option value="New">New</Option>
//         <Option value="Applied">Applied</Option>
//         <Option value="Interviewed">Interviewed</Option>
//         <Option value="Accepted">Accepted</Option>
//         <Option value="Rejected">Rejected</Option>
//       </Select>
//     </Form.Item>

//     <Form.Item
//       label="Notes"
//       name="notes"
//     >
//       <TextArea rows={4} />
//     </Form.Item>

//     <Form.Item
//       wrapperCol={{
//         offset: 4,
//         span: 16,
//       }}
//     >
//       <Button type="primary" htmlType="submit">
//         Submit
//       </Button>
//     </Form.Item>
//   </Form>);

//   const [modalText, setModalText] = useState(internshipForm);

//   const showModal = () => {
//     setVisible(true);
//   };

//   const handleOk = () => {
//     setModalText('Submitted!');
//     setTimeout(() => {
//       setVisible(false);
//     }, 500);
//   };

//   const handleCancel = () => {
//     setVisible(false);
//   };

//   const handleNew = () => {
//     setModalText(internshipForm);
//     showModal();
//   };
//   const deleteInternship = (record) => {
//     Axios.delete(`http://localhost:3001/delete/${record.key}`).then(() => { console.log("success, deleted") });
//     setInternData(pre => {
//       if (pre != null) {
//         return (pre.filter((it) => it.key !== record.key))
//       };
//     })
//   }
//   const operationsCol = (_, record) => {
//     const editable = isEditing(record);
//     return editable ? (
//       <span>
//         <CheckOutlined
//           onClick={() => save(record.key)}
//           style={{
//             marginRight: 8,
//             fontSize: '20px',
//             color: 'green'
//           }}
//         />
//         <Popconfirm title="Discard changes?" onConfirm={cancel}>
//           <CloseOutlined style={{ fontSize: '20px', color: 'red' }} />
//         </Popconfirm>
//       </span>
//     ) : (
//       <div>
//         <Space size="large">
//           <EditOutlined disabled={editingKey !== ''} onClick={() => edit(record)} style={{ fontSize: '20px', color: '#08c' }} />
//         </Space>
//         <Popconfirm title="Are you sure?" okText="Yes" cancelText="No" onConfirm={() => deleteInternship(record)}>
//           <DeleteOutlined style={{ fontSize: '20px', color: 'red', marginLeft: '12px' }} />
//         </Popconfirm>
//       </div>
//     );
//   }
//   const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format;
//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       sorter: (a, b) => { if (a.name < b.name) return -1; if (a.name > b.name) return 1; return 0; },
//       key: '1',
//       editable: true
//     },
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: '2',
//       sorter: (a, b) => { if (a.date < b.date) return -1; if (a.date > b.date) return 1; return 0; },
//       render: (_, record) => new Date(record.date).toLocaleDateString('en-US'),
//       filters: [
//         { text: 'January', value: 'Jan' },
//         { text: 'February', value: 'Feb' },
//         { text: 'March', value: 'Mar' },
//         { text: 'April', value: 'Apr' },
//         { text: 'May', value: 'May' },
//         { text: 'June', value: 'Jun' },
//         { text: 'July', value: 'Jul' },
//         { text: 'August', value: 'Aug' },
//         { text: 'September', value: 'Sep' },
//         { text: 'October', value: 'Oct' },
//         { text: 'November', value: 'Nov' },
//         { text: 'December', value: 'Dec' },
//       ],
//       onFilter: (value, record) => { return shortMonthName(new Date(record.date)) === value },
//       editable: true
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       sorter: (a, b) => { if (a.status < b.status) return -1; if (a.status > b.status) return 1; return 0; },
//       filters: [
//         { text: 'New', value: 'New' },
//         { text: 'Applied', value: 'Applied' },
//         { text: 'Interviewed', value: 'Interviewed' },
//         { text: 'Accepted', value: 'Accepted' },
//         { text: 'Rejected', value: 'Rejected' },
//       ],
//       onFilter: (value, record) => record.status === value,
//       key: '3',
//       editable: true
//     },
//     {
//       title: 'Notes',
//       dataIndex: 'notes',
//       key: '4',
//       ellipsis: true,
//       editable: true,
//       filters: [
//         { text: 'Notes', value: 'Notes' },
//         { text: 'No notes', value: 'No notes' },
//       ],
//       onFilter: (value, record) => { if (value === 'Notes') return record.notes !== undefined; return record.notes === undefined },
//       render: (address => (
//         <Tooltip placement="topLeft" title={address}>
//           {address}
//         </Tooltip>)),
//     },
//     {
//       title: '',
//       key: '5',
//       render: operationsCol,
//     }
//   ];


//   const mergedColumns = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }

//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         inputType: col.dataIndex === 'age' ? 'number' : 'text',
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//       }),
//     };
//   });


//   return (
//     <div className="buttons">
//       <Button onClick={handleNew}>
//         <Space>
//           <PlusOutlined />
//         </Space>
//       </Button>
//       <Form form={form} component={false}>
//         <Table
//           components={{
//             body: {
//               cell: EditableCell,
//             },
//           }}
//           bordered
//           dataSource={internData}
//           columns={mergedColumns}
//           rowClassName="editable-row"
//           pagination={{
//             onChange: cancel,
//           }}
//         />
//       </Form>
//       <Modal
//         title="Add Internship"
//         visible={visible}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         {modalText}
//       </Modal>
//     </div>
//   );

// }

// export default Intern;


import './App.css';
import React from 'react'
import { useState } from 'react';
import { Button, Space, Table, Modal, Form, Input, Popconfirm, Tooltip, DatePicker, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
const dateFormat = "MM/DD/YYYY";
const { Option } = Select;

const Intern = () => {
  const [internData, setInternData] = useState([]);
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
    const inputNode = dataIndex === 'notes' ? <TextArea /> : (dataIndex === 'status' ? <Select>
      <Option value="New">Yet to Apply</Option>
      <Option value="Applied">Applied</Option>
      <Option value="Interviewed">Interviewed</Option>
      <Option value="Accepted">Accepted</Option>
      <Option value="Rejected">Rejected</Option>
    </Select> : (dataIndex === 'date' ? <DatePicker format={dateFormat} /> : <Input />));
    const req = dataIndex === 'notes' ? false : true;
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
      const newData = [...internData];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setInternData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setInternData(newData);
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
    setInternData(
      pre => { return [...pre, newData] }
    )
  };

  const internshipForm = (<Form
    name="basic"
    labelCol={{
      span: 4,
    }}
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
          message: 'Please select a date!',
        },
      ]}
    >
      <DatePicker format={dateFormat} />
    </Form.Item>

    <Form.Item
      label="Status"
      name="status"
      value="status"
      rules={[
        {
          required: true,
          message: 'Please select a status!',
        },
      ]}
    >
      <Select >
        <Option value="New">New</Option>
        <Option value="Applied">Applied</Option>
        <Option value="Interviewed">Interviewed</Option>
        <Option value="Accepted">Accepted</Option>
        <Option value="Rejected">Rejected</Option>
      </Select>
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
  const deleteInternship = (record) => {
    setInternData(pre => {
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
  const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format;
  const columns = [
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
      render: (_, record) => new Date(record.date).toLocaleDateString('en-US'),
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
      onFilter: (value, record) => { if (value === 'Notes') return record.notes !== undefined; return record.notes === undefined },
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
    <div className="buttons">
      <Button onClick={handleNew}>
        <Space>
          <PlusOutlined />
        </Space>
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={internData}
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
  );

}

export default Intern;