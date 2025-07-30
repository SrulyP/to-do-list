let projects = [];

function createProjectFactory(title, description=null, tasksArray=[], id=null) {
    let _title = title;
    let _description = description;
    let _tasksArray = tasksArray;
    let _id;
    if (id === null) {
        _id = crypto.randomUUID();
    } else {
        _id = id;
    }
    
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
    if (project) {
        projects.splice(index, 1);
    }
}

function getProjects() {
    return projects;
}

function initializeDefaultProjects() {
    if (projects.length === 0) {
        const cake = createProjectFactory("Bake a cake", "Buy the ingredients to bake a cake");
        const cookies = createProjectFactory("Cookies", "Finish the cookies in the fridge");
        projects.push(cake, cookies);
    }
}

initializeDefaultProjects();

export { createProjectFactory, findProjectByID, deleteProject, getProjects, projects, initializeDefaultProjects }