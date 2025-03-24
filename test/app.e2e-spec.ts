import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
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
});
