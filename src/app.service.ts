import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIntro(): string {
    return '✅ Server is up and running!!!';
  }
}
