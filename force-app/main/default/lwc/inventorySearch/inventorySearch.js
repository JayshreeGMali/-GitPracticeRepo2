import { LightningElement, track } from 'lwc';

export default class InventorySearch extends LightningElement {


    @track projectNameId = '';
    @track towerName = '';

    // Will be called from inventorySearchForm 
    projectNameSelectHandler(event){
        this.projectNameId = event.detail;
        console.log('projectNameId' + this.projectNameId);
        this.towerName = '';
    }

    towerSelectHandler(event){
        this.towerName = event.detail;
        console.log('towerName' + this.towerName);
    }

}