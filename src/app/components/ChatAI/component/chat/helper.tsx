export const listQuestion: string[] = [
  'Tóm tắt thông tin lưu ý của giao dịch',
  'Các thông tin cần lưu ý khi thực hiện công việc này là gì ?',
  'Có deadline cần chú ý cho công việc này không ?',
];

export class IAIResponseClass {
  id: number;
  conversationId: string;
  message: string;
  reply: string | null;
  sequence: number | null;
  pushNotify: boolean | null;
  status: string | null;
  userId: number;
  custId: number;
  orgIn: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  feedback: boolean;
  voteValue: number | null;
  idResponseAi: string | null;

  constructor(data?: Partial<IAIResponseClass>) {
    this.id = Date.now() + Math.floor(Math.random() * 10000);
    this.conversationId = '';
    this.message = '';
    this.reply = null;
    this.sequence = null;
    this.pushNotify = null;
    this.status = null;
    this.userId = 0;
    this.custId = 0;
    this.orgIn = '';
    this.createdDate = new Date().toISOString();
    this.createdBy = '';
    this.lastModifiedDate = null;
    this.lastModifiedBy = null;
    this.feedback = false;
    this.voteValue = null;
    this.idResponseAi = null;

    // Nếu truyền vào `data`, cập nhật giá trị dựa trên data đó
    Object.assign(this, data);
  }
}
