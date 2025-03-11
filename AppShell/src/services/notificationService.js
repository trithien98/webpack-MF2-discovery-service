import { EventEmitter } from 'events';

class NotificationService extends EventEmitter {
  showNotification(title, message) {
    this.emit('notification', { title, message });
  }
}

export const notificationService = new NotificationService(); 