"use client";
import { useEffect, useState, useContext } from "react";
import { approveMatch } from "@/until/action";
import { useRouter } from "next/navigation";
import style from "./page.module.scss";

import { Button, Form, Input, message, Table, Select } from "antd";
import {
  onFinish,
  onFinishFailed,
  approveFunc,
  rejectFunc,
  deleteFunc,
} from "./until";

import UserRoleContext from "@/store/user-role";

type FieldType = {
  title?: string;
  authors?: string;
  approval?: number;
};

export default function Home(props: any) {
  const useCtx = useContext(UserRoleContext);
  console.log("useCtx", useCtx);
  const router = useRouter();
  const { isAll } = props;
  const [paperList, setPaperList] = useState([]);
  const [fresh, setFresh] = useState(false);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "title",
      key: "title",
      render: (text: any, record: any) => {
        let showEdit = useCtx.roleData === "3" || useCtx.roleData === "2";
        return (
          <span className={style.actionBox}>
            {showEdit && (
              <a onClick={() => router.push("/UserEdit/" + record.id)}>
                {record.title}
              </a>
            )}
            {!showEdit && <span>{record.title}</span>}
          </span>
        );
      },
    },
    {
      title: "authors",
      dataIndex: "authors",
      key: "authors",
    },
    {
      title: "journal name",
      dataIndex: "journalName",
      key: "journalName",
    },
    {
      title: "year of publication",
      dataIndex: "yearOfPublication",
      key: "yearOfPublication",
    },
    {
      title: "volume",
      dataIndex: "volume",
      key: "volume",
    },
    {
      title: "number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "pages",
      dataIndex: "pages",
      key: "pages",
    },
    {
      title: "DOI",
      dataIndex: "DOI",
      key: "DOI",
    },
    {
      title: "approval",
      dataIndex: "approval",
      key: "approval",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => {
        const params = { record, setFresh, fresh, form };
        let showDelete = useCtx.roleData === "3";
        let showReview = useCtx.roleData === "3" || useCtx.roleData === "1";
        let showEdit = useCtx.roleData === "3" || useCtx.roleData === "2";
        return (
          <span className={style.actionBox}>
            {showReview && (
              <>
                <a onClick={() => approveFunc(params)}>approve</a>
                <a onClick={() => rejectFunc(params)}>reject</a>
              </>
            )}
            {showEdit && (
              <a onClick={() => router.push("/UserEdit/" + record.id)}>edit</a>
            )}
            {showDelete && <a onClick={() => deleteFunc(params)}>delete</a>}
          </span>
        );
      },
    },
  ];

  if (isAll) {
    columns.pop();
  }

  const onReset = () => {
    form.resetFields();
    setFresh(!fresh);
  };

  async function getPaperList(params: any) {
    let paramsStr = "";
    if (params !== "all") {
      for (let key in params) {
        if (params[key]) {
          paramsStr = paramsStr + "&" + key + "=" + params[key];
        }
      }
      paramsStr = paramsStr.replace("&", "");
    }

    let url = process.env.NEXT_PUBLIC_API_URL + `/paper/list`;
    if (paramsStr) url = url + "?" + paramsStr;
    let res = await fetch(url, {
      cache: "no-store",
    });
    console.log("res1", res);
    let dealRes = await res.json();
    console.log("res2", dealRes);
    if (dealRes.code === 0) {
      message.error(dealRes.message);
      return;
    }
    let list: any = [];
    if (dealRes.data.length === 0) {
      setPaperList([]);
      return;
    }
    dealRes.data.forEach((item: any) => {
      let itemObj = {
        title: item.title,
        authors: item.authors,
        id: item["_id"],
        journalName: item.journalName,
        yearOfPublication: item.yearOfPublication,
        volume: item.volume,
        number: item.number,
        pages: item.pages,
        DOI: item.DOI,
        approval: approveMatch(item.approval),
      };
      list.push(itemObj);
    });

    setPaperList(list);
  }
  useEffect(() => {
    getPaperList("all");
  }, [fresh]);
  return (
    <main>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={(values) => onFinish(values, getPaperList)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="flex my-6"
        form={form}
      >
        <Form.Item<FieldType>
          label="title"
          name="title"
          rules={[{ message: "Please input your title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="authors"
          name="authors"
          rules={[{ message: "Please input your authors!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className={style.selectApproval}
          label="approval"
          name="approval"
        >
          <Select defaultValue="">
            <Select.Option value={""}>All</Select.Option>
            <Select.Option value={0}>Pending Review</Select.Option>
            <Select.Option value={1}>Approved</Select.Option>
            <Select.Option value={2}>Rejected</Select.Option>
          </Select>
        </Form.Item>

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
      />
    </main>
  );
}
