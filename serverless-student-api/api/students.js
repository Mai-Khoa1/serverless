// ============================================================
// STUDENT MANAGEMENT FUNCTION
// Mục đích: CRUD cơ bản cho danh sách sinh viên
// Trigger (Event): HTTP Request đến /api/students
//   - GET  /api/students        → lấy tất cả
//   - GET  /api/students?id=... → lấy một người
//   - POST /api/students        → thêm mới
// ============================================================

// ----- DỮ LIỆU MẪU (thay cho Database trong demo) -----
// Trong hệ thống thực tế, đây sẽ là lệnh đọc từ Database
// như MongoDB, PostgreSQL, hoặc DynamoDB
const students = [
  {
    id: 'SV001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@university.edu.vn',
    major: 'Công nghệ thông tin',
    gpa: 3.7,
    year: 3,
    status: 'Đang học'
  },
  {
    id: 'SV002',
    name: 'Trần Thị Bình',
    email: 'binh.tran@university.edu.vn',
    major: 'Khoa học máy tính',
    gpa: 3.2,
    year: 2,
    status: 'Đang học'
  },
  {
    id: 'SV003',
    name: 'Lê Minh Cường',
    email: 'cuong.le@university.edu.vn',
    major: 'Kỹ thuật phần mềm',
    gpa: 2.8,
    year: 4,
    status: 'Đang học'
  },
  {
    id: 'SV004',
    name: 'Phạm Thị Dung',
    email: 'dung.pham@university.edu.vn',
    major: 'Hệ thống thông tin',
    gpa: 3.9,
    year: 1,
    status: 'Đang học'
  }
];

// ----- HÀM PHÂN LOẠI GPA -----
// Tách riêng để tái sử dụng
function classifyGPA(gpa) {
  if (gpa >= 3.6) return 'Xuất sắc';
  if (gpa >= 3.2) return 'Giỏi';
  if (gpa >= 2.5) return 'Khá';
  if (gpa >= 2.0) return 'Trung bình';
  return 'Yếu';
}

// ----- FUNCTION HANDLER CHÍNH -----
// Đây là hàm được Vercel gọi mỗi khi có HTTP request
// req = request (thông tin từ client gửi lên)
// res = response (thứ ta trả về cho client)
export default function handler(req, res) {

  // Ghi log — trong production, đây sẽ hiện trong Vercel Dashboard
  console.log(`[EVENT] ${req.method} /api/students - ${new Date().toISOString()}`);

  // ── Xử lý GET Request ──────────────────────────────────────
  if (req.method === 'GET') {
    
    // Kiểm tra có tham số ?id= không
    const { id } = req.query;

    if (id) {
      // TH1: Có id → tìm sinh viên cụ thể
      const student = students.find(s => s.id === id);
      
      if (!student) {
        // Không tìm thấy → trả về lỗi 404
        return res.status(404).json({
          success: false,
          error: 'Không tìm thấy sinh viên',
          message: `Không có sinh viên với ID: ${id}`,
          tip: 'Thử với SV001, SV002, SV003, hoặc SV004'
        });
      }

      // Tìm thấy → trả về thông tin sinh viên kèm phân loại GPA
      return res.status(200).json({
        success: true,
        data: {
          ...student,                          // spread tất cả field của student
          gpaClassification: classifyGPA(student.gpa)  // thêm phân loại
        },
        meta: {
          eventType: 'GET_SINGLE_STUDENT',
          processedAt: new Date().toISOString()
        }
      });

    } else {
      // TH2: Không có id → trả về tất cả sinh viên
      const enrichedStudents = students.map(s => ({
        ...s,
        gpaClassification: classifyGPA(s.gpa)
      }));

      return res.status(200).json({
        success: true,
        total: students.length,
        data: enrichedStudents,
        meta: {
          eventType: 'GET_ALL_STUDENTS',
          processedAt: new Date().toISOString(),
          serverlessRuntime: 'Vercel Functions (FaaS)'
        }
      });
    }
  }

  // ── Xử lý POST Request ─────────────────────────────────────
  if (req.method === 'POST') {
    const body = req.body;

    // Kiểm tra dữ liệu đầu vào (Validation)
    if (!body || !body.name || !body.major) {
      return res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        message: 'Cần có ít nhất: name và major',
        example: {
          name: 'Võ Thị Em',
          email: 'em.vo@university.edu.vn',
          major: 'Trí tuệ nhân tạo',
          gpa: 3.5,
          year: 2
        }
      });
    }

    // Tạo sinh viên mới
    const newStudent = {
      id: `SV${String(students.length + 1).padStart(3, '0')}`, // SV005, SV006...
      name: body.name,
      email: body.email || `${body.name.toLowerCase().replace(/\s/g, '.')}@university.edu.vn`,
      major: body.major,
      gpa: parseFloat(body.gpa) || 0.0,
      year: parseInt(body.year) || 1,
      status: 'Đang học'
    };

    // Thêm vào danh sách (trong memory)
    students.push(newStudent);

    // Trả về kết quả thành công
    return res.status(201).json({
      success: true,
      message: 'Thêm sinh viên thành công',
      data: {
        ...newStudent,
        gpaClassification: classifyGPA(newStudent.gpa)
      },
      meta: {
        eventType: 'STUDENT_CREATED',        // ← Đây là "Event" trong Event-Driven
        processedAt: new Date().toISOString(),
        totalStudents: students.length
      }
    });
  }

  // ── Phương thức không được hỗ trợ ──────────────────────────
  return res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `Phương thức ${req.method} không được hỗ trợ`,
    allowedMethods: ['GET', 'POST']
  });
}