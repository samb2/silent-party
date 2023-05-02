import _ from 'underscore';

class Users {
    users: any = [];

    setUser(userInfo: object): void {
        this.users.push(userInfo);
    }

    getUsers() {
        return this.users;
    }

    deleteUser(socketId): void {
        this.users = _.without(
            this.getUsers(),
            _.findWhere(this.getUsers(), {
                id: socketId,
            }),
        );
    }
}

export default new Users();
