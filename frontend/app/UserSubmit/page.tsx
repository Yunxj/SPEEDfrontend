"use client";
import { Button, Form, Input, message } from "antd";
import style from "./page.module.scss";

type FieldType = {
  title?: string;
  authors?: string;
  journalName?: string;
  yearOfPublication?: string;
  volume?: string;
  number?: string;
  pages?: string;
  DOI?: string;
};
type resType = {
  code: number;
  message: string;
};

export default function Home(props: any) {
  const { sourceData } = props;
  const [form] = Form.useForm();
  let dataId: any;
  if (sourceData) {
    for (let key in sourceData[0]) {
      if (key === "_id") {
        dataId = sourceData[0][key];
      } else {
        form.setFieldValue(key, sourceData[0][key]);
      }
    }
  }
  console.log("dataId", dataId);
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    let url = "/paper/add";
    let method = "POST";
    if (sourceData) {
      url = "/paper/edit";
      method = "PUT";
      values.id = dataId;
    }
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
      method: method,
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("res1", res);
    let dealRes: resType = await res.json();
    console.log("res2", dealRes);
    if (dealRes.code === 1) {
      message.success(dealRes.message);
    } else {
      message.error(dealRes.message);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <main className={style.submitBox}>
      <Form
        className={style.formBox}
        name="basic"
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
          label="title"
          name="title"
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="authors"
          name="authors"
          rules={[{ required: true, message: "Please input your authors!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="journal name"
          name="journalName"
          rules={[{ message: "Please input your journal name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="year of publication"
          name="yearOfPublication"
          rules={[
            {
              message: "Please input your year of publication!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="volume"
          name="volume"
          rules={[
            {
              message: "Please input your volume!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="number"
          name="number"
          rules={[
            {
              message: "Please input your number!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="pages"
          name="pages"
          rules={[
            {
              message: "Please input your pages!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="DOI"
          name="DOI"
          rules={[
            {
              message: "Please input your DOI!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </main>
  );
}