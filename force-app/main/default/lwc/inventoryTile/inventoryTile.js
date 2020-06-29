import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class InventoryTile extends LightningElement {


    @api flat;
    @api flatSelectedId;

    // required for firing an event publically for other components using pubsub
    @wire(CurrentPageReference) pageRef;


    // This method executes on click on Grid Item
    handleFlatSelect(event){
        event.preventDefault();

        const flatId = this.flat.Id;

        // dispatching event to parent component inventorySearchResult
        const flatSelect = new CustomEvent('flatselect', {detail:flatId});
        this.dispatchEvent(flatSelect);

        // dispatching event to other components publically using pubsub library
        fireEvent(this.pageRef, 'flatselect', this.flat);
    }

    get isInterested(){
        if(this.flat.Status__c === 'Interested'){
            return true;
        } 
        return false;
    }

    get isBooked(){
        if(this.flat.Status__c === 'Booked'){
            return true;
        } 
        return false;
    }

    get isReserved(){
        if(this.flat.Status__c === 'Reserved'){
            return true;
        } 
        return false;
    }

    get isStatusEmpty(){
        if(this.flat.Status__c === ''){
            return true;
        } 
        return false;
    }

    // returns the flag to set css properties to Grid Item e.g blue border
    get isFlatSelected(){
        if(this.flat.Id === this.flatSelectedId){
            return "tooltip tile selected";
        }
        return "tooltip tile";
    }

    get getTooltipStatement(){
        // if(this.flat.Status__c === 'Booked'){
        //     return 'This flat is already booked';
        // }else{
        //     return 'This flat is available for booking';
        // }
        return this.flat.Flat_feature__c;
    }

}