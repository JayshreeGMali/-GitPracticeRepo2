import { LightningElement, wire, track, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

import FLAT_ID from '@salesforce/schema/Inventory__c.Id';
import FLAT_PROJECT from '@salesforce/schema/Inventory__c.Project__c';
import FLAT_TOWER from '@salesforce/schema/Inventory__c.Tower__c';
import FLAT_USABLE_AREA from '@salesforce/schema/Inventory__c.Usable_Area__c';
import FLAT_COST from '@salesforce/schema/Inventory__c.Flat_Cost__c';
import FLAT_UNIT_NO from '@salesforce/schema/Inventory__c.Unit_No__c';
import FLAT_FEATURE from '@salesforce/schema/Inventory__c.Flat_feature__c';
import FLAT_STATUS from '@salesforce/schema/Inventory__c.Status__c';
import FLAT_IMAGE from '@salesforce/schema/Inventory__c.floorPlanImage__c';

const fields = [
    FLAT_ID,
    FLAT_PROJECT,
    FLAT_TOWER,
    FLAT_USABLE_AREA,
    FLAT_COST,
    FLAT_UNIT_NO,
    FLAT_FEATURE,
    FLAT_STATUS,
    FLAT_IMAGE
];

export default class FlatDetails extends LightningElement {

    @track flatId;
    @track selectedTabValue;
    
    @wire(CurrentPageReference) pageRef;

    // get record using Lightning data service lightning/uiRecordApi
    @wire(getRecord, { recordId : '$flatId', fields})
    flat;

    @track recordIdVal;


    @api
    get recordId(){
        return this.recordIdVal;
    }

    set recordId(value){
        this.recordIdVal = value;
        console.log("In flat details record Id " + this.recordIdVal);
    }


    // connectedCallback provided by pubsub lib for catching the events fired by another component
    // it executes as soon as component is loaded into the DOM
    connectedCallback(){
        registerListener('flatselect', this.callBackMethod, this);
    }

    callBackMethod(payload){
        this.flatId = payload.Id;
    }

    // provided by pubsub lib
    disconnectedCallback(){
        unregisterAllListeners(this);
    }

    // called on Tab selection
    tabChangeHandler(event){
        this.selectedTabValue = event.target.value;
    }

    // returns a boolean when car array has data in it
    get flatFound(){
        if(this.flat.data){
            return true;
        }
        return false;
    }

}