"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./Report.css";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";

export default function page() {
  const searchParams = useSearchParams();
  const Name_Project = searchParams.get('Name_Project'); // ดึงค่าจาก URL
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://10.15.0.23:5006/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name_Project: Name_Project }),
      });

      const response = await res.json();
      setData(response);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length < 12) {
      const arrinvalid = 12 - data.length;
      const emptyArray = Array.from({ length: arrinvalid }, () => ""); // ✅ สร้างอาร์เรย์ว่าง

      setData([...data, ...emptyArray]); // ✅ รวมเข้ากับ data เดิม
    }
  });

  return (
    <div className="d-flex justify-content-center">
      <div className="Border-Report p-3">
        <div>
          <Image
            className="header-images"
            src={`/Images_report/image.png`}
            width={1000}
            height={1000}
            alt="header"
          />
        </div>
        <div className="font-18 mt-2 text-center">ใบสั่งซื้อ</div>
        <div className="font-18 mt-2 text-center">PURCHASE ORDER</div>
        <div className="font-18 row">
          <div className="font-18 col-6">
            เรียน TO..................................................
          </div>
          <div className="font-18 col-6">
            วันที่ Date
            .............................................................
          </div>
          <div className="font-18 col-6">
            ..................................................................
          </div>
          <div className="font-18 col-6">
            ใบสั่งซื้อเลขที่ PO.No .......................................
          </div>
          <div className="font-18 col-3">โทร TEL ......................</div>
          <div className="font-18 col-3">แฟกซ์ FAX .................</div>
          <div className="font-18 col-6">
            สถานที่ส่งของ DELIVERY TO ...........................
          </div>
        </div>
        <table className="w-100 border-1">
          <thead>
            <tr className="text-center">
              <th>
                <div>ที่</div>
                <div>No.</div>
              </th>
              <th width={300}>
                <div>รายการ</div>
                <div>DESCRIPTION</div>
              </th>
              <th>
                <div>จำนวน</div>
                <div>QUANTITY</div>
              </th>
              <th>
                <div>ราคาต่อหน่วย</div>
                <div>UNIT PRICE</div>
              </th>
              <th>
                <div>จำนวนเงิน</div>
                <div>AMOUNT</div>
              </th>
            </tr>
          </thead>
          {data.map((item, index) => (
            <tbody key={index}>
              <tr className="font-18">
                <td className="text-center">{item.PCS && item.Price ? index + 1 : ""}</td>
                <td className={`p-1 ${!item.PCS && !item.Price ? "p-3" : ""}`}>
                  {item.Name_Product} {item.Name_Class}
                </td>
                <td className="text-center">{item.PCS}</td>
                <td className="text-center">{item.Price}</td>
                <td className="text-center">
                  {item.PCS && item.Price
                    ? Number(item.PCS) * Number(item.Price)
                    : ""}
                </td>
              </tr>
            </tbody>
          ))}
          <tfoot>
            <tr>
              <td colSpan={3} className="bg-finish"></td>
              <td className="text-center">ราคารวม (Total)</td>
              <td className="text-center">
                {data
                  .reduce(
                    (sum, item) =>
                      sum + (Number(item.PCS) * Number(item.Price) || 0),
                    0
                  )
                  .toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="text-end">(ราคายังไม่รวม VAT)</div>
        <div className="font-18 mt-3">
          กำหนดส่งสินค้า
          .....................................................................................................................................
        </div>
        <div className="font-18 mt-3">
          เงื่อนไข
          ...................................................................................................................................................
        </div>
        <div className="font-18 mt-3">
          หมายเหตุ ถ้าหากได้รับใบสั่งซื้อ กรุณาเซ็นรับ แล้วส่งกลับ
          Email:korexthailand@gmail.com
        </div>
        <div className="row mt-3 text-center">
          <div className="col-4">
            <div className="row font-18">
              <div className="col-12">
                ลงชื่อ...................................
              </div>
              <div className="col-12">( นางนิรดา ดุจนาคี )</div>
              <div className="col-12">ผู้สั่งซื้อ ORDERED BY</div>
              <div className="col-12">
                .........../............./.............
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="row font-18">
              <div className="col-12">
                ลงชื่อ...................................
              </div>
              <div className="col-12">( นายภูมิทัศน์ ธีระวัฒน์สกุล )</div>
              <div className="col-12">ผู้อนุมัติ</div>
              <div className="col-12">
                .........../............./.............
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="row font-18">
              <div className="col-12">
                ลงชื่อ...................................
              </div>
              <div className="col-12">(.................)</div>
              <div className="col-12">ผู้รับใบสั่งซื้อ RECEIVED BY</div>
              <div className="col-12">
                .........../............./.............
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
