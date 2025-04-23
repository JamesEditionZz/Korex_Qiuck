"use client";
import React, { use, useEffect, useState } from "react";
import "./product.css";
import { useCallback } from "react";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import "./animation.css";
import BarChart from "./IndexGraph/Bar/page";
import "font-awesome/css/font-awesome.css";
import "./Loading.css";

function page() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [product_basket, setProduct_Basket] = useState([]);
  const [swith_page, setSwith_Page] = useState(0);
  const [dashboard, setDashBoard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [header_select, setHeader_Select] = useState(0);
  const [modelFile, setModelFile] = useState(0);
  const [importFile, setImportFile] = useState(null);
  const [modelDetail, setModelDetail] = useState(false);
  const [modelEdit, setModelEdit] = useState(false);
  const [heaerNameProject, setHeaderNameProject] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [getDataEdit, setGetDataEdit] = useState([]);

  const username = JSON.parse(localStorage.getItem("username"));

  //Get DataInput
  const [standard, setStandard] = useState("");
  const [category_Bloom, setCategory_Bloom] = useState([]);
  const [dataStandard, setDataStandard] = useState([]);
  const [textArea, setTextArea] = useState([]);
  const [getProduct, setGetProduct] = useState("");
  const [getCategory, setGetCategory] = useState("");
  const [getWidth, setGetWidth] = useState("");
  const [getLong, setGetLong] = useState("");
  const [getPcs, setGetPcs] = useState("");
  const [getPrice, setGetPrice] = useState("");
  const [number_FG, setNumber_FG] = useState(0);
  const [request_Date, setRequest_Date] = useState("");
  const [nameProject, setNameProject] = useState("");
  const [recordValueEdit, setRecordValueEdit] = useState("");

  const [projectClass, setProjectClass] = useState("");
  const [numberOrder, setNumberOrder] = useState(0);
  const [updatePDFProject, setUpdatePDFProject] = useState("");
  const [updatePDFDiscription, setUpdatePDFDiscription] = useState("");
  const [files, setFiles] = useState([]); // เก็บไฟล์ทั้งหมด
  const [insertmultifile, setInsertMultifile] = useState([Date.now()]); // ใช้ timestamp ป้องกัน key ซ้ำ

  const [detailOrder, setDetailOrder] = useState([]);
  const [checkEditHeader, setCheckEditHeader] = useState(0);
  const [valueEditHeader, setValueEditHeader] = useState("");
  const [valueDefaultProject, setValueDefaultProject] = useState("");
  const [newTextProject, setNewTextProject] = useState("");

  const [openInputProject, setOpenInputProject] = useState(0);

  //Edit
  const [editProduct_description, setEditProduct_description] = useState("");
  const [editProduct_long, setEditProduct_long] = useState("");
  const [editProduct_pcs, setEditProduct_pcs] = useState("");
  const [editProduct_price, setEditProduct_price] = useState("");
  const [editProduct_requestDate, setEditProduct_requestDate] = useState("");
  const [editProduct_width, setEditProduct_width] = useState("");

  const [edit_Data, setEdit_Data] = useState(0);
  const [display_Edit, setDisplay_Edit] = useState(0);
  const [response_Data_Edit, setResponse_Data_Edit] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://10.15.0.23:5006/api/get/MasterData");
      const data = await res.json();
      setMasterData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://10.15.0.23:5006/api/get/product");
      const fetdata = await response.json();

      setData(fetdata);
    };

    const fetchBasket = async () => {
      if (!username) return;
      try {
        const res = await fetch("http://10.15.0.23:5006/api/post/checkbasket", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            username,
          }),
        });

        const response = await res.json();
        setProduct_Basket(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchBasket();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://10.15.0.23:5006/api/get/DashBoard");
      const fetdata = await response.json();

      // ใช้ Promise.all เพื่อให้การ fetch ทุกๆ request เสร็จพร้อมกัน
      const updatedData = await Promise.all(
        fetdata.map(async (item) => {
          const Request_Date = await fetch(
            "http://192.168.199.104:9083/jderest/v3/orchestrator/Sale_Order_Request",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("itskor:itskor"),
              },
              body: JSON.stringify({
                Order_Number_1: parseInt(item.ERP_Order_Number),
                Or_Ty_1: "SO",
              }),
            }
          );

          const fetch_Request_Date = await Request_Date.json();

          // ตรวจสอบว่า F4211_DOCO ตรงกับ ERP_Order_Number หรือไม่
          const requestDateData =
            fetch_Request_Date?.ServiceRequest1?.fs_DATABROWSE_V4211A?.data
              ?.gridData?.rowset[0];
          if (
            requestDateData &&
            requestDateData.F4211_DOCO === parseInt(item.ERP_Order_Number)
          ) {
            // ถ้าตรงกัน, เอาข้อมูลมาใส่ใน array ของ object
            return {
              ERP_Order_Number: item.ERP_Order_Number,
              Name_Project: item.Name_Project,
              Order_date: item.Order_date,
              Product_pcs: item.Product_pcs,
              Product_price: item.Product_price,
              SO_TY: item.SO_TY,
              date_request: item.date_request,
              Schedule_Pick_Date: requestDateData.F4211_DRQJ,
              Last_Date: requestDateData.F4211_LTTR,
              Next_Date: requestDateData.F4211_NXTR,
            };
          } else {
            // ถ้าไม่ตรงกัน ให้ส่ง object ที่ไม่มีข้อมูลนี้
            return {
              ERP_Order_Number: item.ERP_Order_Number,
              Name_Project: item.Name_Project,
              Order_date: item.Order_date,
              Product_pcs: item.Product_pcs,
              Product_price: item.Product_price,
              SO_TY: item.SO_TY,
              date_request: item.date_request,
              Schedule_Pick_Date: null,
              Last_Date: null,
              Next_Date: null,
            };
          }
        })
      );

      // เก็บข้อมูลที่อัพเดทแล้วใน state
      setDashBoard(updatedData);
    };

    fetchData();
  }, []);

  const totalPrice = product_basket.reduce((acc, item) => {
    // Ensure Product_price is a number, fallback to 0 if undefined or invalid
    const price = parseFloat(item.Product_price || 0);
    return acc + price;
  }, 0);

  const handlemodal = async (Name_Product, Number_FG) => {
    try {
      const res = await fetch(`http://10.15.0.23:5006/api/find/FG`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ Number_FG }),
      });

      const response = await res.json();
      setNumber_FG(Number_FG);
      setCategory_Bloom(response);
    } catch (error) {
      console.error(error);
    }

    try {
      const res = await fetch("http://10.15.0.23:5006/api/post/category");

      const response = await res.json();

      setDataStandard(response);
    } catch (error) {
      console.error("Login failed:", error);
    }

    setStandard(Name_Product);
  };

  const Logout = () => {
    router.push("../");
  };

  const page_listproduct = () => {
    setHeader_Select(0);
    setSwith_Page(0);
  };

  const page_product = () => {
    setHeader_Select(1);
    setSwith_Page(1);
  };

  const page_Detail = async () => {
    const res = await fetch(`http://10.15.0.23:5006/api/get/import_file`);
    const fetchdata = await res.json();

    setImportFile(fetchdata);

    setHeader_Select(2);
    setSwith_Page(2);
  };

  const handleProductSubmit = async () => {
    if (number_FG != "N05") {
      if (nameProject == "") {
        alert("ระบุโครงการ");
      } else if (getWidth == "") {
        alert("ระบุความกว้าง");
      } else if (getLong == "") {
        alert("ระบุความยาว");
      } else if (getPcs == "") {
        alert("ระบุจำนวน");
      } else if (getPrice == "") {
        alert("ระบุราคา");
      } else if (request_Date == "") {
        alert("ระบุวันที่");
      }
    }

    if (
      nameProject &&
      getProduct &&
      getWidth &&
      getLong &&
      getPcs &&
      getPrice &&
      request_Date
    ) {
      try {
        const res = await fetch("http://10.15.0.23:5006/api/post/basket", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            nameProject,
            projectClass,
            standard,
            number_FG,
            getProduct,
            getCategory,
            getWidth,
            getLong,
            getPcs,
            getPrice,
            request_Date,
            username,
            textArea,
          }),
        });
        const response = await res.json();
        setProduct_Basket(response);
      } catch (error) {
        console.error(error);
      }

      setHeaderNameProject(nameProject);
      setGetWidth("");
      setGetLong("");
      setGetPcs("");
      setGetPrice("");
      setTextArea("");

      try {
        const res = await fetch("http://10.15.0.23:5006/api/post/checkbasket", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            username,
          }),
        });

        const response = await res.json();
        setProduct_Basket(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlesubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://10.15.0.23:5006/api/post/ERPRecord", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username,
        }),
      });

      const response = await res.json();

      const newNumberOrderSN = response.insertSN?.["Previous Order"];
      const Pre_Order_typeSN = response.insertSN?.["Previous Order Type"];

      const newNumberOrderSO = response.insertSO?.["Previous Order"];
      const Pre_Order_typeSO = response.insertSO?.["Previous Order Type"];

      sessionStorage.setItem("numberOrder", newNumberOrderSO);

      if (newNumberOrderSO) {
        const storedNumberOrder = sessionStorage.getItem("numberOrder");

        try {
          const responses = await Promise.all(
            product_basket.map(async (item) => {
              const res = await fetch(
                "http://10.15.0.23:5006/api/post/Master",
                {
                  method: "POST",
                  headers: { "Content-type": "application/json" },
                  body: JSON.stringify({
                    FG_Product: item.Product_FG,
                    Name_Project: nameProject,
                    Name_Class: item.Product_class,
                    SN: newNumberOrderSN,
                    SN_TY: Pre_Order_typeSN,
                    SO: newNumberOrderSO,
                    SO_TY: Pre_Order_typeSO,
                    Name_Product: item.Name_Product,
                    Category_Product: item.Product_Category,
                    Width: item.Product_width,
                    Height: item.Product_long,
                    PCS: item.Product_pcs,
                    Price: item.Product_price,
                    username,
                    Description: item.Product_description,
                    request_date: item.Product_requestDate,
                    ERP_Order_Number: storedNumberOrder,
                  }),
                }
              );
              return res.json();
            })
          );
          setProduct_Basket(responses);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
          alert("บันทึกเรียบร้อยแล้ว");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const deletebasket = async (value) => {
    if (confirm(`ยืนยันการลบ`)) {
      try {
        const fetchDelete = await fetch(
          "http://10.15.0.23:5006/api/post/DeleteBasket",
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              value,
            }),
          }
        );

        try {
          const res = await fetch("http://10.15.0.23:5006/api/get/basket");
          const response = await res.json();
          setProduct_Basket(response);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // เดือนปัจจุบัน (January คือ 0)
  const findmonthThai = new Date().getMonth(); // เดือนปัจจุบัน (January คือ 0)
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

  const totalPricesCard = dashboard
    .filter((item) => {
      const date = new Date(item.Order_date);
      return date.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + item.Product_price, 0);

  const totalPriceThisMonth = dashboard
    .filter((item) => {
      const date = new Date(item.Order_date);
      return (
        date.getMonth() + 1 === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, item) => sum + item.Product_price, 0);

  const insertFile = (Project, Other, Order) => {
    setModelFile(1);
    setUpdatePDFProject(Project);
    setUpdatePDFDiscription(Other);
    setNumberOrder(Order);
  };

  // ฟังก์ชันเลือกไฟล์
  const handleFileChange = (index, event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return; // ตรวจสอบว่ามีไฟล์ถูกเลือกไหม

    if (selectedFile.type !== "application/pdf") {
      alert("กรุณาเลือกไฟล์ PDF เท่านั้น");
      event.target.value = ""; // รีเซ็ตค่า input
      return;
    }

    // อัปเดตไฟล์ในตำแหน่งที่เลือก
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = selectedFile;
      return newFiles;
    });
  };

  // ฟังก์ชันอัปโหลดไฟล์
  const importfile = async () => {
    setLoading(true);

    if (files.length === 0) {
      alert("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // ใช้ "files" ให้ตรงกับ Backend
    });

    formData.append("Project", updatePDFProject);
    formData.append("Description", updatePDFDiscription);
    formData.append("Order", numberOrder);

    const res = await fetch(`http://10.15.0.23:5006/api/post/importFile`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.message === "true") {
      alert("เพิ่มไฟล์เรียบร้อยแล้ว");
      setFiles([]); // รีเซ็ตไฟล์หลังอัปโหลดเสร็จ
      setInsertMultifile([Date.now()]); // รีเซ็ต input ใหม่
      setModelFile(0);
      window.location.reload();
    } else {
      alert("ไม่สามารถบันทึกได้");
      setModelFile(0);
      setLoading(false);
    }
  };

  const uniqueData = data.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.Name_Product === item.Name_Product && t.Number_FG === item.Number_FG
      )
  );

  const insertinput = () => {
    setInsertMultifile([...insertmultifile, Date.now()]); // ใช้ timestamp ป้องกัน key ซ้ำ
  };

  const OrderDetail = async (OrderNumber) => {
    setModelDetail(true);

    const res = await fetch(`http://10.15.0.23:5006/api/post/OrderDetail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ OrderNumber }),
    });

    const response = await res.json();

    setDetailOrder(response);
  };

  const groupByCategory = (data) => {
    // เรียง Name_Class จาก "ชั้น 1" -> "ชั้น 2"
    const sortedData = [...data].sort((a, b) =>
      a?.Name_Class?.localeCompare(b.Name_Class, "th")
    );

    // จัดกลุ่มตาม Name_Class
    return sortedData.reduce((acc, item) => {
      const key = item.Name_Class;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  };

  const CloseModelDetail = () => {
    setModelDetail(false);
  };

  const Report = (Name_Project, ReportNumber) => {
    const newTab = window.open(
      `../Components/Report?Name_Project=${Name_Project}&Report=${ReportNumber}`,
      "_blank"
    );

    if (newTab) {
      newTab.onload = () => {
        setTimeout(() => {
          newTab.print(); // สั่งพิมพ์หน้าทันทีที่หน้าโหลดเสร็จ
        }, 500);
      };
      newTab.onafterprint = () => newTab.close(); // ปิดหน้าหลังจากพิมพ์เสร็จ
    }
  };

  const editheader = async (valueheader) => {
    setCheckEditHeader(1);
    setValueEditHeader(valueheader);
    setRecordValueEdit(valueheader);
  };

  const submit_edittextheader = async () => {
    const ValueEdit = await fetch(`http://10.15.0.23:5006/api/post/Edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valueheader: valueEditHeader,
        valueEditHeader: recordValueEdit,
        username: username,
      }),
    });

    if (ValueEdit.ok) {
      const res = await fetch("http://10.15.0.23:5006/api/post/checkbasket", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username,
        }),
      });

      const response = await res.json();

      setProduct_Basket(response);
      setCheckEditHeader(0);
    }
  };

  const groupedProducts = product_basket.reduce((acc, item) => {
    if (!acc[item.Product_class]) {
      acc[item.Product_class] = [];
    }
    acc[item.Product_class].push(item);
    return acc;
  }, {});

  useEffect(() => {
    if (product_basket.length > 0 && product_basket[0]?.Product_Projectname) {
      setNameProject(product_basket[0].Product_Projectname);
    }
  }, [product_basket]);

  const editProject = (Project_name) => {
    setOpenInputProject(1);
    setValueDefaultProject(Project_name);
    setNewTextProject(Project_name);
  };

  const ChangeRecordProject = async () => {
    const res = await fetch(`http://10.15.0.23:5006/api/post/EditTextHeader`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valueDefaultProject: valueDefaultProject,
        newTextProject: newTextProject,
        username: username,
      }),
    });

    if (res.ok) {
      const res = await fetch("http://10.15.0.23:5006/api/post/checkbasket", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username,
        }),
      });

      const response = await res.json();

      setProduct_Basket(response);
      setOpenInputProject(0);
    }
  };

  const EditBasket = async (value) => {
    setModelEdit(true);

    const res = await fetch(
      `http://localhost:5006/api/post/get_Data_edit_Product`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Product_ID: value,
        }),
      }
    );

    const response = await res.json();

    setEditProduct_width(response[0].Product_width);
    setEditProduct_long(response[0].Product_long);
    setEditProduct_pcs(response[0].Product_pcs);
    setEditProduct_price(response[0].Product_price);
    setEditProduct_description(response[0].Product_description);
    setEditProduct_requestDate(response[0].Product_requestDate);

    setGetDataEdit(response);
  };

  const handleEditProductSubmit = async (Product_ID) => {
    const res = await fetch(
      `http://localhost:5006/api/post/edit_Product_basket`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Product_ID,
          editProduct_width,
          editProduct_long,
          editProduct_pcs,
          editProduct_price,
          editProduct_description,
          editProduct_requestDate,
        }),
      }
    );

    if (res.ok) {
      const res2 = await fetch("http://10.15.0.23:5006/api/get/basket");
      const response = await res2.json();

      setProduct_Basket(response);
      setModelEdit(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const EditData = async (value) => {
    setEdit_Data(1);

    const res = await fetch(`http://localhost:5006/api/post/Master_Data_Edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    const response = await res.json();

    setResponse_Data_Edit(response);

    setTimeout(() => {
      setDisplay_Edit(1);
    }, 400);
  };

  const OpjectDataEdit = () => {
    setEdit_Data(0);
    setTimeout(() => {
      setDisplay_Edit(0);
    }, 400);
  };

  const handleChange = (index, field, value) => {
    const updatedData = [...response_Data_Edit];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
    };
    setResponse_Data_Edit(updatedData);
  };

  const handleChangeEdit = () => {
    console.log(response_Data_Edit);
  };

  return (
    <div className="bg-dashbaord">
      {loading && (
        <div className="form-loading">
          <span className="loader"></span>
        </div>
      )}
      {modelFile == 1 && (
        <>
          <div className="modal-data">
            <div className="model-file">
              <div className="mx-5 mt-3 row">
                {insertmultifile.map((item, index) => (
                  <div className="col-11 mb-2" key={item}>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf"
                      onChange={(event) => handleFileChange(index, event)}
                    />
                  </div>
                ))}
                <div className="col-1">
                  <label className="h3 handleDetail" onClick={insertinput}>
                    +
                  </label>
                </div>
                <div className="mt-3 d-flex justify-content-center mb-3">
                  <div className="mx-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setModelFile(0), setInsertMultifile([Date.now()]);
                      }}
                    >
                      ยกเลิก
                    </button>
                  </div>
                  <div className="mx-2">
                    <button className="btn btn-danger" onClick={importfile}>
                      Import
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {modelDetail == true && (
        <div className="modeldetail" onClick={() => CloseModelDetail()}>
          <div
            className="modeldetail-content row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="col-12 text-center">
              <label className="h5">
                โครงการ {detailOrder[0]?.Name_Project}
              </label>
              {swith_page != 2 && (
                <div className="w-90 position-absolute d-flex justify-content-end">
                  <button
                    className="btn btn-success mx-2"
                    onClick={() => Report(detailOrder[0]?.Name_Project, 0)}
                  >
                    Report Korex
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => Report(detailOrder[0]?.Name_Project, 1)}
                  >
                    Report Practika
                  </button>
                </div>
              )}
            </div>
            <div className="w-100 col-12">
              {Object.entries(groupByCategory(detailOrder)).map(
                ([category, items]) => (
                  <div key={category}>
                    {/* หัวข้อหมวดหมู่ */}
                    <h5 className="mt-3">{category}</h5>
                    <table className="table table-bordered w-100">
                      <thead className="text-center">
                        <tr>
                          <th width="200">FG</th>
                          <th width="200">ประเภทสินค้า</th>
                          <th width="200">กว้าง X ยาว</th>
                          <th width="200">จำนวน/ชิ้น</th>
                          <th width="200">ราคา</th>
                          <th width="600">รายละเอียดเพิ่มเติม</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.FG_Product}</td>
                            <td>{item.Name_Product}</td>
                            <td>
                              {item.Width}x{item.Height}
                            </td>
                            <td>{item.PCS}</td>
                            <td>{(item.PCS * item.Price).toLocaleString()}</td>
                            <td>{item.Description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      {modelEdit == true && (
        <div className="modeledit" onClick={() => setModelEdit(false)}>
          <div
            className="modeledit-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-1 p-3">
              <div className={``}>
                <div className="mb-2">
                  <input
                    className="form-control"
                    value={getDataEdit[0]?.Product_Projectname}
                    placeholder={getDataEdit[0]?.Product_Projectname}
                    disabled
                  />
                </div>
                <div className="mb-2">
                  <input
                    className="form-control"
                    value={getDataEdit[0]?.Product_class}
                    disabled
                  />
                </div>
                <div className="mb-2">
                  <input
                    className="form-control"
                    value={getDataEdit[0]?.Name_Product}
                    disabled
                  />
                </div>
                <div className="mb-2">
                  <input
                    className="form-control"
                    value={getDataEdit[0]?.Product_STD}
                    disabled
                  />
                </div>
                <div className="mb-2">
                  <input
                    className="form-control"
                    value={getDataEdit[0]?.Product_Category}
                    disabled
                  />
                </div>
                <div className="mb-2">
                  <div className="row">
                    <div className="col-6">
                      <input
                        className="form-control col-5"
                        placeholder="กว้าง"
                        onChange={(e) => setEditProduct_width(e.target.value)}
                        value={editProduct_width}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <input
                        className="form-control col-5"
                        placeholder="ยาว"
                        onChange={(e) => setEditProduct_long(e.target.value)}
                        value={editProduct_long}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setEditProduct_pcs(e.target.value)}
                    placeholder="จำนวน"
                    value={editProduct_pcs}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setEditProduct_price(e.target.value)}
                    placeholder="ราคา/หน่วย"
                    value={editProduct_price}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) => setEditProduct_requestDate(e.target.value)}
                    value={
                      editProduct_requestDate
                        ? formatDate(editProduct_requestDate)
                        : ""
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    placeholder="รายละเอียดเพิ่มเติม"
                    onChange={(e) => setEditProduct_description(e.target.value)}
                    value={editProduct_description}
                  ></textarea>
                </div>
                <div className="col-12">
                  <button
                    className="form-control btn btn-warning"
                    onClick={() =>
                      handleEditProductSubmit(getDataEdit[0]?.Product_ID)
                    }
                  >
                    แก้ไข
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`navbar-menu text-center`}>
        <div className="row">
          <div
            className={`col border-btn ${
              header_select == 0 ? "header-select" : ""
            }`}
          >
            <h5 className={`p-3 menu-header`} onClick={page_listproduct}>
              แดชบอร์ด
            </h5>
          </div>
          <div
            className={`col border-btn ${
              header_select == 1 ? "header-select" : ""
            }`}
          >
            <h5 className={`p-3 menu-header`} onClick={page_product}>
              ขอยื่นราคา
            </h5>
          </div>
          <div
            className={`col border-btn ${
              header_select == 3 ? "header-select" : ""
            }`}
          >
            <h5 className={`p-3 menu-header`} onClick={page_Detail}>
              แนบแบบโครงการ
            </h5>
          </div>
          <div className={`col border-btn`}>
            <h5 className={`p-3 menu-header`} onClick={Logout}>
              ออกจากระบบ
            </h5>
          </div>
        </div>
      </div>
      <div>
        {swith_page === 0 && (
          <div className={`opacity`}>
            <div className="row d-flex justify-content-between mx-5 m-3">
              <div className="col-4">
                <div className="card-modal-1">
                  <div className="number-modal">
                    <h5>โครงการทั้งหมด</h5>
                    <hr />
                    <div className="d-flex justify-content-end">
                      <label>
                        <h2>{dashboard.length} โครงการ</h2>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card-modal-3">
                  <div className="number-modal">
                    <h5>มูลค่าขาย เดือน{month[findmonthThai]}</h5>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <label>
                        <h4>มูลค่า</h4>
                      </label>
                      <label>
                        <h2>{totalPriceThisMonth.toLocaleString()} บ.</h2>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card-modal-4">
                  <div className="number-modal">
                    <h5>รวมมูลค่าปี {currentYear}</h5>
                    <hr />
                    <div className="d-flex justify-content-end">
                      <label>
                        <h2>{totalPricesCard.toLocaleString()} บ.</h2>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mx-5">
              <div className="col-6">
                <div className="table-box-shadow bg-white">
                  <BarChart />
                </div>
              </div>
              <div className="col-6">
                <div className="table-box-shadow bg-white">
                  <div className="data-box">
                    <label className="p-2">
                      <h5>รายการเดือน {month[findmonthThai]}</h5>
                    </label>
                    <table className="table table-bordered">
                      <thead className="table-header">
                        <tr>
                          <th>โครงการ</th>
                          <th>Doc_TY</th>
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
                              <td>{element.SO_TY}</td>
                              <td>{element.Product_price.toLocaleString()}</td>
                              <td>
                                {(() => {
                                  const date = new Date(element.date_request);
                                  return `${date
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0")}-${(date.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0")}-${date.getFullYear()}`;
                                })()}
                              </td>
                              <td align="center">
                                <button
                                  className="btn btn-warning"
                                  onClick={() =>
                                    OrderDetail(element.ERP_Order_Number)
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
                </div>
              </div>
            </div>
            <div className="table-box-shadow p-2 mt-4 mx-5 bg-white">
              <div className="mx-5 text-center row">
                <div className="col-1">
                  <select className="form-select m-1">
                    <option>Status</option>
                    <option>กำลังผลิต</option>
                    <option>กำลังส่ง</option>
                  </select>
                </div>
                <h5 className="col-11">โครงการทั้งหมด({currentYear})</h5>
              </div>
              <div className="dashboard-table-responsive mx-4">
                <table className="table table-bordered">
                  <thead className="basket-table-header">
                    <tr>
                      <th>ว/ด/ป</th>
                      <th>Doc_TY</th>
                      <th width="60%">โครงการ</th>
                      <th>กำหนดโอน</th>
                      <th>วันที่จัดส่ง</th>
                      <th>สินค้า/ชิ้น</th>
                      <th>มูลค่า</th>
                      <th width="5%">รายละเอียด</th>
                    </tr>
                  </thead>
                  {console.log(dashboard)}
                  <tbody>
                    {dashboard
                      .filter((element) => {
                        const date = new Date(element.Order_date);
                        return date.getFullYear() === currentYear;
                      })
                      .map((element, index) => (
                        <tr
                          key={index}
                          className={`${
                            element.Next_Date === 999
                              ? "bg-success bg-gradient text-white"
                              : ""
                          }`}
                        >
                          <td>
                            {(() => {
                              const date = new Date(element.Order_date);
                              return `${date
                                .getDate()
                                .toString()
                                .padStart(2, "0")}-${(date.getMonth() + 1)
                                .toString()
                                .padStart(2, "0")}-${date.getFullYear()}`;
                            })()}
                          </td>
                          <td>{element.SO_TY}</td>
                          <td>
                            {element.ERP_Order_Number} - {element.Name_Project}
                          </td>
                          <td>
                            {element.Schedule_Pick_Date.slice(6, 8)}-
                            {element.Schedule_Pick_Date.slice(4, 6)}-
                            {element.Schedule_Pick_Date.slice(0, 4)}
                          </td>
                          <td>
                            {(() => {
                              const date = new Date(element.date_request);
                              return `${date
                                .getDate()
                                .toString()
                                .padStart(2, "0")}-${(date.getMonth() + 1)
                                .toString()
                                .padStart(2, "0")}-${date.getFullYear()}`;
                            })()}
                          </td>
                          <td className="text-center">{element.Product_pcs}</td>
                          <td>{element.Product_price.toLocaleString()}</td>
                          <td align="center">
                            <button
                              className="btn btn-warning"
                              onClick={() =>
                                OrderDetail(element.ERP_Order_Number)
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
            </div>
          </div>
        )}
        {swith_page === 1 && (
          <>
            <div className="row mt-3 mx-3 p-3 opacity">
              <div className={`col-2 line-border-input`}>
                <div className="row p-1">
                  {product_basket.length > 0 ? (
                    <div className="col-12 mb-2">
                      <input
                        className="form-control"
                        value={product_basket[0].Product_Projectname}
                        placeholder={product_basket[0].Product_Projectname}
                        disabled
                      />
                    </div>
                  ) : (
                    <div className="col-12 mb-2">
                      <input
                        className="form-control"
                        onChange={(e) => setNameProject(e.target.value)}
                        value={nameProject}
                        placeholder="โครงการ"
                        required
                      />
                    </div>
                  )}
                  <div className="col-12 mb-2">
                    <input
                      className="form-control"
                      onChange={(e) => setProjectClass(e.target.value)}
                      value={projectClass}
                      placeholder="Text Ly_TY"
                      required
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <select
                      className="form-select"
                      onChange={(e) => {
                        const [Name_Product, Number_FG] =
                          e.target.value.split(" ");
                        handlemodal(Name_Product, Number_FG);
                      }}
                      required
                    >
                      <option value="" selected disabled>
                        เลือกประเภท
                      </option>
                      {uniqueData.map((item, index) => (
                        <option
                          key={index}
                          value={`${item.Name_Product} ${item.Number_FG}`}
                        >
                          {item.Name_Product}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 mb-2">
                    <select
                      className="form-select"
                      onChange={(e) => setGetProduct(e.target.value)}
                      defaultValue=""
                      required
                    >
                      <option value="" selected disabled>
                        เลือก Standard
                      </option>
                      {dataStandard.map((item, index) => (
                        <option key={index}>
                          {item.Standard} : {item.Name_Model}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 mb-2">
                    <select
                      className="form-select"
                      onChange={(e) => setGetCategory(e.target.value)}
                      defaultValue={""}
                      required
                    >
                      <option value="" selected disabled>
                        {category_Bloom[0]?.Category_bloom === null ? (
                          <labal>-</labal>
                        ) : (
                          <label>ประเภทบาน</label>
                        )}
                      </option>
                      {category_Bloom[0]?.Category_bloom === null
                        ? ""
                        : category_Bloom.map((item, index) => (
                            <option key={index}>{item.Category_bloom}</option>
                          ))}
                    </select>
                  </div>
                  <div className="col-12 mb-2">
                    <div className="row">
                      <div className="col-6">
                        <input
                          className="form-control col-5"
                          placeholder="กว้าง"
                          onChange={(e) => setGetWidth(e.target.value)}
                          value={getWidth}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <input
                          className="form-control col-5"
                          placeholder="ยาว"
                          onChange={(e) => setGetLong(e.target.value)}
                          value={getLong}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setGetPcs(e.target.value)}
                      placeholder="จำนวน"
                      value={getPcs}
                      required
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setGetPrice(e.target.value)}
                      placeholder="ราคา/หน่วย"
                      value={getPrice}
                      required
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <input
                      type="date"
                      className="form-control"
                      onChange={(e) => setRequest_Date(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <textarea
                      className="form-control"
                      placeholder="รายละเอียดเพิ่มเติม"
                      onChange={(e) => setTextArea(e.target.value)}
                      value={textArea}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      className="form-control btn btn-success"
                      onClick={() => handleProductSubmit()}
                    >
                      เพิ่ม
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-10">
                <div className="list-product">
                  <table className="table table-bordered border-radius">
                    {product_basket.length > 0 &&
                      product_basket[0].Product_Projectname && (
                        <thead className="bg-white h5">
                          <tr>
                            <td colSpan={9}>
                              {openInputProject == 1 ? (
                                <div className="row">
                                  <div className="col-4"></div>
                                  <div className="col-3">
                                    <input
                                      className="form-control"
                                      value={newTextProject}
                                      onChange={(e) =>
                                        setNewTextProject(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="col-5">
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => ChangeRecordProject()}
                                    >
                                      ตกลง
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center">
                                  โครงการ{" "}
                                  {product_basket[0].Product_Projectname}
                                </div>
                              )}
                            </td>
                            <td>
                              <Image
                                src={`/icon/edit.png`}
                                width={25}
                                height={25}
                                alt="edit"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  editProject(
                                    product_basket[0].Product_Projectname
                                  )
                                }
                              />
                            </td>
                          </tr>
                        </thead>
                      )}

                    {Object.entries(groupedProducts).map(
                      ([className, items], index) => (
                        <React.Fragment key={index}>
                          <thead className="bg-white">
                            <tr>
                              <td colSpan={9}>
                                {checkEditHeader == 1 &&
                                className == valueEditHeader ? (
                                  <div className="row">
                                    <div className="col-4"></div>
                                    <div className="col-3">
                                      <input
                                        className="form-control"
                                        value={recordValueEdit}
                                        onChange={(e) =>
                                          setRecordValueEdit(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="col-5">
                                      <button
                                        className="btn btn-primary"
                                        onClick={() => submit_edittextheader()}
                                      >
                                        ตกลง
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center">{className}</div>
                                )}
                              </td>
                              <td className="bg-light">
                                <Image
                                  src={`/icon/edit.png`}
                                  width={25}
                                  height={25}
                                  alt="edit"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => editheader(className)}
                                />
                              </td>
                            </tr>
                          </thead>
                          <thead className="bg-white">
                            <tr>
                              <th>FG</th>
                              <th>ประเภท</th>
                              <th>สินค้า</th>
                              <th>บาน</th>
                              <th>กว้าง X ยาว</th>
                              <th>จำนวน/ชิ้น</th>
                              <th>ราคา</th>
                              <th>วันที่ต้องการสินค้า</th>
                              <th>รายละเอียดเพิ่มเติม</th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {items.map((item, i) => (
                              <tr key={i}>
                                <td>{item.Product_FG}</td>
                                <td>{item.Name_Product}</td>
                                <td>{item.Product_STD}</td>
                                <td>{item.Product_Category}</td>
                                <td>
                                  {item.Product_width} x {item.Product_long}
                                </td>
                                <td>{item.Product_pcs}</td>
                                <td>{item.Product_price}</td>
                                <td>
                                  {item.Product_requestDate.split("T")[0]}
                                </td>
                                <td>{item.Product_description}</td>
                                <td width={40} align="center">
                                  <i
                                    className="fa fa-edit icon-edit"
                                    onClick={() => EditBasket(item.Product_ID)}
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </td>
                                <td width={40} align="center">
                                  <i
                                    className="fa fa-trash icon-delete"
                                    onClick={() =>
                                      deletebasket(item.Product_ID)
                                    }
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </React.Fragment>
                      )
                    )}
                  </table>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => handlesubmit()}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {swith_page === 2 && (
          <>
            {display_Edit == 1 ? (
              <div
                className={`${
                  edit_Data == 1 ? "slide-left-center" : "slide-center-left"
                } `}
              >
                <div className="row mt-3 mx-3 p-3 opacity">
                  <div className="col-12">
                    <div className="list-product">
                      <table className="table table-bordered border-radius">
                        {response_Data_Edit.map((items, index) => {
                          const isFirstInGroup =
                            index === 0 ||
                            response_Data_Edit[index - 1].Name_Class !==
                              items.Name_Class;
                          return (
                            <React.Fragment key={index}>
                              {isFirstInGroup && (
                                <>
                                  <thead className="bg-white">
                                    <tr>
                                      <td colSpan={9} className="text-center">
                                        {items.Name_Class}
                                      </td>
                                      <td className="bg-light">
                                        <Image
                                          src={`/icon/edit.png`}
                                          width={25}
                                          height={25}
                                          alt="edit"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            editheader(items.Name_Class)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  </thead>

                                  <thead className="bg-white">
                                    <tr className="text-center">
                                      <th>FG</th>
                                      <th>ประเภท</th>
                                      <th>สินค้า</th>
                                      <th>บาน</th>
                                      <th>กว้าง X ยาว</th>
                                      <th>จำนวน/ชิ้น</th>
                                      <th>ราคา</th>
                                      <th>วันที่ต้องการสินค้า</th>
                                      <th>รายละเอียดเพิ่มเติม</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                </>
                              )}

                              <tbody className="bg-white">
                                <tr>
                                  <td className="bg-secondary bg-gradient">
                                    {items.FG_Product}
                                  </td>
                                  <td className="bg-secondary bg-gradient">
                                    {items.Name_Product}
                                  </td>
                                  <td className="bg-secondary bg-gradient">
                                    {items.Product_STD}
                                  </td>
                                  <td className="bg-secondary bg-gradient">
                                    {items.Category_Product}
                                  </td>
                                  <td width={200}>
                                    <input
                                      className="form-inputsize text-center"
                                      value={items.Width}
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "Width",
                                          e.target.value
                                        )
                                      }
                                    />
                                    &nbsp;X&nbsp;
                                    <input
                                      className="form-inputsize text-center"
                                      value={items.Height}
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "Height",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td width={100}>
                                    <input
                                      className="form-inputsize text-center"
                                      value={items.PCS}
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "PCS",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td width={100}>
                                    <input
                                      className="form-inputsize text-center"
                                      value={items.Price}
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "Price",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td width={150}>
                                    <input
                                      type="date"
                                      className="form-inputsize-date"
                                      value={
                                        formatDate(items.request_date)
                                      }
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "Product_requestDate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <textarea
                                      className="w-100 form-inputsize-textarea"
                                      value={items.Description}
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "Description",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td width={40} align="center">
                                    <i
                                      className="fa fa-trash icon-delete"
                                      onClick={() =>
                                        deletebasket(items.Product_ID)
                                      }
                                      style={{ cursor: "pointer" }}
                                    ></i>
                                  </td>
                                </tr>
                              </tbody>
                            </React.Fragment>
                          );
                        })}
                      </table>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                      <button
                        className="btn btn-secondary mx-2"
                        onClick={() => OpjectDataEdit()}
                      >
                        ย้อนกลับ
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={(e) => handleChangeEdit()}
                      >
                        บันทึก
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`p-5 mx-5 form-product opacity ${
                  edit_Data == 1 ? "slide-center-left" : "slide-left-center"
                }`}
              >
                {importFile.length > 0 ? (
                  <>
                    <table className="table table-striped">
                      <thead className="text-center">
                        <tr>
                          <th>Number Order</th>
                          <th>โครงการ</th>
                          <th>PCS</th>
                          <th>มูลค่า</th>
                          <th>วันที่ จัดส่ง</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {importFile.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {item.SO_TY} - {item.NumberOrder}
                            </td>
                            <td>{item.Name_Project}</td>
                            <td>{item.PCS.toLocaleString()}</td>
                            <td>{item.Price.toLocaleString()}</td>
                            <td>{item.LatestDate.split("T")[0]}</td>
                            <td width={50}>
                              <button
                                className="btn btn-warning"
                                onClick={() => OrderDetail(item.NumberOrder)}
                              >
                                <Image
                                  src="/icon/search.png"
                                  width={20}
                                  height={20}
                                  alt="search"
                                />
                              </button>
                            </td>
                            <td>
                              <button
                                className={`btn btn-warning`}
                                onClick={() => EditData(item.NumberOrder)}
                              >
                                แก้ไขข้อมูล
                              </button>
                            </td>
                            <td>
                              {item.PDF_File == undefined ? (
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    insertFile(
                                      item.Name_Project,
                                      item.Product_Other,
                                      item.NumberOrder
                                    )
                                  }
                                >
                                  อัพโหลดไฟล์
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    insertFile(
                                      item.Product_ProjectName,
                                      item.Product_Other,
                                      item.NumberOrder
                                    )
                                  }
                                >
                                  อัพไฟล์เพิ่มเติม
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <div className="h3 text-center">ไม่มีข้อมูล</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default page;
