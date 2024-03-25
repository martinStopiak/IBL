import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { FormComponent } from './form/form.component';
import { ResultTableComponent } from './result-table/result-table.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, FormComponent, ResultTableComponent, HttpClientModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title: string = 'iblApp';
    tableIsVisible: boolean = false;
    tableData: any = [];
    receiveMessage($event: any) {
        this.tableData = $event;
        this.tableIsVisible = true;
    }
}
