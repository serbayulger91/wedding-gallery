import { connectToDatabase } from "@/utils/mongodb";

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const pending = await db.collection("uploads").find({ approved: false }).toArray();
  res.status(200).json(pending);
}
