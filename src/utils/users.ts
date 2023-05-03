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

    getUsernameWithId(socketId) {
        const user = this.getUsers().find((item) => item.id === socketId);
        if (user) {
            return user.username;
        }
        return 'unknown user';
    }
}

export default new Users();
