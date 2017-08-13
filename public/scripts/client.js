
$(document).ready(function () {
    console.log('jq ready');
    $('#addItemButton').on('click', postListItems);
    $('#deleteItemButton').on('click', deleteChecked);
    $('#listContainer').on('click', '.btn-success', function () {
        //console.log('item div: ', $(this).parent());
        var $div = $(this).parent();
        updateToComplete($div.data().id);
        $div.animate({ backgroundColor: "#5cb85c" }, 500, function () {
            $(this).children('.btn-success').remove();
        });
        
        $div.data('complete', 'y');
        //console.log($div.data().complete);
        $listDivs = $(this).parent().siblings('div');
        $div.fadeOut(500, function () {
            $div.insertAfter($listDivs[$listDivs.length - 1]).fadeIn(500);
        });
    });
    getListItems();
    //make div wander http://jsfiddle.net/Xw29r/

    function prependListItems(listArray) {
        $('#listFieldset').empty();
        var listItemsHtml, $listDiv;
        listArray.forEach(function (row) {
            $listDiv = $('<div class="item"></div>');
            $listDiv.data('id', row.id);
            $listDiv.data('complete', row.complete);
            listItemHtml = '<label><input type="checkbox" name="checkbox" value="">  ' + row.item + '</label>';
            $listDiv.prepend(listItemHtml);
            if (row.complete == 'y') {
                $listDiv.css('background-color', '#5cb85c');
                $('#listFieldset').append($listDiv);
            } else {
                $listDiv.append('<button class="btn btn-success"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span></button>');
                $('#listFieldset').prepend($listDiv);
            }
        });
    }

    function getListItems() {
        $.ajax({
            method: 'GET',
            url: '/listItems',
            success: function (response) {
                console.log('ajax get success callback worked.  Data: ', response);
                prependListItems(response);
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

    function deleteChecked() {//modified from https://stackoverflow.com/questions/19650108/how-to-delete-a-check-box-using-javascript
        //var checkBoxes = document.getElementsByName('checkbox');
        var confirm = window.confirm("Are you sure?");
        console.log('confirm ' + confirm);
        if (confirm === true) {
            var ids = '('
            var $checkBoxes = $("input:checked");
            $checkBoxes.each(function (index) {
                var id = $(this).parent().parent().data().id;
                ids += index < $checkBoxes.length - 1 ? id.toString(10) + ', ' : id.toString(10) + ')';
            });
            var idsObj = { ids: ids };
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

    function updateToComplete(id) {
        var idObj = {id: id};
        $.ajax({
            method: 'POST',
            url: '/listItems/updateToComplete',
            data: idObj, 
            success: function (response) {
                console.log('delete/post request successful');
                //getListItems();
            }
        });
    }
}); //document ready end