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
    const verificationToken = crypto.randomBytes(16).toString('hex');
    const user = this.userRepository.create({
      ...createUserDto,
      verificationToken,
    });
    await this.userRepository.save(user);
    await this.sendVerificationEmail(user, verificationToken);
  }
  async verifyEmail(
    username: string,
    verificationToken: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user || user.verificationToken !== verificationToken) {
      throw new NotFoundException('User not found');
    }
    user.verified = true;
    await this.userRepository.save(user);
    return true;
  }
  async checkVerification(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user?.verified ?? false;
  }
  async sendVerificationEmail(
    user: User,
    verificationToken: string,
  ): Promise<void> {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your email',
      text: `Click here to verify your email: http://localhost:3000/verify?token=${verificationToken}`,
    };
    await transport.sendMail(mailOptions);
  }
}
