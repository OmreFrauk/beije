import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  describe('register', () => {
    it('should register a new user and send verification email', async () => {
      userRepository.create.mockReturnValue({
        username: 'test',
        email: 'omar48faruk@gmail.com',
        verificationToken: '1234',
        isVerified: false,
      });
      userRepository.save.mockResolvedValue({
        username: 'test',
        email: 'omar48faruk@gmail.com',
        verificationToken: '1234',
        isVerified: false,
      });

      const sendVerificationEmailSpy = jest
        .spyOn(service as any, 'sendVerificationEmail')
        .mockImplementation(() => Promise.resolve());

      await service.register({
        username: 'test',
        email: 'omar48faruk@gmail.com',
      });

      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'test',
        email: 'omar48faruk@gmail.com',
        verificationToken: expect.any(String),
        isVerified: false,
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(sendVerificationEmailSpy).toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should verify the email', async () => {
      const user = {
        username: 'test',
        email: 'omar48faruk@gmail.com',
        verificationToken: '1234',
        isVerified: false,
      };
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.verifyEmail('test', '1234');

      expect(result).toBe(true);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        isVerified: true,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.verifyEmail('test', '1234')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return false if verification token is invalid', async () => {
      const user = {
        username: 'test',
        email: 'omar48faruk@gmail.com',
        verificationToken: '1234',
        isVerified: false,
      };
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.verifyEmail('test', 'wrong-token');

      expect(result).toBe(false);
    });
  });

  describe('checkVerification', () => {
    it('should return true if user is verified', async () => {
      const user = {
        username: 'test',
        email: 'omar48faruk@gmail.com',
        verificationToken: '1234',
        isVerified: true,
      };
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.checkVerification('test');

      expect(result).toBe(true);
    });

    it('should return false if user is not verified', async () => {
      const user = {
        username: 'test',
        email: 'omar48faruk@gmail.com',
        verificationToken: '1234',
        isVerified: false,
      };
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.checkVerification('test');

      expect(result).toBe(false);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.checkVerification('test')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
