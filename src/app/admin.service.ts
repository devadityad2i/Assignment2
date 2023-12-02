import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Row } from './row.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  getData(): Observable<Row[]> {
    return this.http.get<Row[]>('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
  }
}
