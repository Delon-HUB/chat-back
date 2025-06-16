import { CreateMessageDto } from "src/Modules/message/dto/create-message.dto";

export default interface IConversation {
    my_id: number;
    interlocutor_id: number;
    isgroup: boolean;
    messages: CreateMessageDto[];
}