import { createFileRoute } from "@tanstack/react-router";
import { students, type Student } from "@/lib/students-data";

export const Route = createFileRoute("/api/students")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (id) {
          const student = students.find((s) => s.id === Number(id));
          if (!student) {
            return Response.json(
              { error: "Không tìm thấy sinh viên", error_en: "Student not found", id: Number(id) },
              { status: 404 },
            );
          }
          return Response.json(student);
        }
        return Response.json({ count: students.length, data: students });
      },
      POST: async ({ request }) => {
        let body: Partial<Student>;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "JSON không hợp lệ", error_en: "Invalid JSON" }, { status: 400 });
        }
        if (!body.name || !body.email) {
          return Response.json(
            { error: "Thiếu trường name hoặc email", error_en: "Missing name or email" },
            { status: 422 },
          );
        }
        const created: Student = {
          id: students.length + 1,
          name: body.name,
          email: body.email,
          major: body.major ?? "Chưa cập nhật",
          gpa: typeof body.gpa === "number" ? body.gpa : 0,
          year: typeof body.year === "number" ? body.year : 1,
        };
        return Response.json(
          { message: "Đã thêm sinh viên thành công", message_en: "Student created", data: created },
          { status: 201 },
        );
      },
    },
  },
});