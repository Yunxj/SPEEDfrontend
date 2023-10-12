import { Button, Form, Input, message, Table } from "antd";
export const onFinish = async (values: any, getPaperList: any) => {
  console.log("Success:", values);
  getPaperList(values);
};

export const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export async function modifyApprove(params: any) {
  const { id, approval, setFresh, fresh, form } = params;
  let data = { id, approval };
  let res: any = await fetch(process.env.NEXT_PUBLIC_API_URL + `/paper/edit`, {
    method: "put",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  res = await res.json();
  console.log("res", res);
  if (res.code === 1) {
    message.success(res.message);
    form.resetFields();
    setFresh(!fresh);
  } else {
    message.error(res.message);
  }
}

export async function approveFunc(paramsAll: any) {
  const { record, setFresh, fresh, form } = paramsAll;
  const params = { id: record["id"], approval: 1, setFresh, fresh, form };
  await modifyApprove(params);
}

export async function rejectFunc(paramsAll: any) {
  const { record, setFresh, fresh, form } = paramsAll;
  const params = { id: record["id"], approval: 2, setFresh, fresh, form };
  await modifyApprove(params);
}

export async function deleteFunc(paramsAll: any) {
  const { record, setFresh, fresh, form } = paramsAll;
  const id = record["id"];
  let res: any = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/paper/delete/${id}`,
    {
      method: "DELETE",
    }
  );
  res = await res.json();
  console.log("res", res);
  if (res.code === 1) {
    message.success(res.message);
    form.resetFields();
    setFresh(!fresh);
  } else {
    message.error(res.message);
  }
}
