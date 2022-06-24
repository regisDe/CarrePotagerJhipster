import LoginService from '@/account/login.service';
import axios from 'axios';
import sinon from 'sinon';

const axiosStub = {
  get: sinon.stub(axios, 'get'),
  post: sinon.stub(axios, 'post'),
};

describe('Login Service test suite', () => {
  let loginService;

  beforeEach(() => {
    loginService = new LoginService();
  });

  it('should call global logout when asked to', () => {
    loginService.logout();

    expect(axiosStub.post.calledWith('api/logout')).toBeTruthy();
  });
});
