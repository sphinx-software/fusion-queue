class Task {

    setParam(...param) {
        this.param = param;
        return this;
    }

    setExec(handler) {
        this.handler = handler;
        return this;
    }

    exec() {
        return this.handler(...param);
    }

}

module.exports = Task;