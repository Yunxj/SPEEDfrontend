"use client";
import "./globals.css";
import { useRouter } from "next/navigation";
import { Button, Form, Input, message, Modal, Select, Layout } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { baseUrl } from "./config";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useState, useRef, useEffect } from "react";
import UserRoleContext from "@/store/user-role";
import { UserType } from "./interfaces/types/common";

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
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [loginRes, setLoginRes] = useState({} as any);

  const [form] = Form.useForm();
  const divStyle = {
    backgroundImage: "url(/logo-pic.jpg)",
  };
  async function registerFunc() {
    let name = form.getFieldValue("name");
    let password = form.getFieldValue("password");
    if (!name || !password) {
      return Modal.warning({
        title: "warning",
        content: "Please check required fields",
      });
    }
    setRegisterLoading(true);
    try {
      let res = await fetch(baseUrl + "/user/add", {
        method: "POST",
        body: JSON.stringify({ name, password, role: UserType.general }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let dealRes: resType = await res.json();
      if (dealRes.code === 1) {
        setRoleData(UserType.general);
        setIsModalOpen(false);
        message.success(dealRes.message);
      } else {
        message.error(dealRes.message);
      }
      setRegisterLoading(false);
    } catch (error: any) {
      message.error(error.message);
      setRegisterLoading(false);
    }
  }

  const menuHanlder = (level: any) => {
    const items: MenuProps["items"] = [
      {
        label: "paper list",
        key: "AllData",
        icon: <MailOutlined />,
      },
      // {
      //   label: "add paper",
      //   key: "UserSubmit",
      //   icon: <AppstoreOutlined />,
      // },
      {
        label: "review paper",
        key: "ModeratorReview",
        icon: <SettingOutlined />,
        disabled: roleData === "",
      },
      {
        label:
          roleData === "" ? (
            "login"
          ) : (
            <>
              logout
              <span style={{ marginLeft: "20px" }}>
                {loginRes?.code === 1 && loginRes?.name ? loginRes?.name : ""}
              </span>
            </>
          ),
        key: "login",
        icon: <AppstoreOutlined />,
      },
    ];
    // if (level === UserType.moderators || level === UserType.analysts) {
    //   items.splice(1, 0, {
    //     label: `${
    //       level === UserType.moderators ? "moderators" : "analysts"
    //     } list`,
    //     key: `ModeratorsList`,
    //     // key: `${level === UserType.moderators ? "Moderators" : "Analysts"}List`,
    //     icon: <CreditCardOutlined />,
    //   });
    // }

    if (!!level) {
      items.splice(1, 0, {
        label: "add paper",
        key: "UserSubmit",
        icon: <AppstoreOutlined />,
      });
    }

    if (level === UserType.admin) {
      items.push({
        label: "user list",
        key: "UserManagementList",
        icon: <UserOutlined />,
      });
    }
    return items;
  };
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const { name, password } = values;
    setLoginLoading(true);
    try {
      let res: any = await fetch(
        baseUrl + `/user/list?name=${name}&password=${password}`
      );
      res = await res.json();
      if (res.code === 1) {
        message.success(res.message);
        setLoginRes({ ...res, name });
        setRoleData(res?.data?.role);
        setIsModalOpen(false);
      } else {
        message.error(res.message);
      }
      setLoginLoading(false);
    } catch (error: any) {
      message.error(error.message);
      setLoginLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const router = useRouter();
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    if (e.key === "login") {
      if (roleData) {
        setRoleData("");
        setLoginRes({});
        router.push("/");
        return;
      }
      setIsModalOpen(true);
      return;
    }
    router.push("/" + e.key);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRegisterLoading(false);
    setLoginLoading(false);
  };

  return (
    <html lang="en">
      <body>
        <UserRoleContext.Provider value={{ roleData: roleData }}>
          <div className="flex">
            <div
              className="flex justify-center items-center"
              style={{
                width: "100px",
                borderRadius: "10px",
                backgroundSize: "100%",
                ...divStyle,
              }}
            ></div>
            <Menu
              className="flex justify-center items-center"
              style={{ flex: 1 }}
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={menuHanlder(loginRes?.data?.role)}
            />
          </div>
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
              {/* <Form.Item
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
              </Form.Item> */}

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" loading={loginLoading} htmlType="submit">
                  login
                </Button>
                <Button
                  className="ml-5"
                  loading={registerLoading}
                  onClick={registerFunc}
                >
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
