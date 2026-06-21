import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireApiKey } from "./_auth";

type Student = {
  id: number;
  name: string;
  email: string;
  major: string;
  gpa: number;
  year: number;
};

const students: Student[] = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nv@university.edu.vn", major: "Khoa học máy tính", gpa: 3.8, year: 3 },
  { id: 2, name: "Trần Thị Bình", email: "binh.tt@university.edu.vn", major: "Điện toán đám mây", gpa: 3.5, year: 2 },
  { id: 3, name: "Lê Hoàng Cường", email: "cuong.lh@university.edu.vn", major: "An toàn thông tin", gpa: 2.9, year: 4 },
  { id: 4, name: "Phạm Thu Dung", email: "dung.pt@university.edu.vn", major: "Trí tuệ nhân tạo", gpa: 3.95, year: 1 },
  { id: 5, name: "Vũ Minh Đức", email: "duc.vm@university.edu.vn", major: "Kỹ thuật phần mềm", gpa: 3.2, year: 3 },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (!requireApiKey(req, res)) return; // chặn nếu thiếu/sai x-api-key

  if (req.method === "GET") {
    const id = req.query.id;
    if (id) {
      const student = students.find((s) => s.id === Number(id));
      if (!student) {
        return res.status(404).json({ error: "Không tìm thấy sinh viên", error_en: "Student not found", id: Number(id) });
      }
      return res.status(200).json(student);
    }
    return res.status(200).json({ count: students.length, data: students });
  }

  if (req.method === "POST") {
    const body = req.body as Partial<Student>;
    if (!body?.name || !body?.email) {
      return res.status(422).json({ error: "Thiếu trường name hoặc email", error_en: "Missing name or email" });
    }
    const created: Student = {
      id: students.length + 1,
      name: body.name,
      email: body.email,
      major: body.major ?? "Chưa cập nhật",
      gpa: typeof body.gpa === "number" ? body.gpa : 0,
      year: typeof body.year === "number" ? body.year : 1,
    };
    return res.status(201).json({ message: "Đã thêm sinh viên thành công", message_en: "Student created", data: created });
  }

  return res.status(405).json({ error: "Method not allowed" });
}