const sql = require("mssql");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5006;

app.use(cors());
app.use(express.json());

const config = {
  user: "sa",
  password: "P@55w0rd",
  server: "192.168.199.20",
  port: 1433,
  database: "dbKorexQuick",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// ตั้งค่า Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/home/ptkdev/Tre/Korex_Quick/Korex_BE/File_upload"); // บันทึกไฟล์ไปยังเซิร์ฟเวอร์เครือข่าย
  },
  filename: (req, file, cb) => {
    const safeFilename = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    ); // แปลงชื่อไฟล์ให้เป็น UTF-8
    cb(null, `${Date.now()}-${safeFilename}`);
  },
});

const upload = multer({ storage: storage });

app.post("/api/Login", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { username, password } = req.body;

    const result = await pool
      .request()
      .input("user", sql.VarChar, username)
      .input("pass", sql.VarChar, password)
      .execute("db_smember");

    if (result.recordset.length > 0) {
      res.status(200).json(true);
    } else {
      res.status(404).json(false);
    }
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  } finally {
    sql.close();
  }
});

app.get("/api/get/product", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query("SELECT * FROM sproduct");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.get("/api/get/DashBoard", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().execute("db_DataMaster");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.post(`/api/find/FG`, async (req, res) => {
  try {
    const { Number_FG } = req.body;

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Number_FG", sql.VarChar, Number_FG)
      .query(`SELECT * FROM sproduct WHERE Number_FG = @Number_FG`);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/post/category", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("db_sStandard");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.post("/api/post/price", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { standard, font, depth } = req.body;

    const result = await pool
      .request()
      .input("modal", sql.VarChar, standard)
      .input("font", sql.VarChar, font)
      .input("depth", sql.VarChar, depth)
      .execute("db_sfindmodal");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.post("/api/post/basket", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const {
      projectName,
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
    } = req.body;

    const result = await pool
      .request()
      .input("nameProject", sql.VarChar, nameProject)
      .input("projectClass", sql.VarChar, projectClass)
      .input("Name_Product", sql.VarChar, standard)
      .input("Standard", sql.VarChar, getProduct)
      .input("Category", sql.VarChar, getCategory)
      .input("Width", sql.Int, getWidth)
      .input("Long", sql.Int, getLong)
      .input("Pcs", sql.Int, getPcs)
      .input("Price", sql.Int, getPrice)
      .input("request_Date", sql.VarChar, request_Date)
      .input("member", sql.VarChar, username.username)
      .input("number_FG", sql.VarChar, number_FG)
      .input("Product_description", sql.VarChar, textArea)
      .input("projectName", sql.VarChar, projectName)
      .input("projectClass", sql.VarChar, projectClass)
      .execute("db_Insert_basket");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.get("/api/get/basket", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query("SELECT * FROM sproduct_basket");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.post("/api/post/checkbasket", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { username } = req.body;

    const result = await pool
      .request()
      .input("member", sql.VarChar, username.username)
      .execute("db_Show_basket");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.post("/api/post/ERPRecord", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    // รับ username และ file
    const { username } = req.body.username;

    // ดึงข้อมูลจากฐานข้อมูล
    const getresult = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query(
        `SELECT 
    Name_Product AS Name_Product, 
    Product_pcs AS Quantity_Ordered, 
    Product_FG AS Item_Number, 
    Product_price AS Unit_Price, 
    Product_width AS width, 
    Product_long AS long, 
    LEFT(Product_description, 30) AS Product_description, 
    Product_ProjectName, 
    Product_class, 
    Product_requestDate
FROM sproduct_basket 
WHERE Product_member = @username 
ORDER BY Product_class ASC;`
      );

    const responseSN = [];
    const responseSO = [];
    let previousClass = null;

    let hasN05 = false; // ตัวแปรเช็คว่ามี 'N05' หรือไม่
    let tempN05Item = null; // เก็บข้อมูลของ 'N05' ไว้ก่อน

    ///SN
    getresult.recordset.forEach(
      ({
        width,
        long,
        Name_Product,
        Product_description,
        Product_class,
        Product_ProjectName,
        Product_requestDate,
        ...item
      }) => {
        // ถ้า Product_class เปลี่ยน ให้เพิ่มแถวใหม่ที่มี Ln_Ty = "T"
        if (Product_class !== previousClass) {
          responseSN.push({
            Quantity_Ordered: 1,
            Item_Number: "",
            Unit_Price: 1,
            Description_1: Product_class,
            Ln_Ty: "T",
            Branch__Plant: "P01",
          });

          responseSO.push({
            Quantity_Ordered: 1,
            Item_Number: "",
            Unit_Price: 1,
            Description_1: Product_class,
            Ln_Ty: "T",
            Branch__Plant: "P01",
          });

          previousClass = Product_class; // อัปเดตค่า Product_class ปัจจุบัน
        }

        // เพิ่มสินค้าในกลุ่ม
        response.push({
          ...item,
          Description_1: `${Name_Product} ${width}X${long} ${Product_description}`,
          Description_2: `${Name_Product} ${width}X${long} ${Product_description}`,
          Ln_Ty: "S",
          Branch__Plant: "P01",
          Requested_Date: Product_requestDate,
          
        });
      }
    );

    // ถ้ามี 'N05' ให้เพิ่มท้ายสุด
    if (hasN05 && tempN05Item) {
      responseSN.push(tempN05Item);
      responseSO.push(tempN05Item);
    }

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // แปลงเป็น พ.ศ. แล้วตัดแค่ 2 หลัก

    let formattedDate = `${day}/${month}/${year}`;

    const apiResponse = await fetch(
      "http://ptkjdeweb:9083/jderest/v3/orchestrator/CreateSalesOrder_KOR",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "ITSKOR",
          password: "itskor",
          Business_Unit: "11111",
          Sold_To: "107932",
          Ship_To: "107933",
          Order_Date: { formattedDate },
          Tax_Rate_Code: "OVAT7",
          ProjectNo: "1",
          Customer_PO: getresult.recordset[0]?.Product_ProjectName.substring(
            0,
            25
          ),
          GridIn_1_3: responseSN,
          GridIn_1_4: [
            {
              Sales_Rep_or_Group: "3686",
            },
          ],
          P4210_Version: "",
        }),
      }
    );

    const apiResult = await apiResponse.json();    

      // ส่ง response กลับไปยังผู้ใช้งาน
      res.status(200).json({ insertSN, insertSO });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

app.post("/api/post/Master", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const {
      FG_Product,
      Name_Project,
      Name_Class,
      SN,
      SN_TY,
      SO,
      SO_TY,
      Name_Product,
      Category_Product,
      Width,
      Height,
      PCS,
      Price,
      username,
      Description,
      request_date,
      ERP_Order_Number,
    } = req.body;

    const datetoday = new Date();
    const formattedDate = datetoday.toISOString().split("T")[0];

    const daterequest = request_date.split('T')[0]
    
    const result = await pool
      .request()
      .input("Order_date", sql.VarChar, formattedDate)
      .input("FG_Product", sql.VarChar, FG_Product)
      .input("Name_Project", sql.VarChar, Name_Project)
      .input("Name_Class", sql.VarChar, Name_Class)
      .input("SO", sql.VarChar, "")
      .input("SN", sql.VarChar, "")
      .input("Name_Product", sql.VarChar, Name_Product)
      .input("Category_Product", sql.VarChar, Category_Product)
      .input("Width", sql.Int, Width)
      .input("Height", sql.Int, Height)
      .input("PCS", sql.Int, PCS)
      .input("Price", sql.Int, Price)
      .input("username", sql.VarChar, username.username)
      .input("Description", sql.VarChar, Description)
      .input("request_date", sql.VarChar, daterequest)
      .input("ERP_Order_Number", sql.VarChar, ERP_Order_Number)
      .execute("db_Insert_Master");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.post("/api/post/Detailtitle", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const title = req.body;

    const result = await pool
      .request()
      .input("title", sql.VarChar, title.value)
      .execute("db_Detail_title");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.post("/api/post/DeleteBasket", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { value } = req.body;

    const result = await pool
      .request()
      .input("ID_Product", sql.Int, value)
      .execute("db_Delete_basket");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.get("/api/get/MasterData", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().execute("db_DataMaster");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.get("/api/get/import_file", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().execute("db_GetMaster_ImportFile");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(
  "/api/post/importFile",
  upload.array("files", 10),
  async (req, res) => {
    if (!req.files?.length)
      return res
        .status(400)
        .json({ message: false, error: "กรุณาอัปโหลดไฟล์อย่างน้อย 1 ไฟล์" });

    const filePaths = req.files.map((file) =>
      path.join("/mnt/fileupload", file.filename)
    );

    if (filePaths) {
      try {
        const pool = await sql.connect(config);
        for (const file of req.files) {
          try {
            const response = await fetch(
              "http://192.168.199.104:9083/jderest/v3/orchestrator/Korex_FileUpload",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Basic " + Buffer.from("ITSCRM:itscrm").toString("base64"),
                },
                body: JSON.stringify({
                  FileName1: file.filename,
                  DOC: req.body.Order,
                  DCT: "SO",
                }),
              }
            );

            const responseApi = await response.json();

            if (!response.ok) throw new Error("Upload API failed");

            const PDF_Data = await pool
              .request()
              .input("ERP_Order_Number", sql.VarChar, req.body.Order)

              .query(
                "SELECT * FROM master_data WHERE ERP_Order_Number = @ERP_Order_Number"
              );

            const data = PDF_Data.recordset;

            const fileNames = req.files.map((file) => file.filename).join(", ");

            const dbFileNames = data.map((item) => item.PDF_name).join(", ");

            const finalFileNames = `${dbFileNames}, ${fileNames}`;

            await pool
              .request()
              .input("Name_PDF", sql.VarChar, fileNames)
              .input("Order", sql.VarChar, req.body.Order)
              .execute("db_upload_namePDF");
          } catch (error) {
            console.error(`❌ Error processing file ${file.filename}:`, error);
            return res.status(500).json({ message: "fail", error });
          }
        }

        res.status(200).json({ message: "true" });
      } catch (error) {
        console.error("❌ Error in file upload:", error);
        res
          .status(500)
          .json({ message: false, error: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
      }
    }
  }
);

app.post(
  "/api/update/importFile",
  upload.array("files", 10),
  async (req, res) => {
    if (!req.files?.length)
      return res
        .status(400)
        .json({ message: false, error: "กรุณาอัปโหลดไฟล์อย่างน้อย 1 ไฟล์" });

    const filePaths = req.files.map((file) =>
      path.join("/mnt/fileupload", file.filename)
    );

    if (filePaths) {
      try {
        const pool = await sql.connect(config);
        for (const file of req.files) {
          try {
            const response = await fetch(
              "http://192.168.199.104:9083/jderest/v3/orchestrator/Korex_FileUpload",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Basic " + Buffer.from("ITSCRM:itscrm").toString("base64"),
                },
                body: JSON.stringify({
                  FileName1: file.filename,
                  DOC: req.body.Order,
                  DCT: "SO",
                }),
              }
            );

            const responseApi = await response.json();

            if (!response.ok) throw new Error("Upload API failed");

            await pool
              .request()
              .input("Name_PDF", sql.VarChar, finalFileNames)
              .input("Order", sql.VarChar, req.body.Order)
              .execute("db_update_upload_namePDF");
          } catch (error) {
            console.error(`❌ Error processing file ${file.filename}:`, error);
            return res.status(500).json({ message: "fail", error });
          }
        }

        res.status(200).json({ message: "true" });
      } catch (error) {
        console.error("❌ Error in file upload:", error);
        res
          .status(500)
          .json({ message: false, error: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
      }
    }
  }
);

app.post("/api/post/OrderDetail", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { OrderNumber } = req.body;

    const result = await pool
      .request()
      .input("OrderNumber", sql.Int, OrderNumber)
      .execute("db_Detail_Master");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
