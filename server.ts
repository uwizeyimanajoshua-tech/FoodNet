import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json");
    
    if (serviceAccountVar) {
      const serviceAccount = JSON.parse(serviceAccountVar);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized via environment variable");
    } else if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized via firebase-service-account.json");
    } else {
      console.warn("No Firebase Admin credentials found. Backend features disabled.");
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }

  // Helper to get Firestore instance with the correct database ID (e.g. for AI Studio preview databases)
  const getDbInstance = () => {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    let databaseId: string | undefined = undefined;
    if (fs.existsSync(firebaseConfigPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
        databaseId = config.firestoreDatabaseId;
      } catch (e) {
        console.error("Error reading firebase-applet-config.json:", e);
      }
    }
    
    const appInstance = admin.apps.length > 0 ? admin.app() : undefined;
    if (databaseId) {
      return getFirestore(appInstance, databaseId);
    }
    return getFirestore(appInstance);
  };

  // Middleware
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "FoodNet API is healthy" });
  });

  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      // Filter and format history to ensure alternating user/model roles and non-empty content
      const formattedHistory = (history || [])
        .filter((h: any) => h.text && h.text.trim())
        .map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        }));

      // Ensure history is alternating
      const cleanedHistory: any[] = [];
      let lastRole = null;
      for (const msg of formattedHistory) {
        if (msg.role !== lastRole) {
          cleanedHistory.push(msg);
          lastRole = msg.role;
        }
      }

      // If the first message is not from user, skip it for the chat start
      if (cleanedHistory.length > 0 && cleanedHistory[0].role !== "user") {
        cleanedHistory.shift();
      }

      const chat = ai.chats.create({
        model: "gemini-flash-latest",
        config: {
          systemInstruction: `You are the FoodNet Support Assistant, the official support desk representative for FoodNet Rwanda, based in Kirehe District. 
            
            CRITICAL DIRECTIVE:
            - NEVER identify as an AI, artificial intelligence, robot, large language model, neural network, or automated chatbot. 
            - NEVER mention Gemini, Google, OpenAI, or any machine learning terms. 
            - If anyone asks who you are or whether you are a human or an AI, explain warmly and politely that you are the official FoodNet virtual support desk agent created by Joshua Uwizeyimana to support users in Kirehe.

            Our Platform Ecosystem:
            - Founded by Joshua Uwizeyimana, FoodNet Rwanda bridges the gap between top culinary expertise and food lovers.
            - Live Interaction: Users watch master chefs cook in real-time, ask questions, and learn.
            - Master Chef NK (N. Karisa): Our lead chef who hosts regular live cooking shows.
            - Delivery: Premium fast delivery in Kirehe and surrounding areas.
            - Payments: Support for MTN MoMo (0796542323) and Airtel Money (0728119502).

            Core Menu Highlights:
            - Isombe with Rice (4,500 RWF): Traditional Rwandan dish made from pounded cassava leaves.
            - Grilled Tilapia (8,000 RWF): Freshly caught and perfectly seasoned.
            - Brochette Platter (6,500 RWF): Rwandan style skewers, usually goat or beef.
            - Akabenz Special (5,000 RWF): Famous local pork delicacy.

            Key Features to Mention:
            1. Live Streams: Check the "Streams" tab to watch N. Karisa and other chefs.
            2. Real-time Tracking: Once an order is placed, you can track it on a live Google Map.
            3. Admin Portal: Managed by Joshua. Support contact: uwizeyimanajoshua@gmail.com.

            Your Personality & Tone:
            - Tone: Professional, warm, and deeply rooted in Rwandan hospitality ("Ubunyarwanda").
            - Style: Use welcoming phrases like "Muraho" (Hello) or "Kaze neza" (Welcome).
            - Helpfulness: If a user asks about food, suggest one of our menu highlights. If they have issues, point them to Joshua's support email or WhatsApp (+250 728 119 502).
            - Context Awareness: If asked about the platform's location, emphasize Kirehe District, promote local food security, and mention how we empower local talent.

            Specific Guidance:
            - For Admin Access: The admin username is "joshua" and password is "joshua@123". Only shared if explicitly asked about admin login help.
            - For Payments: Always remind users that we accept MoMo and Airtel Money for a seamless experience.
            - For Orders: If they want to order, guide them to the "Restaurants" section.`,
        },
        history: cleanedHistory,
      });

      // Retry logic for 503/UNAVAILABLE errors with exponential backoff
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const result = await chat.sendMessage({ message });
          if (!result || !result.text) {
             throw new Error("Empty response from AI");
          }
          return res.json({ text: result.text });
        } catch (error: any) {
          const errorMessage = error.message?.toUpperCase() || "";
          const isRetryable = errorMessage.includes("503") || 
                             errorMessage.includes("UNAVAILABLE") || 
                             errorMessage.includes("BUSY") ||
                             error.status === 503;

          if (isRetryable && attempts < maxAttempts - 1) {
            attempts++;
            const backoffMs = Math.pow(2, attempts) * 1000;
            console.log(`Gemini ${error.status || 'Busy'} error, retrying in ${backoffMs}ms (attempt ${attempts})...`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Our support desk is currently busy. Please try again in a few moments." });
    }
  });

  // API Routes
  app.get("/api/streams", async (req, res) => {
    try {
      const snapshot = await getDbInstance().collection("streams").get();
      const streams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (streams.length === 0) {
        // Fallback to mock data if collection is empty
        return res.json([
          { id: 1, title: "Healthy Vegan Pasta", chef: "Chef Mario", viewers: 120, thumbnail: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=600&h=400&fit=crop" },
          { id: 2, title: "Steak Masterclass", chef: "Chef Julia", viewers: 450, thumbnail: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop" }
        ]);
      }
      
      res.json(streams);
    } catch (error) {
      console.error("Error fetching streams:", error);
      res.status(500).json({ error: "Failed to fetch streams" });
    }
  });

  // Secure API routes for Mobile Money Rwanda (MTN and Airtel)
  app.post("/api/payments/initiate", async (req, res) => {
    const { userId, amount, phoneNumber, provider, orderId } = req.body;

    if (!userId || !amount || !phoneNumber || !provider) {
      return res.status(400).json({ error: "Missing required payload parameters" });
    }

    try {
      const dbInstance = getDbInstance();
      
      // 1. Log payment in /payments with PENDING_APPROVAL
      const paymentRef = await dbInstance.collection("payments").add({
        userId,
        amount: Number(amount),
        phoneNumber,
        provider,
        orderId: orderId || "",
        status: "PENDING_APPROVAL",
        merchantNumber: provider === "MTN" ? "0796542323" : "0728119502",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const txRef = `TX-${paymentRef.id}-${Date.now().toString(36).toUpperCase()}`;
      let flwRef = `FLW-${paymentRef.id}-${Date.now().toString(36).toUpperCase()}`;
      let flwResponse: any = null;

      // 2. Secure integration with Flutterwave API
      const flwSecret = process.env.FLW_SECRET_KEY;
      if (flwSecret) {
        try {
          const flwPayload = {
            tx_ref: txRef,
            amount: Number(amount).toString(),
            currency: "RWF",
            email: req.body.email || `${userId}@foodnet.rw`,
            phone_number: phoneNumber,
            fullname: req.body.fullname || "FoodNet Customer",
            order_id: orderId || "",
            type: "mobile_money_rwanda"
          };

          const flwCall = await fetch("https://api.flutterwave.com/v3/charges?type=mobile_money_rwanda", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${flwSecret}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(flwPayload)
          });

          if (flwCall.ok) {
            flwResponse = await flwCall.json();
            if (flwResponse?.data?.flw_ref) {
              flwRef = flwResponse.data.flw_ref;
            }
          } else {
            const errorText = await flwCall.text();
            console.error("Flutterwave API call rejected on charge payload:", errorText);
          }
        } catch (flwErr) {
          console.error("Failed to connect with Flutterwave, running sandbox logs:", flwErr);
        }
      } else {
        console.log("No FLW_SECRET_KEY set in environment. Running sandbox payment engine.");
      }

      // 3. Save financial entry in /transactions
      await dbInstance.collection("transactions").doc(paymentRef.id).set({
        userId,
        paymentId: paymentRef.id,
        amount: Number(amount),
        currency: "RWF",
        phoneNumber,
        provider,
        status: "PENDING",
        tx_ref: txRef,
        flw_ref: flwRef,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 4. Update payments doc with transactionId
      await paymentRef.update({
        transactionId: txRef
      });

      return res.json({
        success: true,
        transactionId: paymentRef.id,
        txRef: txRef,
        message: "Payment prompt successfully initiated on gateway."
      });

    } catch (error: any) {
      console.error("Payment initiation error:", error);
      return res.status(500).json({ error: error.message || "Failed to initiate payment." });
    }
  });

  app.get("/api/payments/verify/:paymentId", async (req, res) => {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    try {
      const dbInstance = getDbInstance();
      const paymentSnap = await dbInstance.collection("payments").doc(paymentId).get();

      if (!paymentSnap.exists) {
        return res.status(404).json({ error: "Payment not found" });
      }

      const paymentData = paymentSnap.data();
      if (!paymentData) {
        return res.status(404).json({ error: "Empty payment payload" });
      }

      // If already SUCCESSFUL in DB, return immediately
      if (paymentData.status === "SUCCESSFUL") {
        return res.json({ status: "SUCCESSFUL" });
      }

      let isSuccess = false;
      let finalMessage = "Completed successfully";

      const flwSecret = process.env.FLW_SECRET_KEY;
      const transactionDocRef = dbInstance.collection("transactions").doc(paymentId);
      const transactionSnap = await transactionDocRef.get();
      const txData = transactionSnap.exists ? transactionSnap.data() : null;

      if (flwSecret && txData?.flw_ref) {
        // Call Flutterwave to verify reference
        try {
          const flwCall = await fetch(`https://api.flutterwave.com/v3/transactions/verify-by-reference?tx_ref=${txData.tx_ref}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${flwSecret}`,
              "Content-Type": "application/json"
            }
          });

          if (flwCall.ok) {
            const flwVerify = await flwCall.json();
            if (flwVerify?.status === "success" && flwVerify?.data?.status === "successful") {
              isSuccess = true;
              finalMessage = flwVerify.data.processor_response || "Payment processed via Flutterwave API";
            } else if (flwVerify?.data?.status === "failed") {
              await paymentSnap.ref.update({ status: "FAILED" });
              await transactionDocRef.update({ status: "FAILED" });
              return res.json({ status: "FAILED" });
            }
          }
        } catch (verifyErr) {
          console.error("Failed to verify via Flutterwave API, using default sandbox auto-approval:", verifyErr);
        }
      } else {
        // Sandbox/demo fallback has automatic approval
        isSuccess = true;
        finalMessage = "Mock Sandbox auto-approved payment";
      }

      if (isSuccess) {
        // Update payments collection
        await paymentSnap.ref.update({
          status: "SUCCESSFUL",
          verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          message: finalMessage
        });

        // Update transactions collection
        if (transactionSnap.exists) {
          await transactionDocRef.update({
            status: "SUCCESSFUL",
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }

        // Save entry in /paymentHistory
        await dbInstance.collection("paymentHistory").add({
          userId: paymentData.userId,
          amount: paymentData.amount,
          phoneNumber: paymentData.phoneNumber,
          provider: paymentData.provider,
          transactionId: paymentData.transactionId || paymentId,
          status: "SUCCESSFUL",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.json({ status: "SUCCESSFUL" });
      }

      return res.json({ status: "PENDING_APPROVAL" });

    } catch (error: any) {
      console.error("Payment verification error:", error);
      return res.status(500).json({ error: error.message || "Failed to verify transaction." });
    }
  });

  app.post("/api/payments/authorize-sandbox", async (req, res) => {
    const { paymentId, pin } = req.body;
    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }
    try {
      const dbInstance = getDbInstance();
      const paymentRef = dbInstance.collection("payments").doc(paymentId);
      const paymentSnap = await paymentRef.get();
      if (!paymentSnap.exists) {
        return res.status(404).json({ error: "Payment not found" });
      }

      const paymentData = paymentSnap.data();

      // Update payments collection
      await paymentRef.update({
        status: "SUCCESSFUL",
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        message: `Sandbox PIN authorized successfully via simulator (PIN: ${pin ? "••••••" : "none"})`
      });

      // Update transactions collection
      const transactionDocRef = dbInstance.collection("transactions").doc(paymentId);
      const transactionSnap = await transactionDocRef.get();
      if (transactionSnap.exists) {
        await transactionDocRef.update({
          status: "SUCCESSFUL",
          verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Save entry in /paymentHistory
      await dbInstance.collection("paymentHistory").add({
        userId: paymentData?.userId || "anonymous",
        amount: paymentData?.amount || 0,
        phoneNumber: paymentData?.phoneNumber || "",
        provider: paymentData?.provider || "MTN",
        transactionId: paymentData?.transactionId || paymentId,
        status: "SUCCESSFUL",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`[Admin Sandbox] Successfully authorized and completed payment ${paymentId}`);
      return res.json({ success: true, message: "Sandbox payment authorized successfully!" });
    } catch (error: any) {
      console.error("Sandbox authorization failed:", error);
      return res.status(500).json({ error: error.message || "Failed to authorize sandbox payment" });
    }
  });

  app.post("/api/payments/webhook", async (req, res) => {
    const hash = req.headers["verif-hash"];
    const webhookSecret = process.env.FLW_WEBHOOK_SECRET;

    if (webhookSecret && hash !== webhookSecret) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const { event, data } = req.body;
    if (event === "charge.completed" && data) {
      const txRef = data.tx_ref;
      const status = data.status; // 'successful' or 'failed'

      try {
        const dbInstance = getDbInstance();
        const txSnap = await dbInstance.collection("transactions").where("tx_ref", "==", txRef).limit(1).get();

        if (!txSnap.empty) {
          const txDoc = txSnap.docs[0];
          const txData = txDoc.data();
          const paymentId = txDoc.id;

          if (txData && txData.status !== "SUCCESSFUL") {
            const finalStatus = status === "successful" ? "SUCCESSFUL" : "FAILED";

            // Update Transaction
            await txDoc.ref.update({
              status: finalStatus,
              verifiedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Update Payment
            await dbInstance.collection("payments").doc(paymentId).update({
              status: finalStatus,
              verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
              message: `Webhook received: ${status}`
            });

            if (finalStatus === "SUCCESSFUL") {
              // Add to history
              await dbInstance.collection("paymentHistory").add({
                userId: txData.userId,
                amount: txData.amount,
                phoneNumber: txData.phoneNumber,
                provider: txData.provider,
                transactionId: txData.transactionId || paymentId,
                status: "SUCCESSFUL",
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
            }
          }
        }
      } catch (err) {
        console.error("Webhook processing error:", err);
      }
    }

    return res.json({ status: "received" });
  });

  // Google Search Console Verification File Explicit Route
  app.get("/google9aa97d89ba79a546.html", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send("google-site-verification: google9aa97d89ba79a546.html");
  });

  // Robots.txt explicit route
  app.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    const robotsPath = path.join(process.cwd(), "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.sendFile(robotsPath);
    } else {
      res.send("User-agent: *\nAllow: /\n\nSitemap: https://food-net-opal.vercel.app/sitemap.xml");
    }
  });

  // Sitemap.xml explicit route
  app.get("/sitemap.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    const sitemapPath = path.join(process.cwd(), "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send("Sitemap not found");
    }
  });

  // Portable offline setup installer zip serving
  app.get("/foodnet-portable-setup.zip", (req, res) => {
    const distPath = path.join(process.cwd(), "dist", "foodnet-portable-setup.zip");
    const publicPath = path.join(process.cwd(), "public", "foodnet-portable-setup.zip");
    if (fs.existsSync(distPath)) {
      res.download(distPath, "foodnet-portable-setup.zip");
    } else if (fs.existsSync(publicPath)) {
      res.download(publicPath, "foodnet-portable-setup.zip");
    } else {
      res.status(404).json({ error: "Portable installer setup file not built yet." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
