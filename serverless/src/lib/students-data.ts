export type Student = {
  id: number;
  name: string;
  email: string;
  major: string;
  gpa: number;
  year: number;
};

export const students: Student[] = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nv@university.edu.vn", major: "Khoa học máy tính", gpa: 3.8, year: 3 },
  { id: 2, name: "Trần Thị Bình", email: "binh.tt@university.edu.vn", major: "Điện toán đám mây", gpa: 3.5, year: 2 },
  { id: 3, name: "Lê Hoàng Cường", email: "cuong.lh@university.edu.vn", major: "An toàn thông tin", gpa: 2.9, year: 4 },
  { id: 4, name: "Phạm Thu Dung", email: "dung.pt@university.edu.vn", major: "Trí tuệ nhân tạo", gpa: 3.95, year: 1 },
  { id: 5, name: "Vũ Minh Đức", email: "duc.vm@university.edu.vn", major: "Kỹ thuật phần mềm", gpa: 3.2, year: 3 },
];

export function classifyGpa(score: number): { rank: string; rank_en: string; emoji: string } {
  if (score >= 3.6) return { rank: "Xuất sắc", rank_en: "Excellent", emoji: "🏆" };
  if (score >= 3.2) return { rank: "Giỏi", rank_en: "Very Good", emoji: "🌟" };
  if (score >= 2.5) return { rank: "Khá", rank_en: "Good", emoji: "👍" };
  if (score >= 2.0) return { rank: "Trung bình", rank_en: "Average", emoji: "📘" };
  return { rank: "Yếu", rank_en: "Weak", emoji: "⚠️" };
}