export class CreateMessageDto {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  isgroup: boolean;
  created_at: number;
}
