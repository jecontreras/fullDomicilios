import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';

import {AutoCompleteService} from 'ionic4-auto-complete';

@Injectable()
export class CompleteTestService implements AutoCompleteService {
  labelAttribute = 'name';
  formValueAttribute = 'numericCode';

  constructor(private http:HttpClient) {
  
  }

  getResults(keyword:string) {
     if (!keyword) { return false; }

     return this.http.get('https://restcountries.eu/rest/v2/name/' + keyword).pipe(map(
        (result: any[]) => {
           return result.filter(
              (item) => {
                 return item.name.toLowerCase().startsWith(
                    keyword.toLowerCase()
                 );
              }
           );
        }
     ));
  }
}