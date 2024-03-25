import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiResponse } from './interfaces/apiResponse.type';

@Component({
    selector: 'app-form',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    imports: [ReactiveFormsModule, CommonModule],
})
export class FormComponent {
    constructor(protected httpClient: HttpClient) {}

    loading: boolean = false;
    flightBriefingForm: FormGroup;

    ngOnInit() {
        this.flightBriefingForm = new FormGroup(
            {
                messageTypes: new FormGroup(
                    {
                        METAR: new FormControl(false),
                        SIGMET: new FormControl(false),
                        TAF: new FormControl(false),
                    },
                    requiredOneMessageType()
                ),
                airports: new FormControl('', [Validators.pattern('^([A-Z]{4}(?: [A-Z]{4})*)?$')]),
                countries: new FormControl('', [Validators.pattern('^([A-Z]{2}(?: [A-Z]{2})*)?$')]),
            },
            requireOneControl()
        );
    }

    onSubmit() {
        this.loading = true;
        const messageData = this.flightBriefingForm.value.messageTypes;
        const messageTypes = Object.keys(messageData).filter(key => messageData[key]);

        const stations = this.flightBriefingForm.value.airports?.split(' ').filter(Boolean);
        const countries = this.flightBriefingForm.value.countries?.split(' ').filter(Boolean);

        let params = [
            {
                id: 'briefing01',
                reportTypes: messageTypes,
                stations: stations,
                countries: countries,
            },
        ];

        if (!stations?.length) delete params[0].stations;
        if (!countries?.length) delete params[0].countries;

        this.httpClient
            .post(
                'https://ogcie.iblsoft.com/ria/opmetquery',
                JSON.stringify({ id: 'query01', method: 'query', params: params })
            )
            .subscribe({
                next: (res: any) => {
                    this.loading = false;
                    this.messageEvent.emit(res['result']);
                },
                error: (err: any) => console.log('HTTP Error', err),
            });
    }

    @Output() messageEvent = new EventEmitter<ApiResponse[]>();
}

const requiredOneMessageType = () => {
    return (formGroup: any) => {
        if (!Object.keys(formGroup.value).some(messageType => !!formGroup.value[messageType])) {
            return { incorrect: true };
        }

        return null;
    };
};

const requireOneControl = () => {
    return (formGroup: any) => {
        if (!formGroup.controls.airports?.value && !formGroup.controls.countries?.value) {
            return { required: 'at least one of the items is required' };
        }
        return null;
    };
};
