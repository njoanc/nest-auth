import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PassportLocalModel } from 'mongoose';
import { IUser } from '../users/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { debug } from 'console';
import { RegistrationStatus } from './interfaces/registrationStatus.interface';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel('User') private readonly userModel: PassportLocalModel<IUser>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const createUser = new this.userModel(createUserDto);
    return await createUser.save();
  }

  createToken(user) {
    console.log('get the expiration');
    const expiresIn = 3600;
    console.log('sign the token');
    console.log(user);

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.username,
        firstname: user.firstName,
        lastname: user.lastName,
      },
      'ILovePokemon',
      { expiresIn },
    );
    console.log('return the token');
    console.log(accessToken);
    return {
      expiresIn,
      accessToken,
    };
  }
  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findById(payload.id);
  }
}
