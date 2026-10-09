require("dotenv").config();

const express = require("express");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
});

const walletobjects = google.walletobjects({
  version: "v1",
  auth,
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "google-wallet-poc",
  });
});

app.get("/wallet/class", async (req, res) => {
  try {
    const response = await walletobjects.genericclass.get({
      resourceId: `${process.env.ISSUER_ID}.genclass`,
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Google Wallet error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});
app.get("/wallet/object", async (req, res) => {
  const objectId = `${process.env.ISSUER_ID}.student001`;

  try {
    // Check if object already exists
    try {
      const existing = await walletobjects.genericobject.get({
        resourceId: objectId,
      });

      return res.json(existing.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
    }

    // Create new Generic Object
    const response = await walletobjects.genericobject.insert({
      requestBody: {
        id: objectId,
        classId: `${process.env.ISSUER_ID}.genclass`,
        state: "ACTIVE",

        cardTitle: {
          defaultValue: {
            language: "en-US",
            value: "Student Pass",
          },
        },

        header: {
          defaultValue: {
            language: "en-US",
            value: "Google Wallet POC",
          },
        },

        textModulesData: [
          {
            id: "student_name",
            header: "Student",
            body: "Rahul",
          },
          {
            id: "course",
            header: "Course",
            body: "Google Wallet Demo",
          },
        ],

        barcode: {
          type: "QR_CODE",
          value: "STUDENT-001",
        },
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Google Wallet object error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});
app.get("/wallet/add-link", (req, res) => {
  try {
    const issuerId = process.env.ISSUER_ID;

    const objectId = `${issuerId}.student001`;
    const classId = `${issuerId}.genclass`;

    const credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    const claims = {
      iss: credentials.client_email,
      aud: "google",
      typ: "savetowallet",
      iat: Math.floor(Date.now() / 1000),
      origins: ['http://localhost:4200','http://10.0.2.2:3000'],
      payload: {
        genericObjects: [
          {
            id: objectId,
            classId: classId,
          },
        ],
      },
    };
console.log('Wallet JWT claims:', JSON.stringify(claims, null, 2));
    const token = jwt.sign(claims, credentials.private_key, {
      algorithm: "RS256",
    });

    const addToWalletUrl = `https://pay.google.com/gp/v/save/${token}`;

    res.json({
      objectId,
      classId,
      addToWalletUrl,
      jwt: token,
    });
  } catch (error) {
    console.error("JWT error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
