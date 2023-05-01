import _ from 'underscore';

class Users {
    users: any = [];

    setUser(userInfo: object) {
        this.users.push(userInfo);
    }

    getUsers() {
        return this.users;
    }

    deleteUser(socketId) {
        this.users = _.without(
            this.getUsers(),
            _.findWhere(this.getUsers(), {
                id: socketId,
            }),
        );
    }
}

export default new Users();
