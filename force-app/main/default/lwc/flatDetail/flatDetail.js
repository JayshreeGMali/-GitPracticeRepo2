import { LightningElement, api } from 'lwc';
import insertselectedFlatInventory from '@salesforce/apex/InventoryController.insertselectedFlatInventory';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FlatDetail extends LightningElement {

    @api flat;

    @api recordId;
    actionVal = '';

    connectedCallback(){
        console.log('Flat detail page record Id : ' + this.recordId);
    }

    get projectName(){
        try{
            return this.flat.data.fields.Project__c.value;
        }catch(error){
            return 'NA';
        }
    }

    get towerName(){
        try{
            return this.flat.data.fields.Tower__c.value;
        }catch(error){
            return 'NA';
        }
    }

    get unitNumber(){
        try{
            return this.flat.data.fields.Unit_No__c.value;
        }catch(error){
            return 'NA';
        }
    }

    get usableArea(){
        try{
            return this.flat.data.fields.Usable_Area__c.value;
        }catch(error){
            return 'NA';
        }
    }

    get flatCost(){
        try{
            return this.flat.data.fields.Flat_Cost__c.value;
        }catch(error){
            return 'NA';
        }
    }

    get flatFeature(){
        try{
            return this.flat.data.fields.Flat_feature__c.value;
        }catch(error){
            return 'NA';
        }
    }

    get status(){
        try{
            return this.flat.data.fields.Status__c.value;
        }catch(error){
            return 'NA';
        }
    }

    get flatPic(){
        try{
            return this.flat.data.fields.floorPlanImage__c.value;
        }catch(error){
            return 'NA';
        }
    }

    handleAction(event){
        const actionItem = event.target.label;
        console.log('Button clicked', actionItem);
        this.actionVal = '';
        if(actionItem == 'Interested'){
            this.actionVal = 'Interested';
        }else if(actionItem == 'Book'){
            this.actionVal = 'Booked';
        }else{
            this.actionVal = 'Reserved';
        }
        // call to handle business logic
        this.callInsertAPI();
    }

    @api
    callInsertAPI(){
        console.log('insertAction' + this.actionVal);
        insertselectedFlatInventory({oppId : this.recordId, invId : this.flat.data.fields.Id.value, status : this.actionVal}).then( (result) =>{
            console.log('Result data : ' + JSON.stringify(result));
        }).catch((error) =>{
            this.showToast('ERROR', "Error in Data Retrival", 'error');
        });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }


}