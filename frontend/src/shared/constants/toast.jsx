import { uid } from '@utils/helpers';

export class Toast {
  static SUCCESS = 'success';
  static ERROR = 'error';
  static WARNING = 'warning';
  static INFO = 'info';

  static DEFAULT_DURATION = 5000;
  static DEFAULT_POSITION = 'top-right';

  static TYPES = [Toast.SUCCESS, Toast.ERROR, Toast.WARNING, Toast.INFO];

  static DEFAULT_OPTIONS = {
    duration: Toast.DEFAULT_DURATION,
    position: Toast.DEFAULT_POSITION,
    replace: false,
  };

  constructor(type, message, description = '', options = {}) {
    if (!Toast.TYPES.includes(type)) {
      type = Toast.INFO;
    }

    this.id = uid();
    this.timestamp = Date.now();
    this.type = type;
    this.message = message.trim();
    this.description = description.trim();
    this.options = { ...Toast.DEFAULT_OPTIONS, ...options };
  }

  static isEqual(a, b) {
    return a.id === b.id || a.timestamp === b.timestamp;
  }
}
