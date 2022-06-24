import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import axios from 'axios';
import sinon from 'sinon';
import * as config from '@/shared/config/config';
import SessionsClass from '@/account/sessions/sessions.component';
import Sessions from '@/account/sessions/sessions.vue';
import router from '@/router';

const localVue = createLocalVue();

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);

const axiosStub = {
  get: sinon.stub(axios, 'get'),
  delete: sinon.stub(axios, 'delete'),
};

describe('Sessions Component', () => {
  let wrapper: Wrapper<SessionsClass>;
  let sessions: SessionsClass;

  beforeEach(() => {
    axiosStub.get.reset();
    axiosStub.get.resolves({ data: [] });
    axiosStub.delete.reset();

    store.commit('authenticated', {
      login: 'username',
    });

    wrapper = shallowMount<SessionsClass>(Sessions, {
      store,
      localVue,
    });
    sessions = wrapper.vm;
  });

  it('should call remote service on init', () => {
    expect(axiosStub.get.callCount).toEqual(1);
  });

  it('should have good username', () => {
    expect(sessions.username).toEqual('username');
  });

  it('should invalidate a session', async () => {
    // Given
    axiosStub.get.reset();
    axiosStub.get.resolves({ data: [] });
    axiosStub.delete.resolves();

    // When
    sessions.invalidate('session');
    await sessions.$nextTick();

    // Then
    expect(sessions.error).toBeNull();
    expect(sessions.success).toEqual('OK');
    expect(axiosStub.get.callCount).toEqual(1);
  });

  it('should fail to invalidate session', async () => {
    // Given
    axiosStub.get.reset();
    axiosStub.get.resolves({ data: [] });
    axiosStub.delete.rejects();

    // When
    sessions.invalidate('session');
    await sessions.$nextTick();

    // Then
    expect(sessions.success).toBeNull();
    expect(sessions.error).toEqual('ERROR');
    expect(axiosStub.get.callCount).toEqual(0);
  });
});
