import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Datamonth.css";
import Image from "next/image";

function page() {
  const [masterData, setMasterData] = useState([]);

  const currentMonth = new Date().getMonth() + 1; // เดือนปัจจุบัน (January คือ 0)
  const findmonthThai = new Date().getMonth(); // เดือนปัจจุบัน (January คือ 0)
  const currentYear = new Date().getFullYear();
  const month = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฏาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤษจิกายน",
    "ธันวาคม",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/api/get/MasterData");
      const data = await res.json();
      setMasterData(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="data-box">
        <label className="p-2">
          <h5>รายการเดือน {month[findmonthThai]}</h5>
        </label>
        <table className="table table-bordered">
          <thead className="table-header">
            <tr>
              <th>โครงการ</th>
              <th>Status</th>
              <th>มูลค่า</th>
              <th>วันที่จัดส่ง</th>
              <th width="5%">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {masterData
              .filter((element) => {
                const date = new Date(element.Order_date);
                return (
                  date.getMonth() + 1 === currentMonth &&
                  date.getFullYear() === currentYear
                );
              })
              .map((element, index) => (
                <tr key={index}>
                  <td>{element.Name_Project}</td>
                  <td></td>
                  <td>{element.Product_price.toLocaleString()}</td>
                  <td>
                    {(() => {
                      const date = new Date(element.date_request);
                      return `${date.getDate().toString().padStart(2, "0")}-${(
                        date.getMonth() + 1
                      )
                        .toString()
                        .padStart(2, "0")}-${date.getFullYear()}`;
                    })()}
                  </td>
                  <td align="center">
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        ModelDetail(element.Order_date, element.Name_Project)
                      }
                    >
                      <Image
                        src="/icon/search.png"
                        width={20}
                        height={20}
                        alt="search"
                      />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default page;
