import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestSetup } from './util/test-setup';

describe('AppController (e2e)', () => {
//  let app: INestApplication<App>;

/*  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });*/

  let testSetup: TestSetup; 

  beforeEach(async()=>{
    testSetup = await TestSetup.create(AppModule);
  })
  
afterEach(async()=>{
  testSetup.cleanup();
})

afterAll(async()=>{
  await testSetup.teardown();
})

  it('/ (GET)', () => {
    return request(testSetup.app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => expect(res.text).toContain('Hello World!'));
  });

  const testUser = {
    email: 'test@example.com',
    password: 'ASD12$sd',
    name: 'Test User'
  };

  it('/auth/register (POST)',()=>{
    return request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res)=>{
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.name).toBe(testUser.name);
        expect(res.body).not.toHaveProperty('password');
        
      })
  })
});
