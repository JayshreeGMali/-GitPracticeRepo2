({
    
  fetchPickListVal : function(component){
     
        var action = component.get("c.getPicklistvalues");
        action.setParams({
            'objectName': component.get("v.ObjectName"),
            'field_apiname': component.get("v.Status"),
            'nullRequired': true // includes --None--
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.StatusPicklist", a.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
    }, 
    
  fetchProjectPicklist : function(component){
        var action = component.get("c.getPicklistvalues");
        action.setParams({
            'objectName': component.get("v.InventoryObjectName"),
            'field_apiname': component.get("v.Project"),
            'nullRequired': true // includes --None--
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.ProjectPicklist", a.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
    },
    
  fetchTowerPicklist : function(component){
        var action = component.get("c.getPicklistvalues");
        action.setParams({
            'objectName': component.get("v.InventoryObjectName"),
            'field_apiname': component.get("v.Tower"),
            'nullRequired': true // includes --None--
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.TowerPicklist", a.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
    },
    
  fetchInventoryData : function(component){
      
     /* var Tower = component.get("v.Tower");
      var TowerVal = Tower.get("v.value");
      var Project = component.get("v.Project");
      var ProjectVal = Project.get("v.value");
      */
        var action = component.get("c.fetchInventory");
       
        action.setParams({
            'project': 'Ambrose',
            'tower': 'Tower A'
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.InventoryList", a.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
    },
    
  fetchfloorDetails : function(component,event,helper){
      
      component.set("v.opportunityId", component.get("v.recordId"));
       var controllerValueKey = event.getSource().get("v.value"); // get selected controller field value
       component.set("v.selectedtower" , controllerValueKey);
      
      var proj = component.get("v.selectedproj");
      var action = component.get("c.fetchFloorDetails");
        action.setParams({
            'project': proj,
            'tower': controllerValueKey
        });  
        action.setCallback(this, function(response){
            var arrayMapKeys = [];
            var lst = [];
            var result = response.getReturnValue();
           /* for(var key in result){
                //arrayMapKeys.push({key:key, key0: key.split('-')[0], key1:key.split('-')[1], value:result[key]});
                arrayMapKeys.push({key:key, value :result[key]});
            }*/
            
            for(var key in result){
                //arrayMapKeys.push({key:key, key0: key.split('-')[0], key1:key.split('-')[1], value:result[key]});
                arrayMapKeys.push({key:key, value :result[key]});
            }
           /* for(var i=0; i<result.length; i++){
                
                   let username = result[i].split('-')[0];
                  // arrayMapKeys.push({value:username, key:result[i]});
                   arrayMapKeys.push({key:key, value :result[key].split('_')[0]});
            }*/

            
            component.set("v.housingMap", arrayMapKeys);
        });
      
        $A.enqueueAction(action);
        this.FetchstatusDetails(component);
    },   
  
  FetchstatusDetails :function(component,event,helper){
     
      var action = component.get("c.fetchStatusDetails");
      var proj = component.get("v.selectedproj");
      var tower = component.get("v.selectedtower");
        action.setParams({
            'project': proj,
            'tower': tower
        });  
        action.setCallback(this, function(response){
            var arrayMapKeys1 = [];
            var result = response.getReturnValue();
            for(var key in result){
                //arrayMapKeys.push({key:key, key0: key.split('-')[0], key1:key.split('-')[1], value:result[key]});
                arrayMapKeys1.push({key:key, value :result[key]});
            }
            component.set("v.statusMap", arrayMapKeys1);
        });
      
        $A.enqueueAction(action);
        
    },     
 
  fetchSelectedFlatDetails : function(component){
      var action = component.get("c.fetchselectedFlatInventory"); 
      var proj = component.get("v.selectedproj");
      var tower = component.get("v.selectedtower");
      action.setParams({
            'project': proj,
            'tower': tower,
            'flatno': component.get("v.selectedflat") 
        }); 
      
       action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                var result = a.getReturnValue();
                component.set("v.selectInventoryList", result);
                
                component.set("v.selectedinvId",result[0].Id);
            } 
        });
        $A.enqueueAction(action);
      
    },
    
 insertSelectedFlatDetails : function(component,event,helper){
        var action = component.get("c.insertselectedFlatInventory"); 
        var btnValue1 = event.getSource().get("v.name");
     
        var oppId = component.get("v.selectedflat");
        action.setParams({
            'oppId': component.get("v.opportunityId"),
            'invId': component.get("v.selectedinvId"),
            'status': btnValue1 
        });
         action.setCallback(this, function(a) {
            var state = a.getState();
         if (state === "SUCCESS"){
                //Success message display logic.
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Record has been saved Successfully."
                });
                toastEvent.fire();
                var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                      "recordId": component.get("v.opportunityId"),
                      "slideDevName": "related"
                    });
                    navEvt.fire();
             
             
            }else if (state === "INCOMPLETE") {
                //Offline message display logic.
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "OFFLINE!",
                    "message": "You are in offline."
                });
                toastEvent.fire();
            }else if (state === "ERROR") {
                //Error message display logic.
                var errors = response.getError();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "ERROR!",
                    "message": errors[0].message
                });
                toastEvent.fire();
            }else {
                //Unknown message display logic.
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "UNKOWN!",
                    "message": "Unknown error."
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    
  fetchPicklistValues: function(component,objDetails,controllerField, dependentField) {
        // call the server side function  
        var action = component.get("c.getDependentMap");
        // pass paramerters [object definition , contrller field name ,dependent field name] -
        // to server side function 
        action.setParams({
            'objDetail' : objDetails,
            'contrfieldApiName': controllerField,
            'depfieldApiName': dependentField 
        });
        //set callback   
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                //store the return response from server (map<string,List<string>>)  
                var StoreResponse = response.getReturnValue();
                
                // once set #StoreResponse to depnedentFieldMap attribute 
                component.set("v.depnedentFieldMap",StoreResponse);
                
                // create a empty array for store map keys(@@--->which is controller picklist values) 
                var listOfkeys = []; // for store all map keys (controller picklist values)
                var ControllerField = []; // for store controller picklist value to set on lightning:select. 
                
                // play a for loop on Return map 
                // and fill the all map key on listOfkeys variable.
                for (var singlekey in StoreResponse) {
                    listOfkeys.push(singlekey);
                }
                
                //set the controller field value for lightning:select
                if (listOfkeys != undefined && listOfkeys.length > 0) {
                    ControllerField.push('--- None ---');
                }
                
                for (var i = 0; i < listOfkeys.length; i++) {
                    ControllerField.push(listOfkeys[i]);
                }  
                // set the ControllerField variable values to country(controller picklist field)
                component.set("v.listControllingValues", ControllerField);
            }else{
                alert('Something went wrong..');
            }
        });
        $A.enqueueAction(action);
    },
    
    fetchDepValues: function(component, ListOfDependentFields) {
        // create a empty array var for store dependent picklist values for controller field  
        var dependentFields = [];
        dependentFields.push('--- None ---');
        for (var i = 0; i < ListOfDependentFields.length; i++) {
            dependentFields.push(ListOfDependentFields[i]);
        }
        // set the dependentFields variable values to store(dependent picklist field) on lightning:select
        component.set("v.listDependingValues", dependentFields);
        
    },  
    
})