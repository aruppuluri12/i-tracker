import { Button, Form, Input, Radio, message } from 'antd';
import React from 'react';
import axios from 'axios';
import './App.css';

const Login = () => {
  const onFinish = (values) => {
    console.log(values);
    if (values.usertype === 'new') {
      axios.get(`http://localhost:3001/getUsers/${values.username}`).then((response) => {
        if (response.data.length != 0) message.error("This username is unavailable.")
        else {
          axios.post("http://localhost:3001/createUser", { username: values.username, password: values.password }).then(() => console.log("success"))
        }
      });
    }
  };


  return (
    <Form
      name="basic"
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
        label="  "
        name="usertype"
        rules={[
          {
            required: true,
            message: 'Please choose a value!',
          },
        ]}
      >
        <Radio.Group>
          <Radio.Button value="new">New</Radio.Button>
          <Radio.Button value="returning">Returning</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;