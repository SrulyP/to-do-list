let projects = [createProjectFactory()];

function createProjectFactory(title, description=null, tasksArray=[]) {
    let _title = title;
    let _description = description;
    let _tasksArray = tasksArray;
    let _id = crypto.randomUUID();

    return {
        getTitle() { 
            return _title;
        },
        setTitle(newTitle) { 
            _title = newTitle; 
        },
        getDescription() {
            return _description;
        },
        setDescription(newDescription) {
            _description = newDescription;
        },
        getTasks() {
            return _tasksArray;
        },
        pushTask(task) {
            return _tasksArray.push(task);
        },
        getID() {
            return _id;
        }
    }
}

function findProjectByID(projectID) {
    for (const project of projects) {
        if (project.getID() === projectID) {
            return project;
        }
    }
    return null;
}

function deleteProject(projectID) {
    const project = findProjectByID(projectID);
    const index = projects.indexOf(project);
    projects.splice(index, 1);
}

export { createProjectFactory, findProjectByID, deleteProject }