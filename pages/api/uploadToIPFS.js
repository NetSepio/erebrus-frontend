import multiparty from "multiparty";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing file:", err);
      return res.status(500).json({ error: "File parsing error" });
    }

    const file = files.file ? files.file[0] : null;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const fileBuffer = fs.readFileSync(file.path); // Read file as Buffer
      const formData = new FormData();
      formData.append("file", fileBuffer, file.originalFilename);

      console.log("Uploading file to IPFS...");

      const response = await fetch("https://api.ipfs.myriadflow.com/api/v0/add", {
        method: "POST",
        body: formData.getBuffer(), 
        headers: {
          ...formData.getHeaders(),
        },
      });

      const text = await response.text(); // Capture raw response
      console.log("IPFS Response:", text);

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${text}`);
      }

      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (error) {
      console.error("Upload Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  });
}
