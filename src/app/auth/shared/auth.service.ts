import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) { }

    // getProducts() {
    //     return products
    // }

    register(userData: any): Observable<any> {
        return this.http.post('/api/v1/users/register', userData)
    }

    login(userData: any): Observable<any> {
        return this.http.post('/api/v1/users/login', userData)
    }
}