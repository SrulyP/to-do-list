let projects = [];

function createProjectFactory(title, description, dueDate, completedStatus = false, tasksArray = []) {
    let _title = title;
    let _description = description;
    let _dueDate = dueDate;
    let _completedStatus = completedStatus;
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
        getDueDate() {
            return _dueDate;
        },
        setDueDate(newDueDate) {
            _dueDate = newDueDate;
        },
        getCompletedStatus() {
            return _completedStatus
        },
        setCompletedStatus() {
            _completedStatus = !_completedStatus;
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

export { createProjectFactory, findProjectByID }