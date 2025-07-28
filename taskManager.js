import * as Projects from './projects.js';
import * as Tasks from './tasks.js';


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
    if (project && task) {
        const task = Tasks.findTaskByID(taskID)
    }
    project.pushTask(task);
}