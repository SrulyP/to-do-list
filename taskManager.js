import * as Projects from './projects.js';
import * as Tasks from './tasks.js';
import * as Storage from './storage.js';

const taskManager = {
    init: function() {

        this.cacheDom();
        this.bindEvents();
        this.render();
        Storage.loadTasksFromStorage();
        Storage.loadProjectsFromStorage();
    },

    cacheDom: function() {

    },
    bindEvents: function() {

    },
    render: function() {

    },
}

function removeTaskFromProject(projectID, taskID) {
    const project = Projects.findProjectByID(projectID);
    const task = Tasks.findTaskByID(taskID);
    if (project && task) {
        const tasksArray = project.getTasks();
        const index = tasksArray.indexOf(task);
        tasksArray.splice(index, 1);
    }
}


function addTaskToProject(projectID, taskID) {
    const project = Projects.findProjectByID(projectID);
    const task = Tasks.findTaskByID(taskID)
    if (project && task) {
        project.pushTask(task);
    }
}

taskManager.init();