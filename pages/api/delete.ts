import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const { id } = req.query;
  await db.collection("uploads").deleteOne({ _id: new ObjectId(id) });
  res.status(200).json({ success: true });
}
