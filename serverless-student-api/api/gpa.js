// ============================================================
// GPA CLASSIFICATION FUNCTION
// Mục đích: Phân loại học lực từ điểm GPA
// Trigger (Event): HTTP GET request đến /api/gpa?score=X
// Ví dụ: /api/gpa?score=3.7
// ============================================================

export default function handler(req, res) {

  console.log(`[EVENT] ${req.method} /api/gpa - ${new Date().toISOString()}`);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Chỉ hỗ trợ GET method' });
  }

  // Lấy tham số score từ query string
  const { score } = req.query;

  // Kiểm tra có truyền score không
  if (score === undefined || score === '') {
    return res.status(400).json({
      success: false,
      error: 'Thiếu tham số score',
      usage: '/api/gpa?score=3.7',
      validRange: '0.0 đến 4.0'
    });
  }

  // Chuyển đổi sang số
  const gpaScore = parseFloat(score);

  // Kiểm tra giá trị hợp lệ
  if (isNaN(gpaScore) || gpaScore < 0 || gpaScore > 4.0) {
    return res.status(400).json({
      success: false,
      error: 'Điểm GPA không hợp lệ',
      message: `Giá trị "${score}" không hợp lệ. GPA phải từ 0.0 đến 4.0`,
      example: '/api/gpa?score=3.5'
    });
  }

  // Bảng phân loại GPA (theo thang điểm 4.0)
  const classifications = [
    { min: 3.6, max: 4.0, level: 'Xuất sắc',    grade: 'A+/A', scholarship: true,  emoji: '🏆' },
    { min: 3.2, max: 3.59, level: 'Giỏi',        grade: 'A-/B+', scholarship: true, emoji: '⭐' },
    { min: 2.5, max: 3.19, level: 'Khá',          grade: 'B/B-',  scholarship: false, emoji: '✅' },
    { min: 2.0, max: 2.49, level: 'Trung bình',   grade: 'C',     scholarship: false, emoji: '📚' },
    { min: 0.0, max: 1.99, level: 'Yếu - Cảnh báo học vụ', grade: 'D/F', scholarship: false, emoji: '⚠️' }
  ];

  // Tìm phân loại phù hợp
  const result = classifications.find(
    c => gpaScore >= c.min && gpaScore <= c.max
  );

  return res.status(200).json({
    success: true,
    input: {
      score: gpaScore,
      scale: '4.0'
    },
    result: {
      classification: result.level,
      grade: result.grade,
      eligible_for_scholarship: result.scholarship,
      icon: result.emoji,
      message: result.scholarship 
        ? `🎉 Chúc mừng! GPA ${gpaScore} - ${result.level}. Đủ điều kiện xét học bổng.`
        : `GPA ${gpaScore} - ${result.level}. Cần cố gắng thêm để được học bổng.`
    },
    allClassifications: classifications.map(c => ({
      range: `${c.min} - ${c.max}`,
      level: c.level,
      scholarship: c.scholarship
    })),
    meta: {
      eventType: 'GPA_CLASSIFICATION_REQUESTED',
      processedAt: new Date().toISOString(),
      functionName: 'gpa-classifier',
      runtime: 'Serverless FaaS'
    }
  });
}