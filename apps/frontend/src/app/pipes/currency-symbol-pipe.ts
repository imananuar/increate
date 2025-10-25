import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {

  private currencyMap: Record<string, string> = {
    MYR: 'RM',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    SGD: 'S$',
    IDR: 'Rp'
    // Add more mappings as needed
  };

  transform(amount: string, currencyCode: string = 'MYR', digits: string = '1.2-2'): string {
    const symbol = this.currencyMap[currencyCode] || currencyCode;
    // const formatted = amount.toLocaleString('en-MY', {
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 2
    // });
    return `${symbol} ${amount}`;
  }

}
