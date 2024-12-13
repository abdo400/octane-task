import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../users.controller';
import { UserService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthTokenDto } from '../dto/auth-token.dto';


describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const createUserDto: CreateUserDto = { username: 'user1', password: 'password123', role: 'user' };
      const result: UserResponseDto = { id: 1, username: 'user1', role: 'user' };

      // Mocking the service call
      jest.spyOn(service, 'register').mockResolvedValue(result);

      // Testing the controller method
      expect(await controller.register(createUserDto)).toEqual(result);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if registration fails', async () => {
      const createUserDto: CreateUserDto = { username: 'user1', password: 'password123', role: 'user' };
      const error = new Error('Registration failed');

      // Mocking the service call to throw an error
      jest.spyOn(service, 'register').mockRejectedValue(error);

      try {
        await controller.register(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Registration failed');
      }
    });
  });

  describe('login', () => {
    it('should successfully log in the user', async () => {
      const loginDto: LoginDto = { username: 'user1', password: 'password123' };
      const result: AuthTokenDto = { accessToken: 'auth-token', refreshToken: 'auth-token' };

      // Mocking the service call
      jest.spyOn(service, 'login').mockResolvedValue(result);

      // Testing the controller method
      expect(await controller.login(loginDto)).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error if login fails', async () => {
      const loginDto: LoginDto = { username: 'user1', password: 'password123' };
      const error = new Error('Invalid credentials');

      // Mocking the service call to throw an error
      jest.spyOn(service, 'login').mockRejectedValue(error);

      try {
        await controller.login(loginDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Invalid credentials');
      }
    });
  });
});
