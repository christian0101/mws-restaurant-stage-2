/**
 * Toast notifications.
 */

/**
 * Toast ntification contructor.
 */
function Toast(text, buttons) {
  const toast = this;

  this.container = {
   text: text,
   buttons: buttons
  }

  this.answer = new Promise(function(resolve) {
    toast._answerResolver = resolve;
  });

  this.gone = new Promise(function(resolve) {
    toast._goneResolver = resolve;
  });
}

/**
 * Create toast notification.
 */
Toast.prototype.create = (message, opts = {buttons: ['dismiss']}) => {
  const toast = new Toast(message, opts.buttons);

  const toastElement = document.createElement('div');
  toastElement.id = 'toast';
  toastElement.className = 'toast';
  toastElement.tabIndex = '-1';
  document.body.appendChild(toastElement);

  const toastContent = document.createElement('div');
  toastContent.className = 'toast-content';
  toastContent.innerHTML = message;
  opts.buttons.forEach((button) => {
    const toastButton = document.createElement('button');
    toastButton.id = button;
    toastButton.innerHTML = button;
    toastButton.className = 'unbutton';
    toastContent.appendChild(toastButton);
  });

  toastElement.appendChild(toastContent);
  toastElement.focus();

  toastElement.addEventListener('click', function(event) {
    const button = event.target;
    if (!button) return;
    toast._answerResolver(button.innerHTML);
    toast.dismiss(toastElement, toast);
  });

  return toast;
}

/**
 * Dismiss toast notification.
 */
Toast.prototype.dismiss = (toastElement, toast) => {
  toast._answerResolver();
  toastElement.parentNode.removeChild(toastElement);

  return this.gone;
}
