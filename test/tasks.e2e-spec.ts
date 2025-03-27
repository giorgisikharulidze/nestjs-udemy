import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestSetup } from './util/test-setup';
import { TaskStatus } from '../src/tasks/enums/task-status.enum';

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
    email: 'test2@example.com',
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
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('should not allow  access to other users tasks', async () => {
    const otherUser = { ...testUser, email: 'other@example.com' };

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser)
      .expect(201);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(otherUser)
      .expect(201);

    const otherToken = loginResponse.body.accessToken;

    await request(testSetup.app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('should list users tasks only', async () => {
        await request(testSetup.app.getHttpServer())
        .get(`/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res)=>{
          expect(res.body.meta.total).toBe(1);
        });

        const otherUser = { ...testUser, email: 'other@example.com' };

        await request(testSetup.app.getHttpServer())
          .post('/auth/register')
          .send(otherUser)
          .expect(201);
    
        const loginResponse = await request(testSetup.app.getHttpServer())
          .post('/auth/login')
          .send(otherUser)
          .expect(201);
    
        const otherToken = loginResponse.body.accessToken;
    
        await request(testSetup.app.getHttpServer())
        .get(`/tasks`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(200)
        .expect((res)=>{
          expect(res.body.meta.total).toBe(0);
        });
    
  });
  });
