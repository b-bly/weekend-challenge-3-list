
$(document).ready(function () {
    console.log('jq ready');
    //event handlers
    $('#addItemButton').on('click', postListItems); //adds new item to list from input box
    $('#deleteItemButton').on('click', deleteChecked); //deletes checked items
    $('#listContainer').on('click', '.btn', complete); // toggles tasks to complete or not complete
    $('#itemInput').keypress(function (key) { //allows user to use enter from input box
        if (key.which == 13) {
            postListItems();
        }
    });
    getListItems();
    //make div wander http://jsfiddle.net/Xw29r/

 
}); //document ready end

function prependListItems(listArray) { // parameter is rows from the database table 'list'
$('#listFieldset').empty();
var listItemsHtml, $listDiv; //initialize variables
listArray.forEach(function (row) { //loop through and add each table row
    $listDiv = $('<div class="item"></div>'); //new div to hold a list item
    $listDiv.data('id', row.id); //store the id in the div for use in delete requests
    $listDiv.data('complete', row.complete);  //store complete status for use when updating 
    listItemHtml = '<label><input type="checkbox" name="checkbox" value="">  ' + row.item + '</label>';
    $listDiv.prepend(listItemHtml);
    if (row.complete == 'y') { //set up css styles differently for complete tasks
        $listDiv.css('background-color', '#5cb85c');  //complete tasks have a green div
        //buttons have aria-label for accessability
        //no btn-success class so that it turns gray
        $listDiv.append('<button class="btn" aria-label="complete"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span></button>');                
        $('#listFieldset').append($listDiv);
    } else {
        $listDiv.append('<button class="btn btn-success" aria-label="complete"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span></button>');
        $('#listFieldset').prepend($listDiv);
    }
});
}

function getListItems() { //get 'list' table from betelgeuse database
$.ajax({
    method: 'GET',
    url: '/listItems',
    success: function (response) {
        console.log('ajax get success callback worked.  Data: ', response);
        prependListItems(response);  // add to DOM
    }
});
}

function postListItems() {
var listItemObj = {};
listItemObj.item = $('#itemInput').val();
listItemObj.complete = 'n';
console.log(listItemObj);
$.ajax({
    method: 'POST',
    url: '/listItems',
    data: listItemObj,
    success: function (response) {
        console.log('ajax post successful ', response);
        getListItems();
    }
});
}

function deleteChecked() {
var confirm = window.confirm("Are you sure?");
console.log('confirm ' + confirm);
if (confirm === true) {
    var ids = '(' //build up string of ids in SQL language
    var $checkBoxes = $("input:checked"); //javascript version: var checkBoxes = document.getElementsByName('checkbox');
    $checkBoxes.each(function (index) { 
        var id = $(this).parent().parent().data().id;  //table id from database that was stored in each div
        ids += index < $checkBoxes.length - 1 ? id.toString(10) + ', ' : id.toString(10) + ')';
    });
    var idsObj = { ids: ids };  //store in an object so we can delete these through a post req
    //on the server
    $.ajax({
        method: 'POST',//I don't know how to use DELETE to delete multiple records.
        url: '/listItems/deleteItems',
        data: idsObj,
        success: function (response) {
            console.log('delete/post request successful');
            getListItems();
        }
    });
} else {
    alert('Close one.');
}
}

function complete() { //runs when complete button is clicked
//console.log('item div: ', $(this).parent());
var $div = $(this).parent();  // class="item" div holding each list item
var status = $div.data().complete;  // y or n
if (status == 'n') {  //if not complete
    $div.data('complete', 'y'); //update div data to y for 'completed'
    updateComplete($div.data().id, 'y'); //update SQL to 'y'
    $div.animate({ backgroundColor: "#5cb85c" }, 500, function () {
        $(this).children('.btn-success').removeClass('btn-success'); //changes color to gray
    });
    //console.log($div.data().complete);
    $listDivs = $(this).parent().siblings('div'); //selects all class="item" divs
    $div.fadeOut(500, function () {
        $div.insertAfter($listDivs[$listDivs.length - 1]).fadeIn(500);  //changes div color to green
    });
} else {
    $div.data('complete', 'n');
    updateComplete($div.data().id, 'n');
    $div.animate({ backgroundColor: "#D3D3D3" }, 500, function () {  //fades bkgnd to gray
        $(this).children('.btn').addClass('btn-success'); //changes button color to green
    });
    $firstDiv = $(this).parent().siblings('div')[0]; //selects first class="item" div
    $div.fadeOut(500, function () {
        $div.insertBefore($firstDiv).fadeIn(500); //puts the clicked div first in list
    });
}
}

function updateComplete(id, status) { //when complete button clicked, this runs to update the database
var listObj = {  //stores id from class="item" div
    id: id,
    complete: status //y or n
};
$.ajax({
    method: 'POST',
    url: '/listItems/updateToComplete',
    data: listObj,
    success: function (response) {
        console.log('delete/post request successful');
        //getListItems();  Probably should figure out how to load this data from database.
        //Right now the page should show them correctly, but only because the complete function
        //changes their appearance.  If there were an error connecting to the server or database, the page
        //would still show that their status changed.
    }
});
}