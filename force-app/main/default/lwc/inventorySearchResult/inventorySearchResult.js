import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchfullInventory from '@salesforce/apex/InventoryController.fetchfullInventory';
import fetchFloorDetails2 from '@salesforce/apex/InventoryController.fetchfullInventory';

export default class InventorySearchResult extends LightningElement {


   // @api projectNameId;
   // @api towerName;

    @track floorsArray = [];
    @track flats = [];
    @track selectedFlatId;

    @track projectNameVal = '';
    @track towerNameVal = '';

    connectedCallback(){
        // console.log('connected callback' + this.projectNameId + this.towerName);
        // this.getFlatsData();
    }

    @api
    get towerName(){
        return this.towerNameVal;
    }

    set towerName(value){
        this.towerNameVal = value;
        this.getFlatsData();
    }

    @api
    get projectNameId(){
        return this.projectNameVal;
    }

    set projectNameId(value){
        this.projectNameVal = value;
        this.towerNameVal = '';
        this.getFlatsData();
    }

    //apex call here to get selected flats
    @api
    getFlatsData(){
        console.log('call get Flats data');
        console.log('projectNameVal : $projectNameVal --' + this.projectNameVal);
        console.log('towerNameVal: $towerNameVal --' + this.towerNameVal);
        if(this.towerNameVal != ''){
            //fetchFloorDetails2
            fetchfullInventory({project : this.projectNameVal, tower : this.towerNameVal}).then( (projectData) =>{
                this.floorsArray = [];
                this.flats = [];
              //  console.log('projectData : ' + JSON.stringify(projectData));
                for (var i = 0; i < projectData.length; i++) {
                    const flat = {
                        "Id" : projectData[i].Id,
                        "floorPlanImage__c" : projectData[i].floorPlanImage__c,
                        "Flat_feature__c" : projectData[i].Flat_feature__c,
                        "Project__c" : projectData[i].Project__c,
                        "Unit_No__c" : projectData[i].Unit_No__c,
                        "Tower__c" : projectData[i].Tower__c,
                        "Status__c" : projectData[i].Status__c
                    };
                    this.flats.push(flat);
                }            
             
            }).catch((error) =>{
                this.showToast('ERROR', "Error in Data Retrival", 'error');
            });

        }
    }

    flatSelectHandler(event){
        const flatId = event.detail;
        this.selectedFlatId = flatId;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    
    // getter property which returns a boolean if there are cars or not
    get flatsFound(){
        if(this.flats.length > 0){
            return true;
        }
        return false;
    }


}