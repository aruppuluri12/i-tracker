import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, Space, Modal, Form, Input, DatePicker, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import EditableTable from './EditableTable'


const Intern = () => {

  const [visible, setVisible] = useState(false);
  const { TextArea } = Input;
  const dateFormat = "MM/DD/YYYY";
  const { Option } = Select;
  const [internData, setInternData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/internships").then((response) => {
      setInternData(response.data.map((val, index) => {
        return { key: val.key, name: val.name, date: moment(val.date.toString().substring(0, 10), "YYYY-MM-DD"), status: val.status, notes: val.notes }
      }))
    });
  }, [])

  const onFinish = (values) => {
    handleOk();
    const newData = {
      key: 0,
      name: values.name,
      date: values.date,
      status: values.status,
      notes: values.notes,
    }
    axios.post("http://localhost:3001/createIntern", newData).then(() => {
      axios.get("http://localhost:3001/internships").then((response) => {
        setInternData(response.data.map((val, index) => {
          return { key: val.key, name: val.name, date: moment(val.date.toString().substring(0, 10), "YYYY-MM-DD"), status: val.status, notes: val.notes }
        }));
      })
    });
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

  const handleOk = () => {
    setModalText('Submitted!');
    setTimeout(() => {
      setVisible(false);
    }, 500);
  };

  const handleNew = () => {
    setModalText(internshipForm);
    setVisible(true);
  };

  return (
    <div className="buttons">
      <Button onClick={handleNew}>
        <Space>
          <PlusOutlined />
        </Space>
      </Button>
      <EditableTable data={internData} setData={setInternData} intern={true} />
      <Modal
        title="Add Internship"
        visible={visible}
        onCancel={() =>
          setVisible(false)
        }
        footer={null}
      >
        {modalText}
      </Modal>
    </div>
  );

}

export default Intern;