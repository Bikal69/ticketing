import {Publisher,Subjects,ExpirationCompleteEvent} from '@bikalticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject=Subjects.ExpirationComplete;
}