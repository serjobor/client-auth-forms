import { makeAutoObservable, runInAction } from 'mobx';

export interface IUser {
  id: string;
  name: string;
  surName: string;
  fullName: string;
  email: string;
  password: string;
  birthDate: string;
  telephone: string;
  employment: 'трудоустроен' | 'не трудоустроен' | '';
  userAgreement: boolean;
}

class UsersStore {
  users: IUser[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get all() {
    return this.users.filter(u => u.email !== 'admin@inno.tech');
  }

  async fetchUsers() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch('/api/v1/users', { credentials: 'include' });
      if (!res.ok) throw new Error('Ошибка загрузки пользователей');
      const data = await res.json();
      runInAction(() => {
        this.users = data.map((u: any) => ({
          ...u,
          userAgreement: Boolean(u.userAgreement)
        }));
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

  async addUser(user: Omit<IUser, 'id'>) {
    this.error = null;
    try {
      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка добавления пользователя');
      }
      await this.fetchUsers();
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Ошибка';
      });
      throw e;
    }
  }

  async updateUser(id: string, data: Partial<Omit<IUser, 'id'>>) {
    this.error = null;
    try {
      // Исключаем email и id из отправляемых данных
      const { email, ...rest } = data;
      // @ts-expect-error: id может быть в объекте, но не в типе
      const { id: _id, ...patchData } = rest;
      const res = await fetch(`/api/v1/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(patchData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка обновления пользователя');
      }
      await this.fetchUsers();
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Ошибка';
      });
      throw e;
    }
  }

  async removeUser(id: string) {
    this.error = null;
    try {
      const res = await fetch(`/api/v1/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Ошибка удаления пользователя');
      await this.fetchUsers();
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Ошибка';
      });
    }
  }
}

const usersStore = new UsersStore();
export default usersStore; 