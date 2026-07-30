// src/lib/mailer.js: SMTP 발송 공용 유틸 (41_AUTH_CONTRACT 메일 절)
//
// routes/consult.js의 notifyEmail과 같은 방침이다. nodemailer는 동적 import,
// SMTP 환경변수가 없으면 조용히 스킵, 발송 실패는 호출부의 응답을 깨뜨리지 않는다.
// 호출부는 반드시 catch를 붙여서 부르고(await 하지 않는다) 실패는 로그로만 남긴다.

// 메일 본문의 안내 링크 기준 오리진. CLIENT_ORIGIN이 쉼표 목록이면 첫 값을 쓴다.
function clientOrigin() {
  const first = process.env.CLIENT_ORIGIN?.split(',')[0]?.trim()
  return (first || 'http://localhost:5173').replace(/\/+$/, '')
}

export async function sendMail({ to, subject, text }) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !to) return false

  const { default: nodemailer } = await import('nodemailer')
  const port = Number(process.env.SMTP_PORT) || 587
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  await transporter.sendMail({
    from: process.env.MAIL_FROM || SMTP_USER,
    to,
    subject,
    text,
  })
  return true
}

const ENTRY_TYPE_LABEL = { solo: '개인', team: '팀' }

// 전시회 접수 완료 확인 메일. 제출자 본인에게만 보낸다.
export async function sendExhibitionConfirmation(entry) {
  const text = [
    '전시회 접수가 정상적으로 완료되었습니다.',
    '',
    `접수 번호: ${entry.id}`,
    `참가 유형: ${ENTRY_TYPE_LABEL[entry.entry_type] || entry.entry_type}`,
    `접수 계정: ${entry.email}`,
    `접수 일시: ${entry.created_at}`,
    '',
    '접수 내용 확인과 수정은 아래 링크에서 구글 로그인 후 가능합니다.',
    `${clientOrigin()}/submit/edit`,
    '',
    '수정 마감 이후에는 내용을 바꿀 수 없으니 기간 안에 확인해 주세요.',
    '',
    '한림대학교 디지털인문예술전공',
  ].join('\n')

  return sendMail({
    to: entry.email,
    subject: '[디지털인문예술전공] 전시회 접수 완료 안내',
    text,
  })
}
