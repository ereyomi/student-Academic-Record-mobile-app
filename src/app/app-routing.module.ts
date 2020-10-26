import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SelectOptionResolverService } from './services/resolver/select-option-resolver.service';

const routes: Routes = [

    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
    },
    {
        path: 'select/:type',
        loadChildren: () => import('./pages/select-page/select-page.module').then(m => m.SelectPagePageModule),
        resolve: { data: SelectOptionResolverService }
    },
    {
        path: 'record',
        loadChildren: () => import('./pages/record-page/record-page.module').then(m => m.RecordPagePageModule)
    },
    {
        path: 'score',
        loadChildren: () => import('./layout/score/score.module').then(m => m.ScorePageModule)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'view-result',
        loadChildren: () => import('./pages/view-result/view-result.module').then(m => m.ViewResultPageModule)
    },
    {
        path: 'header',
        loadChildren: () => import('./layout/header/header.module').then(m => m.HeaderPageModule)
    },

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
