import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;

const products = [
  { id: 1, name: "iPhone 12", price: 499, category: "phone" },
  { id: 2, name: "Samsung Galaxy S21", price: 450, category: "phone" },
  { id: 3, name: "OnePlus Nord", price: 399, category: "phone" },
  { id: 4, name: "iPhone 14", price: 799, category: "phone" },
  { id: 5, name: "Google Pixel 7", price: 599, category: "phone" },
  { id: 6, name: "Redmi Note 12", price: 199, category: "phone" },
  { id: 7, name: "Samsung Galaxy A14", price: 249, category: "phone" },
  { id: 8, name: "Realme Narzo 60", price: 279, category: "phone" },
  { id: 9, name: "Samsung Galaxy A54", price: 399, category: "phone" },
  { id: 10, name: "OnePlus Nord CE 3", price: 349, category: "phone" },
  { id: 11, name: "iQOO Neo 7", price: 429, category: "phone" },
  { id: 12, name: "iPhone 15", price: 899, category: "phone" },
  { id: 13, name: "Samsung Galaxy S23", price: 749, category: "phone" },
  { id: 14, name: "Google Pixel 8", price: 699, category: "phone" }
];


app.post("/recommend", async (req, res) => {
  const { preference } = req.body;


  const priceMatch = preference.match(/under\s+\$?(\d+)/i);
  const maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;

  let filteredProducts = products;


  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
  }

  try {
    const hfResponse = await axios.post(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
      {
        inputs: preference,
        parameters: {
          candidate_labels: ["phone", "laptop", "accessory"]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const category = hfResponse.data.labels?.[0];
    console.log("Detected category:", category);

    if (category) {
      filteredProducts = filteredProducts.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

  } catch (e) {
    console.log("AI skipped, using price-only logic");
  }

  res.json({ recommendation: filteredProducts });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

