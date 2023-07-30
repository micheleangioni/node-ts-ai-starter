// eslint-disable-next-line
type Token<T> = { new (...args: any[]): T };
type Factory<T> = () => T;

enum Lifecycle {
  TRANSIENT,
  SINGLETON,
}

class Binding<T> {
  constructor(public factory: Factory<T>, public lifecycle: Lifecycle) {}
}

export interface IContainer {
  bind<T>(
    token: Token<T>,
    factory: Factory<T>,
    lifecycle?: Lifecycle,
  ): void;

  resolve<T>(token: Token<T>): T;
}

class Container implements IContainer {
  private _registry: Map<Token<any>, Binding<any>> = new Map();
  private _instances: Map<Token<any>, any> = new Map();

  public bind<T>(token: Token<T>, factory: Factory<T>, lifecycle: Lifecycle = Lifecycle.TRANSIENT): void {
    this._registry.set(token, new Binding(factory, lifecycle));
  }

  public resolve<T>(token: Token<T>): T {
    const binding = this._registry.get(token);

    if (!binding) {
      throw new Error(`No service registered for token: ${token.name}`);
    }

    if (binding.lifecycle === Lifecycle.SINGLETON) {
      const instance = this._instances.get(token);

      if (instance) {
        return instance;
      } else {
        const newInstance = binding.factory();
        this._instances.set(token, newInstance);

        return newInstance;
      }
    } else {
      return binding.factory();
    }
  }
}

const container = new Container();

export default () => container;
