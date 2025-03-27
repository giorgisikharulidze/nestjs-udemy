import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestSetup } from './util/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/users/enums/role.enum';
import { PasswordService } from '../src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';

describe('Authentication & Authorization (e2e)', () => {
  //  let app: INestApplication<App>;

  /*  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });*/

  let testSetup: TestSetup;

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);
  });

  afterEach(async () => {
    testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'ASD12$sd',
    name: 'Test User',
  };

  it('should require auth', () => {
    return request(testSetup.app.getHttpServer()).get('/tasks').expect(401);
  });

  it('should allow public route access', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(201);
  });

  it('should include roles in JWT token', async () => {
    const userRepo = testSetup.app.get(getRepositoryToken(User));

    await userRepo.save({
      ...testUser,
      roles: [Role.AMDIN],
      password: await testSetup.app
        .get(PasswordService)
        .hash(testUser.password),
    });

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const decoded = testSetup.app
      .get(JwtService)
      .verify(response.body.accessToken);

    expect(decoded.roles).toBeDefined();
    expect(decoded.roles).toContain(Role.AMDIN);
  });

  it('/auth/register (POST)', () => {
    return request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.name).toBe(testUser.name);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/register (POST) - dublicate email', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    return await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409);
  });

  it('/auth/login (POST) ', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
  });



  it('/auth/profile (GET) ', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const token = response.body.accessToken;

    return request(testSetup.app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.name).toBe(testUser.name);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/admin (GET) - admin access', async () => {
    const userRepo = testSetup.app.get(getRepositoryToken(User));

    await userRepo.save({
      ...testUser,
      roles: [Role.AMDIN],
      password: await testSetup.app
        .get(PasswordService)
        .hash(testUser.password),
    });

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const token = response.body.accessToken;

    return request(testSetup.app.getHttpServer())
      .get('/auth/admin')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('This is for admins only!');
      });
  });


  it('/auth/admin (GET) - regular user denied', async () => {
    await request(testSetup.app.getHttpServer())
    .post('/auth/register')
    .send(testUser);

  const response = await request(testSetup.app.getHttpServer())
    .post('/auth/login')
    .send({ email: testUser.email, password: testUser.password });

  const token = response.body.accessToken;

  return request(testSetup.app.getHttpServer())
    .get('/auth/admin')
    .set('Authorization', `Bearer ${token}`)
    .expect(403)


  });


  it('/auth/register (POST) - attemplting to register as an admin', async()=>{

    const userAdmin={
      ...testUser,
      roles: [Role.AMDIN]
    }

    await request(testSetup.app.getHttpServer())
    .post('/auth/register')
    .send(userAdmin)
    .expect(201)
    .expect((res)=>{
      expect(res.body.roles).toEqual([Role.USER]);
    });

  })


});
