function  validateNumeric( strValue ) 
{
    var objRegExp  =  /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;
    
    //check for numeric characters
    return objRegExp.test(strValue);
}

function calculateNoOfWeeksByDate(f)
{
    var startDate = document.getElementById("startDate").value.split('/');
    var formattedStartDate = new Date(startDate[0] + '/' + startDate[1] + '/' + startDate[2]); // mm/dd/yyyy
    //alert(formattedStartDate);
    
    var endDate = document.getElementById("endDate").value.split('/');
    var formattedEndDate = new Date(endDate[0] + '/' + endDate[1] + '/' + endDate[2]); // mm/dd/yyyy
    //alert(formattedEndDate);
    
    var perDay = 24 * 60 * 60 * 1000;
    var perWeek = 24 * 60 * 60 * 1000 * 7;
    
    // calculating total week. FYI the week starts from Monday to Sunday
    if (startDate != "" && endDate != "")
    {
        var totalDays = ((formattedEndDate.valueOf()- formattedStartDate.valueOf()) / perDay);
        var totalWeeks = Math.round((formattedEndDate.valueOf()- formattedStartDate.valueOf())/ perWeek) -1;
        var remainingDays = totalDays - (totalWeeks * 7);
        var netRemainingDays;
        if (remainingDays < 7)
        {
            netRemainingDays = Math.round(remainingDays);
            //document.getElementById("noOfWeeks").value = totalWeeks + " week(s) " + netRemainingDays + " day(s)";
            Ext.Msg.show({
                         title:'Result',
                         msg: totalWeeks + ' week(s) ' + netRemainingDays + ' day(s)',
                         buttons: Ext.Msg.OK
                         });
        }
        else
        {
            netRemainingDays = Math.round(remainingDays - 7);
            totalWeeks = totalWeeks + 1;
            //document.getElementById("noOfWeeks").value = totalWeeks + " week(s) " + netRemainingDays + " day(s)";
            Ext.Msg.show({
                         title:'Result',
                         msg: totalWeeks + ' week(s) ' + netRemainingDays + ' day(s)',
                         buttons: Ext.Msg.OK
                         });
        }
    }
    else
    {
        //document.getElementById("noOfWeeks").value = "Please fill in the required field(s)";
        Ext.Msg.show({
                     title:'Error !',
                     msg: 'Please fill in the required field(s)',
                     buttons: Ext.Msg.OK,
                     icon: Ext.MessageBox.QUESTION
                     });

    }
}

function calculateNoOfWeeksByWeeks(f)
{
    var startDate = document.getElementById("weeklyStartDate").value;
    var formattedStartDate = new Date(startDate); // mm/dd/yyyy

    var parsedStartDate = Date.parse(formattedStartDate);
    var inputWeeks = document.getElementById("weeks").value;
    
    if (startDate != "" && inputWeeks != "")
    {
        var perWeek = 24 * 60 * 60 * 1000 * 7;
        var weeksToDays = (inputWeeks * perWeek) + parsedStartDate;
        var date = new Date(weeksToDays);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var dateDay = date.getDate();
        //document.getElementById("endDateBox").value = "End Date: " + month + "/" + dateDay + "/" + year;
        Ext.Msg.show({
                     title:'Result',
                     msg: 'End Date: ' + month + '/' + dateDay + '/' + year,
                     buttons: Ext.Msg.OK
                     });
    }
    else
    {
        Ext.Msg.show({
                     title:'Error !',
                     msg: 'Please fill in the required field(s)',
                     buttons: Ext.Msg.OK
                     });
    }
}

function calculatePresentValue()
{
    var weeklyPayments = document.getElementById("weeklyPayments").value;
    var numberOfWeeks = document.getElementById("wowz").value;
    var interestRate = document.getElementById("interestRate").value / 100;
    
    if (weeklyPayments != "" && numberOfWeeks != "" && interestRate != "")
    {
        var time = numberOfWeeks * 0.0191653649;
        var principal = weeklyPayments * numberOfWeeks;
        var presentValue = principal / (1 + (time * interestRate));
        //document.getElementById("sum").value = "Sum of Payments: $" + principal + "\n";
        //document.getElementById("pValue").value = "Present Value: $" + presentValue.toFixed(2);
        Ext.Msg.show({
                     title:'Result',
                     msg: 'Sum of payments: $' + principal.toFixed(2) + '</br>' + 'Present Value: $' + presentValue.toFixed(2),
                     buttons: Ext.Msg.OK,
                     defaultTextHeight: 85,
                     });
    }
    else
    {
        Ext.Msg.show({
                     title:'Error !',
                     msg: 'Please fill in the required field(s)',
                     buttons: Ext.Msg.OK
                     });
        //document.getElementById("sum").value = "Please fill in the required field(s)";
        //document.getElementById("pValue").value = "Please fill in the required field(s)";

    }
}


function calculateLifeExpectancy()
{
    var birthDate = document.getElementById("birthDate").value;
    var formattedBirthDate = new Date(birthDate);
    var parsedBirthDate = formattedBirthDate.getTime();
    
    var gender = document.getElementById("gender").value;
    
    var currentDate = new Date();
    var parsedCurrentDate = currentDate.getTime();
    
    var perYear = 24 * 60 * 60 * 1000 * 365;
    
    var difference = Math.abs(parsedBirthDate - parsedCurrentDate);
    var age  = Math.round(difference / perYear);
    
    var cdcXmlDoc = null;
    //var amtXmlDoc = null;
    
    var cdcReq = new XMLHttpRequest;
    //var amtReq = new XMLHttpRequest;
    //req.open("GET", "data:" + ("application/xml") +
    //                ";charset=utf-8," + encodeURIComponent(str), false);
    
    if ((age >= 1 && age <= 100) && parsedBirthDate < currentDate)
    {
        if (birthDate != "" && gender != "" && gender != "selectGender")
        {    
            cdcReq.onreadystatechange = function() 
            {
                if (cdcReq.readyState == 4) {
                    cdcXmlDoc = cdcReq.responseXML;
                    
                    var allItems = cdcXmlDoc.getElementsByTagName("Row");
                    
                    
                    //allItems collection start with 0 so to get the right value for an age, we need to do age - 1
                    var value = allItems[age - 1].getElementsByTagName(gender);
                    
                    var lifeExpectancy = value[0].firstChild.nodeValue;
                     
                    //document.getElementById("lifeExAnswer").value = "Life Expectancy: " + lifeExpectancy + " year(s)";
                    Ext.Msg.show({
                                 title:'Result',
                                 msg: 'CDC Life Expectancy: ' + lifeExpectancy + ' year(s)',
                                 buttons: Ext.Msg.OK
                                 });
                }
            } 
            cdcReq.open("GET", "cdcdata.xml", true);       
            cdcReq.send(null);
            
            /*amtReq.onreadystatechange = function() 
            {
                if (amtReq.readyState == 4) {
                    amtXmlDoc = amtReq.responseXML;
                    
                    var allItems = amtXmlDoc.getElementsByTagName("Row");
                    
                    
                    //allItems collection start with 0 so to get the right value for an age, we need to do age - 1
                    var value = allItems[age - 1].getElementsByTagName(gender);
                    
                    var lifeExpectancy = value[0].firstChild.nodeValue;
                    
                    document.getElementById("amtlifeExAnswer").value = "Life Expectancy: " + lifeExpectancy + " year(s)";
                    
                }
            } 
            amtReq.open("GET", "cdcdata.xml", true);       
            amtReq.send(null);*/
        }
        else
        {
            //document.getElementById("lifeExAnswer").value = "Please fill in the required field(s)";
            //document.getElementById("amtlifeExAnswer").value = "Please fill in the required field(s)";
            Ext.Msg.show({
                         title:'Error !',
                         msg: 'Please fill in the required field(s)',
                         buttons: Ext.Msg.OK
                         });
        }
    }
    else
    {
        //document.getElementById("lifeExAnswer").value = "Life expectancy not available";
        //document.getElementById("amtlifeExAnswer").value = "Life expectancy not available";
        Ext.Msg.show({
                     title:'Warning !',
                     msg: 'Life expectancy not available',
                     buttons: Ext.Msg.OK,
                     });
    }
        
}

function calculateSettlement()
{
    var grossAmount = document.getElementById("grossAmount").value;
    var attFees = document.getElementById("attFees").value / 100;
    var netAmount = document.getElementById("netAmount").value;
    var expenses = document.getElementById("expenses").value;
    //var medicalExpenses = document.getElementById("medicalExpenses").value; 
    
    var calculatedNetAmount = grossAmount - (grossAmount * attFees);
    
    var calculatedAttFees = 100 - ((netAmount / grossAmount) * 100);
    
    var netClientSettlement;  
    
    if (grossAmount != "")
    {
        if (attFees == "")
        {
            netClientSettlement = netAmount - expenses; 
            document.getElementById("attFees").value = calculatedAttFees;
            Ext.Msg.show({
                         title:'Net Client Settlement',
                         msg: '$'+netClientSettlement.toFixed(2),
                         buttons: Ext.Msg.OK
                         });

        }
        else
        {
            netClientSettlement = calculatedNetAmount - expenses; 
            document.getElementById("netAmount").value = calculatedNetAmount;
            Ext.Msg.show({
                         title:'Net Client Settlement',
                         msg: '$'+netClientSettlement.toFixed(2),
                         buttons: Ext.Msg.OK
                         });
        }
    }
    else
    {
        Ext.Msg.show({
                     title:'Error !',
                     msg: 'Please fill in the required field(s)',
                     buttons: Ext.Msg.OK
                     });
    }
}

function calculateTracker()
{
    var demand = document.getElementById("demand").value;
    var offer = document.getElementById("offer").value;
    var midpoint = (parseInt(demand) + parseInt(offer)) / 2;
    
    if (demand != "" && offer != "")
    {
        Ext.Msg.show({
                     title:'Midpoint',
                     msg: '$'+ midpoint.toFixed(2),
                     buttons: Ext.Msg.OK
                     });
        document.getElementById("midpoint").value = midpoint;
    }
    else
    {
        Ext.Msg.show({
                     title:'Error !',
                     msg: 'Please fill in the required field(s)',
                     buttons: Ext.Msg.OK
                     });
    }
    
}

function clearRows()
{
    var Parent = document.getElementById("tracker-table");
    while(Parent.hasChildNodes())
    {
        Parent.removeChild(Parent.firstChild);
    }
    window.localStorage.clear();
    tracker.index = 1;
}

function clearTrackerData()
{
    Ext.Msg.confirm('Warning !', 'Are you sure you want to clear all data?', function(btn, text){ 
                    
                    if (btn == 'yes')
                    { 
                        var Parent = document.getElementById("tracker-table");
                        while(Parent.hasChildNodes())
                        {
                            Parent.removeChild(Parent.firstChild);
                        }
                        window.localStorage.clear();
                        tracker.index = 1;
                    } 
                    else 
                    { 
                        return;
                    } 
                    
                    });  
}

/*function submitTracker()
{
    document.forms["tracker-form"].submit();
}*/

