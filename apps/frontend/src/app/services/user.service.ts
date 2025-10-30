import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/user`;
  constructor(
    private http: HttpClient
  ) {

  }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  }

  getUserByEmail(email: string, token: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/getUserByEmail`, email, {
      headers: this.getAuthHeaders(token)
    });
  }

  getCurrentUser(token: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/getCurrentUser`, {
      headers: this.getAuthHeaders(token)
    })
  }
}
