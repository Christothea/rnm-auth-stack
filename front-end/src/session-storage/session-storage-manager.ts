import { SessionStorageKey } from './session-storage-key.enum';

export class SessionStorageManager {
    public static setItem(itemKey: SessionStorageKey, obj: any): void {
        try {
            sessionStorage.setItem(itemKey, JSON.stringify(obj));
        } catch (ex) {
            console.error(ex);
        }
    }

    public static getItem(itemKey: SessionStorageKey): any {
        try {
            const storedValue: any = sessionStorage.getItem(itemKey);
            return sessionStorage.getItem(itemKey) ? JSON.parse(storedValue) : undefined;
        } catch (ex) {
            console.error(ex);
        }
        return undefined;
    }

    public static removeItem(itemKey: SessionStorageKey | string): void {
        try {
            sessionStorage.removeItem(itemKey);
        } catch (ex) {
            console.error(ex);
        }
    }

    public static clear() {
        try {
            sessionStorage.clear();
        } catch (ex) {
            console.error(ex);
        }
    }
}