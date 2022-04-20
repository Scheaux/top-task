import Task from './Task';

export default class App {
  init() {
    this.getDOM();
    this.initListeners();
    this.taskList = [];
  }

  getDOM() {
    this.searcher = document.getElementById('searcher');
    this.tasks = document.getElementsByClassName('task');
    this.taskContainer = document.querySelector('.task_container');
    this.pinned = document.querySelector('.pinned');
    this.allTasks = document.querySelector('.all-tasks');
  }

  initListeners() {
    this.searcher.addEventListener('keyup', (evt) => {
      if (evt.key === 'Enter') {
        if (this.searcher.value === '') {
          App.showError('Cannot search for empty text');
        } else {
          const newTask = new Task(this.searcher.value, false);
          this.taskList.push(newTask);
          App.createTask(newTask);
          this.searcher.value = '';
          this.checkPinned();
        }
      }

      App.taskFilter(this.searcher.value);
    });

    this.taskContainer.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('task-text')) {
        const target = evt.target.closest('.task');
        const input = target.querySelector('.task-name');
        if (input.checked) {
          input.checked = false;
          this.unpin(target);
          App.taskFilter(this.searcher.value);
        } else {
          input.checked = true;
          this.pin(target);
          App.taskFilter(this.searcher.value);
        }
      }
    });
  }

  static showError(message) {
    const wrapper = document.createElement('div');
    const blackout = document.createElement('div');
    const error = document.createElement('div');

    blackout.classList.add('blackout');
    error.classList.add('error');
    error.innerText = message;

    wrapper.appendChild(blackout);
    wrapper.appendChild(error);
    document.querySelector('body').appendChild(wrapper);

    wrapper.addEventListener('click', () => {
      wrapper.remove();
    }, { once: true });
  }

  static createTask(e) {
    const task = document.createElement('div');
    const input = document.createElement('input');
    const text = document.createElement('span');
    const allTasks = document.querySelector('.all-tasks');

    input.type = 'checkbox';
    task.classList.add('task');
    input.classList.add('task-name');
    text.classList.add('task-text');
    text.innerText = e.name;

    task.appendChild(input);
    task.appendChild(text);
    allTasks.appendChild(task);
  }

  pin(task) {
    const text = task.querySelector('.task-text').innerText;
    const target = this.taskList.find((e) => e.name === text);
    target.isPinned = true;
    this.pinned.appendChild(task);
    this.checkPinned();
  }

  unpin(task) {
    const text = task.querySelector('.task-text').innerText;
    const target = this.taskList.find((e) => e.name === text);
    target.isPinned = false;
    this.allTasks.appendChild(task);
    this.checkPinned();
  }

  checkPinned() {
    const pins = this.taskList.filter((e) => e.isPinned === true);
    const tasks = this.taskList.filter((e) => e.isPinned === false);
    const anchorPin = document.querySelector('.anchor-pin-text');
    const anchorTask = document.querySelector('.anchor-task-text');

    if (pins.length > 0) {
      anchorPin.classList.add('hidden');
    } else {
      anchorPin.classList.remove('hidden');
    }

    if (tasks.length > 0) {
      anchorTask.classList.add('hidden');
    } else {
      anchorTask.classList.remove('hidden');
    }
  }

  static taskFilter(name) {
    const tasksText = [...document.querySelectorAll('.task-text')];
    const anchorTask = document.querySelector('.anchor-task-text');

    tasksText.forEach((e) => {
      const containsPinned = e.closest('.task').parentElement.classList.contains('pinned');
      if (containsPinned === false) {
        if (e.textContent.startsWith(name)) {
          e.closest('.task').classList.remove('hidden');
          anchorTask.classList.add('hidden');
        } else {
          e.closest('.task').classList.add('hidden');
          // anchorTask.classList.remove('hidden');
        }
      }
    });

    tasksText.every((e, i) => {
      const containsPinned = e.closest('.task').parentElement.classList.contains('pinned');
      if (containsPinned === false) {
        if (e.closest('.task').classList.length === 1) return false;

        if (i === tasksText.length - 1) {
          anchorTask.classList.remove('hidden');
        }
      }
      return true;
    });
  }
}
