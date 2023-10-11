@extends('admin.layouts.app')
@section('title','model')
@section('content')
    <div class="main-container">
        <div class="pd-ltr-20 xs-pd-20-10">
            <div class="min-height-200px">
                <!-- Simple Datatable start -->
                <div class="pd-20 card-box mb-30">
                    <div class="clearfix mb-20">
                        <div class="pull-left">
                            <h4 class="text-blue h4">List Model</h4>
                        </div>
                        <div class="pull-right">
                            <a href="javascript:;" class="fill_data btn btn-primary" data-url="{!! route('admin.models.create') !!}" data-method="get">
                                New Model
                            </a>
                        </div>
                    </div>
                    <div class="pb-20">
                        <table class="data-table table stripe hover nowrap" id="ModelTable">
                            <thead>
                                <tr>
                                    <th class="table-plus datatable-nosort">Id</th>
                                    <th>Brand</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th class="datatable-nosort">Action</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                <!-- Simple Datatable End -->
            </div>
        </div>
    </div>
@push('modals')
<div class="modal fade bs-example-modal-lg" id="modelModel" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content"></div>
    </div>
</div>
@endpush
@endsection
@section('scripts')
<script type="text/javascript">
    window.list = "{!! route('admin.models.index') !!}";
</script>
<script src="{!! asset('js/models.js') !!}" type="text/javascript"></script>
@endsection
