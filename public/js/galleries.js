/* Define two custom functions (asc and desc) for string sorting */
jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  1 : 0));
};

jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};
var userTable = $('#GalleryTable').DataTable({
    dom: '<"top"f>tr<"bottom"ip>',
    processing: true,
    serverSide: true,
    pageLength: 10,
    ajax: list,

    columns: [
        {data: 'id', name: 'id',orderable: true,width:'4%'},
        {data: 'file_name', name: 'file_name',orderable:true},
        {data: 'file_type', name: 'file_type',orderable:true},
        {data: 'is_featured', name: 'is_featured',orderable: true},
        {data: 'action', name: 'action', orderable: false,width:'20%'},
    ],
    language: {
        emptyTable: "No matching records found"
    },
    fnDrawCallback: function(oSettings) {
        // Hide pagination when data is less then pagelimit
        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
            $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
        }
        else{
            $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
        }
    }
});

/* Custom Filter*/
$('#user_filter').change(function (e) {
    userTable.page.len($(this).val()).draw();
});

// Sort by columns 1 and 2 and redraw
userTable.order( [ 0, 'desc' ]).draw();

$.fn.dataTable.ext.errMode = 'none';
userTable.on('error', function () {
    alert("Something went wrong, Please try after sometimes.");
});

jQuery(function(){
    var  m=document.getElementById('GalleryModel'), table=document.getElementById('GalleryTable');
    var rack_types = {
        init: function() {

            jQuery(document).on('click','.btn-submit',function(e){
                //jQuery('.pre-loader').show();
                var _this = jQuery(this);
                e.preventDefault();
                rack_types.fire(_this,"save");
            });
            jQuery(document).on('click','.fill_data',function(e){
                //jQuery('.pre-loader').show();
                var _this = jQuery(this);
                e.preventDefault();
                rack_types.fire(_this,"fetch");
            });
            jQuery(document).on('click',".btn-delete",function(e){
                //jQuery('.pre-loader').show();
                var _this = jQuery(this);
                e.preventDefault();
                if(confirm('Are you sure?')){
                    rack_types.fire(_this,"delete");
                }
            });

            $(document).ready(function() {
                $(window).keydown(function(event){
                  if(event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                  }
                });
            });
        },
        fire: function(_this,action) {
            var _f = _this.parents('form');
            var method = action == "save" ? _f.attr('method') : _this.data('method');
            var url = action == "save" ? _f.attr('action') : _this.data('url');
            var data = action == "delete" ? {_token: jQuery('meta[name="csrf-token"]').attr('content')} : _f.serialize();
            var ajax = {
                fire: function(){
                    $.ajax({
                        type: method,
                        url: url,
                        data: data,
                    })
                    .done(function(response) {
                        ajax.success(response)
                    })
                    .fail(function(response) {
                        ajax.error(response)
                    });
                },
                success: function(response){
                    //jQuery('.pre-loader').hide();
                    userTable.ajax.reload();

                    if(action == "fetch")
                    {
                        jQuery(".modal-content").html(response);
                        jQuery(m).modal('show');
                    }
                    else if(action == "delete")
                    {
                        jQuery(_this).parents("tr").remove();
                        jQuery(m).modal('hide');
                    }
                    else if(action == "save")
                    {
                        jQuery(m).modal('hide');
                    }

                },
                error: function(error){
                    jQuery('.pre-loader').hide();
                    jQuery(_f).find(".has-error").remove();
                    var response = JSON.parse(error.responseText);
                    $.each(error.responseJSON, function (key, value) {
                        if(key == 'agree_terms')
                        {
                            jQuery('.confirm-read-tc').find('.has-error').remove();
                            jQuery('.confirm-read-tc').append("<span class='has-error'>"+ value +"</span>");
                        }
                        else
                        {
                            var input = '[name=' + key + ']';
                            jQuery(_f).find(input).parent().find(".has-error").length == 0 ? jQuery(_f).find(input).parent().append("<span class='has-error'>"+ value +"</span>") : jQuery(_f).find(input).parent().find('.has-error').html(value);
                        }
                    });
                }
            }
            ajax.fire();
        }
    }

    var model = {
        init: function(){
            jQuery(m).on('shown.bs.modal',function(){
            });
            jQuery(m).on('hidden.bs.modal', function(){
                jQuery(this).find('form')[0].reset();
                jQuery(this).find('.has-error').remove();
                //jQuery.get('/do_rollback',function(){});
            });
        }
    }
    rack_types.init();
    model.init();

    $(document).on('change','#CategoryId', function() {
        var id = $(this).val();
        $.ajax({
            url: fetchData,
            type: "GET",
            data: {
                id: id,
                type: "brand"
            },
            success: function (response) {
                $('#BrandId').html(response);
            }
        });
    });

    $(document).on('change','#BrandId', function() {
        var id = $(this).val();
        $.ajax({
            url: fetchData,
            type: "GET",
            data: {
                id: id,
                type: "model"
            },
            success: function (response) {
                $('#ModelId').html(response);
            }
        });
    });

    $(document).on('click','.change_status', function() {
        var status = $(this).data("status");
        var id = $(this).data("id");
        $.ajax({
            url: updateStatus,
            type: "POST",
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
            },
            data: {
                id: id,
                status: status
            },
            success: function (response) {
                userTable.ajax.reload(null, false); // reload datatable ajax
            }
        });
    });
});
