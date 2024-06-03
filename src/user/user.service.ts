import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<void> {
    try {
      const verificationToken = crypto.randomBytes(16).toString('hex');
      const user = this.userRepository.create({
        ...createUserDto,
        verificationToken,
        isVerified: false,
      });
      console.log(user);
      await this.userRepository.save(user);
      console.log('user saved');
      await this.sendVerificationEmail(user, verificationToken);
    } catch (e) {
      console.log(e);
    }
  }
  async verifyEmail(
    username: string,
    verificationToken: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.verificationToken !== verificationToken) {
      return false;
    }

    user.isVerified = true;
    await this.userRepository.save(user);
    return true;
  }
  async checkVerification(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user?.isVerified ?? false;
  }
  async sendVerificationEmail(
    user: User,
    verificationToken: string,
  ): Promise<void> {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'farruk.bulut@gmail.com',
        pass: 'hehu jzex wlfs yddd',
      },
      host: 'smtp.gmail.com',
      port: 465,
    });
    console.log(process.env.EMAIL_USER);

    const mailOptions = {
      from: 'farruk.bulut@gmail.com',
      to: user.email,
      subject: 'Verify your email',
      text: `Click here to verify your email: http://localhost:3000/user/verify-email/${user.username}/${verificationToken}`,
    };
    await transport.sendMail(mailOptions);
  }
}
