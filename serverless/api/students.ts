import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, head, getDownloadUrl } from "@vercel/blob";

type Student = {
  id: number;
  studentCode: string;
  name: string;
  email: string;
  major: string;
  gpa: number;
  year: number;
};

const BLOB_KEY = "students.json";

const DEFAULT_STUDENTS: Student[] = [
  { id: 1, studentCode: "SV001", name: "Nguyễn Văn An", email: "an.nv@university.edu.vn", major: "Khoa học máy tính", gpa: 3.8, year: 3 },
  { id: 2, studentCode: "SV002", name: "Trần Thị Bình", email: "binh.tt@university.edu.vn", major: "Điện toán đám mây", gpa: 3.5, year: 2 },
  { id: 3, studentCode: "SV003", name: "Lê Hoàng Cường", email: "cuong.lh@university.edu.vn", major: "An toàn thông tin", gpa: 2.9, year: 4 },
  { id: 4, studentCode: "SV004", name: "Phạm Thu Dung", email: "dung.pt@university.edu.vn", major: "Trí tuệ nhân tạo", gpa: 3.95, year: 1 },
  { id: 5, studentCode: "SV005", name: "Vũ Minh Đức", email: "duc.vm@university.edu.vn", major: "Kỹ thuật phần mềm", gpa: 3.2, year: 3 },
];

async function getStudents(): Promise<Student[]> {
  try {
    const blob = await head(BLOB_KEY);
    const res = await fetch(blob.url);
    return await res.json();
  } catch {
    await put(BLOB_KEY, JSON.stringify(DEFAULT_STUDENTS), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return DEFAULT_STUDENTS;
  }
}

async function saveStudents(students: Student[]) {
  await put(BLOB_KEY, JSON.stringify(students), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const students = await getStudents();

  if (req.method === "GET") {
    const id = req.query.id as string | undefined;
    if (id) {
      const student = /^SV\d+$/i.test(id)
        ? students.find((s) => s.studentCode.toLowerCase() === id.toLowerCase())
        : students.find((s) => s.id === Number(id));
      if (!student) {
        return res.status(404).json({ error: "Không tìm thấy sinh viên", id });
      }
      return res.status(200).json(student);
    }
    return res.status(200).json({ count: students.length, data: students });
  }

  if (req.method === "POST") {
    const body = req.body as Partial<Student>;
    if (!body?.name || !body?.email) {
      return res.status(422).json({ error: "Thiếu trường name hoặc email" });
    }
    const created: Student = {
      id: students.length + 1,
      studentCode: `SV${String(students.length + 1).padStart(3, "0")}`,
      name: body.name,
      email: body.email,
      major: body.major ?? "Chưa cập nhật",
      gpa: typeof body.gpa === "number" ? body.gpa : 0,
      year: typeof body.year === "number" ? body.year : 1,
    };
    await saveStudents([...students, created]);
    return res.status(201).json({ message: "Đã thêm sinh viên thành công", data: created });
  }

  return res.status(405).json({ error: "Method not allowed" });
}