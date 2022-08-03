import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, Space, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import EditableTable from './EditableTable'


const Network = () => {

  const [visible, setVisible] = useState(false);
  const { TextArea } = Input;
  const [internData, setInternData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/network").then((response) => {
      setInternData(response.data)
    });
  }, [])

  const onFinish = (values) => {
    handleOk();
    const newData = {
      key: 0,
      name: values.name,
      email: values.email,
      phone: values.phone,
      notes: values.notes,
    }
    axios.post("http://localhost:3001/createNetwork", newData).then(() => {
      axios.get("http://localhost:3001/network").then((response) => {
        setInternData(response.data);
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
      label="Email"
      name="email"
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Phone"
      name="phone"
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
      <EditableTable data={internData} setData={setInternData} intern={false} />
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

export default Network;