({
	doInit: function(component, event, helper) {
       // helper.fetchPickListVal(component);
       // helper.fetchProjectPicklist(component);
       // helper.fetchTowerPicklist(component);
        component.set("v.displayedSection","hide");
        
        
         // get the fields API name and pass it to helper function  
        var controllingFieldAPI = component.get("v.controllingFieldAPI");
        var dependingFieldAPI = component.get("v.dependingFieldAPI");
        var objDetails = component.get("v.objDetail");
        // call the helper function
        helper.fetchPicklistValues(component,objDetails,controllingFieldAPI, dependingFieldAPI);
        
    },
    onControllerFieldChange: function(component, event, helper) {     
        var controllerValueKey = event.getSource().get("v.value"); // get selected controller field value
        component.set("v.selectedproj" , controllerValueKey);
         component.set("v.displayedSection","hide");
        component.set("v.displayedFlatSection","hide");
         
        var depnedentFieldMap = component.get("v.depnedentFieldMap");
        
        if (controllerValueKey != '--- None ---') {
            var ListOfDependentFields = depnedentFieldMap[controllerValueKey];
            
            if(ListOfDependentFields.length > 0){
                component.set("v.bDisabledDependentFld" , false);  
                helper.fetchDepValues(component, ListOfDependentFields);    
            }else{
                component.set("v.bDisabledDependentFld" , true); 
                component.set("v.listDependingValues", ['--- None ---']);
            }  
            
        } else {
            component.set("v.listDependingValues", ['--- None ---']);
            component.set("v.bDisabledDependentFld" , true);
        }
    },
    onTowerChange: function(component, event, helper) {
         // helper.fetchInventoryData(component);
        helper.fetchfloorDetails(component, event, helper);
        component.set("v.displayedSection","hide");
        component.set("v.displayedFlatSection","show");
    },
   displaydata:function(component,event,helper){    
	   component.set("v.displayedSection","show");
       var btnValue = event.getSource().get("v.value");
       component.set("v.selectedflat",btnValue);
       helper.fetchSelectedFlatDetails(component);
  
  },
  insertinvdata:function(component,event,helper){
      helper.insertSelectedFlatDetails(component,event,helper);
  },
})