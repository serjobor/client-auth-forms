import { makeAutoObservable, runInAction } from 'mobx';

export interface IUserAuth {
  email: string;
  name?: string;
  id?: string;
}

class AuthStore {
  user: IUserAuth | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async login(email: string, password: string) {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка входа');
      }
      await this.checkAuth();
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Ошибка';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async checkAuth() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch('/api/v1/auth/me', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Не авторизован');
      const data = await res.json();
      runInAction(() => {
        this.user = data;
      });
    } catch (e: any) {
      runInAction(() => {
        this.user = null;
        this.error = e.message || 'Ошибка';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async logout() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Ошибка выхода');
      runInAction(() => {
        this.user = null;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Ошибка';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

const authStore = new AuthStore();
export default authStore; 