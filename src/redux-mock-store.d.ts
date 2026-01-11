declare module 'redux-mock-store' {
  import { Middleware, Store } from 'redux';

  interface MockStore<S = any, A = any> extends Store<S, A> {
    getActions(): any[];
    clearActions(): void;
  }

  interface ConfigureStore {
    <S = any, A = any>(middlewares?: Middleware[]): (initialState?: S) => MockStore<S, A>;
  }

  const configureStore: ConfigureStore;
  export default configureStore;
}
