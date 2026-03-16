const escapePdfText = (text) => String(text || "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const generateTasksPdfBuffer = (tasks = []) => {
  const lines = [
    "Smart Productivity Management System - Tasks Report",
    `Generated: ${new Date().toISOString()}`,
    "",
    ...tasks.map((task, index) => `${index + 1}. ${task.title} | ${task.status} | ${task.assigned_user || "Unassigned"}`),
  ];

  const textOps = lines
    .map((line, i) => `BT /F1 11 Tf 40 ${780 - i * 16} Td (${escapePdfText(line)}) Tj ET`)
    .join("\n");

  const objects = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
  objects.push("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj");
  objects.push("3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj");
  objects.push("4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");
  objects.push(`5 0 obj << /Length ${Buffer.byteLength(textOps, "utf8")} >> stream\n${textOps}\nendstream endobj`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${obj}\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
};

module.exports = { generateTasksPdfBuffer };
