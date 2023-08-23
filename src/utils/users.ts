import _ from 'underscore';

class Users {
    users: any = [];

    setUser(userInfo: object): void {
        this.users.push(userInfo);
    }

    getUsers() {
        return this.users;
    }

    checkUserExist(id) {
        return _.some(this.getUsers(), function (item) {
            return item.id == id;
        });
    }

    changeUserName(id, username) {
        _.each(this.getUsers(), function (item) {
            if (item.id === id) {
                item.username = username;
            }
        });
    }

    deleteUser(socketId): void {
        this.users = _.without(
            this.getUsers(),
            _.findWhere(this.getUsers(), {
                id: socketId,
            }),
        );
    }

    getUsernameWithId(socketId) {
        const user = this.getUsers().find((item) => item.id === socketId);
        if (user) {
            return user.username;
        }
        return 'unknown user';
    }
}

export default new Users();
