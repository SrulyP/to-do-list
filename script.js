function createToDo(title, description, dueDate, priority, project, completedStatus = false) {
    let _title = title;
    let _description = description;
    let _dueDate = dueDate;
    let _priority = priority;
    let _project = project;
    let _completedStatus = completedStatus;
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
        getPriority() {
            return _priority;
        },
        setPriority(newPriority) {
            _priority = newPriority;
        },
        getProject() {
            return _project;
        },
        setProject(newProject) {
            _project = newProject;
        },
        getCompletedStatus() {
            return _completedStatus
        },
        setCompletedStatus() {
            _completedStatus = !_completedStatus;
        },
        getID() {
            return _id;
        }
    }
}

