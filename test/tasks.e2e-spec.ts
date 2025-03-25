import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestSetup } from './util/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Role } from '../src/users/role.enum';
import { PasswordService } from '../src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { title } from 'process';
import { TaskStatus } from 'src/tasks/task.model';

describe('Tasks (e2e)', () => {
  //  let app: INestApplication<App>;

  /*  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });*/

  let testSetup: TestSetup;
  let authToken: string;
  let taskId: string;

  const testUser = {
    email: 'test@example.com',
    password: 'ASD12$sd',
    name: 'Test User',
  };

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(201);

    authToken = loginResponse.body.accessToken;

    const response = await request(testSetup.app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'test task',
        description: ' test desc',
        status: TaskStatus.OPEN,
        labels: [{ name: 'test' }],
      });

    taskId = response.body.id;
  });

  afterEach(async () => {
    testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });
});
