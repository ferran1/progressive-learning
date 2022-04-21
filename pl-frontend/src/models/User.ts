export class User {

    id?: number
    firstName: string
    lastName: string
    email: string
    password: string
    admin: boolean
    aboutMe: string | undefined
    profilePicture: string | undefined

    constructor(email: string, password: string, firstName: string, lastName: string, admin: boolean,
                id?: number) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.admin = admin;
        this.id = id;
    }

    getName(): string {
        return this.firstName + " " + this.lastName;
    }



}
