"use client";
import "./globals.css";
import { useRouter } from "next/navigation";
import { Button, Form, Input, message, Modal, Select } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useState, useRef } from "react";
import UserRoleContext from "@/store/user-role";

type FieldType = {
  name?: string;
  password?: string;
  role?: string;
};

type resType = {
  code: number;
  message: string;
  data: string;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState("AllData");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleData, setRoleData] = useState("");

  const [form] = Form.useForm();

  async function registerFunc() {
    let name = form.getFieldValue("name");
    let password = form.getFieldValue("password");
    let role = form.getFieldValue("role");
    if (!name || !password || !role) {
      return Modal.warning({
        title: 'warning',
        content: 'Please check required fields',
      });
    }
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/add", {
      method: "POST",
      body: JSON.stringify({ name, password, role }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let dealRes: resType = await res.json();
    console.log("res2", dealRes);
    if (dealRes.code === 1) {
      setRoleData(dealRes.data);
      setIsModalOpen(false);
      message.success(dealRes.message);
    } else {
      message.error(dealRes.message);
    }
  }

  const items: MenuProps["items"] = [
    {
      label: "paper list",
      key: "AllData",
      icon: <MailOutlined />,
    },
    {
      label: "add paper",
      key: "UserSubmit",
      icon: <AppstoreOutlined />,
    },
    {
      label: "review paper",
      key: "ModeratorReview",
      icon: <SettingOutlined />,
      disabled: roleData === "",
    },
    {
      label: roleData === "" ? "login" : "logout",
      key: "login",
      icon: <AppstoreOutlined />,
    },
  ];

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const { name, password, role } = values;
    let res: any = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/user/list?name=${name}&password=${password}&role=${role}`
    );
    res = await res.json();
    if (res.code === 1) {
      message.success(res.message);
      setRoleData(res.data);
      setIsModalOpen(false);
    } else {
      message.error(res.message);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const router = useRouter();
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    if (e.key === "login") {
      if (roleData) {
        setRoleData("");
        return;
      }
      setIsModalOpen(true);
      return;
    }
    router.push("/" + e.key);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <html lang="en">
      <body>
        <UserRoleContext.Provider value={{ roleData: roleData }}>
          <Menu
            className="flex justify-center items-center"
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
          {children}
          <Modal
            title="login"
            open={isModalOpen}
            maskClosable={false}
            footer={false}
            onCancel={handleCancel}
          >
            <Form
              name="userLogin"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}
            >
              <Form.Item<FieldType>
                label="name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                label="password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please input your journal role!",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="1">moderators</Select.Option>
                  <Select.Option value="2">analysts</Select.Option>
                  <Select.Option value="3">admin</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  login
                </Button>
                <Button className="ml-5" onClick={registerFunc}>
                  register
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </UserRoleContext.Provider>
      </body>
    </html>
  );
}
