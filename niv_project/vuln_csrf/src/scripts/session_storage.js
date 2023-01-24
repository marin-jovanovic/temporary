class SessionStorageWrapper {
    constructor() {
        this.vals = new Set([
            'username',
            'accessToken',
            'profilePhoto',
        ])
    }

    _test(variable) {
        if (!this.vals.has(variable)) {
            console.log(`[err] ${variable} not accepted, if you need it add it to acceptable values`)
            return false;
        }

        return true;
    }

    set(variable, value) {
        if (!this._test(variable)) {
            return
        }
        sessionStorage.setItem(variable, value);
    }

    get(variable) {
        if (!this._test(variable)) {
            return
        }

        return sessionStorage.getItem(variable);
    }

    remove(variable) {
        if (!this._test(variable)) {
            return
        }

        return sessionStorage.removeItem(variable);
    }
}

let ssw = new SessionStorageWrapper();

export {
    ssw,
}
