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
  onFinish,
  onFinishFailed,
  approveFunc,
  rejectFunc,
  deleteFunc,
  modifyRate,
} from "./until";

import UserRoleContext from "@/store/user-role";

type FieldType = {
  title?: string;
  authors?: string;
  approval?: number;
  SE?: string;
  yearOfPublication?: string;
  averageScore?: number;
};

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

export default function Home(props: any) {
  const useCtx = useContext(UserRoleContext);
  console.log("useCtx", useCtx);
  const router = useRouter();
  const { isAll } = props;
  const [paperList, setPaperList] = useState([]);
  const [fresh, setFresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [rateValue, setRateValue] = useState(3);
  // const [searchForm, setSearchForm] = useState({});

  const initialValues = {
    title: "",
    authors: "",
    yearOfPublication: "",
    SE: "",
    averageScore: "",
    approval: "",
  };

  const handleOk = () => {
    setIsModalOpen(false);
    modifyRate({ id: currentId, rate: rateValue, setFresh, fresh });
  };

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
    // console.log("searchForm", searchForm);
    let searchFormStorage: any = {};
    for (let key in initialValues) {
      searchFormStorage[key] = localStorage.getItem(key);
    }
    getPaperList({
      ...searchFormStorage,
      sortBy: sorter.field,
      order: sorter.order,
      role: useCtx.roleData || "",
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();

  function rateFunc(params: any) {
    console.log("rateFunc", params);
    setCurrentId(params.record.id);
    setIsModalOpen(true);
  }

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
      sorter: (a: any, b: any) => a.authors - b.authors,
    },
    {
      title: "journal name",
      dataIndex: "journalName",
      key: "journalName",
      sorter: (a: any, b: any) => a.journalName - b.journalName,
    },
    {
      title: "year of publication",
      dataIndex: "yearOfPublication",
      key: "yearOfPublication",
      sorter: (a: any, b: any) => a.yearOfPublication - b.yearOfPublication,
    },
    {
      title: "SE",
      dataIndex: "SE",
      key: "SE",
      sorter: (a: any, b: any) => a.SE - b.SE,
    },
    {
      title: "average score",
      dataIndex: "averageScore",
      key: "averageScore",
      sorter: (a: any, b: any) => a.averageScore - b.averageScore,
    },
    {
      title: "volume",
      dataIndex: "volume",
      key: "volume",
      sorter: (a: any, b: any) => a.volume - b.volume,
    },
    {
      title: "number",
      dataIndex: "number",
      key: "number",
      sorter: (a: any, b: any) => a.number - b.number,
    },
    {
      title: "pages",
      dataIndex: "pages",
      key: "pages",
      sorter: (a: any, b: any) => a.pages - b.pages,
    },
    {
      title: "DOI",
      dataIndex: "DOI",
      key: "DOI",
      sorter: (a: any, b: any) => a.DOI - b.DOI,
    },
    {
      title: "approval",
      dataIndex: "approval",
      key: "approval",
      sorter: (a: any, b: any) => a.approval - b.approval,
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
            <a onClick={() => rateFunc(params)}>rate</a>
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

  async function getPaperList(params: any) {
    let paramsStr = "";
    if (params !== "all") {
      if (params.approval === "all") {
        delete params.approval;
      }
      // let searchForm: any = {};
      for (let key in params) {
        if (params[key]) {
          // searchForm[key] = params[key];
          paramsStr = paramsStr + "&" + key + "=" + params[key];
          localStorage.setItem(key, params[key]);
        }
      }
      // setSearchForm({ ...searchForm });
      paramsStr = paramsStr.replace("&", "");
    }
    console.log(paramsStr);
    let url = baseUrl + `/paper/list`;
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
        SE: item.SE,
        volume: item.volume,
        number: item.number,
        pages: item.pages,
        DOI: item.DOI,
        approval: approveMatch(item.approval),
        averageScore: averageScoreFunc(item.ratePersonNum, item.rateTotal),
      };
      list.push(itemObj);
    });

    setPaperList(list);
  }
  function initSearchForm() {
    let params: any = {};
    for (let key in initialValues) {
      form.setFieldValue(key, localStorage.getItem(key));
      params[key] = localStorage.getItem(key);
    }
    getPaperList(params);
  }
  useEffect(() => {
    getPaperList("all");
  }, [fresh]);
  useEffect(() => {
    initSearchForm();
  }, []);
  return (
    <main>
      <Form
        name="basic"
        onFinish={(values) =>
          onFinish({ ...values, role: useCtx.roleData || "" }, getPaperList)
        }
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="flex flex-wrap my-6"
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
          label="Year of Publication Range"
          name="yearOfPublicationRange"
          rules={[
            {
              message: "Please select the year range of publication!",
            },
          ]}
        >
          <DatePicker.RangePicker picker="year" format="YYYY" />
        </Form.Item>
        <Form.Item<FieldType>
          label="SE"
          name="SE"
          rules={[{ message: "Please input your SE!" }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item<FieldType>
          label="average score"
          name="averageScore"
          rules={[{ message: "Please input your average score!" }]}
        >
          <Input />
        </Form.Item> */}
        {/* <Form.Item
          className={style.selectApproval}
          label="approval"
          name="approval"
        >
          <Select
            defaultValue=""
            options={(() => {
              let options: any = [
                {
                  value: null,
                  label: "All",
                },
                {
                  value: 0,
                  label: "Pending Review",
                },
                {
                  value: 1,
                  label: "Approved",
                },
              ];
              if (useCtx?.roleData === "3") {
                options.push({
                  value: 2,
                  label: "Rejected",
                });
              }
              return options;
            })()}
          />
        </Form.Item> */}

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
        title="rate"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <span className="flex justify-center">
          <Rate tooltips={desc} onChange={setRateValue} value={rateValue} />
          {rateValue ? (
            <span className="ant-rate-text">{desc[rateValue - 1]}</span>
          ) : (
            ""
          )}
        </span>
      </Modal>
    </main>
  );
}
