"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./Report.css";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bahttext from "bahttext";

export default function page() {
  const searchParams = useSearchParams();
  const Name_Project = searchParams.get("Name_Project"); // ดึงค่าจาก URL
  const NumberReport = searchParams.get("Report"); // ดึงค่าจาก URL
  const [dataKorex, setDataKorex] = useState([]);
  const [dataPractika, setDataPractika] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://10.15.0.23:5006/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name_Project: Name_Project }),
      });

      const response = await res.json();
      setDataKorex(response);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dataKorex.length < 12) {
      const arrinvalid = 12 - dataKorex.length;
      const emptyArray = Array.from({ length: arrinvalid }, () => ""); // ✅ สร้างอาร์เรย์ว่าง

      setDataKorex([...dataKorex, ...emptyArray]); // ✅ รวมเข้ากับ data เดิม
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://10.15.0.23:5006/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name_Project: Name_Project }),
      });

      const response = await res.json();
      setDataPractika(response);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dataPractika.length < 5) {
      const arrinvalid = 5 - dataPractika.length;
      const emptyArray = Array.from({ length: arrinvalid }, () => ""); // ✅ สร้างอาร์เรย์ว่าง

      setDataPractika([...dataPractika, ...emptyArray]); // ✅ รวมเข้ากับ data เดิม
    }
  });

  let count = 1;

  function numberToThaiText(number) {
    const numbers = [
      "ศูนย์",
      "หนึ่ง",
      "สอง",
      "สาม",
      "สี่",
      "ห้า",
      "หก",
      "เจ็ด",
      "แปด",
      "เก้า",
    ];
    const units = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

    let numStr = Math.floor(number).toString();
    let result = "";
    let len = numStr.length;

    for (let i = 0; i < len; i++) {
      let digit = parseInt(numStr[i]);
      let unit = units[len - i - 1];

      if (digit !== 0) {
        if (unit === "สิบ" && digit === 2) {
          result += "ยี่";
        } else if (unit === "สิบ" && digit === 1) {
          result += "";
        } else if (unit === "" && digit === 1 && len > 1) {
          result += "เอ็ด";
        } else {
          result += numbers[digit];
        }
        result += unit;
      }
    }
    return result + "บาทถ้วน";
  }

  const totalPrice = dataPractika.reduce(
    (sum, item) =>
      sum + (Number(item.PCS) * Number(item.Price) || 0) - (Number(item.PCS) * Number(item.Price) || 0) * 0.07,
    0
  );

  return (
    <>
      {NumberReport == 0 ? (
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
              <div className="font-18 col-3">
                โทร TEL ......................
              </div>
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
              {dataKorex.map((item, index) => (
                <tbody key={index}>
                  <tr className="font-18">
                    <td className="text-center">
                      {item.PCS && item.Price ? index + 1 : ""}
                    </td>
                    <td
                      className={`p-1 ${!item.PCS && !item.Price ? "p-3" : ""}`}
                    >
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
                    {dataKorex
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
      ) : (
        <div className="mt-5 size-paper">
          <div className="row font-11">
            <div className="col-6">
              <h5 className="text-decoration">QUOTATION</h5>
            </div>
            <div className="col-6 text-end">
              <Image
                className="images-logo-practika"
                src={`/images_report/Practika.png`}
                width={1000}
                height={1000}
                alt="Practika"
              />
            </div>
            <div className="col-1">PROJECT</div>
            <div className="col-1"> : </div>
            <div className="col-10">โคเรกซ์ โซลูชั่น</div>
            <div className="col-1">ADDRESS</div>
            <div className="col-1"> : </div>
            <div className="col-10">บริษัทโคเรกซ์ โซลูชั่น</div>
            <div className="col-1"></div>
            <div className="col-1"></div>
            <div className="col-5">
              จำกัด 1/8 ซ.สุขาภิบาล 5 ซอย 98 แขวงสายไหม
            </div>
            <div className="col-5 text-end">QTN NO.: 2568-001 Rev.0</div>
            <div className="col-1"></div>
            <div className="col-1"></div>
            <div className="col-5">เขตสายไหม กรุงเทพฯ 10220</div>
            <div className="col-5 text-end">วันที่ : 1/4/2568</div>
            <div className="col-1">TEL.</div>
            <div className="col-1"> : </div>
            <div className="col-2">02-946-4384</div>
            <div className="col-8 text-end">
              พนักงานขาย อำนาจ สวัสดี : โทร. 089-622-3352
            </div>
            <div className="col-1">FAX.</div>
            <div className="col-1"> : </div>
            <div className="col-3"> </div>
            <div className="col-7 text-end">
              TEL. 0-2533-3955 EXT 400 FAX. 0-2533-3644
            </div>
            <div className="col-1">E-mail.</div>
            <div className="col-1"> : </div>
            <div className="col-3"> </div>
            <div className="col-7 text-end">
              E-mail address : amnat.saw@practika.com
            </div>
          </div>
          <table className="w-100 font-11 table-bordered">
            <thead className="bg-header text-center">
              <tr>
                <td width={30}>ITEM</td>
                <td width={`40%`}>DESCRIPTION</td>
                <td width={`50`}>QUANTITY</td>
                <td width={`50`}>NET PRICE</td>
                <td width={`50`}>AMOUNT</td>
              </tr>
            </thead>
            {dataPractika.map((item, index) => (
              <tbody key={index}>
                <tr>
                  <td className="text-center">{item.PCS && count++}</td>
                  <td>
                    {item.Name_Product} {item.Name_Class}
                  </td>
                  <td className="text-center">{item.PCS}</td>
                  <td className="text-end">{item.Price}</td>
                  <td className="text-end">
                    {item.Price && item.PCS ? (
                      item.PCS * item.Price
                    ) : (
                      <div className="p-2"></div>
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
            <tfoot className="bg-header">
              <tr>
                <td colSpan={3} rowSpan={3} className="text-center">
                  ({numberToThaiText(totalPrice)})
                </td>
                <td>มูลค่าสินค้ารวม</td>
                <td>
                  {dataPractika
                    .reduce(
                      (sum, item) =>
                        sum + (Number(item.PCS) * Number(item.Price) || 0),
                      0
                    )
                    .toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>ภาษีมูลค่าเพิ่ม 7%</td>
                <td>
                  {dataPractika
                    .reduce(
                      (sum, item) =>
                        sum +
                        (Number(item.PCS) * Number(item.Price) || 0) * 0.07,
                      0
                    )
                    .toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>รวมราคาเสนอทั้งสิ้น</td>
                <td>
                  {dataPractika
                    .reduce(
                      (sum, item) =>
                        sum +
                        (Number(item.PCS) * Number(item.Price) || 0) -
                        (Number(item.PCS) * Number(item.Price) || 0) * 0.07,
                      0
                    )
                    .toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="row font-9 border-detail">
            <div className="mb-1 col-2 fw-bold">กำหนดยืนราคา</div>
            <div className="mb-1 col-10">30 วันทำการ นับจากวันที่เสนอราคา</div>
            <div className="mb-1 col-2 fw-bold">กำหนดส่งสินค้า</div>
            <div className="mb-1 col-10">
              30 วันทำการ
              นับจากวันเซ็นสัญญาหรือใบสั่งซื้อพร้อมได้รับเงินมัดจำเรียบร้อย
              และได้รับการอนุมัติรูปแบบสินค้า วัสดุ สี
              เพื่อใช้ในการผลิตครบทุกรายการเป็นลายลักษณ์อักษร
              กรณีต้องทำสินค้าต้นแบบ นับจากวันที่ได้รับอนุมัติสินค้าต้นแบบ
            </div>
            <div className="mb-1 col-2 fw-bold">เงื่อนไขการชำระเงิน</div>
            <div className="mb-1 col-10">ชำระ 100% เมื่อส่งสินค้าเครดิต 30 วัน</div>
            <div className="mb-1 col-2 fw-bold">เงื่อนไขอื่น ๆ</div>
            <div className="mb-1 col-10">
              <div className="mb-1 row">
                <div className="mb-1 col-12">1. ราคาเสนอรวมภาษีมูลค่าเพิ่มแล้ว</div>
                <div className="mb-1 col-12">
                  2. ราคาดังกล่าวรวมค่าขนส่งและประกอบติดตั้ง (เฉพาะในเขตกรุงเทพฯ
                  และปริมณฑลในเวลาปกติ วันจันทร์ - ศุกร์)
                  กรณีมีค่าล่วงเวลาในการทำงานในวันหยุดเสาร์ -อาทิตย์
                  และวันหยุดนักขัตฤกษ์ ให้อยู่ในความรับผิดชอบของผู้ซื้อ
                </div>
                <div className="mb-1 col-12">
                  3. ราคาดังกล่าว ไม่รวมถึงงานระบบไฟฟ้า
                  และระบบน้ำที่เกี่ยวเนื่องกับตัวสินค้าตามใบเสนอราคานี้
                </div>
                <div className="mb-1 col-12">
                  4.
                  ราคาดังกล่าวไม่รวมค่าประกันภัยและค่าใช้จ่ายอื่นๆที่เกี่ยวข้องกับการเข้าทำงานในสถานที่ก่อสร้าง/ตกแต่ง
                  เช่น ค่า รปภ., ค่าน้ำ, ค่าไฟ และค่าบริการต่างๆ อันเป็น
                  เงื่อนไขของฝ่ายอาคารสถานที่ของแต่ละหน่วยงาน
                </div>
                <div className="mb-1 col-12">
                  5. กรณีมีงานเพิ่มขึ้นในการปรับเปลี่ยนแบบหรือจำนวน
                  ราคาจะเพิ่มขึ้น ตามปริมาณงานที่ทำจริง
                </div>
                <div className="mb-1 col-12">
                  6.
                  กรณีการยืนราคาสำหรับการสั่งซื้อต่อเนื่อง/เพิ่มเติมหลังงานจบโครงการเป็นระยะเวลา
                  6 เดือน
                </div>
                <div className="mb-1 col-12">
                  7. กรณีพื้นที่ไม่พร้อมให้ติดตั้ง ทางบริษัทฯ
                  ขอพิจารณางดส่งสินค้า จนกว่าพื้นที่จะพร้อมติดตั้งซึ่งทางบริษัทฯ
                  จะจัดส่งสินค้าให้ภายใน 3 วันทำการ หลังจากได้รับแจ้งจากผู้ซื้อ
                </div>
                <div className="mb-1 col-12">8. กรณีลูกค้าเลื่อนส่งสินค้า</div>
                <div className="mb-1 col-12 mx-3">
                  8.1 ผู้ขายจะเรียกเก็บเงินค่าสินค้าให้ครบ 75%
                  ของมูลค่าสินค้าตามสัญญา เมื่อผู้ซื้อเริ่มฝากสินค้ารอบแรก 30
                  วัน และชำระค่าสินค้าเพิ่มให้ครบ 95% ของยอดสินค้าเพื่อฝากต่อรอบ
                  2 อีก 30 วัน
                </div>
                <div className="mb-1 col-12 mx-3">
                  8.2 ระยะเวลาฝากสินค้า 1 ถึง 30 วัน ไม่เสียค่าฝากสินค้า
                </div>
                <div className="mb-1 col-12 mx-3">
                  8.3 ระยะเวลาฝากสินค้า 31 ถึง 60 วัน คิดราคาฝากที่จำนวน 1.5%
                  ของมูลค่าสินค้าที่ฝาก
                </div>
                <div className="mb-1 col-12 mx-3">
                  8.4 ระยะเวลาฝากสินค้าครบ 60 วัน
                  ถ้าไม่รับสินค้าต้องให้สิทธิการจัดการสินค้ากับผู้ขาย
                  และหากเกิดความเสียหายขึ้น ผู้ซื้อเป็นฝ่ายรับผิดชอบ
                </div>
                <div className="mb-1 col-12">
                  9. เฉดสีและลายของวัสดุอาจแตกตา่ งจากตัวอย่าง
                  หรือการผลิตแต่ละครั้ง
                </div>
                <div className="mb-1 col-12">10. การตรวจรับมอบงาน</div>
                <div className="mb-1 col-12 mx-3">
                  10.1 ตรวจรับมอบงานภายใน 5 วันหลังจากรับแจ้งส่งมอบงาน
                  หากไม่ดำเนินการตรวจรับมอบงานภายในกำหนด
                  ให้ถือว่าผู้ซื้อได้ตรวจรับงานนั้นๆ เรียบร้อย
                </div>
                <div className="mb-1 col-12 mx-3">
                  10.2 ทางผู้ซื้อตกลง
                  ตรวจรับมอบงานทั้งจำนวนและคุณภาพสินค้าที่ทางบริษัทฯ
                  ส่งมอบพร้อมกันในรอบเดียว โดยผู้ซื้อหรือตัวแทนของผู้ซื้อ
                </div>
                <div className="mb-1 col-12 mx-3">
                  10.3 หากพบความบกพร่องของสินค้า เช่น รอยกระเทาะ แตกหัก หรือ
                  รอยขีดข่วน เกิดขึ้น หลังการส่งมอบ
                  ให้อยู่ในความรับผิดชอบของทางผู้ซื้อ
                </div>
                <div className="mb-1 col-12">
                  11. รับประกันคุณภาพสินค้าเป็นระยะเวลา 3 ปี ยกเว้นหลอดไฟ
                  รับประกัน 1 ปี /ก๊อก+SINK รับประกัน 2 ปี
                </div>
              </div>
            </div>
          </div>
          <div className="row border-approved font-11">
            <div className="col-6 text-center mt-1">ผู้เสนอราคา</div>
            <div className="col-6 text-center mt-1">ผู้อนุมัติสั่งซื้อ</div>
            <div className="col-6 text-center mt-5">
              .....................................................
            </div>
            <div className="col-6 text-center mt-5">
              .....................................................
            </div>
            <div className="col-6 text-center">(นายอำนาจ สวัสดี)</div>
            <div className="col-6 text-center">
              (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)
            </div>
            <div className="col-6 text-center"></div>
            <div className="col-6 text-center">
              .........../............./............
            </div>
          </div>
          <div className="font-12 border-approved">
            <div className="mx-1 font-11">
              QPFM-06-001 Rev. 10 ประกาศใช้ 16 ม.ค. 67 (อายุจัดเก็บ 5 ปี)
            </div>
          </div>
          <div>
            <Image
              className="img-footer mt-2"
              src={`/images_report/footer.jpg`}
              width={1000}
              height={1000}
              alt="footer"
            />
          </div>
        </div>
      )}
    </>
  );
}
