import * as Tasks from './tasks.js';
import * as Projects from './projects.js';

const storage = {
    loadTasksFromStorage: function() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks);
            Tasks.tasks.length = 0; 
            parsedTasks.forEach(taskData => {
                const task = Tasks.createTask(
                    taskData.title,
                    taskData.description,
                    taskData.dueDate,
                    taskData.priority,
                    taskData.project,
                    taskData.completedStatus,
                    taskData.id
                );
                Tasks.tasks.push(task);
            });
        } else {
            Tasks.tasks.push(firstTask, secondTask);
            this.saveTasksToStorage();
        }
    },

    loadProjectsFromStorage: function() {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects);
            Projects.projects.length = 0;
            parsedProjects.forEach(projectData => {
                const project = Projects.createProjectFactory(
                    projectData.title,
                    projectData.description,
                    projectData.tasksArray,
                    projectData.id
                );
                Projects.projects.push(project);
            });
        } else {
            this.saveProjectsToStorage();
        }
    },

    saveTasksToStorage: function() {
        const tasksData = Tasks.getTasks().map(task => ({
            title: task.getTitle(),
            description: task.getDescription(),
            dueDate: task.getDueDate(),
            priority: task.getPriority(),
            project: task.getProject(),
            completedStatus: task.getCompletedStatus(),
            id: task.getID()
        }));
        localStorage.setItem('tasks', JSON.stringify(tasksData));
    },

    saveProjectsToStorage: function() {
        const projectsData = Projects.getProjects().map(project => ({
            title: project.getTitle(),
            description: project.getDescription(),
            tasksArray: project.getTasks(),
            id: project.getID()
        }));
        localStorage.setItem('projects', JSON.stringify(projectsData));
    }

};

export { storage };