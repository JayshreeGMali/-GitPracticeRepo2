({
    navigateToinventorySearchCmp : function(component, event, helper) {
       component.set("v.recdId", component.get("v.recordId"));
       /*
        var evt = $A.get("e.force:navigateToComponent");
        
        evt.setParams({
            componentDef : "c:InventoryData",
            componentAttributes: {
            boId : component.get("v.recordId")
          }
        });
        evt.fire();
        */
        
         
        
       
        var pageReference = {
            type: 'standard__component',
            attributes: {
                componentName: 'c__InventoryData',
            },
            state: {
                "rid": component.get("v.recdId")
            }
        };
        component.set("v.pageReference", pageReference);
        var navService = component.find("navigationService");
        navService.navigate(pageReference);
      
    } 
})