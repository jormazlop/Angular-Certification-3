import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from "./main-page/main-page.component";

const appRoutes: Routes = [
  {
    path: '', component: MainPageComponent, title: 'Weathers'
  },
  { 
    path: 'forecast/:zipcode',
    loadChildren: () => import('./forecasts-list/forecasts-list.module').then(m => m.ForecastsListModule)
  },
  {
    path: '**', redirectTo: ''
  },
];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes, { bindToComponentInputs: true });
