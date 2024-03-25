import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableData } from './interfaces/tableData.type';

@Component({
    selector: 'app-result-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './result-table.component.html',
    styleUrl: './result-table.component.scss',
})
export class ResultTableComponent {
    @Input() tableData: TableData[];
    groupedData: TableData[][] = [];
    noData: boolean = false;
    validFrom: boolean = false;
    validTo: boolean = false;

    ngOnChanges() {
        if (!this.tableData) return;
        this.noData = !this.tableData.length ? true : false;
        this.groupedData = [];
        this.sortData();
        this.convertTimes();
        this.highlightText();
        this.groupData();
    }

    private sortData() {
        this.tableData.sort((a, b) => a.stationId.toLowerCase().localeCompare(b.stationId.toLowerCase()));
    }

    private convertTimes() {
        this.tableData.forEach(obj => {
            const reportTime = new Date(obj.reportTime);
            obj.reportTime = reportTime.toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' });

            if (obj.validFrom) {
                console.log('brm');
                const validFromTime = new Date(obj.validFrom);
                obj.validFrom = validFromTime.toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' });
            }

            if (obj.validTo) {
                const validToTime = new Date(obj.validTo);
                obj.validTo = validToTime.toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' });
            }
        });
    }

    private highlightText() {
        this.tableData.forEach(obj => {
            obj.text = obj.text.replace(/\b(BKN|FEW|SCT)(\d{3})\b/g, (match, p1, p2) => {
                const num = parseInt(p2);
                const color = num <= 30 ? 'Blue' : 'Red';
                return `<span class="highlight${color}">${match}</span>`;
            });
        });
    }

    private groupData() {
        let currentGroup: TableData[] = [];

        this.tableData.forEach((obj, index) => {
            if (index === 0 || obj.stationId !== this.tableData[index - 1].stationId) {
                if (currentGroup.length > 0) {
                    this.groupedData.push([...currentGroup]);
                }
                currentGroup = [obj];
            } else {
                currentGroup.push(obj);
            }
        });

        if (currentGroup.length > 0) {
            this.groupedData.push([...currentGroup]);
        }
    }

    showValidFrom() {
        this.validFrom = !this.validFrom;
    }

    showValidTo() {
        this.validTo = !this.validTo;
    }
}
