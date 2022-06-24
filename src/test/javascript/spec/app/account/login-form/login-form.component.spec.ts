import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import axios from 'axios';
import sinon from 'sinon';
import AccountService from '@/account/account.service';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import LoginForm from '@/account/login-form/login-form.vue';
import LoginFormClass from '@/account/login-form/login-form.component';

const localVue = createLocalVue();
localVue.component('b-alert', {});
localVue.component('b-button', {});
localVue.component('b-form', {});
localVue.component('b-form-input', {});
localVue.component('b-form-group', {});
localVue.component('b-form-checkbox', {});
localVue.component('b-link', {});

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);

const axiosStub = {
  get: sinon.stub(axios, 'get'),
  post: sinon.stub(axios, 'post'),
};

describe('LoginForm Component', () => {
  let wrapper: Wrapper<LoginFormClass>;
  let loginForm: LoginFormClass;

  beforeEach(() => {
    axiosStub.get.resolves({});
    axiosStub.post.reset();

    wrapper = shallowMount<LoginFormClass>(LoginForm, {
      store,
      localVue,
      provide: {
        accountService: () => new AccountService(store, { get: () => {} }, new VueRouter()),
      },
    });
    loginForm = wrapper.vm;
  });

  it('should authentication be KO', async () => {
    // GIVEN
    loginForm.login = 'login';
    loginForm.password = 'pwd';
    loginForm.rememberMe = true;
    axiosStub.post.rejects();

    // WHEN
    loginForm.doLogin();
    await loginForm.$nextTick();

    // THEN
    expect(
      axiosStub.post.calledWith('api/authentication', 'username=login&password=pwd&remember-me=true&submit=Login', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    ).toBeTruthy();
    await loginForm.$nextTick();
    expect(loginForm.authenticationError).toBeTruthy();
  });

  it('should authentication be OK', async () => {
    // GIVEN
    loginForm.login = 'login';
    loginForm.password = 'pwd';
    loginForm.rememberMe = true;
    axiosStub.post.resolves({});

    // WHEN
    loginForm.doLogin();
    await loginForm.$nextTick();

    // THEN
    expect(
      axiosStub.post.calledWith('api/authentication', 'username=login&password=pwd&remember-me=true&submit=Login', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    ).toBeTruthy();

    expect(loginForm.authenticationError).toBeFalsy();
  });
});
