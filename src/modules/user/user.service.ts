import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Profile, UUID } from '@app/common/types';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.httpService.axiosRef.defaults.baseURL =
      this.configService.get('EXTERNAL_HTTP_URL');
  }

  async getUser(id: UUID): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  private async fetchProfile(id: UUID): Promise<Profile> {
    try {
      const response = await this.httpService.axiosRef.get<Profile>(
        `/api/profiles/${id}`,
      );
      return response?.data;
    } catch (error) {
      this.logger.error(`Error fetching profile for ID ${id}: ${error}`);
      return;
    }
  }

  async createUserIfNeeded(id: UUID): Promise<UserEntity | undefined> {
    try {
      const existingUser = await this.getUser(id);

      if (existingUser) {
        return existingUser;
      }

      const profile: Profile = await this.fetchProfile(id);
      if (!profile) {
        return;
      }

      const user = this.userRepository.create(profile);
      await this.userRepository.upsert(user, ['id']);

      return await this.getUser(id);
    } catch (error) {
      this.logger.error(`Error in creating user with ID ${id}: ${error}`);
      return;
    }
  }
}
