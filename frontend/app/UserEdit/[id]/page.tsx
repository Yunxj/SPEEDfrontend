"use client";
import UserSubmit from "@/app/UserSubmit/page";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Table } from "antd";

export default function Home() {
  const param = useParams();
  const [sourceData, setSourceData] = useState();
  console.log("param", param);
  useEffect(() => {
    getPaperList(param.id);
  }, [param.id]);
  async function getPaperList(id: any) {
    let url = 'https://b968-148-251-210-181.ngrok.io'+ `/paper/list?id=${id}`;
    let res = await fetch(url, {
      cache: "no-store",
    });
    console.log("res1", res);
    let dealRes = await res.json();
    console.log("res2", dealRes);
    if (dealRes.code === 1) {
      setSourceData(dealRes.data);
    } else {
      message.error(dealRes.message);
    }
  }
  return <UserSubmit {...{ sourceData }}></UserSubmit>;
}
