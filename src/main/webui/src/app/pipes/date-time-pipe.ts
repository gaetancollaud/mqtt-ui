import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {
  transform(value: string|Date|undefined): string|undefined {
    if(!value){
      return undefined;
    }
    const date = new Date(value);
    return date.toLocaleString();
  }

}
