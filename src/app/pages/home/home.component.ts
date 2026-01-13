import { Component } from '@angular/core';
import { WelcomePageComponent } from "../welcome-page/welcome-page.component";

@Component({
  selector: 'app-home',
  imports: [WelcomePageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
