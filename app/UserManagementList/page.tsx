"use client";
import { useEffect, useState, useContext } from "react";
import { approveMatch, averageScoreFunc } from "@/until/action";
import { useRouter } from "next/navigation";
import style from "./page.module.scss";
import { baseUrl } from "../config";
import {
  Button,
  Form,
  Input,
  message,
  Table,
  Select,
  Modal,
  Rate,
  DatePicker,
  Popconfirm,
} from "antd";
import {
  onFinishList,
  onFinishUser,
  onFinishFailed,
  deleteFunc,
} from "./until";

import UserRoleContext from "@/store/user-role";

type FieldType = {
  name?: string;
  password?: string;
  role?: string;
  _id?: string;
};

type resType = {
  code: number;
  message: string;
  data: string;
};

export default function UserManagementList(props: any) {
  const useCtx = useContext(UserRoleContext);
  const router = useRouter();
  const { isAll } = props;
  const [paperList, setPaperList] = useState([]);
  const [fresh, setFresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("add");
  const [currentUser, setCurrentUser] = useState({});
  const [formUser] = Form.useForm();
  const [form] = Form.useForm();

  const initialValues = {
    title: "",
    authors: "",
    yearOfPublication: "",
    SE: "",
    averageScore: "",
    approval: "",
  };

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
    let searchFormStorage: any = {};
    for (let key in initialValues) {
      searchFormStorage[key] = localStorage.getItem(key);
    }
    getUserList({
      ...searchFormStorage,
      sortBy: sorter.field,
      order: sorter.order,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "role",
      dataIndex: "role",
      key: "role",
      render: (text: any, record: any) => {
        let showEdit = " - ";
        switch (record?.role) {
          case "0":
            return (showEdit = "general");
          case "1":
            return (showEdit = "moderators");
          case "2":
            return (showEdit = "analysts");
          case "3":
            return (showEdit = "admin");
          default:
            break;
        }
        return <span>{showEdit}</span>;
      },
    },
    {
      title: "created time",
      dataIndex: "createdAt",
      key: "createdAt",
    },

    {
      title: "updated time",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "user id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => {
        const params = { record, setFresh, fresh, form, getUserList };
        return (
          <span className={style.actionBox}>
            <a
              onClick={() => {
                setModalTitle("add");
                setIsModalOpen(true);
              }}
            >
              add
            </a>
            {/* <Popconfirm
              title="Edit the user"
              description="Are you sure to Edit this user?"
              onConfirm={() => {
                setModalTitle("edit");
                router.push("/UserEdit/" + record.id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <span style={{ color: "#1677ff", cursor: "pointer" }}>edit</span>
            </Popconfirm> */}
            <a
              onClick={() => {
                if (record?.name) {
                  for (let key in record) {
                    formUser.setFieldValue(key, record[key]);
                  }
                }
                setModalTitle("edit");
                setCurrentUser(record);
                setIsModalOpen(true);
              }}
            >
              edit
            </a>
            <Popconfirm
              title="Delete the user"
              description="Are you sure to Delete this user?"
              onConfirm={() => deleteFunc(params)}
              okText="Yes"
              cancelText="No"
            >
              <span style={{ color: "#1677ff", cursor: "pointer" }}>
                delete
              </span>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  // if (isAll) {
  //   columns.pop();
  // }

  const onReset = () => {
    form.resetFields();
    for (let key in initialValues) {
      localStorage.setItem(key, "");
    }
    setFresh(!fresh);
  };

  async function getUserList(params: any, name?: any) {
    let url = baseUrl + `/users`;
    if (name === "name") {
      url = baseUrl + `/users?name=${params?.name}`;
    }
    let res = await fetch(url, {
      cache: "no-store",
    });
    let dealRes = await res.json();
    if (dealRes.code === 0) {
      message.error(dealRes.message);
      return;
    }
    if (dealRes.data.length === 0) {
      setPaperList([]);
      return;
    }
    setPaperList(dealRes.data);
  }

  useEffect(() => {
    getUserList("all");
  }, [fresh]);

  return (
    <main>
      <Form
        name="basic"
        onFinish={(values) => onFinishList(values, getUserList)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="flex flex-wrap my-6"
        form={form}
      >
        <Form.Item<FieldType>
          label="name"
          name="name"
          rules={[{ message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="" name="_id"></Form.Item>
        <Form.Item>
          <Button className="mx-6" type="primary" htmlType="submit">
            search
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={paperList}
        rowKey={(record: any) => record.id}
        pagination={false}
        onChange={onChange}
      />
      <Modal
        title={modalTitle}
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
          onFinish={(values) => {
            onFinishUser(
              currentUser,
              getUserList,
              modalTitle,
              formUser,
              setIsModalOpen
            );
          }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={formUser}
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
            rules={[{ required: true, message: "Please input your password!" }]}
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
              <Select.Option value="0">general</Select.Option>
              <Select.Option value="1">moderators</Select.Option>
              <Select.Option value="2">analysts</Select.Option>
              <Select.Option value="3">admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {modalTitle}
            </Button>
            <Button
              className="ml-5"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
