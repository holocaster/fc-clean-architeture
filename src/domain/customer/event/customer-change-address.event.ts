import EventInterface from "../../@shared/event/event.interface";

export default class CustomerChangeAddressEvent implements EventInterface {
    dataTimeOccured: Date;
    eventData: any;


    constructor(eventData: any) {
        this.dataTimeOccured = new Date();
        this.eventData = eventData;
    }
}