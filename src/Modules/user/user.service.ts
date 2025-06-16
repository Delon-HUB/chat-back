import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { EAPI_USER_ERROR, EAUTH_ERROR } from 'src/Enums/apiError';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/Interfaces/IJwtPayload';
import { IToken } from 'src/Interfaces/IToken';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  async signUp(newUser: CreateUserDto): Promise<CreateUserDto> {
    const user = await UserEntity.findOne({ where: { email: newUser.email } });
    if (user)
      throw new WsException(EAPI_USER_ERROR.EMAIL_ALREADY_IN_USED);
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(newUser.password, salt);
    newUser.password = hashedPassword;
    newUser.created_at = Date.now() / 1000;
    return await UserEntity.create(newUser);
  }

  async singIn(data: UpdateUserDto): Promise<IToken> {
    const user = await UserEntity.scope('login').findOne({
      where: { email: data.email },
    });
    if (!user) throw new WsException(EAPI_USER_ERROR.USER_NOT_FOUND);
    
    if (!compareSync(data.password, user.password))
      throw new WsException(EAUTH_ERROR.WRONG_PASSWORD);
    const jwtPayload: IJwtPayload = {
      id: user.id,
      email: user.email,
    };

    return {
      id: user.id,
      token: await this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION,
      }),
    } as IToken;
  }

  async getById(userId: number): Promise<CreateUserDto> {
    const user = await UserEntity.findByPk(userId);
    if (!user) throw new NotFoundException(EAPI_USER_ERROR.USER_NOT_FOUND);
    return user as CreateUserDto;
  }

  async getByToken(token: string): Promise<CreateUserDto> {
    const payload = (await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    })) as IJwtPayload;
    const user = this.getById(payload.id);
    if (!user) throw new NotFoundException(EAPI_USER_ERROR.USER_NOT_FOUND);
    return user;
  }

  async getAll(): Promise<CreateUserDto[]> {
    const users = await UserEntity.findAll();
    if (users.length <= 0)
      throw new NotFoundException(EAPI_USER_ERROR.NO_RESULT);
    return users as CreateUserDto[];
  }

  async deleteOne(userId: number): Promise<CreateUserDto> {
    const user = await this.getById(userId);
    await UserEntity.destroy({ where: { id: user.id } });
    return user;
  }
}
