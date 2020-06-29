trigger Customer_InventoryTrigger on Customer_Inventory__c (after insert){

if(Trigger.isInsert){

Set<Id> invertory;

for(Customer_Inventory__c  ci : trigger.new){
         invertory.add(ci.Inventory__c); 
    }
    

  Map<String,List<String>> statusMap = new Map<String,List<String>>();
    Map<String,String> statusFnMap = new Map<String,String>();
    for (Customer_Inventory__c cinv:[select Inventory__c ,Status__c from Customer_Inventory__c WHERE Inventory__c=:invertory LIMIT 1000]){ 
            if (statusMap.containsKey(cinv.Inventory__c)){
            statusMap.get(cinv.Inventory__c ).add(cinv.Status__c);
        }
        else
        {
            statusMap.put(cinv.Inventory__c,new List<String>{cinv.Status__c});
        }
    }
    
    String strBooked='Booked';
    String strReserved='Reserved';
    String strInterested='Interested';
    
 for(String idValue : statusMap.keyset())
{
     for(String s : statusMap.get(idValue ))
     {
            if (s.equals(strBooked))
            {
                if (statusFnMap.containsKey(idValue)){
                  String a = statusFnMap.remove(idValue);
                  statusFnMap.put(idValue,strBooked);  
                }
                else{
                    
                    statusFnMap.put(idValue,strBooked);
                }
            }
            else if (s.equals(strReserved))
            {
                if (statusFnMap.containsKey(idValue)){
                    if (statusFnMap.get(idValue)!=strBooked){
                         String a = statusFnMap.remove(idValue);
                        statusFnMap.put(idValue,strReserved);
                    }
                }
                else{
                    statusFnMap.put(idValue,strReserved); 
                }
            }
            else if (s.equals(strInterested))
            {
                if (statusFnMap.containsKey(idValue)){
                   
                    
                }
                else{
                    statusFnMap.put(idValue,strInterested); 
                }
                
            }

     }
}


//List<Inventory__c> InvList = [SELECT Id,Status__c FROM Inventory__c WHERE Id IN =: invertory LIMIT 1000];

List<Inventory__c> InvupdList;

for (Inventory__c inv1 : [SELECT Id,Status__c FROM Inventory__c WHERE Id =: invertory LIMIT 1000]){
Inventory__c inv2 = new Inventory__c ();
inv2.Id =  inv1.Id;
inv2.Status__c = statusFnMap.get(inv1.Id);
InvupdList.add(inv2);
 
}

update InvupdList;    
    
}

 
}