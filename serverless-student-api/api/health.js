// ============================================================
// HEALTH CHECK FUNCTION
// Mục đích: Kiểm tra API còn hoạt động không
// Trigger (Event): HTTP GET request đến /api/health
// ============================================================

export default function handler(req, res) {
  
  // Chỉ chấp nhận phương thức GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Endpoint này chỉ chấp nhận GET request'
    });
  }

  // Lấy thời gian hiện tại để đưa vào response
  const now = new Date();

  // Trả về thông tin trạng thái hệ thống
  return res.status(200).json({
    status: 'OK',
    message: '✅ Serverless API đang hoạt động bình thường',
    architecture: 'Serverless FaaS on Vercel',
    pattern: 'Event-Driven Architecture',
    timestamp: now.toISOString(),
    timezone: 'UTC',
    region: process.env.VERCEL_REGION || 'unknown',
    runtime: 'Node.js ' + process.version,
    endpoints: {
      health: 'GET /api/health',
      getAllStudents: 'GET /api/students',
      getOneStudent: 'GET /api/students?id=SV001',
      addStudent: 'POST /api/students',
      classifyGPA: 'GET /api/gpa?score=8.5'
    }
  });
}