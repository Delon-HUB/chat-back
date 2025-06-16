import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entities/message.entity';
import { Op } from 'sequelize';
import { MemberOfGroupService } from '../member-of-group/member-of-group.service';
import IConversation from 'src/Interfaces/IConversation';

@Injectable()
export class MessageService {
  constructor(private readonly memberOfGroupService: MemberOfGroupService) {}
  async save(createMessageDto: CreateMessageDto): Promise<CreateMessageDto> {
    createMessageDto.created_at = Date.now() / 1000;
    const msg = await MessageEntity.create(createMessageDto);
    return msg;
  }

  async getMessageOf(userId: number): Promise<IConversation[]> {
    let conversationList: IConversation[] = [];

    const groupConversation: IConversation[] = [];
    const groupIds: number[] =
      await this.memberOfGroupService.getGroupIdsOfMember(userId);

    groupIds.forEach(async (id) => {
      const groupMessages: CreateMessageDto[] =
        await this.getMessageOfGroup(id);
      groupMessages.forEach((m) => {
        m.isgroup = Boolean(m.isgroup);
      });

      const conversation: IConversation = {
        my_id: userId,
        interlocutor_id: id,
        isgroup: true,
        messages: groupMessages,
      };

      groupConversation.push(conversation);
    });

    const privateMessages: CreateMessageDto[] = await MessageEntity.findAll({
      where: {
        [Op.or]: {
          sender_id: userId,
          receiver_id: userId,
        },
        isgroup: false,
      },
    });
    const privateConversation: Map<string, IConversation> = new Map();
    privateMessages.forEach((m) => {
      m.isgroup = Boolean(m.isgroup);
      const key: string = [m.sender_id, m.receiver_id]
        .sort((a, b) => a - b)
        .join('-');
      if (privateConversation.has(key)) {
        privateConversation.get(key).messages.push(m);
      } else {
        const newConversation: IConversation = {
          my_id: userId,
          interlocutor_id: m.sender_id == userId ? m.receiver_id : m.sender_id,
          isgroup: false,
          messages: [m],
        };
        privateConversation.set(key, newConversation);
      }
    });

    // conversationList.forEach((msg) => (msg.isgroup = Boolean(msg.isgroup)));

    conversationList = [...groupConversation];
    privateConversation.forEach((val) => {
      conversationList.push(val);
    });

    return conversationList?.length > 0 ? conversationList : [];
  }

  async getMessageOfGroup(groupId: number): Promise<CreateMessageDto[]> {
    const messages: CreateMessageDto[] = await MessageEntity.findAll({
      where: { isgroup: true, receiver_id: groupId },
    });
    messages.forEach((msg) => (msg.isgroup = Boolean(msg.isgroup)));
    return messages?.length > 0 ? messages : [];
  }
}
