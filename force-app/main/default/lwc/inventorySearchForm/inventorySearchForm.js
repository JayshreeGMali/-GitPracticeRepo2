import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
//import getselectOptions from '@salesforce/apex/InventoryController.getselectOptions';

export default class InventorySearchForm extends NavigationMixin(LightningElement) {


    @track projectNames = [{value:'Ambrose', label:'Ambrose'},{value:'Amanora', label:'Amanora'},{value:'Antilia', label:'Antilia'}];
    @track towerNames = [{value:'Tower A', label:'Tower A'},{value:'Tower B', label:'Tower B'},{value:'Tower C', label:'Tower C'}];

    // Apex call to fetch the dropdown data
    // @api
    // getProjectNames(){
    //     getselectOptions({objObject : '', fld : ''}).then( (projectData) =>{
    //         console.log('projectData : ' + projectData);
    //         this.projectNames = [{value:'', label:'--- None ---'}];
    //         data.forEach(element => {
    //             const projectName = {};
    //             projectName.label = element.Name;
    //             projectName.value = element.Id;
    //             this.projectNames.push(projectName);
    //         });
    //     }).catch((error) =>{
    //         this.showToast('ERROR', error.body.message, 'error');
    //     })
    // }

    projectSelectedValue = '';
    towerSelectedValue = '';
    isProjectSelectedVal = false;

    handleProjectNameChange(event){
        const projectId = event.detail.value;
        this.projectSelectedValue = event.detail.value;
        this.isProjectSelectedVal = true;
        this.towerSelectedValue = '';
        // sending event to parent component inventorySearch    
        const projectNameSelectionChangeEvent = new CustomEvent('projectnameselect', {detail : projectId});
        this.dispatchEvent(projectNameSelectionChangeEvent);
    }

    handleTowerNameChange(event){
        const towerName = event.detail.value;
        this.towerSelectedValue = event.detail.value;
        // sending event to parent component carSearch    
        const towerSelectionChangeEvent = new CustomEvent('towernameselect', {detail : towerName});
        this.dispatchEvent(towerSelectionChangeEvent);
    }


    get isProjectSelected(){
        if(this.isProjectSelectedVal){
            return true;
        }
        return false;
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