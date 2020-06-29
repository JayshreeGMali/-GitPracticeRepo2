public class InventoryController {
    
@AuraEnabled
public static List < String > getselectOptions(sObject objObject, string fld) {
 system.debug('objObject --->' + objObject);
 system.debug('fld --->' + fld);
 List < String > allOpts = new list < String > ();
 
 Schema.sObjectType objType = objObject.getSObjectType();
 Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
 map < String, Schema.SObjectField > fieldMap = objDescribe.fields.getMap();
 
 list < Schema.PicklistEntry > values =
  fieldMap.get(fld).getDescribe().getPickListValues();
 
 for (Schema.PicklistEntry a: values) {
  allOpts.add(a.getValue());
 }
 system.debug('allOpts ---->' + allOpts);
 allOpts.sort();
 return allOpts;
} 
@AuraEnabled
public static List<String> getPicklistvalues(String objectName, String field_apiname,Boolean nullRequired){
        List<String> optionlist = new List<String>();       
        Map<String,Schema.SObjectType> gd = Schema.getGlobalDescribe(); 
        Map<String, Schema.SObjectField> field_map = gd.get(objectName.toLowerCase()).getDescribe().fields.getMap();        
        List<Schema.PicklistEntry> picklistValues = field_map.get(field_apiname).getDescribe().getPickListValues();       
        if(nullRequired == true){
            optionlist.add('--None--');
        }       
        for (Schema.PicklistEntry pv : picklistValues) {
            optionlist.add(pv.getValue());
        }
        return optionlist;
    }
@AuraEnabled
public static List <Inventory__c> fetchInventory(String project ,String tower) {
    
    System.debug('************ project: ************ ' + project);
    System.debug('************ tower: ************ ' + tower);
        Integer maxno;
        List<Inventory__c> InventoryfinList = new List<Inventory__c>();
        List<Inventory__c> InventoryList = [SELECT Id, Unit_No__c,Tower__c,Project__c,Floor__c from Inventory__c WHERE Project__c=:project and Tower__c=:tower order by Floor__c ASC LIMIT 1000];
       System.debug('************ InventoryList: ************ ' + InventoryList);
        /*
         list<AggregateResult> AggregateResultList1=[select Project__c,sum(Floor__c)nos from Inventory__c WHERE Project__c=:project and Tower__c=:tower group by Project__c];
        if(AggregateResultList1!= null && AggregateResultList1.size() > 0){ 
           for(AggregateResult agg :AggregateResultList1){ 
               maxno =(Integer)agg.get('nos');
           }
        }
*/
        Map<Integer, Integer> mapFl = new Map<Integer, Integer>();
        Map<String, Integer> mapFlIdunit = new Map<String, Integer>();
        Map<String, Integer> mapFlId = new Map<String, Integer>();
        set<Integer> set1 = new set<Integer>();
        Map<ID, Set<Integer>> mapsetfl = new Map<ID, Set<Integer>>();
         
        for(Inventory__c obj:InventoryList){
           mapFl.put(Integer.valueOf(obj.Unit_No__c),Integer.valueOf(obj.Floor__c));
           mapFlIdunit.put(String.valueOf(obj.Id),Integer.valueOf(obj.Unit_No__c));
           mapFlIdunit.put(String.valueOf(obj.Id),Integer.valueOf(obj.Floor__c));  
        }
      
       
        
        return InventoryList;
    }
    
@AuraEnabled
public static Map<String,List<Inventory__c>> fetchFloorDetails2(String project ,String tower){
    Map<String,List<Inventory__c>> houseMap = new Map<String,List<Inventory__c>>();
    
 for (Inventory__c inv:[select Id,Unit_No__c,Floor__c,Tower__c,Project__c,Usable_Area__c,Flat_Cost__c,floorPlanImage__c,Flat_feature__c,status__c from Inventory__c WHERE Project__c=:project and Tower__c=:tower order by Unit_No__c ASC  LIMIT 1000]){
String strFloor =  String.valueOf(inv.Floor__c);
if (houseMap.containsKey(strFloor)){
            houseMap.get(strFloor).add(inv);
        }
        else
        {
            houseMap.put(strFloor,new List<Inventory__c>{inv});
        }
 }
    
    

    return houseMap;
}    
   
    
@AuraEnabled
public static List<Inventory__c> fetchFloorDetails3(String project,String tower){
    List<Inventory__c> houseList = new List<Inventory__c>();
    
    houseList = [select Id,Unit_No__c,Floor__c,Tower__c,Project__c,Usable_Area__c,Flat_Cost__c,floorPlanImage__c,Flat_feature__c,status__c from Inventory__c WHERE Project__c=:project and Tower__c=:tower order by Unit_No__c ASC  LIMIT 1000];
    
    return houseList;
}       
    
@AuraEnabled
public static Map<String,List<String>> fetchFloorDetails(String project ,String tower){
      Map<String, String> mapStatPriority = new Map<String, String>(); // Define a new map
            mapStatPriority.put('Booked','B');                 
            mapStatPriority.put('Reserved','R'); 
            mapStatPriority.put('Interested','I');
    
    Map<String,List<String>> statusMap = new Map<String,List<String>>();
    Map<String,String> statusFnMap = new Map<String,String>();
    for (Customer_Inventory__c cinv:[select Flat_no__c,Status__c from Customer_Inventory__c WHERE Project__c=:project and Tower__c=:tower order by Flat_no__c ASC  LIMIT 1000]){ 
            if (statusMap.containsKey(cinv.Flat_no__c)){
            statusMap.get(cinv.Flat_no__c).add(cinv.Status__c);
        }
        else
        {
            statusMap.put(cinv.Flat_no__c,new List<String>{cinv.Status__c});
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
String button;
  button ='<lightning:button class="action-btns" value="{!mapValue}" variant="neutral" label="{!mapValue}" onclick="{!c.displaydata}"/>';
    
        Map<String,List<String>> houseMap = new Map<String,List<String>>();
    for (Inventory__c inv:[select Id,Unit_No__c,Floor__c from Inventory__c WHERE Project__c=:project and Tower__c=:tower order by Unit_No__c ASC  LIMIT 1000]){
        String connect='-';
        String strUnit;
        String status;
        String status1;
        
      //  status = mapStatPriority.get(statusFnMap.get(String.valueOf(inv.Unit_No__c)));
      status1 = statusFnMap.get(String.valueOf(inv.Unit_No__c));
        status = mapStatPriority.get(status1);
        
        /*
        if (status==null){
           //  strUnit =  String.valueOf(inv.Unit_No__c) + connect + 'None';
         strUnit =  '<td scope="row"><lightning:button class="action-btns" value="'+ String.valueOf(inv.Unit_No__c) +'" variant="neutral" label="'+ String.valueOf(inv.Unit_No__c) +'"  onclick="{!c.displaydata}"/></td>';
        }
        
        if (status==strBooked){
          strUnit =  '<td scope="row"><lightning:button class="action-btns" value="'+ String.valueOf(inv.Unit_No__c) +'" label="'+ String.valueOf(inv.Unit_No__c)  + '" class="bookedButton" /></td>';
        }
        if (status==strReserved){
          strUnit = '<td scope="row"><lightning:button class="action-btns" value="'+ String.valueOf(inv.Unit_No__c) +'" label="'+ String.valueOf(inv.Unit_No__c)  + '" class="reservedButton" onclick="{!c.displaydata}" /></td>';
        }
        if (status==strInterested){
          strUnit = '<td scope="row"><lightning:button class="action-btns" value="'+ String.valueOf(inv.Unit_No__c) +'" label="'+ String.valueOf(inv.Unit_No__c)  + '" class="interestedButton" onclick="{!c.displaydata}" /></td>';
        }
        */
       
        if (status==null){
           strUnit =String.valueOf(inv.Unit_No__c);
        // strUnit =  '<td scope="row"><lightning:button class="action-btns" value="'+ String.valueOf(inv.Unit_No__c) +'" variant="neutral" label="'+ String.valueOf(inv.Unit_No__c) +'"  onclick="{!c.displaydata}"/></td>';
        }
        else
        {
            strUnit =String.valueOf(inv.Unit_No__c)+connect+status;
            
        }
      
       // String strUnit =  String.valueOf(inv.Unit_No__c);
        String strFloor =  String.valueOf(inv.Floor__c);
        
        if (houseMap.containsKey(strFloor)){
            houseMap.get(strFloor).add(strUnit);
        }
        else
        {
            houseMap.put(strFloor,new List<String>{strUnit});
        }
    }
    return houseMap;
}  
@AuraEnabled
public static List <Inventory__c> fetchselectedFlatInventory(String project ,String tower, String flatno){  
        Decimal flatno1 = decimal.valueOf(flatno);
        List<Inventory__c> InventoryList = [SELECT Id, Unit_No__c,Tower__c,Project__c,Floor__c,Agreement_Value__c,Usable_Area__c,Flat_Cost__c from Inventory__c WHERE Project__c=:project and Tower__c=:tower and Unit_No__c =:flatno1 LIMIT 1];
          System.debug('************ InventoryList: ************ ' + InventoryList);
        return InventoryList;
    }    
    
@AuraEnabled
public static List <Inventory__c> fetchfullInventory(String project ,String tower) {
List<Inventory__c> InventoryList = [SELECT Id, Unit_No__c,Tower__c,Project__c,Floor__c,Agreement_Value__c,Usable_Area__c,Flat_Cost__c,floorPlanImage__c,Status__c,Flat_feature__c from Inventory__c WHERE Project__c=:project and Tower__c=:tower order by Unit_No__c ASC LIMIT 1000];
        
return InventoryList;
}    
@AuraEnabled
public static Id  insertselectedFlatInventory(String oppId ,String invId, String status){ 
     Customer_Inventory__c CIobj = new Customer_Inventory__c();
    CIobj.Business_Operation__c=oppId;
    CIobj.Inventory__c=invId;
    CIobj.Status__c=status;
    insert CIobj; 
    
    return CIobj.Id;
}
@AuraEnabled
public static Map<String,String> fetchStatusDetails(String project ,String tower){
        
    Map<String,List<String>> statusMap = new Map<String,List<String>>();
    Map<String,String> statusFnMap = new Map<String,String>();
    for (Customer_Inventory__c cinv:[select Flat_no__c,Status__c from Customer_Inventory__c WHERE Project__c=:project and Tower__c=:tower order by Flat_no__c ASC  LIMIT 1000]){ 
            if (statusMap.containsKey(cinv.Flat_no__c)){
            statusMap.get(cinv.Flat_no__c).add(cinv.Status__c);
        }
        else
        {
            statusMap.put(cinv.Flat_no__c,new List<String>{cinv.Status__c});
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
    
    
     for (Inventory__c inv:[select Unit_No__c,Floor__c from Inventory__c WHERE Project__c=:project and Tower__c=:tower order by Unit_No__c ASC  LIMIT 1000]){
     
          if (statusFnMap.containsKey(String.valueOf(inv.Unit_No__c))){
              
          }
         else
         {
             statusFnMap.put(String.valueOf(inv.Unit_No__c),'None');
         }
     }
    
    return statusFnMap;
}   

    @AuraEnabled 
    public static Map<String, List<String>> getDependentMap(sObject objDetail, string contrfieldApiName,string depfieldApiName) {
        String controllingField = contrfieldApiName.toLowerCase();
        String dependentField = depfieldApiName.toLowerCase();
        
        Map<String,List<String>> objResults = new Map<String,List<String>>();
        
        Schema.sObjectType objType = objDetail.getSObjectType();
        if (objType==null){
            return objResults;
        }
        
        Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();
        
        if (!objFieldMap.containsKey(controllingField) || !objFieldMap.containsKey(dependentField)){
            return objResults;     
        }
        
        Schema.SObjectField theField = objFieldMap.get(dependentField);
        Schema.SObjectField ctrlField = objFieldMap.get(controllingField);
        
        List<Schema.PicklistEntry> contrEntries = ctrlField.getDescribe().getPicklistValues();
        List<PicklistEntryWrapper> depEntries = wrapPicklistEntries(theField.getDescribe().getPicklistValues());
        List<String> controllingValues = new List<String>();
        
        for (Schema.PicklistEntry ple : contrEntries) {
            String label = ple.getLabel();
            objResults.put(label, new List<String>());
            controllingValues.add(label);
        }
        
        for (PicklistEntryWrapper plew : depEntries) {
            String label = plew.label;
            String validForBits = base64ToBits(plew.validFor);
            for (Integer i = 0; i < validForBits.length(); i++) {
                String bit = validForBits.mid(i, 1);
                if (bit == '1') {
                    objResults.get(controllingValues.get(i)).add(label);
                }
            }
        }
        return objResults;
    }
    
    public static String decimalToBinary(Integer val) {
        String bits = '';
        while (val > 0) {
            Integer remainder = Math.mod(val, 2);
            val = Integer.valueOf(Math.floor(val / 2));
            bits = String.valueOf(remainder) + bits;
        }
        return bits;
    }
    
    public static String base64ToBits(String validFor) {
        if (String.isEmpty(validFor)) return '';
        
        String validForBits = '';
        
        for (Integer i = 0; i < validFor.length(); i++) {
            String thisChar = validFor.mid(i, 1);
            Integer val = base64Chars.indexOf(thisChar);
            String bits = decimalToBinary(val).leftPad(6, '0');
            validForBits += bits;
        }
        
        return validForBits;
    }
    
    private static final String base64Chars = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/';
    
    
    private static List<PicklistEntryWrapper> wrapPicklistEntries(List<Schema.PicklistEntry> PLEs) {
        return (List<PicklistEntryWrapper>)
            JSON.deserialize(JSON.serialize(PLEs), List<PicklistEntryWrapper>.class);
    }
    
    public class PicklistEntryWrapper{
        public String active {get;set;}
        public String defaultValue {get;set;}
        public String label {get;set;}
        public String value {get;set;}
        public String validFor {get;set;}
        public PicklistEntryWrapper(){            
        }
        
    }









    
    
}