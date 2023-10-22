import { Button, Form, Input, message, Table ,Modal} from "antd";
import {baseUrl} from '../config'

export const onFinishList = async (values: any, getUserList: any) => {
  console.log("Success:", values);
  getUserList(values, 'name');
};
export const onFinishUser = async (values: any,getUserList:any,modalTitle:any,form:any,setIsModalOpen?:any) => {
  if(modalTitle === 'add') {
    registerFunc(values,getUserList,form,setIsModalOpen)
  }else {
    editFunc(values,getUserList,form,setIsModalOpen)
  }
};


export const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};


export const registerFunc = async  (values: any,getUserList:any,form:any,setIsModalOpen?:any) =>{
  let name = form.getFieldValue("name");
  let password = form.getFieldValue("password");
  let role = form.getFieldValue("role");
  if (!name || !password || !role) {
    return Modal.warning({
      title: "warning",
      content: "Please check required fields",
    });
  }
  let res = await fetch(baseUrl + "/user/add", {
    method: "POST",
    body: JSON.stringify({ name, password, role }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let dealRes:any = await res.json();
  console.log("res2", dealRes);
  if (dealRes.code === 1) {
    setIsModalOpen(false);
    message.success(dealRes.message);
  } else {
    message.error(dealRes.message);
  }
  getUserList(values);
}


export const editFunc = async  (values: any,getUserList:any,form:any,setIsModalOpen?:any) =>{
  let name = form.getFieldValue("name");
  let password = form.getFieldValue("password");
  let role = form.getFieldValue("role");
  const {  _id} = values
  if (!name || !password || !role) {
    return Modal.warning({
      title: "warning",
      content: "Please check required fields",
    });
  }
  let res = await fetch(baseUrl + "/user/update", {
    method: "POST",
    body: JSON.stringify({ name, password, role, id:_id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let dealRes:any = await res.json();
  if (dealRes.code === 1) {
    setIsModalOpen(false);
    message.success(dealRes.message);
  } else {
    message.error(dealRes.message);
  }
  getUserList(values);
}


export async function deleteFunc(paramsAll: any) {
  const {record, record:{_id:id}, setFresh, fresh, form , getUserList} = paramsAll;
  let res: any = await fetch(
    baseUrl + `/user/delete/${id}`,
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
    getUserList(record)
  } else {
    message.error(res.message);
  }
}




