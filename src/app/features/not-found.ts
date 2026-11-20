import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <h1 tabindex="-1">Page not found</h1>
    <p>This address doesn't match any page. <a routerLink="/">See all events</a>.</p>
  `,
})
export default class NotFound {
  constructor() {
    inject(Title).setTitle('Page not found · Live odds');
  }
}
